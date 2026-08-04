const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chivinguyen1998@gmail.com",
    pass: "wwdt rvmd mjtx xxei", // là mật khẩu ứng dụng tạo trong cài đặt Google
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: "chivinguyen1998@gmail.com",
    to: toEmail,
    subject: "Mã xác thực OTP",
    text: "Hi @All, đây là email được gửi tự động bằng code Node.js đó!",
  });
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Lỗi:", error);
  }
  console.log("Gửi mail thành công! \nID thư:", info.response);
});

module.exports = { sendOtpEmail };
