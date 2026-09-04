import { Link } from "react-router-dom";
import "../style/card.css";
import defaultImage from "../assets/img/cau_be_vidaiary.png";
export default function CategoryCard({
  category,
  title = category?.name || category?.title || "trẻ Em",
  image = category?.image || defaultImage,
  link = category?.link || "/products",
}) {
  return (
    <div className="category-card">
      <div className="category-img-box">
        <img src={image} alt={title} className="category-img" />
      </div>

      <div className="category-content">
        <h3 className="category-title">{title}</h3>

        <Link to={link} className="category-link">
          <span>Xem thêm</span>
          <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}
