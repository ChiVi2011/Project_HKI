require("dotenv").config();
const app = require("./app");
const connectNoSQL = require("./config/NoSQL");
const connectDB = require("./config/database");

const PORT = parseInt(process.env.PORT, 10) || 3000;

async function startServer() {
  // 1. Kết nối MongoDB Atlas (CSDL chính)
  await connectNoSQL();

  // 2. Kết nối SQL Server (nếu có cấu hình trong .env)
  if (process.env.DB_SERVER) {
    await connectDB();
  }

  // 3. Khởi động Express Server
  app.listen(PORT, () => {
    console.log(`🚀 Máy chủ ViDairy Backend đang chạy tại: http://localhost:${PORT}`);
    console.log(`📡 API Endpoints sẵn sàng tại: http://localhost:${PORT}/api`);
  });
}

startServer();
