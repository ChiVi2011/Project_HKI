const mongoose = require("mongoose");

const packOptionSchema = new mongoose.Schema(
  {
    id: { type: String, default: "" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tag: { type: String, default: "" },
  },
  { _id: false }
);

const nutritionFactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unit: { type: String, default: "" },
    value: { type: String, required: true },
  },
  { _id: false }
);

const keyHighlightSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "bi-shield-check" },
    title: { type: String, required: true },
    desc: { type: String, default: "" },
  },
  { _id: false }
);

const usageStepSchema = new mongoose.Schema(
  {
    step: { type: Number, required: true },
    title: { type: String, required: true },
    desc: { type: String, default: "" },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    ProductID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    CategoryID: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    BrandName: {
      type: String,
      default: "VitaDairy",
      trim: true,
    },
    ProductName: {
      type: String,
      required: true,
      trim: true,
    },
    slogan: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    packaging: {
      type: String,
      default: "Lon thiếc tiêu chuẩn",
    },
    targetUser: {
      type: String,
      default: "Mọi lứa tuổi",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isHot: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    soldCount: {
      type: Number,
      default: 100,
    },
    packOptions: [packOptionSchema],
    nutritionFacts: [nutritionFactSchema],
    keyHighlights: [keyHighlightSchema],
    usageSteps: [usageStepSchema],
    origin: {
      type: String,
      default: "Nguyên liệu Sữa non ColosIgG 24h nhập khẩu độc quyền từ Mỹ",
    },
    manufacturer: {
      type: String,
      default: "Công ty Cổ phần Sữa VitaDairy Việt Nam",
    },
    shelfLife: {
      type: String,
      default: "24 tháng kể từ ngày sản xuất",
    },
    storage: {
      type: String,
      default:
        "Bảo quản nơi khô ráo, thoáng mát, đậy kín nắp sau mỗi lần sử dụng. Dùng hết trong vòng 4 tuần.",
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
        ret.id = ret.ProductID;
        ret.name = ret.ProductName;
        ret.brand = ret.BrandName;
        ret.categoryId = ret.CategoryID;
        return ret;
      },
    },
  }
);

// Index tìm kiếm văn bản theo tên và slogan
productSchema.index({ ProductName: "text", slogan: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
