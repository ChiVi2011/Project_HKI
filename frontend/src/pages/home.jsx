import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../assets/img/ViDairy_banner2_1527x633_full.png";
import BannerImg from "../assets/img/ViDairy_banner3_1536x816.png";
import "../style/page-home.css";
import AOS from "aos";
import "aos/dist/aos.css";
import ReviewList from "./review-list";
import CategoryList from "./category-list";
import NewList from "./new-list";

function Home() {
  const [homeData, setHomeData] = useState({
    bannerTopUrl: Banner,
    tertiaryTitle: "KIÊN ĐỊNH VỚI CẢI TIẾN",
    tertiaryDescription: "Ở Vidairy chúng tôi luôn chú trọng từng sản phẩm, Không ngừng tìm kiếm, ứng dụng công nghệ sản xuất\ntiên tiến nhất để đáp ứng những tiêu chuẩn khắt khe nhất của chính ViDairy.",
    tertiaryLinkUrl: "/products",
    bannerTertiaryUrl: BannerImg,
    reviewSectionTitle: "Nhận xét từ khách hàng"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ once: true });

    // TODO: Bỏ comment khi tích hợp API
 
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const response = await fetch("API_URL_CUA_CAU_CHU");
        const data = await response.json();
        setHomeData(prev => ({ ...prev, ...data })); 
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();

  }, []);

  if (loading) return null;

  return (
    <>
      <div className="banner-container" data-aos="fade-right">
        <i className="bi bi-chevron-compact-left"></i>
        <img src={homeData.bannerTopUrl} alt="Banner Vi Dairy - Ươm mầm sức sống" />
        <i className="bi bi-chevron-compact-right"></i>
      </div>

      <CategoryList />

      <div className="bg-surface-tertiary">
        <div className="title-tertiary">
          <h2>{homeData.tertiaryTitle}</h2>
          <p style={{ textAlign: "center", whiteSpace: "pre-line" }}>
            {homeData.tertiaryDescription}
          </p>
          <Link to={homeData.tertiaryLinkUrl}>Tìm hiểu thêm</Link>
        </div>
        <div
          className="img-tertiary"
          data-aos="zoom-in"
          data-aos-delay="20"
          data-aos-duration="500"
          data-aos-easing="ease-in-out"
          data-aos-mirror="false"
          data-aos-once="true"
        >
          <img src={homeData.bannerTertiaryUrl} alt="Công nghệ sản xuất ViDairy" />
        </div>
      </div>

      <div className="customer">
        <h2>{homeData.reviewSectionTitle}</h2>
        <ReviewList />
      </div>

      <NewList />
    </>
  );
}

export default Home;