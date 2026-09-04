const Coupon = require("../models/couponModel");

const couponController = {
  // Lấy danh sách coupons (hỗ trợ Admin xem toàn bộ, hoặc Client xem coupon hợp lệ)
  async getCoupons(req, res) {
    try {
      const { all } = req.query;
      const query = all === "true" ? {} : { Status: true, EndDate: { $gte: new Date() } };

      const coupons = await Coupon.find(query).sort({ createdAt: -1 }).lean();

      return res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách mã giảm giá.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Tạo mã ưu đãi mới
  async createCoupon(req, res) {
    try {
      const {
        CouponCode,
        DiscountType,
        DiscountValue,
        MinimumOrderAmount,
        StartDate,
        EndDate,
      } = req.body;

      if (!CouponCode || !DiscountValue) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập mã ưu đãi và giá trị giảm.",
        });
      }

      const existing = await Coupon.findOne({ CouponCode: CouponCode.trim().toUpperCase() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Mã ưu đãi "${CouponCode}" đã tồn tại!`,
        });
      }

      const coupon = await Coupon.create({
        CouponCode: CouponCode.trim().toUpperCase(),
        DiscountType: DiscountType || "FixedAmount",
        DiscountValue: Number(DiscountValue),
        MinimumOrderAmount: Number(MinimumOrderAmount || 0),
        StartDate: StartDate ? new Date(StartDate) : new Date(),
        EndDate: EndDate ? new Date(EndDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        Status: true,
      });

      return res.status(201).json({
        success: true,
        message: "Tạo mã giảm giá mới thành công!",
        data: coupon,
      });
    } catch (err) {
      console.error("Lỗi createCoupon:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tạo mã giảm giá.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Bật / Tắt trạng thái mã ưu đãi
  async toggleCouponStatus(req, res) {
    try {
      const { id } = req.params;
      let coupon = await Coupon.findOne({ CouponCode: id.toUpperCase() });
      if (!coupon && id.match(/^[0-9a-fA-F]{24}$/)) {
        coupon = await Coupon.findById(id);
      }

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy mã giảm giá.",
        });
      }

      coupon.Status = !coupon.Status;
      await coupon.save();

      return res.status(200).json({
        success: true,
        message: `Đã ${coupon.Status ? "kích hoạt" : "vô hiệu hóa"} mã ưu đãi ${coupon.CouponCode}!`,
        data: coupon,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật trạng thái mã ưu đãi.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Xóa mã ưu đãi
  async deleteCoupon(req, res) {
    try {
      const { id } = req.params;
      let result = await Coupon.findOneAndDelete({ CouponCode: id.toUpperCase() });
      if (!result && id.match(/^[0-9a-fA-F]{24}$/)) {
        result = await Coupon.findByIdAndDelete(id);
      }

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy mã giảm giá để xóa.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Xóa mã giảm giá thành công!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi xóa mã giảm giá.",
        error: err.message,
      });
    }
  },

  // [CLIENT] Xác thực mã giảm giá khi Checkout
  async validateCoupon(req, res) {
    try {
      const { code, orderAmount, subTotal } = req.body;
      const effectiveAmount = orderAmount !== undefined ? orderAmount : subTotal;
      if (!code || !code.trim()) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập mã ưu đãi.",
        });
      }

      const coupon = await Coupon.findOne({
        CouponCode: code.toUpperCase().trim(),
        Status: true,
        EndDate: { $gte: new Date() },
      }).lean();

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
        });
      }

      const totalNum = Number(effectiveAmount || 0);
      if (coupon.MinimumOrderAmount > totalNum) {
        return res.status(400).json({
          success: false,
          message: `Đơn hàng tối thiểu từ ${coupon.MinimumOrderAmount.toLocaleString("vi-VN")}đ để sử dụng mã này.`,
        });
      }

      let discount = 0;
      if (coupon.DiscountType === "Percent") {
        discount = Math.round((totalNum * coupon.DiscountValue) / 100);
      } else {
        discount = coupon.DiscountValue;
      }

      // Giảm giá không được vượt quá tổng tiền
      discount = Math.min(discount, totalNum);

      return res.status(200).json({
        success: true,
        message: `Áp dụng thành công! Bạn được giảm ${discount.toLocaleString("vi-VN")}đ`,
        data: {
          code: coupon.CouponCode,
          discount,
          coupon,
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi kiểm tra mã ưu đãi.",
        error: err.message,
      });
    }
  },
};

module.exports = couponController;
