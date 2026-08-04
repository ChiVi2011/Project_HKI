const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  OTP: {
    type: String,
    required: true,
  },
  ExpiresAt: {
    type: Date,
    required: true,
  },
});
// Tự động xóa sau khi hết 1 phút 
otpVerificationSchema.index({ ExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OtpVerification", otpVerificationSchema);
