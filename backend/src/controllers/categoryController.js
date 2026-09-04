const Category = require("../models/categoryModel");

const categoryController = {
  // Lấy toàn bộ danh mục sản phẩm
  async getCategories(req, res) {
    try {
      const categories = await Category.find({ Status: true }).lean();
      return res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (err) {
      console.error("Lỗi getCategories:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh mục sản phẩm.",
        error: err.message,
      });
    }
  },

  // Lấy danh mục theo CategoryID
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ CategoryID: id }).lean();
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục yêu cầu.",
        });
      }
      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh mục.",
        error: err.message,
      });
    }
  },
};

module.exports = categoryController;
