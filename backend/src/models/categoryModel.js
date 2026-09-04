const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    CategoryID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    CategoryName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "bi-grid-fill",
    },
    color: {
      type: String,
      default: "#23408e",
    },
    bgGradient: {
      type: String,
      default: "",
    },
    brandTags: {
      type: [String],
      default: ["Tất cả"],
    },
    bannerDesc: {
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
        ret.id = ret.CategoryID;
        ret.name = ret.CategoryName;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Category", categorySchema);
