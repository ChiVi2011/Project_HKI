import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/otp.css";

export default function OTP({ email, registerData, onClose, onSuccess }) {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Đếm ngược 90 giây
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Focus ô đầu tiên khi mở modal
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Xử lý nhập từng ô OTP và tự động chuyển ô
  const handleInputChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
    if (errorMessage) setErrorMessage("");

    // Nếu nhập số, tự động chuyển sang ô kế tiếp
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Xử lý phím Backspace để lùi ô
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Xử lý dán toàn bộ mã (Paste)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpValues(digits);
      if (inputRefs.current[5]) inputRefs.current[5].focus();
    }
  };

  // 1. Gửi lại mã OTP qua email
  const handleResendOtp = async () => {
    if (timeLeft > 0 || isLoading) return;
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register-send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName: registerData?.name || "Khách hàng",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gửi lại OTP thất bại.");
      }

      setSuccessMessage("Mã OTP mới đã được gửi đến email của bạn!");
      setTimeLeft(90);
      setOtpValues(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Xác thực OTP và hoàn tất đăng ký
  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otpValues.join("");

    if (fullOtp.length !== 6) {
      setErrorMessage("Vui lòng nhập đủ 6 chữ số mã xác thực OTP!");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register-verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: fullOtp,
          fullName: registerData?.name,
          phone: registerData?.phone,
          password: registerData?.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Xác thực OTP thất bại!");
      }

      // Lưu trạng thái đăng nhập
      if (data.token && data.user) {
        login(data.token, data.user);
      }

      setSuccessMessage("Xác thực thành công! Đang chuyển hướng...");

      setTimeout(() => {
        if (typeof onSuccess === "function") {
          onSuccess(data.user);
        } else {
          if (onClose) onClose();
          navigate("/profile");
        }
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-overplay" role="dialog" aria-modal="true">
      <div className="otp">
        <div
          className="iconclose"
          onClick={onClose}
          style={{ cursor: "pointer" }}
          title="Đóng"
          role="button"
          tabIndex={0}
        >
          <i className="bi bi-x-circle"></i>
        </div>

        <div className="titleotp">
          <h2>Xác thực tài khoản</h2>
          <p>
            Vui lòng nhập <strong>6 chữ số mã OTP</strong> đã được gửi tới địa chỉ email:{" "}
            <strong style={{ color: "#23408e" }}>{email}</strong>
          </p>
        </div>

        {errorMessage && <div className="otp-alert error">{errorMessage}</div>}
        {successMessage && <div className="otp-alert success">{successMessage}</div>}

        <div className="otpnumber">
          <div className="number" onPaste={handlePaste}>
            {otpValues.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={val}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isLoading}
                aria-label={`Mã số thứ ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="time">
          {timeLeft > 0 ? (
            <span>
              Mã hết hạn sau: <strong>{formatTime(timeLeft)}</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              style={{ cursor: "pointer", background: "none", border: "none", color: "#23408e", fontWeight: 700 }}
            >
              {isLoading ? "Đang gửi..." : "Gửi lại mã OTP"}
            </button>
          )}
        </div>

        <div className="btnotp">
          <button type="button" onClick={handleVerify} disabled={isLoading}>
            {isLoading ? "Đang xác thực..." : "Xác Thực Ngay"}
          </button>
        </div>
      </div>
    </div>
  );
}
