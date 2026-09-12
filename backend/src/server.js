require("dotenv").config();
const app = require("./app");
const connectNoSQL = require("./config/NoSQL");
const connectDB = require("./config/database");

const PORT = parseInt(process.env.PORT, 10) || 3000;

async function startServer() {
  // 1. Kết nối MongoDB Atlas (CSDL chính)
  await connectNoSQL();

  // 2. Khởi động Express Server
  app.listen(PORT, () => {
    console.log(
      `🚀 Máy chủ ViDairy Backend đang chạy tại: http://localhost:${PORT}`,
    );
    console.log(`📡 API Endpoints sẵn sàng tại: http://localhost:${PORT}/api`);
  });

  // 3. Kết nối SQL Server phụ trợ (không chặn server)
  if (process.env.DB_SERVER) {
    connectDB().catch((err) =>
      console.warn("SQL Server connect error:", err.message),
    );
  }
}

startServer();
