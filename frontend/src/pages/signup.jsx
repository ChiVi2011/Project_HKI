import { Link } from "react-router-dom";
import "../style/login.css";
export default function signUp() {
  return (
    <>
      <div className="From">
        <div className="title-login">
          <h2>Đăng ký</h2>
          <p>
            Tạo tài khoản ViDairy và tham gia chương trình khách hàng thân thiết
          </p>
        </div>
        <div className="form">
          <form action="Login">
            <div className="name">
              <input
                type="text"
                name="name"
                id="fullname"
                placeholder="Nhập Họ và Tên"
              />
            </div>
            <div className="tele">
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Số điện thoại"
              />
            </div>
            <div className="mail">
              <input type="email" name="email" id="email" placeholder="Mail" />
            </div>
            <div className="password">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Nhập mật khẩu"
              />
              <i className="bi bi-eyeglasses"></i>
            </div>
            <div className="password">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Nhập lại mật khẩu"
              />
              <i className="bi bi-eyeglasses"></i>
            </div>
            <div className="remember-forgot">
              <label htmlFor="rememberMe">
                <input type="checkbox" />
                Tôi đã đọc và đồng ý với các Điều khoản sử dụng và Chính sách
                bảo mật
              </label>
            </div>
            <div className="login-action">
              <button to="/home" type="submit" className="btnLogin">
                Đăng Ký
              </button>
            </div>
            <div className="SignUp">
              <label htmlFor="SignUp" style={{ marginTop: "20px" }}>
                Bạn dã có tài khoản?
                <Link to="/login" className="btn-signup">
                  Quay lại
                </Link>
              </label>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
