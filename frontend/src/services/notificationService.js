const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:3000/api";

const STORAGE_KEY = "vidairy_notifications";

// Dữ liệu dự phòng mặc định (kèm mã giảm giá chào mừng nếu là tài khoản mới)
const FALLBACK_NOTIFICATIONS = [
  {
    _id: "notif-promo-1",
    title: "Ưu đãi độc quyền tháng này 🎉",
    message:
      "Nhập mã COLOS15 để được giảm ngay 15% cho tất cả các dòng sữa non ColosGain & ColosBaby chất lượng cao.",
    type: "promotion",
    couponCode: "COLOS15",
    actionText: "Dùng ngay",
    link: "/products?search=Colos",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    _id: "notif-order-2",
    title: "Cập nhật vận chuyển đơn hàng 🚚",
    message:
      "Đơn hàng #VD-89421 của bạn đã được bàn giao cho đơn vị vận chuyển ViDairy Express và đang trên đường giao.",
    type: "order",
    actionText: "Chi tiết",
    link: "/profile",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    _id: "notif-news-3",
    title: "Cẩm nang dinh dưỡng cho bé 🌿",
    message:
      "Bí quyết tăng cường miễn dịch tự nhiên cho trẻ trong giai đoạn giao mùa từ đội ngũ chuyên gia VitaDairy.",
    type: "news",
    actionText: "Đọc ngay",
    link: "/news",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    _id: "notif-sys-4",
    title: "Khám phá dinh dưỡng chuẩn quốc tế ✨",
    message:
      "ViDairy luôn đồng hành cùng sức khỏe gia đình bạn với các dòng sản phẩm sữa non nhập khẩu cao cấp.",
    type: "system",
    actionText: "Khám phá",
    link: "/products",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const notificationService = {
  // Lấy danh sách thông báo (có hỗ trợ lọc theo UserID & JWT token)
  async getNotifications(token, userId) {
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = userId
        ? `${API_BASE_URL}/notifications?userId=${encodeURIComponent(userId)}`
        : `${API_BASE_URL}/notifications`;

      const res = await fetch(url, { headers });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Lưu cache vào localStorage để dùng khi offline
          const storageKey = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
          localStorage.setItem(storageKey, JSON.stringify(json.data));
          return {
            notifications: json.data,
            unreadCount: json.unreadCount ?? json.data.filter((n) => !n.isRead).length,
          };
        }
      }
    } catch (err) {
      console.warn("Không kết nối được Backend Notification API, sử dụng LocalStorage:", err);
    }

    // Fallback: LocalStorage
    try {
      const storageKey = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
      const cached = localStorage.getItem(storageKey) || localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            notifications: parsed,
            unreadCount: parsed.filter((n) => !n.isRead).length,
          };
        }
      }
    } catch {
      // Bỏ qua lỗi parse
    }

    // Fallback mặc định ban đầu
    const fallbackList = [...FALLBACK_NOTIFICATIONS];
    if (!userId) {
      fallbackList.unshift({
        _id: "guest-signup-promo",
        title: "Đăng ký thành viên nhận quà 🎁",
        message:
          "Tạo tài khoản ViDairy ngay hôm nay để nhận mã ưu đãi NEWMEMBER giảm 15% cho đơn hàng đầu tiên!",
        type: "promotion",
        couponCode: "NEWMEMBER",
        link: "/login",
        actionText: "Đăng ký ngay",
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      notifications: fallbackList,
      unreadCount: fallbackList.filter((n) => !n.isRead).length,
    };
  },

  // Đánh dấu 1 thông báo đã đọc
  async markAsRead(id, token, userId) {
    // Gọi API nếu id hợp lệ từ database
    if (id && !id.startsWith("notif-") && !id.startsWith("guest-")) {
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
          method: "PUT",
          headers,
        });
      } catch (err) {
        console.warn("Lỗi API markAsRead:", err);
      }
    }

    // Cập nhật local storage
    try {
      const storageKey = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
      const cached = localStorage.getItem(storageKey) || localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const list = JSON.parse(cached);
        const updated = list.map((item) =>
          item._id === id || item.id === id ? { ...item, isRead: true } : item
        );
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
    } catch {
      // Bỏ qua
    }
  },

  // Đánh dấu tất cả là đã đọc
  async markAllAsRead(token, userId) {
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const url = userId
        ? `${API_BASE_URL}/notifications/read-all?userId=${encodeURIComponent(userId)}`
        : `${API_BASE_URL}/notifications/read-all`;

      await fetch(url, {
        method: "PUT",
        headers,
      });
    } catch (err) {
      console.warn("Lỗi API markAllAsRead:", err);
    }

    // Cập nhật local storage
    try {
      const storageKey = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
      const cached = localStorage.getItem(storageKey) || localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const list = JSON.parse(cached);
        const updated = list.map((item) => ({ ...item, isRead: true }));
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
    } catch {
      // Bỏ qua
    }
  },
};
