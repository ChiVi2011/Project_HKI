const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trang thông báo trạng thái máy chủ
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Hệ thống Backend API ViDairy đang hoạt động!",
    database: "MongoDB Atlas (ViDairyDB)",
    endpoints: {
      products: "/api/products",
      categories: "/api/categories",
      promotions: "/api/promotions",
      orders: "/api/orders",
      news: "/api/news",
    },
  });
});

// Gắn toàn bộ API Routes vào tiền tố /api
app.use("/api", apiRoutes);

module.exports = app;
