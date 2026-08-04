const bcrypt = require("bcrypt"); // so sánh/hash password
const jwt = require("jsonwebtoken"); // tạo token khi login
const userModel = require("../models/userModel"); // gọi Model để thao tác DB
const {
  detectLoginType,
  isStrongPassword,
} = require("../services/authService");

const { sendOtpEmail } = require("../services/mailService");
const { sendOtpSms } = require("../services/smsService");

const otpVerificationModel = require("../models/otpVerificationModel");

const { generateOtp } = require("../services/otpService");

//=== USER ====
const userController = {
  //Đăng Nhập
  async login(req, res) {
    try {
      // lấy thông tin người dùng từ màn hình
      const { account, password } = req.body;
      if (!account || !password) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Vui lòng nhập tài khoản và mật khẩu.",
        });
      }
      const loginType = detectLoginType(account);
      if (loginType === "invalid_mail") {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Email không đúng định dạng.",
        });
      }
      if (loginType === "invalid_phone") {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Số điện thoại không đúng định dạng.",
        });
      }

      // Tìm tài khoản
      const user =
        // Toán tử ba ngôi (cách viết ngắn ngọn if else)
        loginType === "email"
          ? await userModel.getByEmail(account)
          : await userModel.getByPhone(account);

      // Không tìm thấy tài khoan
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Tài khoản không tồn tại.",
        });
      }

      // Tài khoản bị khóa
      if (user.Status === 0) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "Tài khoản không hoạt động.",
        });
      }

      // Lấy mật khẩu người dung
      const passwordHash = await userModel.getPasswordHash(user.UserID);
      if (!passwordHash) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: "Mật khẩu không chính xác.",
        });
      }
      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(password, passwordHash);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: "Mật khẩu không chính xác.",
        });
      }
      // Tạo JWT 15 phút
      const accessToken = jwt.sign(
        { UserID: user.UserID, CustomerCode: user.CustomerCode },
        process.env.JWT_SECRET,
        { expiresIn: "15m" },
      );
      // Khi người nhấn vào remenberMe thì là lưu 30 ngày, còn ko nhấn là 1 ngày
      const refreshExpriesIn = remenberMe ? "30d" : "1d";

      // Cấp refreshToken mới
      const refreshToken = jwt.sign(
        { UserID: user.UserID },
        process.env.JWT_SECRET,
        { expiresIn: refreshExpriesIn },
      );
      // Tính thời điểm hết hạn thật để lưu vào MongoDB
      const refreshExpiresAt = new Date(
        Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000,
      );
      await refreshToken.create({
        UserID: user.UserID,
        Token: refreshToken,
        ExpiresAt: refreshExpiresAt,
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Đăng nhập thành công.",
        accessToken,
        refreshToken,
        user: {
          UserID: user.UserID,
          CustomerCode: user.CustomerCode,
          FullName: user.FullName,
          Email: user.Email,
          Phone: user.Phone,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Đăng nhập thất bại, vui lòng thử lại",
      });
    }
  },
  // Đăng ký
  async register(req, res) {
    try {
      const { email, phone, password, fullName, gender, birthYear, avatar } =
        req.body;
      if (!phone) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Vui lòng nhập số điện thoại của bạn",
        });
      }
      if (!fullName) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Vui lòng nhập Họ và Tên của bạn",
        });
      }
      if (!gender) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Vui lòng nhập giới tính của bạn",
        });
      }
      if (!birthYear) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Vui lòng nhập ngày sinh của bạn",
        });
      }

      if (detectLoginType(phone) !== "phone") {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Số điện thoại không đúng định dạng.",
        });
      }
      if (email && detectLoginType(email) !== "email") {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Email không đúng định dạng.",
        });
      }
      if (!password) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Vui lòng nhập mật khẩu.",
        });
      }

      if (!isStrongPassword(password)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message:
            "Mật khẩu phải có ít nhất 10 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        });
      }

      // Kiểm tra sđt với email đã tồn tại trong DB
      const existingPhone = await userModel.getByPhone(phone);
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          statusCode: 409,
          message: "Số điện thoại đã được sử dụng",
        });
      }
      if (email) {
        const existingMail = await userModel.getByEmail(email);
        if (existingMail) {
          return res.status(409).json({
            success: false,
            statusCode: 409,
            message: "Email đã tồn tại",
          });
        }
      }

      // HashPassword vào database
      const passwordHash = await bcrypt.hash(password, 10);
      // Khai báo OTP
      const otp = generateOtp();
      // Hiệu lực OTP
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

      //Thêm newUser vào DB
      const newUser = await userModel.createUser({
        FullName: fullName,
        Gender: gender,
        DateOfBirth: birthYear,
        Phone: phone,
        Email: email || null,
        Avatar: avatar || null,
        PasswordHash: passwordHash,
        Status: 0,
      });
      // Lưu OTP
      await otpVerificationModel.create({
        UserID: newUser.UserID,
        Otp: otp,
        ExpiresAt: otpExpires,
      });

      // Nhập OTP
      try {
        if (email) {
          await sendOtpEmail(email, otp);
        } else {
          await sendOtpSms(phone, otp);
        }
      } catch (sendErr) {
        console.error("Gửi OTP thất bại:", sendErr);
        return res.status(201).json({
          success: true,
          statusCode: 201,
          message:
            "Đăng ký thành công nhưng gửi OTP thất bại, vui lòng yêu cầu gửi lại OTP.",
          userId: newUser.UserID,
        });
      }

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Đăng ký thành công, vui lòng xác thực OTP.",
        userId: newUser.UserID,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Đăng ký thất bại, vui lòng thử lại",
      });
    }
  },
  // Cập Nhật OTP
  async verifyOtp(req, res) {
    try {
      const { userId, otp } = req.body;

      if (!userId || !otp) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Vui lòng nhập mã OTP.",
        });
      }

      const otpRecord = await otpVerificationModel.findOne({ UserID: userId });

      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Mã OTP không tồn tại hoặc đã hết hạn.",
        });
      }

      if (new Date() > otpRecord.ExpiresAt) {
        await otpVerificationModel.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Mã OTP đã hết hạn.",
        });
      }

      if (otpRecord.Otp !== otp) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Mã OTP không chính xác.",
        });
      }

      await userModel.activateUser(userId);
      await otpVerificationModel.deleteOne({ _id: otpRecord._id });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Kích hoạt tài khoản thành công.",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Xác thực OTP thất bại, vui lòng thử lại",
      });
    }
  },
  // Cập nhật user
  async updateUser(req, res) {
    try {
      const userId = req.user.UserID;
      const { fullName, gender, birthYear, avatar, email } = req.body;

      if (!fullName && !gender && !birthYear && !avatar && !email) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Vui lòng nhập thông tin cần cập nhật.",
        });
      }

      const user = await userModel.getById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Tài khoản không tồn tại.",
        });
      }

      if (email && email !== user.Email) {
        if (detectLoginType(email) !== "email") {
          return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Email không đúng định dạng.",
          });
        }
        const existingEmail = await userModel.getByEmail(email);
        if (existingEmail) {
          return res.status(409).json({
            success: false,
            statusCode: 409,
            message: "Email đã được sử dụng.",
          });
        }
      }

      const updatedUser = await userModel.updateProfile(userId, {
        FullName: fullName || user.FullName,
        Gender: gender || user.Gender,
        DateOfBirth: birthYear || user.DateOfBirth,
        Avatar: avatar || user.Avatar,
        Phone: user.Phone,
        Email: email || user.Email,
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Cập nhật thông tin thành công.",
        user: {
          UserID: updatedUser.UserID,
          FullName: updatedUser.FullName,
          Gender: updatedUser.Gender,
          DateOfBirth: updatedUser.DateOfBirth,
          Avatar: updatedUser.Avatar,
          Email: updatedUser.Email,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Cập nhật thất bại, vui lòng thử lại",
      });
    }
  },
  // Cập nhật mật khẩu
  async changePassword(req, res) {
    try {
      const userId = req.user.UserID;
      const { newPassword } = req.body;

      if (!newPassword) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Vui lòng nhập mật khẩu mới.",
        });
      }
      if (!isStrongPassword(newPassword)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message:
            "Mật khẩu mới phải có ít nhất 10 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await userModel.updatePassword(userId, newPasswordHash);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Đổi mật khẩu thành công.",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Đổi mật khẩu thất bại, vui lòng thử lại",
      });
    }
  },
  // Đăng xuất
  async logout(req,res) {
    
  }
};
module.exports = userController;
