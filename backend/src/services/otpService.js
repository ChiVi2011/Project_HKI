/**
 * Sinh mã OTP ngẫu nhiên gồm 6 chữ số
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { generateOtp };
