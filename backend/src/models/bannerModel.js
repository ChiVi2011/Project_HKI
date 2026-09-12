const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    BannerID: {
      type: String,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      default: "Trang Sản Phẩm (Cover Hero)",
      trim: true,
    },
    page: {
      type: String,
      default: "product-list",
      trim: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    linkUrl: {
      type: String,
      default: "/products",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1, // 1: Đang hiển thị, 0: Ẩn
    },
    updatedAtText: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id || ret.BannerID;
        return ret;
      },
    },
  },
);

bannerSchema.pre("save", function (next) {
  if (!this.BannerID) {
    this.BannerID = `banner-${Date.now()}`;
  }
  this.updatedAtText = new Date().toISOString().slice(0, 10);
  next();
});

module.exports = mongoose.model("Banner", bannerSchema);
