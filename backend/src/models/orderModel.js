const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    ProductID: { type: String, required: true },
    ProductName: { type: String, required: true },
    VariantName: { type: String, default: "Lon tiêu chuẩn" },
    Quantity: { type: Number, required: true, min: 1 },
    UnitPrice: { type: Number, required: true, min: 0 },
    ImageURL: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    OrderCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    CouponCode: {
      type: String,
      default: "",
    },
    ReceiverName: {
      type: String,
      required: true,
      trim: true,
    },
    ReceiverPhone: {
      type: String,
      required: true,
      trim: true,
    },
    ShippingAddress: {
      type: String,
      required: true,
      trim: true,
    },
    Items: [orderItemSchema],
    DeliveryType: {
      type: String,
      default: "DELIVERY",
      enum: ["DELIVERY", "STORE_PICKUP"],
    },
    BranchName: {
      type: String,
      default: "",
    },
    SubTotal: {
      type: Number,
      default: 0,
    },
    Discount: {
      type: Number,
      default: 0,
    },
    TotalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    ShippingFee: {
      type: Number,
      default: 0,
    },
    PaymentMethod: {
      type: String,
      default: "COD",
    },
    PaymentStatus: {
      type: String,
      default: "Pending",
    },
    OrderStatus: {
      type: String,
      default: "Processing",
      enum: ["Pending", "Confirmed", "Processing", "Shipping", "Completed", "Delivered", "Cancelled"],
    },
    HasVAT: {
      type: Boolean,
      default: false,
    },
    VATInfo: {
      Company: { type: String, default: "" },
      TaxId: { type: String, default: "" },
      Email: { type: String, default: "" },
      Address: { type: String, default: "" },
    },
    Note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
