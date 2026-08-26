import { useState, useEffect } from "react";
import "../style/otp.css";
export default function OTP({ onClose }) {
  const [timeLeft, setTimeLeft] = useState(90);
  useEffect(() => {
    if (timeLeft < 0) return;
    const timer = setInterval(() => {
      setTimeLeft((pre) => pre - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const set = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${set.toString().padStart(2, "0")}`;
  };
  return (
    <>
      <div className="otp">
        <div
          className="iconclose"
          onClick={onClose}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-x-circle"></i>
        </div>
        <div className="titleotp">
          <h2>Xác thực tài khoản</h2>
          <p>Vui lòng nhập 5 mã số 0tp được gửi đến số điện thoại hoặc email</p>
        </div>
        <div className="otpnumber">
          <div className="number">
            <input type="number" name="" id="" />
            <input type="number" name="" id="" />
            <input type="number" name="" id="" />
            <input type="number" name="" id="" />
            <input type="number" name="" id="" />
          </div>
        </div>
        <div className="time">
          {timeLeft > 0 ? (
            <span>{formatTime(timeLeft)}</span>
          ) : (
            <button type="button" onClick={() => setTimeLeft(90)}>
              Gửi lại mã OTP
            </button>
          )}
        </div>
        <div className="btnotp">
          <button>Xác Thực</button>
        </div>
      </div>
    </>
  );
}
