import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/login.css";
import OtpVerify from "../components/otp";

export default function ForgotPass() {
  const [account, setAccount] = useState("");
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!account.trim()) {
      setError("Vui lòng nhập số điện thoại hoặc email!");
      return;
    }
    setError("");
    setShowOtpVerify(true);
  };

  return (
    <>
      <div className="From">
        <div className="title-login">
          <h2>Quên Mật Khẩu</h2>
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
                  if (error) setError("");
                }}
                placeholder="Số điện thoại/email"
              />
              {error && <span className="error-text">{error}</span>}
            </div>
            <div className="login-action">
              <button type="submit" className="btnLogin">
                Xác nhận tài khoản
              </button>
            </div>
            <div className="SignUp" style={{ marginTop: "15px" }}>
              <label>
                Bạn đã có tài khoản?
                <Link to="/login" className="btn-signup">
                  Quay lại
                </Link>
              </label>
            </div>
          </form>
        </div>
      </div>

      {showOtpVerify && <OtpVerify onClose={() => setShowOtpVerify(false)} />}
    </>
  );
}
