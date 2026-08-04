const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  UserID: {
    type: Number,
    required: true,
  },
  Token: {
    type: String,
    required: true,
  },
  ExpiresAt: {
    type: Date,
    required: true,
  },
  CreatedAt: {
    type: Date,
    required: true,
  },
});

refreshTokenSchema.index({ ExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
