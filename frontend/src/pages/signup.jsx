import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OTP from "../components/otp";
import "../style/login.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Vui lòng nhập họ và tên của bạn!");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email là bắt buộc để nhận mã xác thực OTP kích hoạt tài khoản!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Địa chỉ email không đúng định dạng!");
      return;
    }

    if (!formData.password) {
      setError("Vui lòng nhập mật khẩu bảo mật!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có tối thiểu 6 ký tự!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp nhau!");
      return;
    }

    if (!formData.agree) {
      setError("Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật!");
      return;
    }

    // Gọi API gửi mã OTP qua email cấu hình trong .env
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/register-send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          fullName: formData.name.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gửi OTP thất bại.");
      }

      // Mở modal nhập OTP
      setShowOtpModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="From">
        <div className="title-login">
          <h2>Đăng ký tài khoản</h2>
          <p>Tạo tài khoản ViDairy để nhận ngay ưu đãi 50K và tích lũy điểm thưởng</p>
        </div>

        <div className="form">
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "13.5px",
                }}
              >
                <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: "6px" }}></i>
                {error}
              </div>
            )}

            {/* Họ và tên */}
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
                placeholder="Nhập Họ và Tên *"
                required
              />
            </div>

            {/* Email (BẮT BUỘC để nhận OTP) */}
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
                placeholder="Địa chỉ Email (Bắt buộc nhận OTP) *"
                required
              />
            </div>

            {/* Số điện thoại */}
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
                placeholder="Số điện thoại liên hệ"
              />
            </div>

            {/* Mật khẩu */}
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
                placeholder="Nhập mật khẩu *"
                required
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            {/* Xác nhận mật khẩu */}
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
                placeholder="Xác nhận lại mật khẩu *"
                required
              />
              <i
                className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            <div className="rules">
              <label htmlFor="agree">
                <input
                  type="checkbox"
                  id="agree"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                />
                <span>
                  Tôi đồng ý với{" "}
                  <Link to="/about">
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link to="/about">
                    Chính sách bảo mật
                  </Link>
                </span>
              </label>
            </div>

            <div className="btn-login">
              <button type="submit" className="btnLogin" disabled={isLoading}>
                {isLoading ? (
                  <span>
                    <i className="bi bi-hourglass-split"></i> Đang gửi mã OTP...
                  </span>
                ) : (
                  "Đăng Ký & Nhận Mã OTP"
                )}
              </button>
            </div>

            <div className="resigter">
              <span>Đã có tài khoản thành viên?</span>
              <Link to="/login">Đăng nhập ngay</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Modal xác thực OTP gửi qua email */}
      {showOtpModal && (
        <OTP
          email={formData.email.trim()}
          registerData={formData}
          onClose={() => setShowOtpModal(false)}
          onSuccess={(user) => {
            setShowOtpModal(false);
            navigate("/profile");
          }}
        />
      )}
    </>
  );
}
