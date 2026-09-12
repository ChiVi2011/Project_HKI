const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Bỏ qua nếu môi trường không hỗ trợ
}

require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import models
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const Promotion = require("../models/promotionModel");
const Coupon = require("../models/couponModel");
const News = require("../models/newsModel");
const Order = require("../models/orderModel");
const Branch = require("../models/branchModel");
const Banner = require("../models/bannerModel");
const Setting = require("../models/settingModel");
const userModel = require("../models/userModel");
const User = userModel.MongooseModel;

async function seedDatabase() {
  const rawUrl = process.env.MONGO_URL || process.env.MONGO_URI;
  if (!rawUrl) {
    console.error("❌ Lỗi: Chưa cấu hình MONGO_URL trong file .env");
    process.exit(1);
  }

  const mongoUrl = rawUrl.trim();
  console.log("🚀 Bắt đầu kết nối MongoDB Atlas để nạp dữ liệu...");

  try {
    await mongoose.connect(mongoUrl, {
      dbName: "ViDairyDB",
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Đã kết nối thành công tới MongoDB Atlas (ViDairyDB)!\n");

    // 1. Tải dữ liệu mẫu từ Frontend
    const productsDataPath = path.resolve(
      __dirname,
      "../../../frontend/src/data/productsData.js",
    );
    const newsDataPath = path.resolve(
      __dirname,
      "../../../frontend/src/data/newsData.js",
    );

    const productsModule = await import(
      "file:///" + productsDataPath.replace(/\\/g, "/")
    );
    const newsModule = await import(
      "file:///" + newsDataPath.replace(/\\/g, "/")
    );

    const { categoriesData, productsData, promotionsData } = productsModule;
    const { newsData } = newsModule;

    // 2. Xóa dữ liệu cũ để tránh trùng lặp
    console.log("🧹 Đang dọn dẹp các collection cũ...");
    await Promise.all([
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Product.deleteMany({}),
      Promotion.deleteMany({}),
      Coupon.deleteMany({}),
      News.deleteMany({}),
      Branch.deleteMany({}),
      Order.deleteMany({}),
      Banner.deleteMany({}),
      Setting.deleteMany({}),
    ]);
    console.log("✅ Đã làm mới các collection.\n");

    // 3. Nạp Danh mục sản phẩm (Categories)
    console.log("📦 Đang nạp danh mục sản phẩm...");
    const categoryDocs = categoriesData.map((cat) => ({
      CategoryID: cat.id,
      CategoryName: cat.title || cat.name,
      Description: cat.subTitle || cat.description || "",
      icon: cat.icon || "bi-grid",
      color: cat.color || "#23408e",
      bgGradient:
        cat.bgGradient || "linear-gradient(135deg, #f0f7ff 0%, #e0eeff 100%)",
      brandTags: cat.brandTags || ["Tất cả"],
      bannerDesc: cat.bannerDesc || "",
      Status: true,
    }));
    await Category.insertMany(categoryDocs);
    console.log(`✅ Đã nạp thành công ${categoryDocs.length} danh mục.`);

    // 4. Trích xuất và nạp Thương hiệu (Brands)
    console.log("🏷️ Đang trích xuất thương hiệu...");
    const brandSet = new Set();
    productsData.forEach((p) => {
      if (p.brand) brandSet.add(p.brand);
    });

    const brandDocs = Array.from(brandSet).map((brandName, idx) => ({
      BrandID: `brand-${idx + 1}`,
      BrandName: brandName,
      Description: `Thương hiệu dinh dưỡng cao cấp ${brandName}`,
      Status: true,
    }));
    await Brand.insertMany(brandDocs);
    console.log(`✅ Đã nạp thành công ${brandDocs.length} thương hiệu.`);

    // 5. Nạp Sản phẩm (Products)
    console.log("🥛 Đang nạp danh sách sản phẩm...");
    const productDocs = productsData.map((p) => ({
      ProductID: p.id,
      CategoryID: p.categoryId,
      BrandName: p.brand || "VitaDairy",
      ProductName: p.name,
      slogan: p.slogan || "Dinh dưỡng chuẩn y học",
      description: p.description || "",
      packaging: p.packaging || "Lon thiếc tiêu chuẩn",
      targetUser: p.targetUser || "Mọi lứa tuổi",
      price: p.price || 0,
      imageUrl:
        p.imageUrl ||
        "https://vitadairy.vn/s/images/product/hinh-thumnail-sp-380-x-210.jpg",
      isHot: Boolean(p.isHot),
      isFeatured: p.isFeatured !== undefined ? Boolean(p.isFeatured) : true,
      rating: p.rating || 5.0,
      soldCount: p.soldCount || 100,
      packOptions: p.packOptions || [],
      nutritionFacts: p.nutritionFacts || [],
      keyHighlights: p.keyHighlights || [],
      usageSteps: p.usageSteps || [],
      origin: p.origin || "Nguyên liệu Sữa non ColosIgG 24h nhập khẩu từ Mỹ",
      manufacturer: p.manufacturer || "Công ty Cổ phần Sữa VitaDairy Việt Nam",
      shelfLife: p.shelfLife || "24 tháng kể từ ngày sản xuất",
      storage: p.storage || "Bảo quản nơi khô ráo, thoáng mát",
      Status: true,
    }));
    await Product.insertMany(productDocs);
    console.log(`✅ Đã nạp thành công ${productDocs.length} sản phẩm.`);

    // 6. Nạp Chương trình khuyến mãi (Promotions)
    console.log("🎁 Đang nạp chương trình khuyến mãi...");
    const promoDocs = promotionsData.map((promo) => ({
      PromotionID: promo.id,
      title: promo.title,
      summary: promo.summary || "",
      tag: promo.tag || "Khuyến mãi",
      badgeColor: promo.badgeColor || "#e11d48",
      date: promo.date || "Đang áp dụng",
      imageUrl:
        promo.imageUrl ||
        "https://vitadairy.vn/s/images/product/hinh-thumnail-sp-380-x-210.jpg",
      details: promo.details || {},
      Status: true,
    }));
    await Promotion.insertMany(promoDocs);
    console.log(
      `✅ Đã nạp thành công ${promoDocs.length} chương trình khuyến mãi.`,
    );

    // 7. Nạp Mã giảm giá (Coupons)
    console.log("🎫 Đang nạp mã voucher ưu đãi...");
    const couponDocs = [
      {
        CouponCode: "VIDAIRY10",
        DiscountType: "Percent",
        DiscountValue: 10,
        MinimumOrderAmount: 300000,
        StartDate: new Date(),
        EndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        Status: true,
      },
      {
        CouponCode: "VIDAIRY50",
        DiscountType: "FixedAmount",
        DiscountValue: 50000,
        MinimumOrderAmount: 300000,
        StartDate: new Date(),
        EndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        Status: true,
      },
      {
        CouponCode: "FREESHIP",
        DiscountType: "FixedAmount",
        DiscountValue: 30000,
        MinimumOrderAmount: 250000,
        StartDate: new Date(),
        EndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        Status: true,
      },
      {
        CouponCode: "MEBAU20",
        DiscountType: "Percent",
        DiscountValue: 20,
        MinimumOrderAmount: 500000,
        StartDate: new Date(),
        EndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        Status: true,
      },
    ];
    await Coupon.insertMany(couponDocs);
    console.log(`✅ Đã nạp thành công ${couponDocs.length} voucher ưu đãi.`);

    // 8. Nạp Tin tức dinh dưỡng (News)
    if (Array.isArray(newsData) && newsData.length > 0) {
      console.log("📰 Đang nạp bài viết tin tức...");
      const newsDocs = newsData.map((item) => ({
        title: item.title || "Tin tức dinh dưỡng VitaDairy",
        category: item.category || "Dinh dưỡng",
        date: item.date || new Date().toLocaleDateString("vi-VN"),
        author: item.author || "Chuyên gia Dinh dưỡng VitaDairy",
        summary: item.summary || item.title,
        content: item.content || item.summary || "",
        imageUrl:
          item.imageUrl ||
          "https://vitadairy.vn/s/images/product/hinh-thumnail-sp-380-x-210.jpg",
        isFeatured: Boolean(item.isFeatured),
        views: item.views || 120,
      }));
      await News.insertMany(newsDocs);
      console.log(`✅ Đã nạp thành công ${newsDocs.length} bài viết tin tức.`);
    }

    // 9. Nạp Chi nhánh cửa hàng (Branches)
    console.log("🏬 Đang nạp hệ thống chi nhánh cửa hàng...");
    const branchDocs = [
      {
        code: "CN001",
        name: "ViDairy Flagship Store - Quận 1",
        address: "Số 120 Nguyễn Huệ, Phường Bến Nghé, Quận 1",
        city: "TP. Hồ Chí Minh",
        phone: "0989 584 592",
        hours: "08:00 - 21:30 (Mở cửa cả tuần)",
        status: 1,
      },
      {
        code: "CN002",
        name: "ViDairy Cầu Giấy - Hà Nội",
        address: "Số 45 Trần Thái Tông, Phường Dịch Vọng Hậu, Quận Cầu Giấy",
        city: "Hà Nội",
        phone: "0989 584 592",
        hours: "08:00 - 21:00 (Mở cửa cả tuần)",
        status: 1,
      },
      {
        code: "CN003",
        name: "ViDairy Hải Châu - Đà Nẵng",
        address: "Số 88 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu",
        city: "Đà Nẵng",
        phone: "0989 584 592",
        hours: "08:00 - 21:00 (Mở cửa cả tuần)",
        status: 1,
      },
    ];
    await Branch.insertMany(branchDocs);
    console.log(
      `✅ Đã nạp thành công ${branchDocs.length} chi nhánh cửa hàng.`,
    );

    // 10. Nạp Đơn hàng mẫu (Orders)
    console.log("🛒 Đang nạp đơn hàng mẫu vào Database...");
    const orderDocs = [
      {
        OrderCode: "VD20260901001",
        ReceiverName: "Lê Minh Hoàng",
        ReceiverPhone: "0912345678",
        ShippingAddress: "Số 88 Nam Kỳ Khởi Nghĩa, P. Bến Nghé, Quận 1, TP.HCM",
        DeliveryType: "DELIVERY",
        BranchName: "",
        Items: [
          {
            ProductID: "sp-be-1",
            ProductName: "Sữa Bột ViDairy Kid Gold (Lon 800g)",
            VariantName: "Lon 800g",
            Quantity: 2,
            UnitPrice: 580000,
            ImageURL:
              "https://vitadairy.vn/s/images/product/hinh-thumnail-sp-380-x-210.jpg",
          },
        ],
        SubTotal: 1160000,
        Discount: 50000,
        TotalAmount: 1110000,
        ShippingFee: 0,
        PaymentMethod: "COD",
        PaymentStatus: "Completed",
        OrderStatus: "Completed",
        HasVAT: false,
        Note: "Giao hàng giờ hành chính",
      },
      {
        OrderCode: "VD20260903002",
        ReceiverName: "Phạm Thùy Linh",
        ReceiverPhone: "0987654321",
        ShippingAddress:
          "Tòa nhà Landmark 81, 720A Điện Biên Phủ, P.22, Q.Bình Thạnh, TP.HCM",
        DeliveryType: "DELIVERY",
        BranchName: "",
        Items: [
          {
            ProductID: "sp-me-1",
            ProductName: "Sữa Bột ViDairy Mom Care (Lon 800g)",
            VariantName: "Lon 800g",
            Quantity: 2,
            UnitPrice: 560000,
            ImageURL:
              "https://vitadairy.vn/s/images/product/hinh-thumnail-sp-380-x-210.jpg",
          },
        ],
        SubTotal: 1120000,
        Discount: 112000,
        TotalAmount: 1008000,
        ShippingFee: 0,
        PaymentMethod: "Banking",
        PaymentStatus: "Completed",
        OrderStatus: "Shipping",
        HasVAT: true,
        VATInfo: {
          Company: "Công Ty TNHH Giải Pháp Công Nghệ Alpha",
          TaxId: "0315899210",
          Email: "ketoan@alphatech.vn",
          Address: "Tầng 12, Tòa nhà Landmark 81, TP.HCM",
        },
        Note: "Xuất hóa đơn VAT điện tử qua email",
      },
      {
        OrderCode: "VD20260904003",
        ReceiverName: "Nguyễn Văn Khách",
        ReceiverPhone: "0987654321",
        ShippingAddress: "Nhận tại: Số 120 Nguyễn Huệ, Phường Bến Nghé, Quận 1",
        DeliveryType: "STORE_PICKUP",
        BranchName: "ViDairy Flagship Store - Quận 1 (TP.HCM)",
        Items: [
          {
            ProductID: "sp-nguoilon-1",
            ProductName: "Sữa Bột ViDairy Grand Care (Lon 850g)",
            VariantName: "Lon 850g",
            Quantity: 1,
            UnitPrice: 620000,
            ImageURL:
              "https://vitadairy.vn/s/images/product/hinh-thumnail-sp-380-x-210.jpg",
          },
        ],
        SubTotal: 620000,
        Discount: 30000,
        TotalAmount: 590000,
        ShippingFee: 0,
        PaymentMethod: "COD",
        PaymentStatus: "Pending",
        OrderStatus: "Processing",
        HasVAT: false,
        Note: "Khách sẽ đến nhận lúc 15h chiều",
      },
    ];
    await Order.insertMany(orderDocs);
    console.log(`✅ Đã nạp thành công ${orderDocs.length} đơn hàng mẫu.`);

    // 11. Nạp Banners
    console.log("🖼️ Đang nạp danh sách banner hệ thống...");
    const bannerDocs = [
      {
        BannerID: "banner-hero-cover",
        title: "VitaDairy Luôn Đồng Hành Cùng Mẹ Và Bé",
        position: "Trang Sản Phẩm (Cover Hero)",
        page: "product-list",
        imageUrl: "/src/assets/img/mother_baby_banner.jpg",
        linkUrl: "/products",
        description:
          "ViDairy hướng tới sản xuất các sản phẩm sữa chăm sóc sức khỏe người tiêu dùng ở nhiều lứa tuổi từ những sản phẩm cung cấp năng lượng cho người lớn, sản phẩm chuyên biệt dành cho người bệnh, sản phẩm cho trẻ biếng ăn, suy dinh dưỡng thấp còi đến các dòng sản phẩm giúp bé phát triển trí não, tăng chiều cao...",
        displayOrder: 1,
        status: 1,
      },
      {
        BannerID: "banner-home-hero",
        title: "Dinh Dưỡng Vàng Cho Tương Lai Khỏe Mạnh",
        position: "Trang Chủ (Hero Banner)",
        page: "home",
        imageUrl: "/src/assets/img/ViDairy_banner_1536x816.png",
        linkUrl: "/products",
        description:
          "Kháng thể tự nhiên ColosIgG 24h nhập khẩu độc quyền từ Mỹ",
        displayOrder: 2,
        status: 1,
      },
      {
        BannerID: "banner-child-care",
        title: "Dinh Dưỡng Vượt Trội Cho Bé Yêu",
        position: "Danh Mục Trẻ Em",
        page: "product-list",
        imageUrl: "/src/assets/img/cau_be_vidaiary.png",
        linkUrl: "/products?category=san-pham-cho-be",
        description: "Phát triển não bộ và tăng cường miễn dịch",
        displayOrder: 3,
        status: 1,
      },
      {
        BannerID: "banner-nut-milk",
        title: "Sống Khỏe Mỗi Ngày Với Sữa Hạt Tự Nhiên",
        position: "Danh Mục Sữa Hạt",
        page: "product-list",
        imageUrl: "/src/assets/img/sua_hat_vidairy.png",
        linkUrl: "/products?category=dung-kem",
        description: "Thuần thực vật thanh nhẹ giàu chất chống oxy hóa",
        displayOrder: 4,
        status: 1,
      },
    ];
    await Banner.insertMany(bannerDocs);
    console.log(`✅ Đã nạp thành công ${bannerDocs.length} banner hệ thống.`);

    // 12. Nạp Cài đặt hệ thống (Settings)
    console.log("⚙️ Đang nạp cấu hình cài đặt hệ thống...");
    const defaultSettingDoc = {
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
      homeHeroSubtitle:
        "Kháng thể tự nhiên ColosIgG 24h nhập khẩu độc quyền từ Mỹ",
      homeHeroBanner: "/src/assets/img/ViDairy_banner_1536x816.png",
      brandSlogan: "ViDairy - Trao Sức Khỏe, Trọn Yêu Thương",
    };
    await Setting.create(defaultSettingDoc);
    console.log("✅ Đã nạp thành công cấu hình cài đặt hệ thống.");

    // 13. Nạp Tài khoản mẫu (SuperAdmin, Admin & Khách hàng demo)
    console.log("👤 Đang kiểm tra và tạo tài khoản mẫu...");
    const superAdminExists = await User.findOne({
      Email: "superadmin@vidairy.vn",
    });
    if (!superAdminExists) {
      const superHash = await bcrypt.hash("Admin@123", 10);
      await User.create({
        CustomerCode: "KH000000",
        FullName: "Tổng Quản Trị Hệ Thống (Super Admin)",
        Email: "superadmin@vidairy.vn",
        Phone: "0909999999",
        PasswordHash: superHash,
        Role: "SUPERADMIN",
        Status: true,
      });
      console.log(
        "✅ Đã tạo tài khoản SuperAdmin: superadmin@vidairy.vn / Admin@123",
      );
    }

    const adminExists = await User.findOne({ Email: "admin@vidairy.vn" });
    if (!adminExists) {
      const adminHash = await bcrypt.hash("Admin@123", 10);
      await User.create({
        CustomerCode: "KH000001",
        FullName: "Quản trị viên VitaDairy",
        Email: "admin@vidairy.vn",
        Phone: "0901234567",
        PasswordHash: adminHash,
        Role: "ADMIN",
        Status: true,
      });
      console.log("✅ Đã tạo tài khoản Admin: admin@vidairy.vn / Admin@123");
    }

    const customerExists = await User.findOne({ Email: "khachhang@gmail.com" });
    if (!customerExists) {
      const custHash = await bcrypt.hash("Customer@123", 10);
      await User.create({
        CustomerCode: "KH000002",
        FullName: "Nguyễn Văn Khách",
        Email: "khachhang@gmail.com",
        Phone: "0987654321",
        PasswordHash: custHash,
        Role: "CUSTOMER",
        Status: true,
      });
      console.log(
        "✅ Đã tạo tài khoản Khách hàng: khachhang@gmail.com / Customer@123",
      );
    }

    console.log(
      "\n🎉 ========================================================",
    );
    console.log("🎉 TOÀN BỘ DỮ LIỆU ĐÃ ĐƯỢC NẠP LÊN MONGODB ATLAS THÀNH CÔNG!");
    console.log(
      "🎉 CSDL: ViDairyDB (Bao gồm Categories, Brands, Products, Promotions, Coupons, News, Branches, Orders, Banners, Settings, Users)",
    );
    console.log(
      "🎉 ========================================================\n",
    );

    process.exit(0);
  } catch (err) {
    console.error("\n❌ Lỗi trong quá trình nạp dữ liệu:", err);
    process.exit(1);
  }
}

seedDatabase();
