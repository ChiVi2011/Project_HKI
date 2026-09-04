require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * Khởi tạo transporter kết nối dịch vụ Gmail sử dụng biến môi trường .env
 */
function createMailTransporter() {
  const user = (process.env.MAIL_USER || "").trim();
  const pass = (process.env.MAIL_PASS || "").trim();

  if (!user || !pass) {
    console.warn("⚠️ [MailService] Chưa cấu hình MAIL_USER hoặc MAIL_PASS trong file .env");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/**
 * Gửi mã xác thực OTP qua Email
 * @param {string} toEmail - Địa chỉ email người nhận
 * @param {string} otp - Mã OTP 6 chữ số
 * @param {string} userName - Tên người nhận (tùy chọn)
 */
const sendOtpEmail = async (toEmail, otp, userName = "Quý khách") => {
  const transporter = createMailTransporter();
  if (!transporter) {
    throw new Error("Dịch vụ gửi email chưa được cấu hình tài khoản (MAIL_USER / MAIL_PASS).");
  }

  const senderEmail = (process.env.MAIL_USER || "").trim();

  const mailOptions = {
    from: `"VitaDairy Official" <${senderEmail}>`,
    to: toEmail,
    subject: `[VitaDairy] ${otp} là mã xác thực tài khoản của bạn`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #edf2f7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #23408e 0%, #003DFF 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">VitaDairy</h1>
          <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Hệ Thống Dinh Dưỡng Chuẩn Vàng Vì Sức Khỏe Gia Đình</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 28px; color: #334155; line-height: 1.6;">
          <p style="font-size: 16px; margin: 0 0 16px;">Kính chào <strong>${userName}</strong>,</p>
          <p style="margin: 0 0 20px; font-size: 14.5px;">
            Cảm ơn bạn đã quan tâm và đăng ký tài khoản thành viên tại hệ thống <strong>VitaDairy Official</strong>.
            Để hoàn tất xác thực đăng ký, vui lòng sử dụng mã OTP dưới đây:
          </p>

          <!-- OTP Box -->
          <div style="text-align: center; margin: 28px 0;">
            <div style="display: inline-block; background: #f0fdf4; border: 2px dashed #8AB33F; border-radius: 12px; padding: 14px 32px;">
              <span style="font-size: 34px; font-weight: 800; color: #23408e; letter-spacing: 8px;">${otp}</span>
            </div>
            <p style="margin: 10px 0 0; font-size: 13px; color: #64748b;">Mã xác thực có hiệu lực trong vòng <strong>5 phút</strong>.</p>
          </div>

          <p style="font-size: 13.5px; color: #64748b; margin: 20px 0 0;">
            * Lưu ý bảo mật: Tuyệt đối không chia sẻ mã này cho bất kỳ ai, kể cả nhân viên hỗ trợ VitaDairy.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12.5px; color: #94a3b8; border-top: 1px solid #edf2f7;">
          <p style="margin: 0 0 4px;">Hotline CSKH: <strong>1900 633 559</strong> | Email: cskh@vitadairy.vn</p>
          <p style="margin: 0;">© 2026 VitaDairy Việt Nam. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✉️ [MailService] Đã gửi OTP thành công tới: ${toEmail} (MessageID: ${info.messageId})`);
  return info;
};

module.exports = { sendOtpEmail };
