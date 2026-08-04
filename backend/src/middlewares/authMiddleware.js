// Khai báo thư việ npm install jsonwebtoken
const jwt = require("jsonwebtoken");

//Khởi tạo authMiddleware

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Vui lòng đăng nhập để tiếp tục.",
      });
    }
    // Tách chuối thành mãng
    const token = authHeader.split(" ")[1];

    // giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Báo cho Express
    next();
    
  } catch (err) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Token không hợp lệ hoặc đã hết hạn.",
    });
  }
};
module.exports = { authMiddleware };
