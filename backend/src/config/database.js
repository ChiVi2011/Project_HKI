/*Kết nối SQL Server, cấu hình*/

const sql = require("mssql"); //Import Mssql

//import dotenv
const config = {
  server: process.env.DB_SERVER,
  port: 1433,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  //Check connect
  options: {
    encrypt: true, //Không mã hóa (SSL/TLS) kết nối giữa Node.js và SQL Server.
    trustServerCertificate: false, //Tin tưởng chứng chỉ (certificate) của SQL Server mà không kiểm tra tính hợp lệ.
  },
};

sql
  .connect(config)
  .then(() => {
    console.log("Connected!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
  
/* Kết nối với database*/
const connectDB = async () => {
  try {
    const pool = await sql.connect(config); // Lấy dữ liệu từ biến config
    console.log("✅ Connected to SQL Server");
    return pool;
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
