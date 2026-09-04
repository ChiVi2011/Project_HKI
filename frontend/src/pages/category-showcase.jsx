import { Link } from "react-router-dom";
import { CATEGORIES_DATA } from "../data/products";
import bannerImg from "../assets/img/ViDairy_banner_1527x633_full.png";
import "../style/product.css";

export default function CategoryShowcase() {
  return (
    <div className="category-showcase-page">
      {/* 1. HERO BANNER */}
      <section className="cat-hero-banner">
        <img
          src={bannerImg}
          alt="Danh mục sản phẩm ViDairy"
          className="cat-banner-img"
        />
        <div className="cat-hero-overlay">
          <h1>HỆ SINH THÁI SẢN PHẨM VIDAIRY</h1>
          <p>
            Dinh dưỡng chuẩn y khoa & tinh hoa tự nhiên cho từng giai đoạn phát
            triển của mọi thành viên gia đình
          </p>
        </div>
      </section>

      {/* 2. THANH ĐIỀU HƯỚNG NHANH CÁC DANH MỤC */}
      <section className="cat-quick-nav-section">
        <div className="cat-quick-nav-container">
          {CATEGORIES_DATA.map((cat, idx) => (
            <a
              key={cat.id}
              href={`#${cat.slug}`}
              className="cat-quick-nav-card"
            >
              <div className="cat-quick-nav-icon">
                <span>0{idx + 1}</span>
              </div>
              <div className="cat-quick-nav-info">
                <h4>{cat.name}</h4>
                <p>{cat.tagline}</p>
              </div>
              <i className="bi bi-arrow-down-short"></i>
            </a>
          ))}
        </div>
      </section>

      {/* 3. CHI TIẾT TỪNG DANH MỤC SẢN PHẨM */}
      <section className="cat-showcase-list-section">
        <div className="cat-showcase-container">
          {CATEGORIES_DATA.map((cat, index) => (
            <div
              key={cat.id}
              id={cat.slug}
              className={`cat-feature-block ${
                index % 2 === 1 ? "reverse-layout" : ""
              }`}
            >
              {/* Cột hình ảnh minh họa */}
              <div className="cat-feature-img-col">
                <div className="cat-img-frame">
                  <img src={cat.image} alt={cat.name} />
                  <span className="cat-badge-top">{cat.heroBadge}</span>
                </div>
              </div>

              {/* Cột thông tin chi tiết */}
              <div className="cat-feature-content-col">
                <div className="cat-header-meta">
                  <span className="cat-target-age">
                    <i className="bi bi-people-fill"></i> {cat.targetAge}
                  </span>
                </div>

                <h2 className="cat-feature-title">{cat.name}</h2>
                <p className="cat-feature-tagline">“{cat.tagline}”</p>
                <p className="cat-feature-desc">{cat.description}</p>

                <div className="cat-benefits-box">
                  <h4>Ưu điểm dinh dưỡng nổi bật:</h4>
                  <ul>
                    {cat.keyBenefits.map((benefit, bIdx) => (
                      <li key={bIdx}>
                        <i className="bi bi-check-circle-fill"></i>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="cat-feature-actions">
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="btn-view-cat-products"
                  >
                    <span>Xem danh sách {cat.name}</span>
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CAM KẾT CHẤT LƯỢNG VIDAIRY */}
      <section className="cat-quality-pledge-section">
        <div className="quality-pledge-container">
          <div className="pledge-header">
            <h2>CAM KẾT CHẤT LƯỢNG VIDAIRY</h2>
            <p>Tiêu chuẩn sản xuất khắt khe vì sức khỏe người tiêu dùng</p>
          </div>

          <div className="pledge-grid">
            <div className="pledge-card">
              <div className="pledge-icon">
                <i className="bi bi-patch-check-fill"></i>
              </div>
              <h3>100% Nguyên Liệu Sạch</h3>
              <p>
                Nguồn sữa tươi từ trang trại sinh thái đạt chuẩn Green Farm và
                các loại hạt Organic không biến đổi gen (Non-GMO).
              </p>
            </div>

            <div className="pledge-card">
              <div className="pledge-icon">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <h3>Công Nghệ Vô Trùng Tiên Tiến</h3>
              <p>
                Dây chuyền sấy phun khép kín và đóng gói vô trùng chuẩn châu Âu,
                bảo toàn tối đa các vi chất dinh dưỡng quý giá.
              </p>
            </div>

            <div className="pledge-card">
              <div className="pledge-icon">
                <i className="bi bi-award-fill"></i>
              </div>
              <h3>Chuẩn Quốc Tế CODEX</h3>
              <p>
                Đạt chứng nhận an toàn thực phẩm FSSC 22000, ISO 9001 và chứng
                chỉ trung hòa Carbon PAS 2060.
              </p>
            </div>

            <div className="pledge-card">
              <div className="pledge-icon">
                <i className="bi bi-qr-code-scan"></i>
              </div>
              <h3>Minh Bạch Nguồn Gốc</h3>
              <p>
                Mỗi sản phẩm đều tích hợp mã QR truy xuất nguồn gốc trang trại,
                nhà máy và ngày đóng gói một cách rõ ràng.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
