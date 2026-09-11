const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["promotion", "order", "news", "system"],
      default: "promotion",
    },
    link: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    actionText: {
      type: String,
      default: "",
    },
    couponCode: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      default: null, // null nghĩa là thông báo chung cho toàn hệ thống
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
