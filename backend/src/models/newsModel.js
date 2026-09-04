const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: "Dinh dưỡng",
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString("vi-VN"),
    },
    author: {
      type: String,
      default: "Chuyên gia Dinh dưỡng VitaDairy",
    },
    summary: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // Hỗ trợ cả mảng các đoạn văn hoặc chuỗi văn bản
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("News", newsSchema);
