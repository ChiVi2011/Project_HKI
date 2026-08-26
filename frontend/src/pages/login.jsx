import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/login.css";
function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    account: "",
    password: "",
  });

  // Tự động xóa lỗi sau 5 giây nếu có lỗi
  useEffect(() => {
    if (!errors.account && !errors.password) return;
    const timer = setTimeout(() => {
      setErrors({ account: "", password: "" });
    }, 5000);
    return () => clearTimeout(timer);
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!account.trim()) {
      newErrors.account = "Vui lòng nhập số điện thoại/email";
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Xử lý đăng nhập thành công hoặc gọi API tại đây
  };

  return (
    <>
      <div className="From">
        <div className="title-login">
          <h2>Đăng nhập</h2>
          <p>Đăng nhập vào tài khoản thành viên của bạn</p>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="user">
              <input
                type="text"
                name="user"
                id="username"
                value={account}
                onChange={(e) => {
                  setAccount(e.target.value);
                  if (errors.account) {
                    setErrors((prev) => ({ ...prev, account: "" }));
                  }
                }}
                className={errors.account ? "input-error" : ""}
                placeholder="Số điện thoại/email"
              />
              {errors.account && (
                <span className="error-text">{errors.account}</span>
              )}
            </div>

            <div className="password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
                className={errors.password ? "input-error" : ""}
                placeholder="Nhập mật khẩu"
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              ></i>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="remember-forgot">
              <label htmlFor="rememberMe">
                <input type="checkbox" id="rememberMe" />
                Ghi nhớ mật khẩu
              </label>
              <Link to="/forgotPass" className="btnForgot">
                Quên mật khẩu?
              </Link>
            </div>

            <div className="login-action">
              <button type="submit" className="btnLogin">
                Đăng nhập
              </button>
            </div>

            <div className="loginSso">Hoặc</div>
            <div className="IconSSO">
              <i className="bi bi-google"></i>
              <i className="bi bi-facebook"></i>
            </div>

            <div className="SignUp">
              <label>
                Bạn chưa có tài khoản?
                <Link to="/signup" className="btn-signup">
                  Đăng Ký
                </Link>
              </label>
            </div>
          </form>
        </div>
      </div>
      <div className="footerLogin"></div>
    </>
  );
}

export default Login;
