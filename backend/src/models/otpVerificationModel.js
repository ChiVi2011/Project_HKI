const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  OTP: {
    type: String,
    required: true,
  },
  ExpiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // Mặc định 5 phút
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Tự động xóa tài liệu sau khi ExpiresAt hết hạn
otpVerificationSchema.index({ ExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OtpVerification", otpVerificationSchema);
