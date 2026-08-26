import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, NavLink } from "react-router-dom";
import logoImg from "../assets/img/logo.png";
import "../style/header.css";
function Header() {
  const navActive = ({ isActive }) => (isActive ? "active-menu" : "");
  return (
    <>
      <header>
        <div className="menu">
          <ul>
            <li>
              <NavLink to="/home" className={navActive}>
                Trang Chủ
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={navActive}>Sản Phẩm</NavLink>
            </li>
            <li>
              <NavLink to="/" className={navActive}>Giới thiệu</NavLink>
            </li>
            <li>
              <NavLink to="/...." className={navActive}>Tin Tức</NavLink>
            </li>
            <li>
              <NavLink to="/..." className={navActive}>Liên Hệ</NavLink>
            </li>
          </ul>
        </div>
        <div className="logo">
          <img src={logoImg} alt="" />
        </div>
        <div className="right">
          <div className="search">
            <label htmlFor="search-box">
              <i className="bi bi-search"></i>
              <input type="text" placeholder="Tìm kiếm" name="Search" />
            </label>
          </div>
          <div className="icon">
            <div className="notification">
              <i className="bi bi-bell-fill"></i>
              <span className="badge">3</span>
            </div>
            <div className="cart">
              <i className="bi bi-cart-fill"></i>
              <span className="badge">2</span>
            </div>
          </div>
          <div className="Login">
            <Link to="/login">
              <i className="bi bi-person-circle"></i>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
export default Header;
