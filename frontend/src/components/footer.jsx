import { Link } from "react-router-dom";
import logoImg from "../assets/img/logo.png";
import "../style/footer.css";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-top-accent"></div>

      <div className="footer-container">
        {/* Cột 1: Thông tin thương hiệu & Logo */}
        <div className="footer-col-company">
          <div className="footer-logo">
            <img src={logoImg} alt="ViDairy Logo" />
          </div>
          <h3 className="footer-company-name">CÔNG TY CỔ PHẦN SỮA VIDAIRY</h3>
          <p className="footer-company-desc">
            Tiên phong mang đến nguồn dinh dưỡng thuần khiết, chuẩn quốc tế cho
            sức khỏe và sự phát triển toàn diện của hàng triệu gia đình Việt
            Nam.
          </p>

          <div className="footer-social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
              title="Facebook"
            >
              <i className="bi bi-facebook"></i>
            </a>
            <a
              href="https://google.com"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
              title="Google"
            >
              <i className="bi bi-google"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
              title="YouTube"
            >
              <i className="bi bi-youtube"></i>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
              title="TikTok"
            >
              <i className="bi bi-tiktok"></i>
            </a>
          </div>
        </div>

        {/* Cột 2: Danh mục sản phẩm */}
        <div className="footer-col">
          <h4 className="footer-col-title">SẢN PHẨM</h4>
          <ul className="footer-links">
            <li>
              <Link to="/products?category=sua-tre-em">Sữa Bột Trẻ Em</Link>
            </li>
            <li>
              <Link to="/products?category=sua-me-bau">Sữa Cho Mẹ Bầu</Link>
            </li>
            <li>
              <Link to="/products?category=sua-nguoi-lon">Sữa Người Lớn</Link>
            </li>
            <li>
              <Link to="/products?category=sua-hat">Sữa Hạt Tự Nhiên</Link>
            </li>
            <li>
              <Link to="/products?category=sua-tuoi">Sữa Tươi Thanh Trùng</Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên kết nhanh */}
        <div className="footer-col">
          <h4 className="footer-col-title">VỀ VIDAIRY</h4>
          <ul className="footer-links">
            <li>
              <Link to="/home">Trang Chủ</Link>
            </li>
            <li>
              <Link to="/products">Cửa Hàng</Link>
            </li>
            <li>
              <Link to="/news">Tin Tức & Dinh Dưỡng</Link>
            </li>
            <li>
              <Link to="/home">Câu Chuyện Thương Hiệu</Link>
            </li>
            <li>
              <Link to="/home">Chính Sách Bảo Mật</Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Thông tin liên hệ & Hỗ trợ */}
        <div className="footer-col">
          <h4 className="footer-col-title">LIÊN HỆ</h4>
          <ul className="footer-contact-list">
            <li className="footer-contact-item">
              <i className="bi bi-telephone-fill"></i>
              <span>Hotline:</span>
              <a href="tel:0989584592">
                <strong>0989584592</strong>
              </a>
            </li>

            <li className="footer-contact-item">
              <i className="bi bi-envelope-fill"></i>
              <span>Email:</span>
              <a href="mailto:chivinguyen1998@gmail.com">
                <strong>chivinguyen1998@gmail.com</strong>
              </a>
            </li>

            <li className="footer-contact-item">
              <i className="bi bi-geo-alt-fill"></i>
              <span>Địa chỉ:</span>
              <span>TP. Hồ Chí Minh, Việt Nam</span>
            </li>

            <li className="footer-contact-item">
              <i className="bi bi-clock-fill"></i>
              <span>Giờ làm việc:</span>
              <span>08:00 - 17:30 (Thứ 2 - Thứ 7)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Dòng bản quyền cuối trang */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2026 ViDairy. Bản quyền thuộc về Công ty Cổ phần ViOne.</p>
          <p>Thiết kế vì sức khỏe & tầm vóc Việt Nam.</p>
        </div>
      </div>
    </footer>
  );
}
