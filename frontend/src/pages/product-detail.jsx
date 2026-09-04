import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PRODUCTS_DATA } from "../data/products";
import { useCart } from "../context/CartContext";
import "../style/product.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  const product = PRODUCTS_DATA.find((p) => String(p.id) === String(id));

  const [selectedVolume, setSelectedVolume] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("desc");
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      if (product.volumes && product.volumes.length > 0) {
        setSelectedVolume(product.volumes[0].label);
      } else {
        setSelectedVolume(product.unit || "Mặc định");
      }
      setQuantity(1);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="product-not-found-page">
        <i className="bi bi-exclamation-triangle"></i>
        <h2>Không tìm thấy sản phẩm!</h2>
        <p>
          Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.
        </p>
        <Link to="/products" className="btn-back-to-list">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  // Lấy giá tương ứng với dung tích
  const currentVolumeObj = product.volumes?.find(
    (v) => v.label === selectedVolume,
  );
  const currentPrice = currentVolumeObj
    ? currentVolumeObj.price
    : product.price;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVolume);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVolume);
    openCart();
  };

  // Sản phẩm liên quan cùng danh mục
  const relatedProducts = PRODUCTS_DATA.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 3);

  return (
    <div className="product-detail-page">
      {/* 1. BREADCRUMB */}
      <nav className="product-breadcrumb-nav" aria-label="Đường dẫn trang">
        <div className="breadcrumb-container">
          <Link to="/home">Trang chủ</Link>
          <i className="bi bi-chevron-right"></i>
          <Link to="/products">Sản phẩm</Link>
          <i className="bi bi-chevron-right"></i>
          <Link to={`/products?category=${product.category}`}>
            {product.categoryName}
          </Link>
          <i className="bi bi-chevron-right"></i>
          <span className="current-breadcrumb">{product.name}</span>
        </div>
      </nav>

      {/* 2. KHỐI THÔNG TIN CHÍNH (2 CỘT) */}
      <section className="product-main-detail-section">
        <div className="product-detail-layout">
          {/* CỘT TRÁI: HÌNH ẢNH SẢN PHẨM */}
          <div className="product-gallery-col">
            <div className="product-main-img-box">
              <img
                src={product.image}
                alt={product.name}
                className="product-large-img"
              />
              {product.badge && (
                <span className="product-detail-badge">{product.badge}</span>
              )}
              {product.discount && (
                <span className="product-detail-discount">
                  {product.discount}
                </span>
              )}
            </div>

            <div className="product-thumbnails-row">
              <div className="thumb-item active">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="thumb-item">
                <img src={product.image} alt={product.name} />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT ĐẶT MUA */}
          <div className="product-info-col">
            <span className="product-info-cat-tag">{product.categoryName}</span>

            <h1 className="product-detail-title">{product.name}</h1>

            {/* Đánh giá & Đã bán */}
            <div className="product-detail-rating-row">
              <div className="stars">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
              <span className="rating-num">{product.rating}</span>
              <span className="divider">|</span>
              <span className="reviews-text">
                {product.reviewsCount} Đánh giá
              </span>
              <span className="divider">|</span>
              <span className="sold-text">
                <i className="bi bi-check-circle-fill"></i> 100% Chính Hãng
                ViDairy
              </span>
            </div>

            {/* Bảng giá */}
            <div className="product-detail-price-box">
              <span className="detail-current-price">
                {formatPrice(currentPrice)}
              </span>
              {product.originalPrice > currentPrice && (
                <span className="detail-old-price">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="detail-discount-tag">
                  Tiết kiệm {product.discount}
                </span>
              )}
            </div>

            <p className="product-detail-summary">{product.summary}</p>

            {/* Bộ chọn Quy cách / Dung tích */}
            {product.volumes && product.volumes.length > 0 && (
              <div className="product-volume-select-group">
                <label className="select-label">
                  Chọn quy cách / dung tích:
                </label>
                <div className="volume-options-grid">
                  {product.volumes.map((vol) => (
                    <button
                      key={vol.label}
                      type="button"
                      className={`volume-btn ${
                        selectedVolume === vol.label ? "active" : ""
                      }`}
                      onClick={() => setSelectedVolume(vol.label)}
                    >
                      <span className="vol-name">{vol.label}</span>
                      <span className="vol-price">
                        {formatPrice(vol.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bộ chọn số lượng */}
            <div className="product-quantity-row">
              <label className="select-label">Số lượng:</label>
              <div className="detail-qty-stepper">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  title="Giảm 1"
                  aria-label="Giảm 1"
                >
                  <i className="bi bi-dash"></i>
                </button>
                <span className="qty-val">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  title="Tăng 1"
                  aria-label="Tăng 1"
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
              <span className="in-stock-text">
                <i className="bi bi-check2"></i> Còn hàng tại kho
              </span>
            </div>

            {/* Nút bấm mua hàng */}
            <div className="product-detail-cta-buttons">
              <button
                type="button"
                className="btn-add-to-cart-large"
                onClick={handleAddToCart}
              >
                <i className="bi bi-cart-plus-fill"></i>
                <span>THÊM VÀO GIỎ HÀNG</span>
              </button>

              <button
                type="button"
                className="btn-buy-now-large"
                onClick={handleBuyNow}
              >
                <span>MUA NGAY VỚI GIÁ NÀY</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>

            {addedSuccess && (
              <div className="add-cart-toast">
                <i className="bi bi-check-circle-fill"></i>
                <span>
                  Đã thêm{" "}
                  <strong>
                    {quantity} x {product.name}
                  </strong>{" "}
                  vào giỏ hàng thành công!
                </span>
              </div>
            )}

            {/* Cam kết dịch vụ */}
            <div className="product-service-perks">
              <div className="perk-item">
                <i className="bi bi-truck"></i>
                <span>Giao hỏa tốc 2H</span>
              </div>
              <div className="perk-item">
                <i className="bi bi-arrow-repeat"></i>
                <span>Đổi trả 7 ngày</span>
              </div>
              <div className="perk-item">
                <i className="bi bi-shield-check"></i>
                <span>100% Chính hãng</span>
              </div>
              <div className="perk-item">
                <i className="bi bi-headset"></i>
                <span>Tư vấn: 0989 584 592</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TABS CHI TIẾT THÔNG TIN & THÀNH PHẦN */}
      <section className="product-tabs-info-section">
        <div className="product-tabs-container">
          <div className="detail-tabs-header">
            <button
              type="button"
              className={`detail-tab-btn ${activeTab === "desc" ? "active" : ""}`}
              onClick={() => setActiveTab("desc")}
            >
              Mô tả chi tiết
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${
                activeTab === "nutrition" ? "active" : ""
              }`}
              onClick={() => setActiveTab("nutrition")}
            >
              Bảng thành phần dinh dưỡng
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${
                activeTab === "guide" ? "active" : ""
              }`}
              onClick={() => setActiveTab("guide")}
            >
              Hướng dẫn sử dụng & Bảo quản
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${
                activeTab === "reviews" ? "active" : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá ({product.reviewsCount})
            </button>
          </div>

          <div className="detail-tab-content-body">
            {/* Tab 1: Mô tả */}
            {activeTab === "desc" && (
              <div className="tab-pane-content">
                <h3>Đặc điểm nổi bật của {product.name}</h3>
                <p>{product.description}</p>
                <div className="product-highlights-box">
                  <h4>Lợi ích vượt trội:</h4>
                  <ul>
                    <li>
                      Công thức dinh dưỡng chuẩn y khoa được nghiên cứu phù hợp
                      thể trạng người Việt.
                    </li>
                    <li>
                      Sản xuất trên dây chuyền khép kín vô trùng chuẩn Châu Âu.
                    </li>
                    <li>
                      Hương vị thơm ngon, ngọt thanh tự nhiên, dễ uống và dễ hấp
                      thu.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Dinh dưỡng */}
            {activeTab === "nutrition" && (
              <div className="tab-pane-content">
                <h3>Thành phần & Giá trị dinh dưỡng</h3>
                <div className="nutrition-table-wrap">
                  <table className="nutrition-table">
                    <thead>
                      <tr>
                        <th>Dưỡng chất</th>
                        <th>Hàm lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.nutritionFacts?.map((fact, idx) => (
                        <tr key={idx}>
                          <td className="nutrient-name">{fact.name}</td>
                          <td className="nutrient-value">{fact.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Hướng dẫn */}
            {activeTab === "guide" && (
              <div className="tab-pane-content">
                <h3>Hướng dẫn sử dụng chuẩn chuyên gia</h3>
                <p>{product.instructions}</p>
                <div className="storage-guide-box">
                  <h4>Hướng dẫn bảo quản:</h4>
                  <p>
                    Đậy kín nắp lon sau mỗi lần sử dụng. Bảo quản nơi khô ráo,
                    thoáng mát, tránh ánh nắng trực tiếp. Không bảo quản trong
                    tủ lạnh. Nên sử dụng hết trong vòng 4 tuần sau khi mở nắp.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 4: Đánh giá */}
            {activeTab === "reviews" && (
              <div className="tab-pane-content">
                <div className="reviews-summary-box">
                  <div className="overall-score">
                    <h2>{product.rating}</h2>
                    <div className="stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <span>
                      Dựa trên {product.reviewsCount} đánh giá xác thực
                    </span>
                  </div>
                </div>

                <div className="user-review-samples">
                  <div className="review-card">
                    <div className="reviewer-header">
                      <span className="reviewer-name">Nguyễn Thị Hồng</span>
                      <span className="verified-badge">
                        <i className="bi bi-patch-check-fill"></i> Đã mua hàng
                      </span>
                    </div>
                    <div className="stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <p>
                      Sữa vị thanh nhẹ rất ngon, giao hàng đóng gói cẩn thận 2
                      lớp. Gia đình tôi đã tin dùng sản phẩm ViDairy được hơn 1
                      năm nay.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. SẢN PHẨM LIÊN QUAN */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="related-products-container">
            <div className="related-header">
              <h2>SẢN PHẨM CÙNG DANH MỤC</h2>
              <Link
                to={`/products?category=${product.category}`}
                className="link-view-more-cat"
              >
                <span>Xem tất cả</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            <div className="products-grid">
              {relatedProducts.map((relProduct) => (
                <article key={relProduct.id} className="product-item-card">
                  <div className="product-card-img-wrap">
                    <Link to={`/product/${relProduct.id}`}>
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        className="product-card-img"
                      />
                    </Link>
                    {relProduct.badge && (
                      <span className="product-card-badge">
                        {relProduct.badge}
                      </span>
                    )}
                  </div>

                  <div className="product-card-body">
                    <span className="product-card-category">
                      {relProduct.categoryName}
                    </span>
                    <Link
                      to={`/product/${relProduct.id}`}
                      className="product-card-name-link"
                    >
                      <h3 className="product-card-name">{relProduct.name}</h3>
                    </Link>
                    <div className="product-card-footer">
                      <span className="product-current-price">
                        {formatPrice(relProduct.price)}
                      </span>
                      <button
                        type="button"
                        className="btn-add-to-cart-quick"
                        onClick={() => addToCart(relProduct, 1)}
                        title="Thêm vào giỏ hàng"
                      >
                        <i className="bi bi-cart-plus-fill"></i>
                        <span>Thêm giỏ</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
