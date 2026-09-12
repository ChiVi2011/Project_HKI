const Category = require("../models/categoryModel");

const categoryController = {
  // Lấy toàn bộ danh mục sản phẩm
  async getCategories(req, res) {
    try {
      const { includeAll } = req.query;
      const query = includeAll === "true" ? {} : { Status: true };
      const categories = await Category.find(query).lean();
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
      let category = await Category.findOne({ CategoryID: id }).lean();
      if (!category && id.match(/^[0-9a-fA-F]{24}$/)) {
        category = await Category.findById(id).lean();
      }
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

  // [ADMIN] Tạo mới danh mục
  async createCategory(req, res) {
    try {
      const {
        CategoryID,
        CategoryName,
        title,
        subTitle,
        icon,
        color,
        bgGradient,
        brandTags,
        bannerDesc,
        Status,
      } = req.body;
      if (!CategoryName) {
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng nhập tên danh mục." });
      }

      const id = CategoryID || `cat-${Date.now()}`;
      const newCategory = await Category.create({
        CategoryID: id,
        CategoryName,
        title: title || CategoryName,
        subTitle: subTitle || "",
        icon: icon || "bi-grid-fill",
        color: color || "#23408e",
        bgGradient:
          bgGradient || "linear-gradient(135deg, #f0f7ff 0%, #e0eeff 100%)",
        brandTags: Array.isArray(brandTags) ? brandTags : ["Tất cả"],
        bannerDesc: bannerDesc || "",
        Status: Status !== undefined ? Boolean(Status) : true,
      });

      return res.status(201).json({
        success: true,
        message: "Tạo danh mục mới thành công!",
        data: newCategory,
      });
    } catch (err) {
      console.error("Lỗi createCategory:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tạo danh mục.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Cập nhật danh mục
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      let category = await Category.findOne({ CategoryID: id });
      if (!category && id.match(/^[0-9a-fA-F]{24}$/)) {
        category = await Category.findById(id);
      }

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục để cập nhật.",
        });
      }

      if (updates.CategoryName) category.CategoryName = updates.CategoryName;
      if (updates.title) category.title = updates.title;
      if (updates.subTitle !== undefined) category.subTitle = updates.subTitle;
      if (updates.icon) category.icon = updates.icon;
      if (updates.color) category.color = updates.color;
      if (updates.bgGradient) category.bgGradient = updates.bgGradient;
      if (updates.brandTags) category.brandTags = updates.brandTags;
      if (updates.bannerDesc !== undefined)
        category.bannerDesc = updates.bannerDesc;
      if (updates.Status !== undefined)
        category.Status = Boolean(updates.Status);

      await category.save();

      return res.status(200).json({
        success: true,
        message: "Cập nhật danh mục thành công!",
        data: category,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật danh mục.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Bật / Tắt trạng thái danh mục
  async toggleCategoryStatus(req, res) {
    try {
      const { id } = req.params;
      let category = await Category.findOne({ CategoryID: id });
      if (!category && id.match(/^[0-9a-fA-F]{24}$/)) {
        category = await Category.findById(id);
      }

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục.",
        });
      }

      category.Status = !category.Status;
      await category.save();

      return res.status(200).json({
        success: true,
        message: `Đã ${category.Status ? "bật" : "tắt"} hiển thị danh mục!`,
        data: { id: category.CategoryID, Status: category.Status },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi đổi trạng thái danh mục.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Xóa danh mục
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      let result = await Category.findOneAndDelete({ CategoryID: id });
      if (!result && id.match(/^[0-9a-fA-F]{24}$/)) {
        result = await Category.findByIdAndDelete(id);
      }

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục để xóa.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Đã xóa danh mục thành công!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi xóa danh mục.",
        error: err.message,
      });
    }
  },
};

module.exports = categoryController;
