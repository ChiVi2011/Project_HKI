import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/login.css";

function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    account: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isLoggedIn, user, canAccessAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu đã đăng nhập: Superadmin / Quản trị viên -> vào thẳng /admin, Khách hàng -> /profile
  useEffect(() => {
    if (isLoggedIn && user) {
      const roleUpper = user.Role ? String(user.Role).toUpperCase() : "";
      const isSuperAdminOrAdmin =
        roleUpper === "SUPERADMIN" ||
        roleUpper === "ADMIN" ||
        roleUpper === "MANAGER" ||
        user.Email === "admin@vidairy.vn" ||
        user.Email === "superadmin@vidairy.vn";

      if (isSuperAdminOrAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate]);

  // Tự động xóa lỗi sau 5 giây nếu có lỗi
  useEffect(() => {
    if (!errors.account && !errors.password && !serverError) return;
    const timer = setTimeout(() => {
      setErrors({ account: "", password: "" });
      setServerError("");
    }, 6000);
    return () => clearTimeout(timer);
  }, [errors, serverError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const newErrors = {};

    if (!account.trim()) {
      newErrors.account = "Vui lòng nhập số điện thoại hoặc email!";
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu!";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: account.trim(),
          password: password.trim(),
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!",
        );
      }

      // Lưu phiên đăng nhập
      login(data.token, data.user);

      // Phân quyền chuyển hướng: Nếu là SuperAdmin / Admin / Staff / Manager -> Vào thẳng trang /admin
      const roleUpper = data.user?.Role
        ? String(data.user.Role).toUpperCase()
        : "";
      const isSuperAdminOrAdmin =
        roleUpper === "SUPERADMIN" ||
        roleUpper === "ADMIN" ||
        roleUpper === "MANAGER" ||
        data.user?.Email === "admin@vidairy.vn" ||
        data.user?.Email === "superadmin@vidairy.vn";

      if (isSuperAdminOrAdmin) {
        navigate("/admin", { replace: true });
      } else {
        const redirectUrl = location.state?.from || "/profile";
        navigate(redirectUrl, { replace: true });
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
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
            {serverError && (
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
                <i
                  className="bi bi-exclamation-circle-fill"
                  style={{ marginRight: "6px" }}
                ></i>
                {serverError}
              </div>
            )}

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
                  if (serverError) setServerError("");
                }}
                className={errors.account ? "input-error" : ""}
                placeholder="Số điện thoại hoặc Email *"
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
                  if (serverError) setServerError("");
                }}
                className={errors.password ? "input-error" : ""}
                placeholder="Nhập mật khẩu *"
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
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Ghi nhớ mật khẩu
              </label>
              <Link to="/forgotPass" className="btnForgot">
                Quên mật khẩu?
              </Link>
            </div>

            <div className="login-action">
              <button type="submit" className="btnLogin" disabled={isLoading}>
                {isLoading ? (
                  <span>
                    <i className="bi bi-hourglass-split"></i> Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>

            <div className="loginSso">Hoặc</div>
            <div className="IconSSO">
              <i className="bi bi-google"></i>
              <i className="bi bi-facebook"></i>
            </div>

            <div className="SignUp">
              <label>
                Bạn chưa có tài khoản?{" "}
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
