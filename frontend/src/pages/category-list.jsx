import CategoryCard from "../components/category-card";
import "../style/card.css";

// Import hình ảnh danh mục thực tế trong assets
import treEmImg from "../assets/img/cau_be_vidaiary.png";
import meBauImg from "../assets/img/me-bau_vidaiary.png";
import nguoiLonImg from "../assets/img/ong_ba_vidairy.png";
import suaHatImg from "../assets/img/sua_hat_vidairy.png";

const DEFAULT_CATEGORIES = [
  {
    id: "sua-tre-em",
    name: "Sữa Trẻ Em",
    image: treEmImg,
    link: "/products?category=sua-tre-em",
  },
  {
    id: "sua-me-bau",
    name: "Sữa Mẹ Bầu",
    image: meBauImg,
    link: "/products?category=sua-me-bau",
  },
  {
    id: "sua-nguoi-lon",
    name: "Sữa Người Lớn",
    image: nguoiLonImg,
    link: "/products?category=sua-nguoi-lon",
  },
  {
    id: "sua-hat",
    name: "Sữa Hạt",
    image: suaHatImg,
    link: "/products?category=sua-hat",
  },
];

export default function CategoryList({ categories = DEFAULT_CATEGORIES }) {
  return (
    <section className="category-section">
      <div className="category-header">
        <h2>DANH MỤC SẢN PHẨM</h2>
        <p>Khám phá các dòng sản phẩm dinh dưỡng chất lượng cao từ ViDairy</p>
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            title={cat.name}
            image={cat.image}
            link={cat.link}
          />
        ))}
      </div>
    </section>
  );
}
