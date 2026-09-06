import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import bannerMotherBaby from "../assets/img/mother_baby_banner.jpg";
import Footer from "../components/footer";
import productService, {
  mockCategories,
  mockProducts,
  mockPromotions,
} from "../services/productService";
import "../style/product.css";

// =========================================================================
// CUSTOM HOOK: QUẢN LÝ CUỘN CAROUSEL & TRẠNG THÁI NÚT ĐIỀU HƯỚNG
// =========================================================================
function useSliderScroll(sliderRef, deps = []) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  }, [sliderRef]);

  useEffect(() => {
    checkScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkScroll, ...deps]);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const card = sliderRef.current.querySelector(
        ".product-card, .promo-card, .product-skeleton-card"
      );
      const cardWidth = card ? card.offsetWidth + 24 : 418;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 350);
    }
  };

  return { canScrollLeft, canScrollRight, checkScroll, handleScroll };
}

// =========================================================================
// COMPONENT SKELETON LOADER DÙNG CHUNG
// =========================================================================
function SkeletonCard() {
  return (
    <div className="product-skeleton-card">
      <div className="skeleton-shimmer skeleton-img"></div>
      <div className="skeleton-shimmer skeleton-title"></div>
      <div className="skeleton-shimmer skeleton-line"></div>
      <div className="skeleton-shimmer skeleton-line short"></div>
      <div className="skeleton-shimmer skeleton-btn"></div>
    </div>
  );
}

// =========================================================================
// COMPONENT THANH TRƯỢT HÀNG NGANG SẢN PHẨM CHUẨN VITADAIRY
// =========================================================================
function CategoryRowSlider({
  section,
  products,
  formatPrice,
  isLoading,
  onSelectCategory,
}) {
  const sliderRef = useRef(null);
  const { canScrollLeft, canScrollRight, checkScroll, handleScroll } =
    useSliderScroll(sliderRef, [products, isLoading]);

  return (
    <section id={section.id} className="category-product-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className={`section-icon-badge section-badge-${section.id}`}>
            <i className={`bi ${section.icon || "bi-grid-fill"}`}></i>
          </span>
          <div>
            <h2 className="section-title">{section.title || section.name}</h2>
            <p className="section-subtitle">{section.subTitle}</p>
          </div>
        </div>
      </div>

      <div className="slider-carousel-container">
        <button
          type="button"
          className={`slider-side-arrow arrow-prev ${!canScrollLeft ? "disabled" : ""}`}
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          title="Lướt sang trái"
          aria-label="Previous products"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className="slider-viewport" ref={sliderRef} onScroll={checkScroll}>
          <div className="slider-track">
            {isLoading ? (
              [1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  {product.isHot && <span className="badge-hot">Nổi bật</span>}
                  <span className="product-category-tag">{section.name}</span>

                  <div className="product-image-wrap">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="product-slogan-bar">
                    <span>{product.slogan}</span>
                  </div>

                  <div className="product-card-body">
                    <h3 className="product-name" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="product-description">{product.description}</p>

                    <div className="product-meta">
                      <p>
                        <strong>Đối tượng:</strong> {product.targetUser}
                      </p>
                      <p>
                        <strong>Quy cách:</strong> {product.packaging}
                      </p>
                    </div>

                    <div className="product-price-box">
                      <span className="price-label">Giá tham khảo:</span>
                      <span className="price-value">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <div className="product-card-actions">
                      <Link
                        to={`/product/${product.id}`}
                        className="btn-view-detail-only"
                      >
                        <span>Xem chi tiết</span>
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "30px 20px", color: "#64748b" }}>
                Chưa có sản phẩm nào trong danh mục này.
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className={`slider-side-arrow arrow-next ${!canScrollRight ? "disabled" : ""}`}
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          title="Lướt sang phải"
          aria-label="Next products"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <div className="view-more-container">
        <button
          type="button"
          className="btn-view-more"
          onClick={() => onSelectCategory(section.id)}
        >
          <span>Xem thêm {section.name}</span>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}

// =========================================================================
// COMPONENT THANH TRƯỢT THÔNG TIN KHUYẾN MÃI
// =========================================================================
function PromotionRowSlider({ promotions, isLoading }) {
  const sliderRef = useRef(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const { canScrollLeft, canScrollRight, checkScroll, handleScroll } =
    useSliderScroll(sliderRef, [promotions, isLoading]);

  return (
    <section
      id="thong-tin-khuyen-mai"
      className="category-product-section promotion-section"
    >
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-icon-badge promo-icon-badge section-badge-thong-tin-khuyen-mai">
            <i className="bi bi-gift-fill"></i>
          </span>
          <div>
            <h2 className="section-title">Thông tin khuyến mãi</h2>
            <p className="section-subtitle">
              Cập nhật các chương trình ưu đãi độc quyền, quà tặng hấp dẫn và chính sách trợ giá mới nhất
            </p>
          </div>
        </div>
      </div>

      <div className="slider-carousel-container">
        <button
          type="button"
          className={`slider-side-arrow arrow-prev ${!canScrollLeft ? "disabled" : ""}`}
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          title="Lướt sang trái"
          aria-label="Previous promotion"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className="slider-viewport" ref={sliderRef} onScroll={checkScroll}>
          <div className="slider-track">
            {isLoading ? (
              [1, 2, 3].map((n) => <SkeletonCard key={n} />)
            ) : promotions && promotions.length > 0 ? (
              promotions.map((promo) => (
                <div key={promo.id} className="promo-card">
                  <div className="promo-image-wrap">
                    <img
                      src={promo.imageUrl}
                      alt={promo.title}
                      loading="lazy"
                    />
                    <span
                      className="promo-tag-badge"
                      style={{ backgroundColor: promo.badgeColor || "#e11d48" }}
                    >
                      {promo.tag}
                    </span>
                  </div>

                  <div className="promo-card-body">
                    <div className="promo-date-meta">
                      <i className="bi bi-calendar-event"></i>
                      <span>{promo.date}</span>
                    </div>

                    <h3 className="promo-title" title={promo.title}>
                      {promo.title}
                    </h3>
                    <p className="promo-summary">{promo.summary}</p>

                    <div className="promo-card-actions">
                      <button
                        type="button"
                        className="btn-promo-action"
                        onClick={() => setSelectedPromo(promo)}
                      >
                        <span>Xem thể lệ chi tiết</span>
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "30px 20px", color: "#64748b" }}>
                Hiện chưa có chương trình khuyến mãi nào.
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className={`slider-side-arrow arrow-next ${!canScrollRight ? "disabled" : ""}`}
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          title="Lướt sang phải"
          aria-label="Next promotion"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      {selectedPromo && (
        <div
          className="promo-modal-backdrop"
          onClick={() => setSelectedPromo(null)}
        >
          <div
            className="promo-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="promo-modal-header">
              <div className="promo-modal-header-left">
                <span
                  className="promo-tag-badge-modal"
                  style={{ backgroundColor: selectedPromo.badgeColor || "#e11d48" }}
                >
                  {selectedPromo.tag}
                </span>
                <span className="promo-modal-date">
                  <i className="bi bi-calendar-event"></i> {selectedPromo.date}
                </span>
              </div>
              <button
                type="button"
                className="promo-modal-close"
                onClick={() => setSelectedPromo(null)}
                aria-label="Đóng"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="promo-modal-body">
              <div className="promo-modal-image-wrap">
                <img src={selectedPromo.imageUrl} alt={selectedPromo.title} />
              </div>

              <h3 className="promo-modal-title">{selectedPromo.title}</h3>
              <p className="promo-modal-desc">{selectedPromo.summary}</p>

              {selectedPromo.details && (
                <div className="promo-details-box">
                  <h4 className="promo-details-title">
                    <i className="bi bi-info-circle-fill" style={{ color: "#23408e" }}></i>{" "}
                    Thể lệ & Điều kiện áp dụng
                  </h4>
                  <ul className="promo-details-list">
                    <li>
                      <strong>Điều kiện áp dụng:</strong> {selectedPromo.details.condition}
                    </li>
                    <li>
                      <strong>Quà tặng / Ưu đãi:</strong> {selectedPromo.details.gift}
                    </li>
                    <li>
                      <strong>Cách thức tham gia:</strong> {selectedPromo.details.howToJoin}
                    </li>
                    <li>
                      <strong>Lưu ý:</strong> {selectedPromo.details.note}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="promo-modal-footer">
              <button
                type="button"
                className="btn-promo-modal-close"
                onClick={() => setSelectedPromo(null)}
              >
                Đóng
              </button>
              <a
                href="#tat-ca-san-pham"
                className="btn-promo-modal-shop"
                onClick={() => setSelectedPromo(null)}
              >
                <span>Mua sắm ngay</span>
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// =========================================================================
// TRANG SẢN PHẨM CHÍNH (PRODUCTS PAGE)
// =========================================================================
export default function Products() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Khởi tạo trực tiếp từ mock data: giao diện hiển thị ngay tức thì 0ms trễ
  const [categories, setCategories] = useState(mockCategories);
  const [products, setProducts] = useState(mockProducts);
  const [promotions, setPromotions] = useState(mockPromotions);

  const [isLoading, setIsLoading] = useState(false);

  // Bộ lọc từ URL
  const initialCategory =
    searchParams.get("category") ||
    (location.hash ? location.hash.replace("#", "") : "all");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState(() => searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort") || "default");

  // 1. Tải danh mục và khuyến mãi từ API khi mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [catRes, promoRes] = await Promise.all([
          productService.getCategories(),
          productService.getPromotions(),
        ]);

        if (isMounted) {
          if (catRes.data?.length) setCategories(catRes.data);
          if (promoRes.data?.length) setPromotions(promoRes.data);
        }
      } catch (err) {
        console.error("Lỗi tải danh mục / khuyến mãi:", err);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Tải sản phẩm từ API khi bộ lọc thay đổi
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productService.getProducts({
        category: selectedCategory,
        search: searchKeyword,
        sort: sortBy,
      });

      setProducts(res.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách sản phẩm:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchKeyword, sortBy]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Cập nhật URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (searchKeyword.trim()) {
      params.set("search", searchKeyword.trim());
    }
    if (sortBy && sortBy !== "default") {
      params.set("sort", sortBy);
    }

    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchKeyword, sortBy, setSearchParams]);

  // Tự động cuộn khi hash URL thay đổi
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    }
  }, [location.hash]);

  // Menu tabs bao gồm cả "Tất cả" & "Thông tin khuyến mãi"
  const tabCategories = useMemo(() => {
    return [
      { id: "all", name: "Tất cả", icon: "bi-grid-fill" },
      ...categories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon || "bi-tag-fill",
      })),
      {
        id: "thong-tin-khuyen-mai",
        name: "Thông tin khuyến mãi",
        icon: "bi-gift-fill",
      },
    ];
  }, [categories]);

  // Đổi tab danh mục
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      window.scrollTo({ top: 480, behavior: "smooth" });
    } else {
      const el = document.getElementById(categoryId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Lọc sản phẩm hiển thị theo danh mục
  const getProductsForCategory = useCallback(
    (catId) => {
      let items = products.filter(
        (p) => String(p.categoryId) === String(catId)
      );

      if (selectedCategory === "all") {
        const featured = items.filter((p) => p.isFeatured);
        if (featured.length > 0) items = featured;
      }

      return items;
    },
    [products, selectedCategory]
  );

  // Danh mục hiển thị trên giao diện
  const visibleCategorySections = useMemo(() => {
    if (selectedCategory === "thong-tin-khuyen-mai") return [];
    if (selectedCategory === "all") return categories;
    return categories.filter((c) => String(c.id) === String(selectedCategory));
  }, [categories, selectedCategory]);

  return (
    <div className="product-page-container product-list-page">
      {/* ================= HERO BANNER ================= */}
      <section
        className="product-hero-banner"
        style={bannerMotherBaby ? { backgroundImage: `url(${bannerMotherBaby})` } : undefined}
      >
        <div className="banner-overlay">
          <nav className="breadcrumb-nav">
            <Link to="/home">Trang chủ</Link>
            <span> &gt; </span>
            <span className="current-page">Sản phẩm</span>
            {selectedCategory !== "all" && (
              <>
                <span> &gt; </span>
                <span className="current-category">
                  {tabCategories.find((cat) => cat.id === selectedCategory)?.name}
                </span>
              </>
            )}
          </nav>

          <div className="banner-content">
            <h1>VitaDairy Luôn Đồng Hành Cùng Mẹ Và Bé</h1>
            <p>
              VitaDairy hướng tới sản xuất các sản phẩm sữa chăm sóc sức khỏe người
              tiêu dùng ở nhiều lứa tuổi từ những sản phẩm cung cấp năng lượng cho
              người lớn, sản phẩm chuyên biệt dành cho người bệnh, sản phẩm cho trẻ
              biếng ăn, suy dinh dưỡng thấp còi đến các dòng sản phẩm giúp bé phát
              triển trí não, tăng chiều cao...
            </p>
          </div>
        </div>
      </section>

      {/* ================= PHẦN THÂN TRANG ================= */}
      <div className="product-main-content">
        {/* Menu Tab danh mục */}
        <nav className="category-tabs-nav" id="tat-ca-san-pham">
          <ul className="category-tabs-list">
            {tabCategories.map((cat) => (
              <li key={cat.id} className="category-tab-item">
                <button
                  type="button"
                  className={`category-tab-btn ${
                    selectedCategory === cat.id ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <i className={`bi ${cat.icon}`}></i>
                  <span>{cat.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Thanh tìm kiếm & Bộ lọc */}
        <section className="product-toolbar">
          <div className="toolbar-search">
            <label htmlFor="product-search-input">
              <i className="bi bi-search"></i>
            </label>
            <input
              id="product-search-input"
              type="text"
              placeholder="Tìm theo tên sữa (ColosBaby, Oggi, Nepro, CaloSure...)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            {searchKeyword && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchKeyword("")}
                title="Xóa tìm kiếm"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>

          <div className="toolbar-sort">
            <label htmlFor="sort-select">Sắp xếp theo: </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Mặc định (Nổi bật)</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>

          <div className="toolbar-count">
            <span>
              Tìm thấy <strong>{products.length}</strong> sản phẩm phù hợp
            </span>
          </div>
        </section>

        {/* Lưới hiển thị sản phẩm */}
        <main className="product-sections-container">
          {!isLoading &&
          products.length === 0 &&
          selectedCategory !== "thong-tin-khuyen-mai" ? (
            <div className="empty-product-state">
              <i className="bi bi-inbox"></i>
              <h3>Không tìm thấy sản phẩm nào phù hợp!</h3>
              <p>Vui lòng thử tìm với từ khóa khác hoặc bấm nút bên dưới.</p>
              <button
                type="button"
                className="btn-reset-filter"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchKeyword("");
                  setSortBy("default");
                }}
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            visibleCategorySections.map((section) => {
              const productsInSection = getProductsForCategory(section.id);
              if (!isLoading && productsInSection.length === 0) return null;

              return (
                <CategoryRowSlider
                  key={section.id}
                  section={section}
                  products={productsInSection}
                  formatPrice={productService.formatCurrency}
                  isLoading={isLoading}
                  onSelectCategory={handleCategoryChange}
                />
              );
            })
          )}

          {/* Mục khuyến mãi */}
          {(selectedCategory === "all" ||
            selectedCategory === "thong-tin-khuyen-mai") && (
            <PromotionRowSlider
              promotions={promotions}
              isLoading={isLoading}
            />
          )}
        </main>

        {/* Footer */}
        <div className="product-footer-wrapper">
          <Footer />
        </div>
      </div>
    </div>
  );
}
export { Products as ProductList };
