import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../assets/img/ViDairy_banner2_1527x633_full.png";
import BannerImg from "../assets/img/ViDairy_banner3_1536x816.png";
import productService from "../services/productService";
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
    tertiaryDescription:
      "Ở Vidairy chúng tôi luôn chú trọng từng sản phẩm, Không ngừng tìm kiếm, ứng dụng công nghệ sản xuất\ntiên tiến nhất để đáp ứng những tiêu chuẩn khắt khe nhất của chính ViDairy.",
    tertiaryLinkUrl: "/products",
    bannerTertiaryUrl: BannerImg,
    reviewSectionTitle: "Nhận xét từ khách hàng",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ once: true });
    productService.getSettings().then((res) => {
      if (res?.success && res.data) {
        const s = res.data;
        setHomeData((prev) => ({
          ...prev,
          bannerTopUrl: s.homeHeroBanner || prev.bannerTopUrl,
          tertiaryTitle: s.homeHeroTitle || prev.tertiaryTitle,
          tertiaryDescription: s.homeHeroSubtitle || prev.tertiaryDescription,
        }));
      }
    });
  }, []);

  if (loading) return null;

  return (
    <>
      <div className="banner-container" data-aos="fade-right">
        <i className="bi bi-chevron-compact-left"></i>
        <img
          src={homeData.bannerTopUrl}
          alt="Banner Vi Dairy - Ươm mầm sức sống"
        />
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
          <img
            src={homeData.bannerTertiaryUrl}
            alt="Công nghệ sản xuất ViDairy"
          />
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
