const Setting = require("../models/settingModel");

const DEFAULT_SETTINGS = {
  settingKey: "general_settings",
  siteName: "ViDairy - Sữa Dinh Dưỡng Chuẩn Y Học",
  logoUrl: "/src/assets/img/logo.png",
  faviconUrl: "/src/assets/favicon/favicon.ico",
  hotline: "0989 584 592",
  email: "cskh@vidairy.vn",
  address: "Số 120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
  productPageBanner: "/src/assets/img/mother_baby_banner.jpg",
  productPageTitle: "VitaDairy Luôn Đồng Hành Cùng Mẹ Và Bé",
  productPageDescription:
    "ViDairy hướng tới sản xuất các sản phẩm sữa chăm sóc sức khỏe người tiêu dùng ở nhiều lứa tuổi từ những sản phẩm cung cấp năng lượng cho người lớn, sản phẩm chuyên biệt dành cho người bệnh, sản phẩm cho trẻ biếng ăn, suy dinh dưỡng thấp còi đến các dòng sản phẩm giúp bé phát triển trí não, tăng chiều cao...",
  homeHeroTitle: "Dinh Dưỡng Vàng Cho Tương Lai Khỏe Mạnh",
  homeHeroSubtitle: "Kháng thể tự nhiên ColosIgG 24h nhập khẩu độc quyền từ Mỹ",
  homeHeroBanner: "/src/assets/img/ViDairy_banner_1536x816.png",
  brandSlogan: "ViDairy - Trao Sức Khỏe, Trọn Yêu Thương",
};

const settingController = {
  // Lấy cài đặt website & trang sản phẩm
  async getSettings(req, res) {
    try {
      let setting = await Setting.findOne({
        settingKey: "general_settings",
      }).lean();
      if (!setting) {
        setting = await Setting.create(DEFAULT_SETTINGS);
      }

      return res.status(200).json({
        success: true,
        data: setting,
      });
    } catch (err) {
      console.error("Lỗi getSettings:", err);
      return res.status(200).json({
        success: true,
        data: DEFAULT_SETTINGS,
        isFallback: true,
      });
    }
  },

  // [ADMIN] Cập nhật cài đặt website & trang sản phẩm
  async updateSettings(req, res) {
    try {
      const updates = req.body;
      let setting = await Setting.findOne({ settingKey: "general_settings" });

      if (!setting) {
        setting = new Setting({ settingKey: "general_settings", ...updates });
      } else {
        Object.keys(updates).forEach((key) => {
          if (key !== "_id" && key !== "settingKey") {
            setting[key] = updates[key];
          }
        });
      }

      await setting.save();

      return res.status(200).json({
        success: true,
        message: "🎉 Cập nhật cài đặt website và nội dung thành công!",
        data: setting,
      });
    } catch (err) {
      console.error("Lỗi updateSettings:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lưu cài đặt.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Khôi phục cài đặt mặc định
  async resetSettings(req, res) {
    try {
      let setting = await Setting.findOne({ settingKey: "general_settings" });
      if (!setting) {
        setting = new Setting(DEFAULT_SETTINGS);
      } else {
        Object.assign(setting, DEFAULT_SETTINGS);
      }
      await setting.save();

      return res.status(200).json({
        success: true,
        message: "Đã khôi phục cài đặt website về mặc định ViDairy!",
        data: setting,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi khôi phục cài đặt.",
        error: err.message,
      });
    }
  },
};

module.exports = settingController;
