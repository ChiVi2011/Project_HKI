import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/login.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Vui lòng nhập họ và tên!");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Vui lòng nhập số điện thoại!");
      return;
    }
    if (!formData.password) {
      setError("Vui lòng nhập mật khẩu!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!formData.agree) {
      setError("Vui lòng đồng ý với Điều khoản sử dụng!");
      return;
    }
    setError("");
  };

  return (
    <div className="From">
      <div className="title-login">
        <h2>Đăng ký</h2>
        <p>
          Tạo tài khoản ViDairy và tham gia chương trình khách hàng thân thiết
        </p>
      </div>

      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="name">
            <input
              type="text"
              name="name"
              id="fullname"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (error) setError("");
              }}
              placeholder="Nhập Họ và Tên"
            />
          </div>

          <div className="tele">
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (error) setError("");
              }}
              placeholder="Số điện thoại"
            />
          </div>

          <div className="mail">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (error) setError("");
              }}
              placeholder="Email (tùy chọn)"
            />
          </div>

          <div className="password">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (error) setError("");
              }}
              placeholder="Nhập mật khẩu"
            />
            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          <div className="password">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (error) setError("");
              }}
              placeholder="Nhập lại mật khẩu"
            />
            <i
              className={`bi ${
                showConfirmPassword ? "bi-eye-slash" : "bi-eye"
              }`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          {error && <span className="error-text">{error}</span>}

          <div className="remember-forgot">
            <label htmlFor="agreeTerms">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={formData.agree}
                onChange={(e) => {
                  setFormData({ ...formData, agree: e.target.checked });
                  if (error) setError("");
                }}
              />
              Tôi đã đọc và đồng ý với các Điều khoản sử dụng và Chính sách bảo
              mật
            </label>
          </div>

          <div className="login-action">
            <button type="submit" className="btnLogin">
              Đăng Ký
            </button>
          </div>

          <div className="SignUp">
            <label style={{ marginTop: "20px" }}>
              Bạn đã có tài khoản?
              <Link to="/login" className="btn-signup">
                Quay lại
              </Link>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
