const Notification = require("../models/notificationModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "vidairy_secret_jwt_key_2026_super_secure";

// Helper: Lấy userId từ JWT Bearer token hoặc query param
function getUserIdFromReq(req) {
  if (req.query.userId && typeof req.query.userId === "string" && req.query.userId.trim() && req.query.userId !== "null" && req.query.userId !== "undefined") {
    return req.query.userId.trim();
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.UserID || decoded.id || decoded.userId || null;
    } catch {
      return null;
    }
  }
  return null;
}

// Dữ liệu thông báo chung mặc định ban đầu
const DEFAULT_NOTIFICATIONS = [
  {
    title: "Ưu đãi độc quyền tháng này 🎉",
    message:
      "Nhập mã COLOS15 để được giảm ngay 15% cho tất cả các dòng sữa non ColosGain & ColosBaby chất lượng cao.",
    type: "promotion",
    couponCode: "COLOS15",
    actionText: "Dùng ngay",
    link: "/products?search=Colos",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25), // 25 phút trước
  },
  {
    title: "Cập nhật vận chuyển đơn hàng 🚚",
    message:
      "Đơn hàng #VD-89421 của bạn đã được bàn giao cho đơn vị vận chuyển ViDairy Express và đang trên đường giao.",
    type: "order",
    actionText: "Chi tiết",
    link: "/profile",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 giờ trước
  },
  {
    title: "Cẩm nang dinh dưỡng cho bé 🌿",
    message:
      "Bí quyết tăng cường miễn dịch tự nhiên cho trẻ trong giai đoạn giao mùa từ đội ngũ chuyên gia VitaDairy.",
    type: "news",
    actionText: "Đọc ngay",
    link: "/news",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 giờ trước
  },
  {
    title: "Khám phá dinh dưỡng chuẩn quốc tế ✨",
    message:
      "ViDairy luôn đồng hành cùng sức khỏe gia đình bạn với các dòng sản phẩm sữa non nhập khẩu cao cấp.",
    type: "system",
    actionText: "Khám phá",
    link: "/products",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 ngày trước
  },
];

const notificationController = {
  // Lấy danh sách thông báo (GET /api/notifications)
  async getNotifications(req, res) {
    try {
      const currentUserId = getUserIdFromReq(req);

      // Kiểm tra trạng thái kết nối MongoDB
      if (mongoose.connection.readyState !== 1) {
        let fallbackData = [...DEFAULT_NOTIFICATIONS];
        if (!currentUserId) {
          fallbackData.unshift({
            _id: "guest-welcome-prompt",
            title: "Nhận voucher 15% khi tạo tài khoản 🎁",
            message:
              "Đăng ký thành viên ViDairy ngay hôm nay để nhận mã ưu đãi NEWMEMBER giảm 15% cho đơn hàng đầu tiên!",
            type: "promotion",
            couponCode: "NEWMEMBER",
            link: "/login",
            actionText: "Đăng ký ngay",
            isRead: false,
            createdAt: new Date(),
          });
        }
        return res.status(200).json({
          success: true,
          count: fallbackData.length,
          unreadCount: fallbackData.filter((n) => !n.isRead).length,
          data: fallbackData,
          isOfflineFallback: true,
        });
      }

      const { type, limit } = req.query;
      const query = {};
      if (type && type !== "all") {
        query.type = type;
      }

      // Nếu có User đang đăng nhập: Lấy thông báo chung (userId = null) + thông báo riêng cho user này
      // Nếu là khách vãng lai: Chỉ lấy thông báo chung (userId = null)
      if (currentUserId) {
        query.$or = [{ userId: null }, { userId: String(currentUserId) }];
      } else {
        query.userId = null;
      }

      let notifCount = await Notification.countDocuments();
      if (notifCount === 0) {
        await Notification.insertMany(DEFAULT_NOTIFICATIONS);
      }

      let notifQuery = Notification.find(query).sort({ createdAt: -1 });
      if (limit) {
        notifQuery = notifQuery.limit(parseInt(limit, 10));
      }

      let notifications = await notifQuery.lean();

      // Nếu là khách vãng lai (chưa đăng nhập), gợi ý đăng ký tài khoản để nhận voucher 15%
      if (!currentUserId && (!type || type === "all" || type === "promotion")) {
        const guestPrompt = {
          _id: "guest-signup-promo",
          title: "Đăng ký thành viên nhận quà 🎁",
          message:
            "Tạo tài khoản ViDairy ngay hôm nay để nhận mã ưu đãi NEWMEMBER giảm 15% cho đơn hàng đầu tiên!",
          type: "promotion",
          couponCode: "NEWMEMBER",
          link: "/login",
          actionText: "Đăng ký ngay",
          isRead: false,
          createdAt: new Date(),
        };
        notifications = [guestPrompt, ...notifications];
      }

      const unreadCount = notifications.filter((n) => !n.isRead).length;

      return res.status(200).json({
        success: true,
        count: notifications.length,
        unreadCount,
        data: notifications,
      });
    } catch (err) {
      console.error("Lỗi getNotifications:", err);
      return res.status(200).json({
        success: true,
        count: DEFAULT_NOTIFICATIONS.length,
        unreadCount: DEFAULT_NOTIFICATIONS.filter((n) => !n.isRead).length,
        data: DEFAULT_NOTIFICATIONS,
        fallback: true,
      });
    }
  },

  // Đánh dấu 1 thông báo đã đọc (PUT /api/notifications/:id/read)
  async markAsRead(req, res) {
    try {
      const { id } = req.params;

      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
        const updated = await Notification.findByIdAndUpdate(
          id,
          { isRead: true },
          { new: true }
        ).lean();

        if (updated) {
          return res.status(200).json({
            success: true,
            message: "Đã đánh dấu thông báo là đã đọc.",
            data: updated,
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: "Đã đánh dấu đã đọc (client/mock).",
      });
    } catch (err) {
      console.error("Lỗi markAsRead:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật thông báo.",
        error: err.message,
      });
    }
  },

  // Đánh dấu tất cả thông báo đã đọc (PUT /api/notifications/read-all)
  async markAllAsRead(req, res) {
    try {
      const currentUserId = getUserIdFromReq(req);
      if (mongoose.connection.readyState === 1) {
        const filter = currentUserId
          ? { isRead: false, $or: [{ userId: null }, { userId: String(currentUserId) }] }
          : { isRead: false, userId: null };
        await Notification.updateMany(filter, { isRead: true });
      }

      return res.status(200).json({
        success: true,
        message: "Đã đánh dấu tất cả thông báo là đã đọc.",
      });
    } catch (err) {
      console.error("Lỗi markAllAsRead:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi cập nhật thông báo.",
        error: err.message,
      });
    }
  },

  // Thêm thông báo mới (POST /api/notifications)
  async createNotification(req, res) {
    try {
      const { title, message, type, link, actionText, couponCode, userId } = req.body;
      if (!title || !message) {
        return res.status(400).json({
          success: false,
          message: "Tiêu đề và nội dung thông báo là bắt buộc.",
        });
      }

      const newNotification = await Notification.create({
        title,
        message,
        type: type || "promotion",
        link: link || "",
        actionText: actionText || "",
        couponCode: couponCode || "",
        userId: userId || null,
        isRead: false,
      });

      return res.status(201).json({
        success: true,
        data: newNotification,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Không thể tạo thông báo mới.",
        error: err.message,
      });
    }
  },
};

module.exports = notificationController;
