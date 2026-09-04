import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logoImg from "../assets/img/logo.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../style/header.css";

function Header() {
  const navActive = ({ isActive }) => (isActive ? "active-menu" : "");
  const { openCart, totalItems } = useCart();
  const { isLoggedIn, user } = useAuth();
  const [headerSearch, setHeaderSearch] = useState("");
  const navigate = useNavigate();

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
          <div className="notification" title="Thông báo ưu đãi">
            <i className="bi bi-bell-fill"></i>
            <span className="badge">3</span>
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

        {/* Icon Tài khoản: Chưa đăng nhập -> /login, Đã đăng nhập -> /profile */}
        <div
          className="Login"
          title={
            isLoggedIn
              ? `Tài khoản: ${user?.FullName || "Thành viên"} (${user?.Role === "ADMIN" ? "Quản trị viên" : "Khách hàng"})`
              : "Đăng nhập tài khoản"
          }
        >
          <Link
            to={isLoggedIn ? "/profile" : "/login"}
            className={isLoggedIn ? "user-avatar-link logged-in" : "user-avatar-link"}
            aria-label={isLoggedIn ? "Trang cá nhân" : "Đăng nhập"}
          >
            {isLoggedIn ? (
              <div className="header-user-badge">
                <i className="bi bi-person-fill-check"></i>
                <span className="user-short-name">
                  {user?.FullName?.split(" ").pop() || "User"}
                </span>
                {user?.Role === "ADMIN" && <span className="admin-pill">Admin</span>}
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
