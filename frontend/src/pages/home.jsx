// import Header from "../components/header";
import { Link } from "react-router-dom";
import Banner from "../assets/img/ViDairy_banner2_1527x633_full.png";
import BannerImg from "../assets/img/ViDairy_banner3_1536x816.png";
import "../style/page-home.css";
function Home() {
  return (
    <>
      {/* <Header /> */}
      <div className="banner-container">
        <i className="bi bi-chevron-compact-left"></i>
        <img src={Banner} alt="Banner Vi Dairy - Ươm mầm sức sống" />
        <i className="bi bi-chevron-compact-right"></i>
      </div>
      <div className="product-category"></div>
      <div className="bg-surface-tertiary">
        <div className="title-tertiary">
          <h2>ĐẶT TÂM VÀO CẢI TIẾN</h2>
          <p style={{ textAlign: "center" }}>
            Ở Vidairy chúng tôi luôn chú trọng từng sản phẩm, Không ngừng tìm
            kiếm, ứng dụng công nghệ sản xuất <br />
            tiên tiến nhất để đáp ứng những tiêu chuẩn khắt khe nhất của chính
            ViDairy.
          </p>
          <Link to="">Tìm hiểu thêm</Link>
        </div>
        <div className="img-tertiary">
          <img src={BannerImg} alt="" />
        </div>
      </div>
      <div className="customer">
        <h2>Nhận xét từ khách hàng</h2>
      </div>
    </>
  );
}
export default Home;
