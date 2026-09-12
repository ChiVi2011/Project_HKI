const Banner = require("../models/bannerModel");

const bannerController = {
  // Lấy danh sách banner (hỗ trợ lọc theo page, position, status)
  async getBanners(req, res) {
    try {
      const { page, position, status } = req.query;
      const query = {};

      if (page && page !== "ALL") query.page = page;
      if (position && position !== "ALL")
        query.position = new RegExp(position, "i");
      if (status !== undefined && status !== "ALL")
        query.status = Number(status);

      const banners = await Banner.find(query)
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        count: banners.length,
        data: banners,
      });
    } catch (err) {
      console.error("Lỗi getBanners:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách banner.",
        error: err.message,
      });
    }
  },

  // Lấy chi tiết banner theo ID
  async getBannerById(req, res) {
    try {
      const { id } = req.params;
      let banner = await Banner.findOne({ BannerID: id }).lean();
      if (!banner && id.match(/^[0-9a-fA-F]{24}$/)) {
        banner = await Banner.findById(id).lean();
      }

      if (!banner) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy banner yêu cầu.",
        });
      }

      return res.status(200).json({ success: true, data: banner });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy chi tiết banner.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Tạo banner mới
  async createBanner(req, res) {
    try {
      const {
        title,
        position,
        page,
        imageUrl,
        linkUrl,
        description,
        status,
        displayOrder,
      } = req.body;

      if (!title || !imageUrl) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập tiêu đề và link hình ảnh banner.",
        });
      }

      const newBanner = await Banner.create({
        BannerID: `banner-${Date.now()}`,
        title: title.trim(),
        position: position || "Trang Sản Phẩm (Cover Hero)",
        page: page || "product-list",
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl || "/products",
        description: description || "",
        displayOrder: Number(displayOrder || 0),
        status: status !== undefined ? Number(status) : 1,
      });

      return res.status(201).json({
        success: true,
        message: "Tạo banner mới thành công!",
        data: newBanner,
      });
    } catch (err) {
      console.error("Lỗi createBanner:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi tạo banner.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Cập nhật banner
  async updateBanner(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      let banner = await Banner.findOne({ BannerID: id });
      if (!banner && id.match(/^[0-9a-fA-F]{24}$/)) {
        banner = await Banner.findById(id);
      }

      if (!banner) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy banner để cập nhật.",
        });
      }

      if (updates.title) banner.title = updates.title.trim();
      if (updates.position) banner.position = updates.position;
      if (updates.page) banner.page = updates.page;
      if (updates.imageUrl) banner.imageUrl = updates.imageUrl.trim();
      if (updates.linkUrl !== undefined) banner.linkUrl = updates.linkUrl;
      if (updates.description !== undefined)
        banner.description = updates.description;
      if (updates.status !== undefined) banner.status = Number(updates.status);
      if (updates.displayOrder !== undefined)
        banner.displayOrder = Number(updates.displayOrder);

      await banner.save();

      return res.status(200).json({
        success: true,
        message: "Cập nhật banner thành công!",
        data: banner,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật banner.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Bật / Tắt trạng thái banner
  async toggleBannerStatus(req, res) {
    try {
      const { id } = req.params;
      let banner = await Banner.findOne({ BannerID: id });
      if (!banner && id.match(/^[0-9a-fA-F]{24}$/)) {
        banner = await Banner.findById(id);
      }

      if (!banner) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy banner.",
        });
      }

      banner.status = banner.status === 1 ? 0 : 1;
      await banner.save();

      return res.status(200).json({
        success: true,
        message: `Đã ${banner.status === 1 ? "bật hiển thị" : "tạm ẩn"} banner!`,
        data: { id: banner._id, status: banner.status },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi chuyển trạng thái banner.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Xóa banner
  async deleteBanner(req, res) {
    try {
      const { id } = req.params;
      let result = await Banner.findOneAndDelete({ BannerID: id });
      if (!result && id.match(/^[0-9a-fA-F]{24}$/)) {
        result = await Banner.findByIdAndDelete(id);
      }

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy banner để xóa.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Đã xóa banner khỏi cơ sở dữ liệu thành công!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi xóa banner.",
        error: err.message,
      });
    }
  },
};

module.exports = bannerController;
