const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    PromotionID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      default: "ƯU ĐÃI",
    },
    badgeColor: {
      type: String,
      default: "#e11d48",
    },
    date: {
      type: String,
      default: "Đang áp dụng",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      default: "",
    },
    details: {
      condition: { type: String, default: "" },
      gift: { type: String, default: "" },
      howToJoin: { type: String, default: "" },
      note: { type: String, default: "" },
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
        ret.id = ret.PromotionID;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Promotion", promotionSchema);
