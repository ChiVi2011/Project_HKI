import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import {
  getProductById as fallbackGetProductById,
  getProductsByCategory,
  formatCurrency,
} from "../data/productsData";
import { useCart } from "../context/CartContext";
import "../style/product-detail.css";

export default function ProductDetail() {
  const { id, productId } = useParams();
  const currentId = id || productId;
  const navigate = useNavigate();
  const { addToCart, openCart, totalItems } = useCart();

  const [product, setProduct] = useState(() => fallbackGetProductById(currentId));
  const [isLoading, setIsLoading] = useState(true);

  // Quản lý trạng thái tương tác người dùng
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("benefits");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cartAlert, setCartAlert] = useState("");
  const alertTimerRef = useRef(null);

  // Tải chi tiết sản phẩm từ API Live
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedPackIndex(0);
    setQuantity(1);
    setActiveImageIndex(0);
    setActiveTab("benefits");

    let isMounted = true;
    setIsLoading(true);

    productService
      .getProductById(currentId)
      .then((data) => {
        if (isMounted) {
          if (data) {
            setProduct(data);
          } else {
            setProduct(fallbackGetProductById(currentId));
          }
        }
      })
      .catch((err) => {
        console.warn("Lỗi tải chi tiết sản phẩm:", err);
        if (isMounted) setProduct(fallbackGetProductById(currentId));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentId]);

  // Hủy timeout khi unmount để tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  // Danh sách hình ảnh sản phẩm (loại bỏ trùng lặp)
  const productImages = useMemo(() => {
    if (!product) return [];
    const imgs = [product.imageUrl];
    if (product.secondaryImageUrl && product.secondaryImageUrl !== product.imageUrl) {
      imgs.push(product.secondaryImageUrl);
    }
    return imgs;
  }, [product]);

  // Sản phẩm liên quan cùng danh mục
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return getProductsByCategory(product.categoryId)
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  // Trạng thái đang tải dữ liệu
  if (isLoading && !product) {
    return (
      <div className="product-not-found-container">
        <div className="not-found-card" style={{ border: "none", boxShadow: "none" }}>
          <div className="spinner-border text-primary" role="status" style={{ width: "40px", height: "40px" }}></div>
          <p style={{ marginTop: "16px", color: "#64748b", fontWeight: 600 }}>Đang tải thông tin dinh dưỡng sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Giao diện khi không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="product-not-found-container">
        <div className="not-found-card">
          <i className="bi bi-exclamation-circle-fill"></i>
          <h2>Không tìm thấy sản phẩm!</h2>
          <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã được cập nhật.</p>
          <Link to="/products" className="btn-back-home">
            <i className="bi bi-arrow-left"></i> Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  // Quy cách đóng gói đang chọn
  const selectedPack =
    product.packOptions?.[selectedPackIndex] ||
    product.packOptions?.[0] || {
      id: "default",
      name: product.packaging || "Lon tiêu chuẩn",
      price: product.price || 0,
    };

  const totalPrice = (selectedPack?.price || product.price || 0) * quantity;

  // Xử lý thêm vào giỏ hàng & mua ngay
  const handleAddToCart = (openDrawer = false) => {
    addToCart(product, selectedPack, quantity);
    setCartAlert(
      `Đã thêm ${quantity} x "${product.name} (${selectedPack.name})" vào giỏ hàng!`
    );

    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => setCartAlert(""), 3500);

    if (openDrawer && typeof openCart === "function") {
      openCart();
    }
  };

  return (
    <div className="product-detail-page">
      {/* 1. BREADCRUMB ĐIỀU HƯỚNG */}
      <div className="detail-breadcrumb-bar">
        <div className="breadcrumb-inner">
          <Link to="/home">
            <i className="bi bi-house-door-fill"></i> Trang chủ
          </Link>
          <span className="sep">&gt;</span>
          <Link to="/products">Sản phẩm</Link>
          <span className="sep">&gt;</span>
          <Link to={`/products?category=${product.categoryId}`}>
            {product.categoryName || "Dòng sản phẩm"}
          </Link>
          <span className="sep">&gt;</span>
          <span className="current-product-name">{product.name}</span>
        </div>
      </div>

      <div className="detail-main-wrapper">
        {/* Toast thông báo giỏ hàng */}
        {cartAlert && (
          <div className="detail-toast-alert" role="status">
            <i className="bi bi-check-circle-fill"></i>
            <span>{cartAlert}</span>
            {typeof openCart === "function" && (
              <button
                type="button"
                className="btn-toast-view-cart"
                onClick={openCart}
              >
                Xem giỏ
              </button>
            )}
          </div>
        )}

        {/* 2. KHU VỰC THÔNG TIN CHÍNH (2 CỘT) */}
        <section className="product-summary-grid">
          {/* CỘT TRÁI: HÌNH ẢNH & CHỨNG NHẬN CHẤT LƯỢNG */}
          <div className="product-gallery-col">
            <div className="main-image-container">
              {product.isHot && <span className="detail-hot-badge">Nổi bật</span>}
              <img
                src={productImages[activeImageIndex] || product.imageUrl}
                alt={product.name}
                className="main-detail-image"
              />
            </div>

            {/* Thumbnail selector (chỉ hiển thị khi có từ 2 ảnh trở lên) */}
            {productImages.length > 1 && (
              <div className="thumbnail-row">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumb-btn ${activeImageIndex === idx ? "active" : ""}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Xem ảnh ${idx + 1}`}
                  >
                    <img src={img} alt={`${product.name} góc ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* 3 Cam kết bảo chứng chất lượng vàng */}
            <div className="quality-trust-box">
              <div className="trust-item">
                <i className="bi bi-shield-check"></i>
                <div>
                  <strong>Sữa non Mỹ 24h</strong>
                  <span>Kháng thể IgG tự nhiên</span>
                </div>
              </div>
              <div className="trust-item">
                <i className="bi bi-award"></i>
                <div>
                  <strong>Chuẩn Y Tế GMP</strong>
                  <span>Công nghệ sản xuất vô trùng</span>
                </div>
              </div>
              <div className="trust-item">
                <i className="bi bi-heart-pulse"></i>
                <div>
                  <strong>Hấp thu trọn vẹn</strong>
                  <span>Bổ sung HMO & MK7</span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT SẢN PHẨM & MUA HÀNG */}
          <div className="product-info-col">
            <div className="brand-header-meta">
              <span className="brand-badge">{product.brand}</span>
              <span className="category-meta-link">
                Dòng sản phẩm: <strong>{product.categoryName}</strong>
              </span>
            </div>

            <h1 className="detail-title">{product.name}</h1>

            {product.slogan && (
              <div className="detail-slogan-strip">
                <i className="bi bi-quote"></i>
                <span>{product.slogan}</span>
              </div>
            )}

            <div className="detail-rating-row">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className="bi bi-star-fill"></i>
                ))}
                <span className="rating-num">{product.rating || "5.0"}</span>
              </div>
              <span className="divider-dot">•</span>
              <span className="sold-count">
                Đã bán <strong>{product.soldCount?.toLocaleString("vi-VN") || 500}+</strong> sản phẩm
              </span>
            </div>

            {/* Bảng giá */}
            <div className="detail-price-panel">
              <div className="price-main-block">
                <span className="price-tag-label">Giá ưu đãi:</span>
                <span className="price-big">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="free-shipping-tag">
                <i className="bi bi-truck"></i> Miễn phí vận chuyển từ 300K
              </div>
            </div>

            {/* Thông số vắn tắt */}
            <div className="quick-specs-grid">
              <div className="spec-cell">
                <span className="spec-label">Đối tượng:</span>
                <span className="spec-value">{product.targetUser}</span>
              </div>
              <div className="spec-cell">
                <span className="spec-label">Quy cách:</span>
                <span className="spec-value">{selectedPack.name}</span>
              </div>
              <div className="spec-cell">
                <span className="spec-label">Xuất xứ:</span>
                <span className="spec-value">{product.origin}</span>
              </div>
            </div>

            {/* Chọn quy cách đóng gói */}
            {product.packOptions && product.packOptions.length > 0 && (
              <div className="detail-option-group">
                <div className="option-header">
                  <label>Quy cách đóng gói:</label>
                  <span className="selected-pack-hint">{selectedPack.name}</span>
                </div>
                <div className="pack-options-list">
                  {product.packOptions.map((pack, idx) => (
                    <button
                      key={pack.id || idx}
                      type="button"
                      className={`pack-option-btn ${selectedPackIndex === idx ? "active" : ""}`}
                      onClick={() => setSelectedPackIndex(idx)}
                    >
                      <span className="pack-name">{pack.name}</span>
                      <span className="pack-price">{formatCurrency(pack.price)}</span>
                      {pack.tag && <span className="pack-tag">{pack.tag}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bộ chọn số lượng */}
            <div className="quantity-control-group">
              <label>Số lượng:</label>
              <div className="quantity-counter">
                <button
                  type="button"
                  className="btn-qty"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Giảm số lượng"
                >
                  <i className="bi bi-dash"></i>
                </button>
                <input
                  type="number"
                  className="qty-number-input"
                  value={quantity}
                  min={1}
                  max={50}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setQuantity("");
                      return;
                    }
                    const num = parseInt(raw, 10);
                    if (isNaN(num)) {
                      setQuantity(1);
                    } else if (num > 50) {
                      setQuantity(50);
                    } else {
                      setQuantity(Math.max(1, num));
                    }
                  }}
                  onBlur={() => {
                    if (!quantity || quantity < 1) setQuantity(1);
                    else if (quantity > 50) setQuantity(50);
                  }}
                  title="Nhập số lượng trực tiếp (Tối đa 50)"
                />
                <button
                  type="button"
                  className="btn-qty"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  disabled={quantity >= 50}
                  aria-label="Tăng số lượng"
                  title={quantity >= 50 ? "Số lượng tối đa là 50 hộp" : "Tăng số lượng"}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
              <span className="total-hint-text">
                Tổng cộng: <strong>{formatCurrency(totalPrice)}</strong>
                <small style={{ marginLeft: "8px", color: "#64748b", fontWeight: 400 }}>(Tổng giỏ hàng tối đa 50 hộp/đơn)</small>
              </span>
            </div>

            {/* Các nút hành động mua */}
            <div className="detail-buy-actions">
              <button
                type="button"
                className="btn-detail-add-cart-primary"
                onClick={() => handleAddToCart(false)}
              >
                <i className="bi bi-cart-plus"></i>
                <span>Thêm vào giỏ hàng</span>
              </button>
          
            </div>

            {/* Cam kết thương hiệu */}
            <div className="store-commitments-box">
              <h4>Cam kết từ VitaDairy Official Store:</h4>
              <ul>
                <li>
                  <i className="bi bi-check-circle-fill text-green"></i> 100% Sữa chính hãng từ nhà máy VitaDairy Việt Nam.
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-green"></i> Đổi trả hàng miễn phí trong 7 ngày nếu lỗi từ nhà sản xuất.
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-green"></i> Đội ngũ Bác sĩ, Chuyên gia dinh dưỡng tư vấn miễn phí 24/7 qua <strong>1900 633 559</strong>.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. TABS CHI TIẾT SẢN PHẨM */}
        <section className="product-tabs-section">
          <div className="tabs-nav-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "benefits"}
              className={`tab-item-btn ${activeTab === "benefits" ? "active" : ""}`}
              onClick={() => setActiveTab("benefits")}
            >
              <i className="bi bi-stars"></i> Đặc điểm nổi bật
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "nutrition"}
              className={`tab-item-btn ${activeTab === "nutrition" ? "active" : ""}`}
              onClick={() => setActiveTab("nutrition")}
            >
              <i className="bi bi-table"></i> Bảng dinh dưỡng
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "usage"}
              className={`tab-item-btn ${activeTab === "usage" ? "active" : ""}`}
              onClick={() => setActiveTab("usage")}
            >
              <i className="bi bi-cup-hot"></i> Hướng dẫn pha & Bảo quản
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "reviews"}
              className={`tab-item-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              <i className="bi bi-chat-heart"></i> Đánh giá ({product.soldCount ? Math.round(product.soldCount / 10) : 58})
            </button>
          </div>

          <div className="tab-content-panel">
            {/* TAB 1: ĐẶC ĐIỂM NỔI BẬT */}
            {activeTab === "benefits" && (
              <div className="tab-pane-benefits">
                <h3 className="pane-title">Ưu Điểm Vượt Trội Của {product.name}</h3>
                <p className="pane-intro">{product.description}</p>

                {product.keyHighlights && product.keyHighlights.length > 0 && (
                  <div className="highlights-grid">
                    {product.keyHighlights.map((item, i) => (
                      <div key={i} className="highlight-card">
                        <div className="hl-icon-wrap">
                          <i className={`bi ${item.icon}`}></i>
                        </div>
                        <div className="hl-content">
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="product-origin-box">
                  <h4>Thông tin xuất xứ & Nhà sản xuất:</h4>
                  <p><strong>Nhà sản xuất:</strong> {product.manufacturer}</p>
                  <p><strong>Nguồn gốc nguyên liệu:</strong> {product.origin}</p>
                  <p><strong>Hạn sử dụng:</strong> {product.shelfLife}</p>
                </div>
              </div>
            )}

            {/* TAB 2: BẢNG THÀNH PHẦN DINH DƯỠNG */}
            {activeTab === "nutrition" && (
              <div className="tab-pane-nutrition">
                <h3 className="pane-title">Bảng Thành Phần Dinh Dưỡng Chuẩn RDA</h3>
                <p className="pane-intro">
                  Công thức được nghiên cứu chuyên sâu bởi các chuyên gia dinh dưỡng hàng đầu, cung cấp nguồn dưỡng chất cân bằng và vượt trội.
                </p>

                <div className="table-responsive">
                  <table className="nutrition-table">
                    <thead>
                      <tr>
                        <th>Chỉ tiêu dinh dưỡng</th>
                        <th>Đơn vị tính</th>
                        <th>Hàm lượng trong 100g bột</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.nutritionFacts?.map((row, idx) => (
                        <tr key={idx}>
                          <td className="nutrient-name"><strong>{row.name}</strong></td>
                          <td>{row.unit}</td>
                          <td className="nutrient-val">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: HƯỚNG DẪN PHA & BẢO QUẢN */}
            {activeTab === "usage" && (
              <div className="tab-pane-usage">
                <h3 className="pane-title">4 Bước Pha Sữa Đúng Chuẩn Khoa Học</h3>
                <p className="pane-intro">
                  Pha sữa đúng nhiệt độ và tỷ lệ giúp giữ nguyên hoạt tính sinh học của kháng thể IgG tự nhiên và lợi khuẩn đường ruột.
                </p>

                <div className="usage-steps-row">
                  {product.usageSteps?.map((step) => (
                    <div key={step.step} className="step-card">
                      <div className="step-number">Bước {step.step}</div>
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="storage-guide-banner">
                  <i className="bi bi-info-circle-fill"></i>
                  <div>
                    <strong>Lưu ý bảo quản:</strong>
                    <p>{product.storage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ĐÁNH GIÁ KHÁCH HÀNG */}
            {activeTab === "reviews" && (
              <div className="tab-pane-reviews">
                <div className="reviews-summary-bar">
                  <div className="rating-overall">
                    <span className="big-rating-score">5.0</span>
                    <div className="stars-fill">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i key={s} className="bi bi-star-fill"></i>
                      ))}
                    </div>
                    <span className="reviews-total-text">
                      Dựa trên {product.soldCount || 350}+ lượt mua hàng chính hãng
                    </span>
                  </div>
                </div>

                <div className="review-list">
                  <div className="review-item">
                    <div className="reviewer-info">
                      <strong>Chị Thu Hà (Hà Nội)</strong>
                      <span className="review-date">Đã mua hàng 2 ngày trước</span>
                    </div>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i key={s} className="bi bi-star-fill"></i>
                      ))}
                    </div>
                    <p className="review-comment">
                      "Sữa thơm ngon, vị thanh nhạt không bị ngọt gắt. Bé nhà mình uống hợp tác lắm, trộm vía tăng cân đều và tiêu hóa rất tốt không bị táo bón!"
                    </p>
                  </div>

                  <div className="review-item">
                    <div className="reviewer-info">
                      <strong>Anh Minh Tuấn (TP.HCM)</strong>
                      <span className="review-date">Đã mua hàng 1 tuần trước</span>
                    </div>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i key={s} className="bi bi-star-fill"></i>
                      ))}
                    </div>
                    <p className="review-comment">
                      "Giao hàng nhanh, đóng gói cẩn thận 2 lớp chống móp hộp. Sữa non Mỹ chất lượng cao, cả nhà mình đều rất yên tâm sử dụng sản phẩm VitaDairy."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. SẢN PHẨM LIÊN QUAN */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="section-title-wrap">
              <span className="section-icon-badge">
                <i className="bi bi-grid-3x3-gap-fill"></i>
              </span>
              <div>
                <h2 className="section-title">Sản Phẩm Cùng Danh Mục</h2>
                <p className="section-subtitle">
                  Khám phá thêm các giải pháp dinh dưỡng chất lượng khác từ {product.categoryName}
                </p>
              </div>
            </div>

            <div className="related-products-grid">
              {relatedProducts.map((item) => (
                <div key={item.id} className="related-product-card">
                  {item.isHot && <span className="card-badge-hot">Nổi bật</span>}
                  <span className="card-brand-tag">{item.brand}</span>

                  <Link to={`/product/${item.id}`} className="related-image-wrapper">
                    <img src={item.imageUrl} alt={item.name} loading="lazy" />
                  </Link>

                  <div className="card-slogan-strip">
                    <span>{item.slogan}</span>
                  </div>

                  <div className="related-body">
                    <h3 className="card-product-title">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="card-spec-text">
                      <strong>Quy cách:</strong> {item.packaging}
                    </p>

                    <div className="card-price-row">
                      <span className="price-title">Giá tham khảo:</span>
                      <span className="price-number">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <div className="related-card-actions">
                      <Link
                        to={`/product/${item.id}`}
                        className="btn-view-detail-only"
                      >
                        <span>Xem chi tiết</span>
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. NÚT ĐIỀU HƯỚNG QUAY LẠI */}
        <div className="back-navigation-bar">
          <button
            type="button"
            className="btn-back-link"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left"></i> Quay lại trang trước
          </button>
          <Link
            to={`/products?category=${product.categoryId}`}
            className="btn-view-collection"
          >
            Xem tất cả {product.categoryName} <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
