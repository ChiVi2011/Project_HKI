const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    CouponCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    DiscountType: {
      type: String,
      enum: ["Percent", "FixedAmount"],
      default: "FixedAmount",
    },
    DiscountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    MinimumOrderAmount: {
      type: Number,
      default: 0,
    },
    StartDate: {
      type: Date,
      default: Date.now,
    },
    EndDate: {
      type: Date,
      required: true,
    },
    Status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
