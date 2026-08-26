import { Outlet, Link } from "react-router-dom";
import logoImg from "../assets/img/logo.png";
import "../style/login.css";

export default function AuthLayout() {
  return (
    <div className="login">
      <div className="header">
        <div className="back">
          <Link to="/home" className="backicon">
            <i className="bi bi-arrow-left-short"></i>
            <p>Quay lại</p>
          </Link>{" "}
        </div>
        <div className="logo">
          <img src={logoImg} alt="" />
        </div>
      </div>
      <div className="from" >
        <Outlet />
      </div>
      <div className="footerLogin"></div>
    </div>
  );
}
