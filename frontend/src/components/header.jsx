import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logoImg from "../assets/img/logo.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./notification-dropdown.jsx";
import { notificationService } from "../services/notificationService.js";
import "../style/header.css";

function Header() {
  const navActive = ({ isActive }) => (isActive ? "active-menu" : "");
  const { openCart, totalItems } = useCart();
  const { isLoggedIn, user, token, canAccessAdmin } = useAuth();
  const [headerSearch, setHeaderSearch] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchNotifications = async () => {
      try {
        const currentUserId = user?.UserID || user?.id || user?._id || null;
        const res = await notificationService.getNotifications(
          token,
          currentUserId,
        );
        if (isMounted && res) {
          setNotifications(res.notifications || []);
          setUnreadCount(res.unreadCount ?? 0);
        }
      } catch (err) {
        console.error("Lỗi tải thông báo:", err);
      }
    };
    fetchNotifications();
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, user, token]);

  const handleToggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleMarkAsRead = async (id) => {
    const currentUserId = user?.UserID || user?.id || user?._id || null;
    await notificationService.markAsRead(id, token, currentUserId);
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === id || item.id === id ? { ...item, isRead: true } : item,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    const currentUserId = user?.UserID || user?.id || user?._id || null;
    await notificationService.markAllAsRead(token, currentUserId);
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
  };

  const handleHeaderSearch = (e) => {
    if (e.key === "Enter" && headerSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  return (
    <header>
      <div className="menu">
        <ul>
          <li>
            <NavLink to="/home" className={navActive}>
              Trang Chủ
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={navActive}>
              Sản Phẩm
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={navActive}>
              Giới thiệu
            </NavLink>
          </li>
          <li>
            <NavLink to="/news" className={navActive}>
              Tin Tức
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={navActive}>
              Liên Hệ
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="logo">
        <Link to="/home" title="Trang chủ ViDairy">
          <img src={logoImg} alt="ViDairy Logo" />
        </Link>
      </div>

      <div className="right">
        <div className="search">
          <label htmlFor="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              id="search-box"
              placeholder="Tìm kiếm sản phẩm..."
              name="Search"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={handleHeaderSearch}
            />
          </label>
        </div>
        <div className="icon">
          <div className="notification-container">
            <div
              className={`notification header-notification-btn ${unreadCount > 0 ? "has-unread" : ""}`}
              title="Thông báo ưu đãi"
              onClick={handleToggleNotification}
              role="button"
              tabIndex={0}
              aria-expanded={isNotificationOpen}
              aria-label="Thông báo"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleToggleNotification();
                }
              }}
            >
              <i className="bi bi-bell-fill"></i>
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </div>

            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </div>
          <div
            className="cart"
            title="Giỏ hàng ViDairy"
            onClick={openCart}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <i className="bi bi-cart-fill"></i>
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </div>
        </div>

        {/* Nút vào nhanh Trang Admin: Chỉ hiện cho STAFF, MANAGER hoặc ADMIN */}
        {canAccessAdmin && (
          <div className="header-admin-quick-wrap">
            <Link
              to="/admin"
              className="btn-header-admin"
              title="Vào Trang Quản Trị Hệ Thống (Admin Portal)"
            >
              <i className="bi bi-speedometer2"></i>
              <span>Vào Admin</span>
            </Link>
          </div>
        )}

        {/* Icon Tài khoản: Chưa đăng nhập -> /login, Đã đăng nhập -> /profile */}
        <div
          className="Login"
          title={
            isLoggedIn
              ? `Tài khoản: ${user?.FullName || "Thành viên"} (${
                  user?.Role === "SUPERADMIN"
                    ? "Cấp tối cao (SuperAdmin)"
                    : user?.Role === "ADMIN"
                      ? "Quản trị viên"
                      : user?.Role === "MANAGER"
                        ? "Quản lý"
                        : "Khách hàng"
                })`
              : "Đăng nhập tài khoản"
          }
        >
          <Link
            to={isLoggedIn ? "/profile" : "/login"}
            className={
              isLoggedIn ? "user-avatar-link logged-in" : "user-avatar-link"
            }
            aria-label={isLoggedIn ? "Trang cá nhân" : "Đăng nhập"}
          >
            {isLoggedIn ? (
              <div className="header-user-badge">
                <i className="bi bi-person-fill-check"></i>
                <span className="user-short-name">
                  {user?.FullName?.split(" ").pop() || "User"}
                </span>
                {user?.Role === "SUPERADMIN" && (
                  <span
                    className="admin-pill"
                    style={{ backgroundColor: "#eab308", color: "#ffffff" }}
                  >
                    SuperAdmin
                  </span>
                )}
                {user?.Role === "ADMIN" && (
                  <span className="admin-pill">Admin</span>
                )}
                {user?.Role === "MANAGER" && (
                  <span className="admin-pill manager">Quản lý</span>
                )}
              </div>
            ) : (
              <i className="bi bi-person-circle"></i>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
