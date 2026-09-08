import {
  categoriesData as mockCategories,
  productsData as mockProducts,
  promotionsData as mockPromotions,
  formatCurrency as localFormatCurrency,
} from "../data/productsData.js";

// Cấu hình URL API cơ sở (mặc định lấy từ biến môi trường Vite hoặc localhost:3000/api)
const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:3000/api";

/**
 * Chuẩn hóa đối tượng sản phẩm từ Backend API (SQL Server / Express)
 * hoặc Mock Data về một cấu trúc thống nhất cho UI
 */
export function normalizeProduct(raw) {
  if (!raw) return null;

  // Lấy ID
  const id = raw.ProductID || raw.id || `sp-${Math.random().toString(36).substr(2, 9)}`;

  // Lấy Category ID
  let categoryId = raw.CategoryID || raw.categoryId || "san-pham-cho-be";
  if (typeof categoryId === "number") {
    // Map ID số nếu backend dùng integer sang slug UI
    const categoryMap = {
      1: "san-pham-cho-me",
      2: "san-pham-cho-be",
      3: "san-pham-cho-nguoi-lon-tuoi",
      4: "dung-kem",
    };
    categoryId = categoryMap[categoryId] || String(categoryId);
  }

  // Lấy giá
  let price = 0;
  if (raw.Price !== undefined && raw.Price !== null) {
    price = Number(raw.Price);
  } else if (raw.price !== undefined && raw.price !== null) {
    price = Number(raw.price);
  } else if (Array.isArray(raw.ProductVariants) && raw.ProductVariants.length > 0) {
    price = Number(raw.ProductVariants[0].Price || 0);
  }

  // Quy cách / packaging
  let packaging = "Lon thiếc tiêu chuẩn";
  if (raw.VariantName) {
    packaging = raw.VariantName;
  } else if (raw.packaging) {
    packaging = raw.packaging;
  } else if (raw.unit) {
    packaging = raw.unit;
  } else if (Array.isArray(raw.ProductVariants) && raw.ProductVariants.length > 0) {
    packaging = raw.ProductVariants[0].VariantName || packaging;
  }

  return {
    id: String(id),
    categoryId: String(categoryId),
    brand: raw.BrandName || raw.brand || "VitaDairy",
    name: raw.ProductName || raw.name || "Sản phẩm Dinh dưỡng VitaDairy",
    slogan: raw.slogan || raw.Slogan || raw.Tagline || "Dinh dưỡng chuẩn y học cho cả gia đình",
    description:
      raw.Description ||
      raw.description ||
      "Bổ sung vi chất thiết yếu, tăng cường sức đề kháng và hỗ trợ tiêu hóa vượt trội.",
    packaging: packaging,
    targetUser: raw.AgeGroup || raw.targetUser || "Mọi lứa tuổi",
    price: isNaN(price) ? 0 : price,
    imageUrl:
      raw.ImageURL ||
      raw.imageUrl ||
      raw.image ||
      "/products/colosbaby-gold.jpg",
    isHot: Boolean(raw.isHot || raw.IsHot || raw.featured),
    isFeatured: raw.isFeatured !== undefined ? Boolean(raw.isFeatured) : true,
    rating: Number(raw.rating || 5),
    soldCount: Number(raw.soldCount || raw.SoldCount || 100),
    raw: raw,
  };
}

/**
 * Chuẩn hóa đối tượng danh mục
 */
export function normalizeCategory(raw) {
  if (!raw) return null;

  const id = raw.CategoryID ? String(raw.CategoryID) : raw.id;
  return {
    id: String(id),
    name: raw.CategoryName || raw.name || "Danh mục sản phẩm",
    title: raw.title || raw.CategoryName || "Sản phẩm VitaDairy",
    subTitle:
      raw.subTitle ||
      raw.Description ||
      "Dinh dưỡng toàn diện và chuyên biệt cho từng thành viên",
    icon: raw.icon || "bi-grid-fill",
    color: raw.color || "#23408e",
    bgGradient: raw.bgGradient || "linear-gradient(135deg, #f0f7ff 0%, #e0eeff 100%)",
    brandTags: raw.brandTags || ["Tất cả"],
    bannerDesc: raw.bannerDesc || raw.Description || "",
  };
}

/**
 * Chuẩn hóa thông tin khuyến mãi
 */
export function normalizePromotion(raw) {
  if (!raw) return null;

  return {
    id: String(raw.id || raw.PromotionID || `promo-${Math.random().toString(36).substr(2, 5)}`),
    title: raw.title || raw.Title || raw.Name || "Ưu đãi đặc biệt từ VitaDairy",
    summary: raw.summary || raw.Description || "Nhận ngay quà tặng và khuyến mãi độc quyền",
    tag: raw.tag || raw.DiscountType || "Khuyến mãi",
    badgeColor: raw.badgeColor || "#e11d48",
    date: raw.date || (raw.StartDate ? `${raw.StartDate || ""} - ${raw.EndDate || ""}` : "Đang áp dụng"),
    imageUrl:
      raw.imageUrl ||
      raw.ImageURL ||
      raw.bannerUrl ||
      "/products/colosbaby-gold.jpg",
    details: raw.details || {
      condition: raw.Condition || "Áp dụng cho tất cả khách hàng khi mua các sản phẩm chính hãng",
      gift: raw.Gift || "Nhiều phần quà giá trị cao từ VitaDairy",
      howToJoin: raw.HowToJoin || "Mua hàng trực tiếp tại cửa hàng hoặc đặt online",
      note: raw.Note || "Số lượng quà tặng có hạn, chương trình có thể kết thúc sớm",
    },
  };
}

export const productService = {
  /**
   * Lấy danh sách sản phẩm từ API
   * Tự động fallback về mock data nếu API offline / chưa có endpoint
   */
  async getProducts(params = {}) {
    const { category, search, sort } = params;

    try {
      const query = new URLSearchParams();
      if (category && category !== "all" && category !== "thong-tin-khuyen-mai") {
        query.append("category", category);
      }
      if (search) query.append("search", search);
      if (sort && sort !== "default") query.append("sort", sort);

      const queryString = query.toString();
      const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ""}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      const rawList = Array.isArray(json) ? json : json.data || json.products || [];

      if (Array.isArray(rawList) && rawList.length > 0) {
        return {
          data: rawList.map(normalizeProduct),
          isFromApi: true,
        };
      }
      return { data: [], isFromApi: true };
    } catch (err) {
      console.warn(
        "[productService] API chưa sẵn sàng hoặc gặp lỗi kết nối. Đang sử dụng dữ liệu mẫu dự phòng:",
        err.message
      );
      // Fallback về mock data
      let items = mockProducts.map(normalizeProduct);

      // Áp dụng bộ lọc local nếu dùng fallback
      if (category && category !== "all" && category !== "thong-tin-khuyen-mai") {
        items = items.filter((p) => p.categoryId === category);
      }
      if (search && search.trim()) {
        const kw = search.trim().toLowerCase();
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(kw) ||
            p.slogan.toLowerCase().includes(kw) ||
            p.description.toLowerCase().includes(kw) ||
            p.targetUser.toLowerCase().includes(kw)
        );
      }
      if (sort === "price-asc") {
        items = [...items].sort((a, b) => a.price - b.price);
      } else if (sort === "price-desc") {
        items = [...items].sort((a, b) => b.price - a.price);
      }

      return {
        data: items,
        isFromApi: false,
        fallbackReason: err.message,
      };
    }
  },

  /**
   * Lấy danh mục sản phẩm từ API hoặc mock fallback
   */
  async getCategories() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      const list = Array.isArray(json) ? json : json.data || json.categories || [];

      if (Array.isArray(list) && list.length > 0) {
        return {
          data: list.map(normalizeCategory),
          isFromApi: true,
        };
      }
    } catch (err) {
      console.warn("[productService] Fallback categories về dữ liệu mẫu:", err.message);
    }

    return {
      data: mockCategories.map(normalizeCategory),
      isFromApi: false,
    };
  },

  /**
   * Lấy danh sách khuyến mãi từ API hoặc mock fallback
   */
  async getPromotions() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${API_BASE_URL}/promotions`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      const list = Array.isArray(json) ? json : json.data || json.promotions || [];

      if (Array.isArray(list) && list.length > 0) {
        return {
          data: list.map(normalizePromotion),
          isFromApi: true,
        };
      }
    } catch (err) {
      console.warn("[productService] Fallback promotions về dữ liệu mẫu:", err.message);
    }

    return {
      data: mockPromotions.map(normalizePromotion),
      isFromApi: false,
    };
  },

  /**
   * Lấy chi tiết sản phẩm theo ID (API Live + Fallback)
   */
  async getProductById(id) {
    if (!id) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return normalizeProduct(json.data);
        }
      }
    } catch (err) {
      console.warn(`[productService] Không tải được sản phẩm ${id} từ API, dùng fallback:`, err.message);
    }
    const found = mockProducts.find(
      (p) => String(p.id) === String(id) || String(p.ProductID) === String(id)
    );
    return found ? normalizeProduct(found) : null;
  },

  /**
   * [ADMIN] Thêm sản phẩm mới vào Database
   */
  async createProduct(productData) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return await response.json();
  },

  /**
   * [ADMIN] Cập nhật thông tin sản phẩm
   */
  async updateProduct(id, productData) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return await response.json();
  },

  /**
   * [ADMIN] Chuyển đổi trạng thái ẩn/hiện sản phẩm
   */
  async toggleProductStatus(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}/status`, {
      method: "PATCH",
    });
    return await response.json();
  },

  /**
   * [ADMIN] Xóa sản phẩm
   */
  async deleteProduct(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  },

  /**
   * Lấy danh sách đơn hàng
   */
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders${query ? `?${query}` : ""}`);
    return await response.json();
  },

  /**
   * Tạo đơn hàng mới
   */
  async createOrder(orderData) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  },

  /**
   * [ADMIN] Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(orderId, newStatus) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ OrderStatus: newStatus }),
    });
    return await response.json();
  },

  /**
   * Lấy danh sách coupons
   */
  async getCoupons(all = true) {
    const response = await fetch(`${API_BASE_URL}/coupons?all=${all}`);
    return await response.json();
  },

  /**
   * [ADMIN] Thêm coupon mới
   */
  async createCoupon(couponData) {
    const response = await fetch(`${API_BASE_URL}/coupons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(couponData),
    });
    return await response.json();
  },

  /**
   * [ADMIN] Chuyển đổi trạng thái coupon
   */
  async toggleCouponStatus(id) {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}/status`, {
      method: "PATCH",
    });
    return await response.json();
  },

  /**
   * Xác thực mã coupon khi checkout
   */
  async validateCoupon(code, orderAmount) {
    const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderAmount }),
    });
    return await response.json();
  },

  /**
   * Lấy danh sách chi nhánh cửa hàng
   */
  async getBranches() {
    const response = await fetch(`${API_BASE_URL}/branches`);
    return await response.json();
  },

  /**
   * Lấy danh sách tin tức
   */
  async getNews() {
    const response = await fetch(`${API_BASE_URL}/news`);
    return await response.json();
  },

  /**
   * Định dạng tiền tệ VND
   */
  /**
 * [ADMIN] Cập nhật vai trò và phân quyền người dùng
 */
  async updateUserRole(userId, role, permissions, token) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ role, permissions }),
    });
    return await response.json();
  },

  formatCurrency(amount) {
    if (typeof localFormatCurrency === "function") {
      return localFormatCurrency(amount);
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  },
};

export { mockCategories, mockProducts, mockPromotions };
export default productService;
