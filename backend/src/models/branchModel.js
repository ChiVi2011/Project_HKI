const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    hours: {
      type: String,
      default: "08:00 - 21:00 (Mở cửa cả tuần)",
    },
    status: {
      type: Number,
      default: 1, // 1: Đang hoạt động, 0: Tạm ngưng
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Branch", branchSchema);
