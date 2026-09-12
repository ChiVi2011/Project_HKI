const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
const bannerController = require("../controllers/bannerController");
const settingController = require("../controllers/settingController");
const promotionController = require("../controllers/promotionController");
const orderController = require("../controllers/orderController");
const newsController = require("../controllers/newsController");
const authController = require("../controllers/authController");
const couponController = require("../controllers/couponController");
const branchController = require("../controllers/branchController");
const chatController = require("../controllers/chatController");
const notificationController = require("../controllers/notificationController");

// ==========================================
// 1. AUTHENTICATION & USER PROFILE
// ==========================================
router.post("/auth/register-send-otp", authController.sendRegisterOtp);
router.post("/auth/register-verify-otp", authController.verifyRegisterOtp);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authController.getProfile);
router.put("/auth/profile", authController.updateProfile);

// ==========================================
// 2. ADMIN USER & STATUS MANAGEMENT
// ==========================================
router.get("/admin/users", authController.getAllUsers);
router.patch("/admin/users/:id/status", authController.toggleUserStatus);
router.patch("/admin/users/:id/role", authController.updateUserRole);

// ==========================================
// 3. PRODUCTS (CRUD & STATUS TOGGLE)
// ==========================================
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
router.patch("/products/:id/status", productController.toggleProductStatus);

// ==========================================
// 4. CATEGORIES (CRUD & STATUS TOGGLE)
// ==========================================
router.get("/categories", categoryController.getCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.post("/categories", categoryController.createCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);
router.patch("/categories/:id/status", categoryController.toggleCategoryStatus);

// ==========================================
// 5. BANNERS (CRUD & STATUS TOGGLE)
// ==========================================
router.get("/banners", bannerController.getBanners);
router.get("/banners/:id", bannerController.getBannerById);
router.post("/banners", bannerController.createBanner);
router.put("/banners/:id", bannerController.updateBanner);
router.delete("/banners/:id", bannerController.deleteBanner);
router.patch("/banners/:id/status", bannerController.toggleBannerStatus);

// ==========================================
// 6. SETTINGS & SYSTEM CONFIGURATION
// ==========================================
router.get("/settings", settingController.getSettings);
router.put("/settings", settingController.updateSettings);
router.post("/settings/reset", settingController.resetSettings);

// ==========================================
// 7. PROMOTIONS
// ==========================================
router.get("/promotions", promotionController.getPromotions);

// ==========================================
// 8. ORDERS & CHECKOUT
// ==========================================
router.get("/orders", orderController.getOrders);
router.get("/orders/:id", orderController.getOrderById);
router.post("/orders", orderController.createOrder);
router.patch("/orders/:id/status", orderController.updateOrderStatus);

// ==========================================
// 9. COUPONS & VOUCHERS
// ==========================================
router.get("/coupons", couponController.getCoupons);
router.post("/coupons", couponController.createCoupon);
router.patch("/coupons/:id/status", couponController.toggleCouponStatus);
router.delete("/coupons/:id", couponController.deleteCoupon);
router.post("/coupons/validate", couponController.validateCoupon);

// ==========================================
// 10. STORE BRANCHES
// ==========================================
router.get("/branches", branchController.getBranches);
router.post("/branches", branchController.createBranch);
router.patch("/branches/:id/status", branchController.updateBranchStatus);

// ==========================================
// 11. NEWS & CMS
// ==========================================
router.get("/news", newsController.getNews);
router.get("/news/:id", newsController.getNewsById);

// ==========================================
// 12. AI NUTRITION CHATBOT (GEMINI & FALLBACK)
// ==========================================
router.post("/chat", chatController.handleChat);

// ==========================================
// 13. NOTIFICATIONS & CMS (doc08_API)
// ==========================================
router.get("/notifications", notificationController.getNotifications);
router.put("/notifications/read-all", notificationController.markAllAsRead);
router.put("/notifications/:id/read", notificationController.markAsRead);
router.post("/notifications", notificationController.createNotification);

module.exports = router;
