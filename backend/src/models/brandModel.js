const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    BrandID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    BrandName: {
      type: String,
      required: true,
      trim: true,
    },
    Description: {
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
        ret.id = ret.BrandID;
        ret.name = ret.BrandName;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Brand", brandSchema);
