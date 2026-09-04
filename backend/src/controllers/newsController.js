const News = require("../models/newsModel");

const newsController = {
  // Lấy toàn bộ bài viết tin tức
  async getNews(req, res) {
    try {
      const { category, limit } = req.query;
      const query = {};
      if (category && category !== "all") {
        query.category = category;
      }

      let newsQuery = News.find(query).sort({ createdAt: -1 });
      if (limit) {
        newsQuery = newsQuery.limit(parseInt(limit, 10));
      }

      const newsList = await newsQuery.lean();
      return res.status(200).json({
        success: true,
        count: newsList.length,
        data: newsList,
      });
    } catch (err) {
      console.error("Lỗi getNews:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy tin tức.",
        error: err.message,
      });
    }
  },

  // Lấy chi tiết bài viết
  async getNewsById(req, res) {
    try {
      const { id } = req.params;
      const article = await News.findById(id).lean();
      if (!article) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bài viết yêu cầu.",
        });
      }
      return res.status(200).json({
        success: true,
        data: article,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xem bài viết.",
        error: err.message,
      });
    }
  },
};

module.exports = newsController;
