const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel").MongooseModel;
const OtpVerification = require("../models/otpVerificationModel");
const { generateOtp } = require("../services/otpService");
const { sendOtpEmail } = require("../services/mailService");

const JWT_SECRET = process.env.JWT_SECRET || "vidairy_secret_jwt_key_2026_super_secure";

// Helper: lấy thông tin người dùng từ JWT Token
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const authController = {
  // 1. Gửi OTP đăng ký qua Email
  async sendRegisterOtp(req, res) {
    try {
      const { email, fullName } = req.body;

      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email là thông tin bắt buộc khi đăng ký!",
        });
      }

      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: "Địa chỉ email không đúng định dạng!",
        });
      }

      // Kiểm tra email đã được đăng ký trước đó chưa
      const existingUser = await User.findOne({ Email: cleanEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email này đã được đăng ký tài khoản. Vui lòng sử dụng email khác hoặc đăng nhập!",
        });
      }

      // Sinh mã OTP 6 chữ số
      const otp = generateOtp();

      // Xóa OTP cũ của email này (nếu có)
      await OtpVerification.deleteMany({ Email: cleanEmail });

      // Lưu OTP mới với thời hạn 5 phút
      await OtpVerification.create({
        Email: cleanEmail,
        OTP: otp,
        ExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      // Gửi email thật qua Nodemailer (Gmail)
      await sendOtpEmail(cleanEmail, otp, fullName || "Quý khách");

      return res.status(200).json({
        success: true,
        message: `Mã xác thực OTP đã được gửi đến email ${cleanEmail}. Vui lòng kiểm tra hộp thư!`,
        email: cleanEmail,
      });
    } catch (err) {
      console.error("Lỗi sendRegisterOtp:", err);
      return res.status(500).json({
        success: false,
        message: "Không thể gửi email OTP. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau!",
        error: err.message,
      });
    }
  },

  // 2. Xác thực OTP và tạo tài khoản vào MongoDB Atlas
  async verifyRegisterOtp(req, res) {
    try {
      const { email, otp, fullName, phone, password } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp email và mã OTP xác thực!",
        });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanOtp = String(otp).trim();

      // Tìm bản ghi OTP hợp lệ
      const otpRecord = await OtpVerification.findOne({
        Email: cleanEmail,
        ExpiresAt: { $gte: new Date() },
      }).sort({ CreatedAt: -1 });

      if (!otpRecord || otpRecord.OTP !== cleanOtp) {
        return res.status(400).json({
          success: false,
          message: "Mã OTP không chính xác hoặc đã hết hiệu lực!",
        });
      }

      // Kiểm tra lại tính duy nhất của email
      const existingUser = await User.findOne({ Email: cleanEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email này đã tồn tại trong hệ thống!",
        });
      }

      // Hash mật khẩu
      const passwordHash = await bcrypt.hash(password || "123456", 10);

      // Tạo mã khách hàng tự động
      const userCount = await User.countDocuments();
      const customerCode = `KH${String(userCount + 1).padStart(6, "0")}`;

      // Tạo User mới trong MongoDB Atlas
      const newUser = await User.create({
        CustomerCode: customerCode,
        FullName: (fullName || "Khách hàng").trim(),
        Email: cleanEmail,
        Phone: phone ? phone.trim() : undefined,
        PasswordHash: passwordHash,
        Role: "CUSTOMER",
        Status: true,
      });

      // Xóa OTP sau khi xác thực thành công
      await OtpVerification.deleteMany({ Email: cleanEmail });

      // Sinh JWT token
      const token = jwt.sign(
        {
          UserID: newUser._id,
          Email: newUser.Email,
          Role: newUser.Role,
          CustomerCode: newUser.CustomerCode,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userObj = newUser.toObject();
      delete userObj.PasswordHash;
      userObj.UserID = newUser._id;
      userObj.id = newUser._id;
      userObj.role = newUser.Role;

      return res.status(201).json({
        success: true,
        message: "Xác thực tài khoản và đăng ký thành công!",
        token,
        user: userObj,
      });
    } catch (err) {
      console.error("Lỗi verifyRegisterOtp:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xác thực đăng ký.",
        error: err.message,
      });
    }
  },

  // 3. Đăng nhập hệ thống (hỗ trợ Email hoặc Số điện thoại)
  async login(req, res) {
    try {
      const { account, email, phone, password } = req.body;
      const targetAccount = account || email || phone;

      if (!targetAccount || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập tài khoản (Email/SĐT) và mật khẩu!",
        });
      }

      const cleanAccount = targetAccount.trim();

      // Tìm user theo Email hoặc Phone
      const user = await User.findOne({
        $or: [
          { Email: cleanAccount.toLowerCase() },
          { Phone: cleanAccount },
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Tài khoản không tồn tại trong hệ thống!",
        });
      }

      // Kiểm tra trạng thái tài khoản
      if (user.Status === false) {
        return res.status(403).json({
          success: false,
          message: "Tài khoản của bạn đang bị khóa hoặc tạm ngưng hoạt động. Vui lòng liên hệ quản trị viên!",
        });
      }

      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(password, user.PasswordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Mật khẩu không chính xác!",
        });
      }

      // Sinh JWT Token
      const token = jwt.sign(
        {
          UserID: user._id,
          Email: user.Email,
          Role: user.Role,
          CustomerCode: user.CustomerCode,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userObj = user.toObject();
      delete userObj.PasswordHash;
      userObj.UserID = user._id;
      userObj.id = user._id;
      userObj.role = user.Role;

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công!",
        token,
        user: userObj,
      });
    } catch (err) {
      console.error("Lỗi login:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi đăng nhập.",
        error: err.message,
      });
    }
  },

  // 4. Lấy thông tin cá nhân hiện tại
  async getProfile(req, res) {
    try {
      const decoded = getUserFromToken(req);
      if (!decoded) {
        return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập hoặc phiên đã hết hạn!" });
      }

      const user = await User.findById(decoded.UserID).select("-PasswordHash").lean();
      if (!user) {
        return res.status(404).json({ success: false, message: "Không tìm thấy người dùng!" });
      }

      user.UserID = user._id;
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err.message });
    }
  },

  // 5. Cập nhật thông tin cá nhân
  async updateProfile(req, res) {
    try {
      const decoded = getUserFromToken(req);
      if (!decoded) {
        return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập!" });
      }

      const { FullName, Phone, Gender, DateOfBirth, Address, Avatar } = req.body;

      const updated = await User.findByIdAndUpdate(
        decoded.UserID,
        {
          ...(FullName && { FullName: FullName.trim() }),
          ...(Phone && { Phone: Phone.trim() }),
          ...(Gender !== undefined && { Gender }),
          ...(DateOfBirth && { DateOfBirth }),
          ...(Address !== undefined && { Address: Address.trim() }),
          ...(Avatar && { Avatar }),
        },
        { new: true }
      ).select("-PasswordHash").lean();

      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản!" });
      }

      updated.UserID = updated._id;
      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công!",
        data: updated,
      });
    } catch (err) {
      console.error("Lỗi updateProfile:", err);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ", error: err.message });
    }
  },

  // 6. [ADMIN API] Lấy danh sách toàn bộ người dùng
  async getAllUsers(req, res) {
    try {
      const decoded = getUserFromToken(req);
      if (!decoded) {
        return res.status(401).json({ success: false, message: "Yêu cầu đăng nhập!" });
      }

      // Kiểm tra quyền Admin
      if (decoded.Role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Quyền truy cập bị từ chối. Chỉ dành cho Quản trị viên!" });
      }

      const users = await User.find().select("-PasswordHash").sort({ createdAt: -1 }).lean();
      const mapped = users.map((u) => ({ ...u, UserID: u._id }));

      return res.status(200).json({
        success: true,
        count: mapped.length,
        data: mapped,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Lỗi lấy danh sách người dùng", error: err.message });
    }
  },

  // 7. [ADMIN API] Chuyển đổi trạng thái tài khoản (Hoạt động <-> Khóa)
  async toggleUserStatus(req, res) {
    try {
      const decoded = getUserFromToken(req);
      if (!decoded || decoded.Role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Chỉ Quản trị viên mới có quyền chuyển đổi trạng thái!" });
      }

      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Không tìm thấy người dùng!" });
      }

      // Đảo ngược trạng thái
      user.Status = !user.Status;
      await user.save();

      const userObj = user.toObject();
      delete userObj.PasswordHash;
      userObj.UserID = user._id;

      return res.status(200).json({
        success: true,
        message: `Đã chuyển đổi trạng thái tài khoản sang: "${user.Status ? "Hoạt động" : "Tạm khóa"}"!`,
        data: userObj,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Lỗi chuyển đổi trạng thái", error: err.message });
    }
  },
};

module.exports = authController;
