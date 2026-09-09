import { Outlet, Link } from "react-router-dom";
import logoImg from "../assets/img/logo.png";
import "../style/login.css";

export default function AuthLayout() {
  return (
    <div className="login">
      <div className="header">
        <div className="back">
          <Link to="/home" className="backicon" title="Quay về trang chủ">
            <i className="bi bi-arrow-left"></i>
            <span>Quay lại</span>
          </Link>
        </div>
        <div className="logo">
          <Link to="/home">
            <img src={logoImg} alt="ViDairy Logo" />
          </Link>
        </div>
      </div>
      <div className="from">
        <Outlet />
      </div>
      <div className="footerLogin"></div>
    </div>
  );
}
