import { useState } from "react";
import { Link } from "react-router-dom";
import CardNew from "../components/card-new";
import "../style/card.css";

const CATEGORY_TABS = [
  "Tất cả",
  "Dinh dưỡng trẻ nhỏ",
  "Kiến thức mẹ bầu",
  "Sức khỏe người lớn",
  "Sự kiện ViDairy",
];

const DEFAULT_NEWS = [
  {
    id: 1,
    title: "Bí quyết bổ sung dưỡng chất giúp trẻ phát triển trí não toàn diện",
    category: "Dinh dưỡng trẻ nhỏ",
    date: "26/08/2026",
    readTime: "3 phút đọc",
    summary:
      "Khám phá các dưỡng chất vàng như DHA, HMO và Canxi đóng vai trò quan trọng trong những năm tháng đầu đời của bé.",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    link: "/news/1",
  },
  {
    id: 2,
    title: "Chế độ dinh dưỡng chuẩn khoa học cho mẹ bầu 3 tháng đầu thai kỳ",
    category: "Kiến thức mẹ bầu",
    date: "25/08/2026",
    readTime: "4 phút đọc",
    summary:
      "Lời khuyên từ các chuyên gia dinh dưỡng ViDairy giúp mẹ giảm ốm nghén và hấp thu vi chất tối đa cho thai nhi.",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    link: "/news/2",
  },
  {
    id: 3,
    title:
      "Bảo vệ sức khỏe xương khớp cho người lớn tuổi với sữa giàu Canxi & Vitamin D3",
    category: "Sức khỏe người lớn",
    date: "24/08/2026",
    readTime: "5 phút đọc",
    summary:
      "Giải pháp chăm sóc hệ vận động dẻo dai và phòng ngừa loãng xương hiệu quả ở người trung niên và cao tuổi.",
    image:
      "https://images.unsplash.com/photo-1528750997573-59b89d66f4f7?w=600&auto=format&fit=crop&q=80",
    link: "/news/3",
  },
  {
    id: 4,
    title:
      "Xu hướng sử dụng sữa hạt dinh dưỡng thuần thực vật trong gia đình hiện đại",
    category: "Sự kiện ViDairy",
    date: "22/08/2026",
    readTime: "3 phút đọc",
    summary:
      "Vì sao sữa hạt ViDairy trở thành lựa chọn yêu thích của hàng triệu người tiêu dùng theo đuổi lối sống xanh lành mạnh.",
    image:
      "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=600&auto=format&fit=crop&q=80",
    link: "/news/4",
  },
];

export default function NewList({ newsList = DEFAULT_NEWS }) {
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const filteredNews =
    activeCategory === "Tất cả"
      ? newsList
      : newsList.filter((item) => item.category === activeCategory);

  return (
    <section className="news-section">
      <div className="news-header">
        <h2>TIN TỨC & BÀI VIẾT MỚI</h2>
        <p>
          Cập nhật kiến thức dinh dưỡng chuẩn khoa học và thông tin mới nhất từ
          ViDairy
        </p>
      </div>

      {/* Tabs lọc theo danh mục tin tức */}
      <div className="news-category-tabs">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`news-tab-btn ${activeCategory === tab ? "active" : ""}`}
            onClick={() => setActiveCategory(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Lưới hiển thị các thẻ tin tức */}
      <div className="news-grid">
        {filteredNews.map((item) => (
          <CardNew key={item.id} news={item} />
        ))}
      </div>

      {/* Nút xem tất cả bài viết */}
      <div className="news-view-all">
        <Link to="/news" className="btn-news-all">
          <span>Xem tất cả bài viết</span>
          <i className="bi bi-chevron-right"></i>
        </Link>
      </div>
    </section>
  );
}
