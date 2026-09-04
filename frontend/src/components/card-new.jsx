import { Link } from "react-router-dom";
import "../style/card.css";

export default function CardNew({
  news,
  id = news?.id || 1,
  title = news?.title ||
    "Bí quyết bổ sung dưỡng chất giúp trẻ phát triển trí não toàn diện",
  image = news?.image ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
  category = news?.category || "Dinh dưỡng",
  date = news?.date || "26 Tháng 8, 2026",
  readTime = news?.readTime || "3 phút đọc",
  summary = news?.summary ||
    "Khám phá các dưỡng chất vàng như DHA, HMO và Canxi đóng vai trò quan trọng trong những năm đầu đời của trẻ nhỏ.",
  link = news?.link || `/news/${id}`,
}) {
  return (
    <article className="news-card">
      <Link to={link} className="news-img-wrapper">
        <img src={image} alt={title} className="news-img" />
        {category && <span className="news-category-badge">{category}</span>}
      </Link>

      <div className="news-content">
        <div className="news-meta">
          <span className="news-meta-item">
            <i className="bi bi-calendar3"></i>
            <span>{date}</span>
          </span>
          <span className="news-meta-item">
            <i className="bi bi-clock"></i>
            <span>{readTime}</span>
          </span>
        </div>

        <Link to={link} className="news-title-link">
          <h3 className="news-title">{title}</h3>
        </Link>

        <p className="news-summary">{summary}</p>

        <div className="news-footer">
          <Link to={link} className="news-read-more">
            <span>Đọc tiếp</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </article>
  );
}
