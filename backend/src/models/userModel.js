const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    CustomerCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    FullName: {
      type: String,
      required: true,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    Phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    PasswordHash: {
      type: String,
      required: true,
    },
    Role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN", "STAFF", "MANAGER"],
    },
    Permissions: {
      type: [String],
      default: [],
      default: "CUSTOMER",
    },
    Gender: {
      type: Boolean, // 1: Nam, 0: Nữ
      default: null,
    },
    DateOfBirth: {
      type: Date,
      default: null,
    },
    Avatar: {
      type: String,
      default: "",
    },
    Address: {
      type: String,
      default: "",
    },
    Status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.UserID = ret._id;
        delete ret.PasswordHash;
        return ret;
      },
    },
  }
);

// Tạo mã khách hàng tự động trước khi lưu nếu chưa có
userSchema.pre("save", async function () {
  if (!this.CustomerCode) {
    const count = await mongoose.model("User").countDocuments();
    this.CustomerCode = `KH${String(count + 1).padStart(6, "0")}`;
  }
});

const UserModel = mongoose.model("User", userSchema);

// Adapter hỗ trợ các phương thức gọi từ userController
const userModel = {
  // Lấy danh sách người dùng
  async getAll() {
    return await UserModel.find().select("-PasswordHash").lean();
  },

  // Lấy dữ liệu theo ID
  async getById(UserID) {
    if (!UserID) return null;
    return await UserModel.findById(UserID).lean();
  },

  // Lấy dữ liệu theo email
  async getByEmail(Email) {
    if (!Email) return null;
    return await UserModel.findOne({ Email: Email.toLowerCase().trim() }).lean();
  },

  // Lấy dữ liệu theo số điện thoại
  async getByPhone(Phone) {
    if (!Phone) return null;
    return await UserModel.findOne({ Phone: Phone.trim() }).lean();
  },

  // Lấy PasswordHash để so sánh khi đăng nhập
  async getPasswordHash(UserID) {
    const user = await UserModel.findById(UserID).select("PasswordHash").lean();
    return user?.PasswordHash;
  },

  // Tạo người dùng mới
  async createUser(user) {
    const passwordHash = await bcrypt.hash(user.Password, 10);
    const count = await UserModel.countDocuments();
    const customerCode = `KH${String(count + 1).padStart(6, "0")}`;

    const newUser = await UserModel.create({
      CustomerCode: customerCode,
      FullName: user.FullName,
      Email: user.Email.toLowerCase().trim(),
      Phone: user.Phone ? user.Phone.trim() : undefined,
      PasswordHash: passwordHash,
      Gender: user.Gender ?? null,
      DateOfBirth: user.DateOfBirth ?? null,
      Avatar: user.Avatar ?? "",
      Role: user.Role || "CUSTOMER",
    });

    const userObj = newUser.toObject();
    userObj.UserID = userObj._id;
    return userObj;
  },

  // Cập nhật thông tin tài khoản
  async updateProfile(UserID, data) {
    return await UserModel.findByIdAndUpdate(
      UserID,
      {
        FullName: data.FullName,
        Phone: data.Phone,
        Email: data.Email,
        Avatar: data.Avatar,
        Gender: data.Gender ?? null,
        DateOfBirth: data.DateOfBirth ?? null,
        Address: data.Address,
      },
      { new: true }
    ).select("-PasswordHash").lean();
  },

  // Cập nhật mật khẩu mới
  async updatePassword(UserID, newPassword) {
    const newHash = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(UserID, { PasswordHash: newHash });
  },

  // Export kèm Model Mongoose để sử dụng linh hoạt
  MongooseModel: UserModel,
};

module.exports = userModel;
