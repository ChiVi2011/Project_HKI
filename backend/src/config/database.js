/* Kết nối SQL Server (nếu được cấu hình trong .env) */
const sql = require("mssql");

const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  database: process.env.DB_DATABASE || "ViDairyDB",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const connectDB = async () => {
  if (!process.env.DB_SERVER) {
    // Không cấu hình SQL Server, bỏ qua để hệ thống dùng MongoDB
    return null;
  }

  try {
    const pool = await sql.connect(config);
    console.log("✅ Connected to SQL Server");
    return pool;
  } catch (error) {
    console.warn("⚠️ SQL Server connection skipped/failed:", error.message);
    return null;
  }
};

module.exports = connectDB;
