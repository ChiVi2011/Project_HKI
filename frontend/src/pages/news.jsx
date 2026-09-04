import { useState } from "react";
import { Link } from "react-router-dom";
import CardNew from "../components/card-new";
import BannerImg from "../assets/img/ViDairy_banner_1527x633_full.png";
import "../style/news.css";

const CATEGORIES = [
  "Tất cả",
  "Dinh dưỡng bé yêu",
  "Sức khỏe mẹ bầu",
  "Người lớn & Người cao tuổi",
  "Sống khỏe & Sữa hạt",
  "Sự kiện & Khuyến mãi",
];

const FEATURED_ARTICLE = {
  id: 100,
  title:
    "ViDairy tiên phong đạt chứng nhận Trung hòa Carbon: Bước tiến xanh vì sức khỏe triệu gia đình Việt",
  category: "Sự kiện & Khuyến mãi",
  date: "28/08/2026",
  readTime: "5 phút đọc",
  summary:
    "ViDairy tự hào trở thành doanh nghiệp sữa đầu tiên tại Việt Nam đạt chứng chỉ trung hòa Carbon PAS 2060 cho cả nhà máy và trang trại sinh thái, khẳng định cam kết phát triển bền vững và chất lượng quốc tế.",
  image: BannerImg,
  link: "/news/100",
};

const NEWS_DATA = [
  {
    id: 1,
    title:
      "Bí quyết bổ sung DHA và HMO giúp trẻ phát triển trí não vượt trội trong 1000 ngày đầu đời",
    category: "Dinh dưỡng bé yêu",
    date: "27/08/2026",
    readTime: "3 phút đọc",
    summary:
      "Khám phá các dưỡng chất vàng như DHA tinh khiết, HMO và Canxi sinh học đóng vai trò nền tảng cho sự phát triển thông minh và đề kháng khỏe mạnh của trẻ.",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    link: "/news/1",
  },
  {
    id: 2,
    title:
      "Thực đơn dinh dưỡng khoa học cho mẹ bầu 3 tháng đầu thai kỳ: Giảm ốm nghén, con đủ chất",
    category: "Sức khỏe mẹ bầu",
    date: "26/08/2026",
    readTime: "4 phút đọc",
    summary:
      "Chuyên gia ViDairy chia sẻ các nguyên tắc bổ sung Acid Folic, Sắt và Vitamin nhóm B giúp mẹ vượt qua cơn nghén nhẹ nhàng và bảo vệ thai nhi tối đa.",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    link: "/news/2",
  },
  {
    id: 3,
    title:
      "Giải pháp bảo vệ hệ vận động và ngăn ngừa loãng xương cho người lớn tuổi với Canxi Nano",
    category: "Người lớn & Người cao tuổi",
    date: "25/08/2026",
    readTime: "5 phút đọc",
    summary:
      "Bổ sung Canxi kết hợp Vitamin D3 & MK7 theo tỉ lệ vàng giúp xương chắc khỏe, khớp dẻo dai và nâng cao chất lượng cuộc sống cho người cao tuổi.",
    image:
      "https://images.unsplash.com/photo-1528750997573-59b89d66f4f7?w=600&auto=format&fit=crop&q=80",
    link: "/news/3",
  },
  {
    id: 4,
    title:
      "Xu hướng sống xanh: Vì sao sữa hạt thuần thực vật ViDairy Plant-Based được ưa chuộng?",
    category: "Sống khỏe & Sữa hạt",
    date: "24/08/2026",
    readTime: "3 phút đọc",
    summary:
      "Sự kết hợp hoàn hảo giữa hạt óc chó, hạnh nhân và yến mạch mang lại nguồn dinh dưỡng thanh nhẹ, giàu chất chống oxy hóa cho mọi thành viên gia đình.",
    image:
      "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=600&auto=format&fit=crop&q=80",
    link: "/news/4",
  },
  {
    id: 5,
    title:
      "Hành trình 1 triệu ly sữa: ViDairy chung tay mang dinh dưỡng đến trẻ em vùng cao",
    category: "Sự kiện & Khuyến mãi",
    date: "22/08/2026",
    readTime: "4 phút đọc",
    summary:
      "Chương trình thường niên của Quỹ sữa ViDairy tiếp tục lan tỏa niềm yêu thương, mang đến những hộp sữa thơm ngon cho hơn 50.000 học sinh khó khăn.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80",
    link: "/news/5",
  },
  {
    id: 6,
    title:
      "Cách nhận biết và chăm sóc dinh dưỡng đúng cách cho trẻ bị dị ứng đạm sữa bò",
    category: "Dinh dưỡng bé yêu",
    date: "20/08/2026",
    readTime: "4 phút đọc",
    summary:
      "Bác sĩ chuyên khoa giải đáp dấu hiệu dị ứng thức ăn và hướng dẫn mẹ chọn dòng sữa thủy phân hoặc sữa đậu nành an toàn cho hệ tiêu hóa của bé.",
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80",
    link: "/news/6",
  },
];

const TOP_READS = [
  {
    id: 1,
    rank: "01",
    title: "10 Loại thực phẩm giàu Canxi tự nhiên tốt nhất cho cả nhà",
    date: "26/08/2026",
    link: "/news/1",
  },
  {
    id: 2,
    rank: "02",
    title: "Bí quyết chọn sữa công thức theo từng giai đoạn phát triển của trẻ",
    date: "25/08/2026",
    link: "/news/2",
  },
  {
    id: 3,
    rank: "03",
    title: "Chế độ ăn cho người có chỉ số đường huyết cao cần lưu ý gì?",
    date: "23/08/2026",
    link: "/news/3",
  },
  {
    id: 4,
    rank: "04",
    title:
      "ViDairy nhận giải thưởng Thương hiệu Dinh dưỡng Uy tín Quốc gia 2026",
    date: "21/08/2026",
    link: "/news/4",
  },
];

const POPULAR_TAGS = [
  "Dinh dưỡng chuẩn",
  "Phát triển trí não",
  "Sức khỏe xương khớp",
  "Mẹ bầu khỏe mạnh",
  "Sữa hạt Organic",
  "Trung hòa Carbon",
  "ViDairy Care",
];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  // Lọc bài viết theo danh mục và từ khóa tìm kiếm
  const filteredArticles = NEWS_DATA.filter((item) => {
    const matchCategory =
      selectedCategory === "Tất cả" || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subscribedEmail.trim()) {
      setSubscribeSuccess(true);
      setSubscribedEmail("");
      setTimeout(() => setSubscribeSuccess(false), 4000);
    }
  };

  return (
    <div className="news-page">
      {/* 1. HERO BANNER TIÊU ĐIỂM */}
      <section className="news-featured-hero">
        <div className="featured-hero-card">
          <div className="featured-hero-img-wrap">
            <img
              src={FEATURED_ARTICLE.image}
              alt={FEATURED_ARTICLE.title}
              className="featured-hero-img"
            />
            <span className="featured-badge">TIN TIÊU ĐIỂM</span>
          </div>

          <div className="featured-hero-content">
            <div className="featured-meta">
              <span className="meta-badge">{FEATURED_ARTICLE.category}</span>
              <span className="meta-item">
                <i className="bi bi-calendar3"></i> {FEATURED_ARTICLE.date}
              </span>
              <span className="meta-item">
                <i className="bi bi-clock"></i> {FEATURED_ARTICLE.readTime}
              </span>
            </div>

            <Link to={FEATURED_ARTICLE.link} className="featured-title-link">
              <h1 className="featured-title">{FEATURED_ARTICLE.title}</h1>
            </Link>

            <p className="featured-summary">{FEATURED_ARTICLE.summary}</p>

            <div className="featured-action">
              <Link to={FEATURED_ARTICLE.link} className="btn-read-featured">
                <span>Đọc bài viết ngay</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THANH TÌM KIẾM & TABS LỌC DANH MỤC */}
      <section className="news-controls-section">
        <div className="news-controls-wrapper">
          {/* Tabs danh mục */}
          <div className="news-tabs-nav">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`news-nav-btn ${
                  selectedCategory === cat ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm tin tức */}
          <div className="news-search-box">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, kiến thức..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm bài viết"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                title="Xóa tìm kiếm"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. NỘI DUNG CHÍNH: LƯỚI BÀI VIẾT & THANH BÊN SIDEBAR */}
      <section className="news-main-section">
        <div className="news-layout-grid">
          {/* CỘT TRÁI: DANH SÁCH BÀI VIẾT (70%) */}
          <div className="news-articles-col">
            <div className="articles-section-header">
              <h2>
                {selectedCategory === "Tất cả"
                  ? "Tất cả bài viết mới nhất"
                  : selectedCategory}
              </h2>
              <span className="articles-count">
                ({filteredArticles.length} bài viết)
              </span>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="articles-grid">
                {filteredArticles.map((article) => (
                  <CardNew key={article.id} news={article} />
                ))}
              </div>
            ) : (
              <div className="no-articles-found">
                <i className="bi bi-journal-x"></i>
                <h3>Không tìm thấy bài viết phù hợp</h3>
                <p>
                  Vui lòng thử tìm với từ khóa khác hoặc chọn danh mục khác nhé!
                </p>
                <button
                  type="button"
                  className="btn-reset-filter"
                  onClick={() => {
                    setSelectedCategory("Tất cả");
                    setSearchQuery("");
                  }}
                >
                  Xem tất cả bài viết
                </button>
              </div>
            )}

            {/* Phân trang */}
            {filteredArticles.length > 0 && (
              <div className="news-pagination">
                <button
                  type="button"
                  className="page-btn active"
                  aria-label="Trang 1"
                >
                  1
                </button>
                <button type="button" className="page-btn" aria-label="Trang 2">
                  2
                </button>
                <button type="button" className="page-btn" aria-label="Trang 3">
                  3
                </button>
                <button
                  type="button"
                  className="page-btn next-btn"
                  aria-label="Trang sau"
                >
                  <span>Sau</span>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: SIDEBAR (30%) */}
          <aside className="news-sidebar-col">
            {/* Widget 1: Đọc nhiều nhất */}
            <div className="sidebar-widget top-reads-widget">
              <h3 className="widget-title">
                <i className="bi bi-fire"></i>
                <span>Bài viết đọc nhiều nhất</span>
              </h3>
              <div className="top-reads-list">
                {TOP_READS.map((item) => (
                  <Link key={item.id} to={item.link} className="top-read-item">
                    <span className="top-read-rank">{item.rank}</span>
                    <div className="top-read-info">
                      <h4 className="top-read-title">{item.title}</h4>
                      <span className="top-read-date">
                        <i className="bi bi-calendar3"></i> {item.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget 2: Đăng ký nhận tin dinh dưỡng */}
            <div className="sidebar-widget newsletter-widget">
              <div className="newsletter-icon">
                <i className="bi bi-envelope-heart"></i>
              </div>
              <h3 className="newsletter-title">Bản tin Dinh dưỡng ViDairy</h3>
              <p className="newsletter-desc">
                Nhận cẩm nang sức khỏe và ưu đãi độc quyền từ chuyên gia gửi vào
                hòm thư mỗi tuần.
              </p>

              {subscribeSuccess ? (
                <div className="subscribe-success-alert">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Cảm ơn bạn đã đăng ký nhận tin!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn..."
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    required
                    aria-label="Email nhận tin"
                  />
                  <button type="submit" className="btn-subscribe">
                    Đăng ký ngay
                  </button>
                </form>
              )}
            </div>

            {/* Widget 3: Chủ đề nổi bật (Tags) */}
            <div className="sidebar-widget tags-widget">
              <h3 className="widget-title">
                <i className="bi bi-tags"></i>
                <span>Chủ đề được quan tâm</span>
              </h3>
              <div className="tags-cloud">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="tag-pill"
                    onClick={() => setSearchQuery(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Widget 4: Hotline tư vấn dinh dưỡng */}
            <div className="sidebar-widget hotline-widget">
              <h4>Tư vấn dinh dưỡng miễn phí</h4>
              <p>
                Đội ngũ bác sĩ và chuyên gia dinh dưỡng luôn sẵn sàng hỗ trợ
              </p>
              <a href="tel:0989584592" className="btn-call-hotline">
                <i className="bi bi-telephone-fill"></i>
                <span>0989 584 592</span>
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
