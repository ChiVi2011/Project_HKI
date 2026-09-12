const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    settingKey: {
      type: String,
      default: "general_settings",
      unique: true,
      trim: true,
    },
    // Thông tin thương hiệu chung
    siteName: {
      type: String,
      default: "ViDairy - Sữa Dinh Dưỡng Chuẩn Y Học",
    },
    logoUrl: {
      type: String,
      default: "/src/assets/img/logo.png",
    },
    faviconUrl: {
      type: String,
      default: "/src/assets/favicon/favicon.ico",
    },
    hotline: {
      type: String,
      default: "0989 584 592",
    },
    email: {
      type: String,
      default: "cskh@vidairy.vn",
    },
    address: {
      type: String,
      default: "Số 120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    },

    // Trang Danh Sách Sản Phẩm (Product-List)
    productPageBanner: {
      type: String,
      default: "/src/assets/img/mother_baby_banner.jpg",
    },
    productPageTitle: {
      type: String,
      default: "VitaDairy Luôn Đồng Hành Cùng Mẹ Và Bé",
    },
    productPageDescription: {
      type: String,
      default:
        "ViDairy hướng tới sản xuất các sản phẩm sữa chăm sóc sức khỏe người tiêu dùng ở nhiều lứa tuổi từ những sản phẩm cung cấp năng lượng cho người lớn, sản phẩm chuyên biệt dành cho người bệnh, sản phẩm cho trẻ biếng ăn, suy dinh dưỡng thấp còi đến các dòng sản phẩm giúp bé phát triển trí não, tăng chiều cao...",
    },

    // Trang Chủ (Home Page)
    homeHeroTitle: {
      type: String,
      default: "Dinh Dưỡng Vàng Cho Tương Lai Khỏe Mạnh",
    },
    homeHeroSubtitle: {
      type: String,
      default: "Kháng thể tự nhiên ColosIgG 24h nhập khẩu độc quyền từ Mỹ",
    },
    homeHeroBanner: {
      type: String,
      default: "/src/assets/img/ViDairy_banner_1536x816.png",
    },
    brandSlogan: {
      type: String,
      default: "ViDairy - Trao Sức Khỏe, Trọn Yêu Thương",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Setting", settingSchema);
