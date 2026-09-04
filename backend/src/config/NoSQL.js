require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

// Cấu hình DNS resolver 8.8.8.8, 1.1.1.1 để tránh lỗi querySrv ECONNREFUSED trên Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Bỏ qua nếu môi trường không cho phép setServers
}

/**
 * Kết nối cơ sở dữ liệu MongoDB Atlas
 */
async function connectNoSQL() {
  const rawUrl = process.env.MONGO_URL || process.env.MONGO_URI;

  if (!rawUrl) {
    console.error("❌ [MongoDB] Lỗi: Chưa cấu hình biến MONGO_URL trong file .env");
    return null;
  }

  const mongoUrl = rawUrl.trim();

  if (mongoUrl.includes("<db_password>")) {
    console.warn(
      "⚠️ [MongoDB] Cảnh báo: Chuỗi kết nối MONGO_URL vẫn chứa placeholder '<db_password>'. Vui lòng cập nhật mật khẩu database thật vào file .env."
    );
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUrl, {
      dbName: "ViDairyDB",
      serverSelectionTimeoutMS: 8000,
    });

    const maskedUrl = mongoUrl.replace(/:([^:@]+)@/, ":****@");
    console.log(`✅ [MongoDB Atlas] Đã kết nối thành công tới cơ sở dữ liệu: "${conn.connection.name}"`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Cluster: ${maskedUrl}`);

    // Lắng nghe các sự kiện kết nối
    mongoose.connection.on("error", (err) => {
      console.error("❌ [MongoDB Event Error]:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ [MongoDB Event]: Mất kết nối tới MongoDB Atlas, đang thử kết nối lại...");
    });

    return conn;
  } catch (error) {
    console.error("❌ [MongoDB Atlas] Kết nối thất bại:", error.message);
    return null;
  }
}

module.exports = connectNoSQL;
