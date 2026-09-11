import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const TOKEN_KEY = "vidairy_auth_token";
const USER_KEY = "vidairy_auth_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isLoggedIn = Boolean(token && user);
  const isAdmin = Boolean(user && user.Role === "ADMIN");
  const isStaff = Boolean(user && user.Role === "STAFF");
  const isManager = Boolean(user && user.Role === "MANAGER");
  const canAccessAdmin = Boolean(
    user && (user.Role === "ADMIN" || user.Role === "STAFF" || user.Role === "MANAGER")
  );

  // Đồng bộ với localStorage khi có thay đổi
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  // Xóa sạch giỏ hàng trong bộ nhớ trình duyệt và phát sự kiện làm mới
  const clearCartStorageAndNotify = () => {
    try {
      localStorage.removeItem("vidairy_cart_v1");
      localStorage.removeItem("vidairy_cart_v2");
      window.dispatchEvent(new Event("vidairy_cart_reset"));
    } catch (e) {
      console.error("Lỗi khi xóa giỏ hàng:", e);
    }
  };

  // Đăng nhập
  const login = (newToken, newUser) => {
    clearCartStorageAndNotify();
    setToken(newToken);
    setUser(newUser);
  };

  // Đăng xuất
  const logout = () => {
    clearCartStorageAndNotify();
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Cập nhật thông tin người dùng
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  // Tải lại thông tin mới nhất từ máy chủ
  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setUser(json.data);
        }
      }
    } catch (err) {
      console.warn("Không thể đồng bộ hồ sơ từ server:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoggedIn,
        isAdmin,
        isStaff,
        isManager,
        canAccessAdmin,
        login,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
}
