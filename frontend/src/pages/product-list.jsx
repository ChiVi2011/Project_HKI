import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PRODUCTS_DATA, CATEGORIES_DATA } from "../data/products";
import { useCart } from "../context/CartContext";
import "../style/product.css";

const PRICE_FILTERS = [
  { label: "Tất cả mức giá", min: 0, max: Infinity },
  { label: "Dưới 100.000 ₫", min: 0, max: 100000 },
  { label: "100.000 ₫ - 300.000 ₫", min: 100000, max: 300000 },
  { label: "300.000 ₫ - 500.000 ₫", min: 300000, max: 500000 },
  { label: "Trên 500.000 ₫", min: 500000, max: Infinity },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const { addToCart } = useCart();

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS_DATA];

    // Lọc theo danh mục
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Lọc theo khoảng giá
    const priceRange = PRICE_FILTERS[selectedPriceFilter];
    list = list.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max,
    );

    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.summary.toLowerCase().includes(keyword) ||
          p.categoryName.toLowerCase().includes(keyword),
      );
    }

    // Sắp xếp
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "bestseller") {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [selectedCategory, selectedPriceFilter, searchKeyword, sortBy]);

  return (
    <div className="product-list-page">
      {/* 1. HEADER BANNER */}
      <section className="product-list-header-banner">
        <div className="product-banner-content">
          <h1>DANH SÁCH SẢN PHẨM VIDAIRY</h1>
          <p>
            Khám phá các sản phẩm sữa và dinh dưỡng gia đình chuẩn chất lượng
            cao từ ViDairy
          </p>
        </div>
      </section>

      {/* 2. THANH DANH MỤC TABS */}
      <section className="product-categories-tabs-bar">
        <div className="cat-tabs-scroll-wrap">
          <button
            type="button"
            className={`cat-tab-pill ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => handleCategoryChange("all")}
          >
            <i className="bi bi-grid-fill"></i>
            <span>Tất cả sản phẩm</span>
          </button>

          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-tab-pill ${
                selectedCategory === cat.id ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. NỘI DUNG CHÍNH: BỘ LỌC & LƯỚI SẢN PHẨM */}
      <section className="product-main-container">
        {/* Thanh công cụ tìm kiếm và sắp xếp */}
        <div className="product-toolbar">
          <div className="product-search-input-wrap">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sữa, công dụng..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              aria-label="Tìm kiếm sản phẩm"
            />
            {searchKeyword && (
              <button
                type="button"
                className="btn-clear-product-search"
                onClick={() => setSearchKeyword("")}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>

          <div className="product-filter-actions">
            {/* Lọc khoảng giá */}
            <div className="price-select-wrap">
              <label htmlFor="price-filter">Khoảng giá:</label>
              <select
                id="price-filter"
                value={selectedPriceFilter}
                onChange={(e) => setSelectedPriceFilter(Number(e.target.value))}
              >
                {PRICE_FILTERS.map((f, idx) => (
                  <option key={idx} value={idx}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sắp xếp */}
            <div className="sort-select-wrap">
              <label htmlFor="sort-by">Sắp xếp:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Nổi bật nhất</option>
                <option value="bestseller">Bán chạy nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Thông tin số lượng kết quả */}
        <div className="product-results-info">
          <span>
            Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm phù hợp
          </span>
          {(selectedCategory !== "all" ||
            selectedPriceFilter !== 0 ||
            searchKeyword) && (
            <button
              type="button"
              className="btn-clear-all-filters"
              onClick={() => {
                handleCategoryChange("all");
                setSelectedPriceFilter(0);
                setSearchKeyword("");
                setSortBy("featured");
              }}
            >
              <i className="bi bi-arrow-counterclockwise"></i> Xóa bộ lọc
            </button>
          )}
        </div>

        {/* LƯỚI SẢN PHẨM */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-item-card">
                {/* Ảnh sản phẩm */}
                <div className="product-card-img-wrap">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-card-img"
                    />
                  </Link>

                  {product.badge && (
                    <span className="product-card-badge">{product.badge}</span>
                  )}
                  {product.discount && (
                    <span className="product-card-discount">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Chi tiết sản phẩm */}
                <div className="product-card-body">
                  <span className="product-card-category">
                    {product.categoryName}
                  </span>

                  <Link
                    to={`/product/${product.id}`}
                    className="product-card-name-link"
                  >
                    <h3 className="product-card-name">{product.name}</h3>
                  </Link>

                  {/* Đánh giá sao */}
                  <div className="product-card-rating">
                    <div className="stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <span className="rating-score">{product.rating}</span>
                    <span className="reviews-count">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  <p className="product-card-summary">{product.summary}</p>

                  <div className="product-card-unit">
                    <i className="bi bi-box-seam"></i>
                    <span>Quy cách: {product.unit}</span>
                  </div>

                  {/* Giá và Nút mua */}
                  <div className="product-card-footer">
                    <div className="product-price-box">
                      <span className="product-current-price">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="product-old-price">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn-add-to-cart-quick"
                      onClick={() => addToCart(product, 1)}
                      title="Thêm vào giỏ hàng"
                      aria-label="Thêm vào giỏ"
                    >
                      <i className="bi bi-cart-plus-fill"></i>
                      <span>Thêm giỏ</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-products-found">
            <i className="bi bi-bag-x"></i>
            <h3>Không tìm thấy sản phẩm phù hợp</h3>
            <p>
              Vui lòng thử tìm với từ khóa khác hoặc điều chỉnh lại khoảng giá
              và danh mục nhé!
            </p>
            <button
              type="button"
              className="btn-reset-product-search"
              onClick={() => {
                handleCategoryChange("all");
                setSelectedPriceFilter(0);
                setSearchKeyword("");
              }}
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
