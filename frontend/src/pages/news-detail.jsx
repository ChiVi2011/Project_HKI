import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import { getNewsById as getLocalNewsById, getRelatedNews } from "../data/newsData";
import { productsData, formatCurrency } from "../data/productsData";
import CardNew from "../components/card-new";
import "../style/news-detail.css";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Khởi tạo bài viết từ fallback local để hiển thị ngay lập tức (không giật trang)
  const [article, setArticle] = useState(() => getLocalNewsById(id));
  const [loading, setLoading] = useState(true);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Cuộn lên đầu trang và tải dữ liệu bài viết
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    let isMounted = true;

    // 1. Kiểm tra bộ nhớ cục bộ trước
    const fallbackItem = getLocalNewsById(id);
    if (fallbackItem) {
      setArticle(fallbackItem);
      setLikesCount(fallbackItem.likes || 120);
    }

    // 2. Thử gọi API backend (nếu có bài viết động trong MongoDB)
    productService
      .getNewsById(id)
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success && res.data) {
          const apiItem = res.data;
          setArticle((prev) => ({
            ...prev,
            ...apiItem,
            id: apiItem._id || apiItem.id || id,
            title: apiItem.title || prev?.title,
            category: apiItem.category || prev?.category || "Dinh dưỡng",
            categoryName: apiItem.category || prev?.categoryName || "Dinh dưỡng",
            date: apiItem.date || prev?.date || "Gần đây",
            author: apiItem.author || prev?.author || "Chuyên gia Dinh dưỡng ViDairy",
            authorRole: apiItem.authorRole || prev?.authorRole || "Cố vấn Y khoa ViDairy",
            authorAvatar: apiItem.authorAvatar || prev?.authorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
            readTime: apiItem.readTime || prev?.readTime || "4 phút đọc",
            image: apiItem.imageUrl || prev?.image,
            imageUrl: apiItem.imageUrl || prev?.imageUrl,
            summary: apiItem.summary || prev?.summary || "",
            content: apiItem.content || prev?.content,
            sections: apiItem.sections || prev?.sections,
            tags: apiItem.tags || prev?.tags || ["ViDairy", "Dinh dưỡng"],
            views: (apiItem.views || 0) + 1,
            likes: apiItem.likes || prev?.likes || 150,
          }));
          setLikesCount(apiItem.likes || 150);
        }
      })
      .catch((err) => {
        console.warn("Không tải được bài viết từ API, sử dụng dữ liệu cục bộ:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Cập nhật tiêu đề trang web
  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} | ViDairy`;
    } else {
      document.title = "Chi tiết bài viết | ViDairy";
    }
  }, [article]);

  // Lấy các bài viết liên quan
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return getRelatedNews(article.category || article.categoryName, article.id, 3);
  }, [article]);

  // Lấy danh sách sản phẩm khuyên dùng liên quan đến bài viết
  const recommendedProducts = useMemo(() => {
    if (!article) return [];
    if (Array.isArray(article.relatedProductIds) && article.relatedProductIds.length > 0) {
      return productsData
        .filter((p) => article.relatedProductIds.includes(p.id) || article.relatedProductIds.includes(Number(p.id)))
        .slice(0, 3);
    }
    // Mặc định lấy 3 sản phẩm tiêu biểu
    return productsData.slice(0, 3);
  }, [article]);

  // Sao chép liên kết bài viết
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    });
  };

  // Tương tác Thích bài viết
  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  // Trạng thái đang tải lần đầu và chưa có dữ liệu fallback
  if (loading && !article) {
    return (
      <div className="news-detail-skeleton">
        <div className="skeleton-box skeleton-title"></div>
        <div className="skeleton-box skeleton-meta"></div>
        <div className="skeleton-box skeleton-banner"></div>
        <div className="skeleton-box skeleton-text"></div>
        <div className="skeleton-box skeleton-text"></div>
        <div className="skeleton-box skeleton-text" style={{ width: "60%" }}></div>
      </div>
    );
  }

  // Trường hợp không tìm thấy bài viết
  if (!article) {
    return (
      <div className="news-detail-page">
        <div className="news-not-found-card">
          <i className="bi bi-file-earmark-x"></i>
          <h2>Rất tiếc, không tìm thấy bài viết!</h2>
          <p>Bài viết bạn đang tìm kiếm có thể đã được gỡ bỏ hoặc đường dẫn không chính xác.</p>
          <button
            type="button"
            className="btn-back-to-news"
            onClick={() => navigate("/news")}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Quay lại trang Tin tức</span>
          </button>
        </div>
      </div>
    );
  }

  const categoryName = article.category || article.categoryName || "Tin tức & Dinh dưỡng";
  const heroImage = article.image || article.imageUrl || "https://vitadairy.vn/s/images/product/hinh-thumnail-sp-380-x-210.jpg";
  const authorAvatar =
    article.authorAvatar ||
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80";

  return (
    <div className="news-detail-page">
      {/* 1. THANH ĐIỀU HƯỚNG BREADCRUMB */}
      <nav className="news-detail-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span className="breadcrumb-separator">
          <i className="bi bi-chevron-right"></i>
        </span>
        <Link to="/news">Góc Dinh Dưỡng & Tin Tức</Link>
        <span className="breadcrumb-separator">
          <i className="bi bi-chevron-right"></i>
        </span>
        <span>{categoryName}</span>
        <span className="breadcrumb-separator">
          <i className="bi bi-chevron-right"></i>
        </span>
        <span className="breadcrumb-current" title={article.title}>
          {article.title}
        </span>
      </nav>

      {/* 2. BỐ CỤC CHÍNH 2 CỘT */}
      <div className="news-detail-layout">
        {/* ================= CỘT TRÁI: NỘI DUNG BÀI VIẾT ================= */}
        <article className="article-main-content">
          {/* Header bài viết */}
          <div className="article-header">
            <span className="article-category-badge">
              <i className="bi bi-bookmark-fill"></i>
              <span>{categoryName}</span>
            </span>

            <h1 className="article-title">{article.title}</h1>

            <div className="article-meta-bar">
              {/* Tác giả */}
              <div className="article-author-info">
                <img
                  src={authorAvatar}
                  alt={article.author || "Tác giả"}
                  className="author-avatar"
                />
                <div className="author-meta-text">
                  <span className="author-name">
                    {article.author || "Chuyên gia Dinh dưỡng ViDairy"}
                  </span>
                  <span className="author-role">
                    {article.authorRole || "Hội đồng Cố vấn Khoa học ViDairy"}
                  </span>
                </div>
              </div>

              {/* Thống kê nhanh */}
              <div className="article-quick-stats">
                <span className="stat-item" title="Ngày phát hành">
                  <i className="bi bi-calendar3"></i>
                  <span>{article.date || "Gần đây"}</span>
                </span>
                <span className="stat-item" title="Thời gian đọc ước tính">
                  <i className="bi bi-clock"></i>
                  <span>{article.readTime || "4 phút đọc"}</span>
                </span>
                <span className="stat-item" title="Lượt xem bài viết">
                  <i className="bi bi-eye"></i>
                  <span>{(article.views || 1200).toLocaleString("vi-VN")}</span>
                </span>
              </div>

              {/* Thanh công cụ tương tác & chia sẻ */}
              <div className="article-action-toolbar">
                <button
                  type="button"
                  className={`action-tool-btn btn-like ${isLiked ? "active" : ""}`}
                  onClick={handleToggleLike}
                  title={isLiked ? "Bỏ thích" : "Thích bài viết"}
                >
                  <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}></i>
                  <span>{likesCount}</span>
                </button>

                <button
                  type="button"
                  className={`action-tool-btn ${isBookmarked ? "active" : ""}`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  title={isBookmarked ? "Đã lưu" : "Lưu bài viết"}
                >
                  <i className={`bi ${isBookmarked ? "bi-bookmark-check-fill" : "bi-bookmark"}`}></i>
                  <span>{isBookmarked ? "Đã lưu" : "Lưu"}</span>
                </button>

                <button
                  type="button"
                  className="action-tool-btn btn-share"
                  onClick={handleCopyLink}
                  title="Sao chép liên kết bài viết"
                >
                  <i className="bi bi-link-45deg"></i>
                  <span>Chia sẻ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ảnh bìa bài viết */}
          <div className="article-hero-media">
            <div className="hero-image-wrap">
              <img
                src={heroImage}
                alt={article.title}
                className="hero-image"
              />
            </div>
            <p className="hero-image-caption">
              Hình ảnh minh họa chuyên đề: {article.title}
            </p>
          </div>

          {/* Đoạn tóm tắt mở đầu (Lead) */}
          {article.summary && (
            <div className="article-lead-box">
              {article.summary}
            </div>
          )}

          {/* Thân bài viết: Hiển thị các phân đoạn (Sections) hoặc chuỗi nội dung */}
          <div className="article-body-content">
            {/* Trường hợp 1: Có cấu trúc sections phân tầng */}
            {Array.isArray(article.sections) && article.sections.length > 0 ? (
              article.sections.map((sec, idx) => (
                <section key={idx} className="article-section">
                  {sec.heading && (
                    <h2 className="article-section-title">{sec.heading}</h2>
                  )}

                  {Array.isArray(sec.paragraphs) &&
                    sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="article-paragraph">
                        {p}
                      </p>
                    ))}

                  {/* Trích dẫn nổi bật nếu có */}
                  {sec.quote && (
                    <div className="article-quote-box">
                      <i className="bi bi-quote quote-icon"></i>
                      <p className="quote-text">"{sec.quote.text}"</p>
                      {sec.quote.author && (
                        <span className="quote-author">— {sec.quote.author}</span>
                      )}
                    </div>
                  )}

                  {/* Hộp lời khuyên của bác sĩ nếu có */}
                  {sec.advice && (
                    <div className="expert-advice-box">
                      <div className="advice-icon-wrap">
                        <i className="bi bi-heart-pulse-fill"></i>
                      </div>
                      <div className="advice-content-wrap">
                        <h4>{sec.advice.title || "Lời khuyên dinh dưỡng từ ViDairy"}</h4>
                        <p>{sec.advice.content}</p>
                      </div>
                    </div>
                  )}
                </section>
              ))
            ) : Array.isArray(article.content) ? (
              /* Trường hợp 2: Mảng các đoạn văn bản */
              article.content.map((p, idx) => (
                <p key={idx} className="article-paragraph">
                  {p}
                </p>
              ))
            ) : typeof article.content === "string" && article.content ? (
              /* Trường hợp 3: Chuỗi văn bản phân tách bằng dòng trống */
              article.content
                .split("\n\n")
                .filter(Boolean)
                .map((p, idx) => (
                  <p key={idx} className="article-paragraph">
                    {p}
                  </p>
                ))
            ) : (
              /* Mặc định hiển thị summary nếu không có content */
              <p className="article-paragraph">{article.summary}</p>
            )}
          </div>

          {/* Thẻ chủ đề (Tags) */}
          {Array.isArray(article.tags) && article.tags.length > 0 && (
            <div className="article-tags-section">
              <span className="tags-label">
                <i className="bi bi-tags-fill"></i> Chủ đề:
              </span>
              {article.tags.map((tag, idx) => (
                <Link
                  key={idx}
                  to="/news"
                  className="article-tag-pill"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Hộp thông tin chuyên gia / Tác giả */}
          <div className="author-bio-card">
            <img
              src={authorAvatar}
              alt={article.author || "Tác giả"}
              className="bio-avatar"
            />
            <div className="bio-details">
              <h4>{article.author || "Chuyên gia Dinh dưỡng ViDairy"}</h4>
              <div className="bio-role">
                <i className="bi bi-patch-check-fill text-primary"></i>{" "}
                {article.authorRole || "Hội đồng Cố vấn Y khoa & Dinh dưỡng"}
              </div>
              <p>
                Bài viết được kiểm duyệt chuyên môn bởi Hội đồng Khoa học ViDairy,
                mang đến kiến thức chuẩn y khoa vì sức khỏe của cả gia đình.
              </p>
            </div>
          </div>
        </article>

        {/* ================= CỘT PHẢI: SIDEBAR THÔNG TIN ================= */}
        <aside className="article-sidebar">
          {/* Card 1: Bài viết liên quan cùng chuyên mục */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">
              <i className="bi bi-journal-text"></i>
              <span>Bài viết cùng chuyên mục</span>
            </h3>
            <div className="sidebar-related-list">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="sidebar-related-item"
                >
                  <img
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="sidebar-related-img"
                  />
                  <div className="sidebar-related-info">
                    <h4 className="item-title">{item.title}</h4>
                    <span className="item-date">
                      <i className="bi bi-calendar3"></i> {item.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Card 2: Sản phẩm khuyên dùng */}
          {recommendedProducts.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">
                <i className="bi bi-bag-check-fill"></i>
                <span>Sản phẩm khuyên dùng</span>
              </h3>
              <div className="recommended-products-list">
                {recommendedProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    to={`/product/${prod.id}`}
                    className="recommended-product-card"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="recommended-prod-img"
                    />
                    <div className="recommended-prod-info">
                      <h4 className="recommended-prod-name">{prod.name}</h4>
                      <span className="recommended-prod-price">
                        {formatCurrency(prod.price)}
                      </span>
                      <div className="recommended-prod-btn">
                        <span>Xem chi tiết</span>
                        <i className="bi bi-arrow-right-short"></i>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Card 3: Banner Hotline tư vấn miễn phí */}
          <div className="sidebar-hotline-card">
            <div className="hotline-icon">
              <i className="bi bi-headset"></i>
            </div>
            <h4>Cần tư vấn dinh dưỡng?</h4>
            <p>
              Đội ngũ bác sĩ và dược sĩ ViDairy sẵn sàng giải đáp mọi thắc mắc của bạn hoàn toàn miễn phí.
            </p>
            <a href="tel:0989584592" className="btn-sidebar-call">
              <i className="bi bi-telephone-fill"></i>
              <span>0989 584 592</span>
            </a>
          </div>
        </aside>
      </div>

      {/* 3. KHỐI BÀI VIẾT LIÊN QUAN DƯỚI CHÂN TRANG */}
      {relatedArticles.length > 0 && (
        <section className="bottom-related-section">
          <h2 className="bottom-related-title">Bài Viết Liên Quan Khác</h2>
          <div className="bottom-related-grid">
            {relatedArticles.map((relItem) => (
              <CardNew key={relItem.id} news={relItem} />
            ))}
          </div>

          <div className="bottom-actions-row">
            <Link to="/news" className="btn-back-to-news">
              <i className="bi bi-arrow-left"></i>
              <span>Xem tất cả bài viết tin tức</span>
            </Link>
          </div>
        </section>
      )}

      {/* Toast thông báo đã sao chép liên kết */}
      {copiedToast && (
        <div className="toast-copied" role="alert">
          <i className="bi bi-check-circle-fill"></i>
          <span>Đã sao chép liên kết bài viết vào bộ nhớ đệm!</span>
        </div>
      )}
    </div>
  );
}
