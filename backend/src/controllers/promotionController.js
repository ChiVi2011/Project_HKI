const Promotion = require("../models/promotionModel");

const promotionController = {
  // Lấy toàn bộ chương trình khuyến mãi
  async getPromotions(req, res) {
    try {
      const promotions = await Promotion.find({ Status: true }).lean();
      return res.status(200).json({
        success: true,
        count: promotions.length,
        data: promotions,
      });
    } catch (err) {
      console.error("Lỗi getPromotions:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy chương trình khuyến mãi.",
        error: err.message,
      });
    }
  },
};

module.exports = promotionController;
