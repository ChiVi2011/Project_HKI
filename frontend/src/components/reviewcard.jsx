import "../style/card.css";
export default function ReviewCard({
  name = "NGUYỄN CHÍ VĨ",
  role = "Khách hàng xác thực",
  avatar = "",
  rating = 5,
  comment = "Sản phẩm chất lượng tốt.",
}) {
  const STARS = [1, 2, 3, 4, 5];
  const safeRating = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  return (
    <div className="review-card">
      <div className="review-quote-icon">
        <i className="bi bi-quote"></i>
      </div>
      <div
        className="review-stars"
        aria-label={`Đánh giá ${safeRating} trên 5 sao`}
      >
        {STARS.map((star) => {
          return (
            <i
              key={star}
              className={`bi ${star <= safeRating ? "bi-star-fill star-active" : "bi-star star-inactive"}`}
            />
          );
        })}
      </div>

      <div className="review-comment">
        <p>{comment}</p>
      </div>

      <div className="review-user">
        <div className="avatarimg">
          {avatar ? (
            <img src={avatar} alt={name} className="review-avatar" />
          ) : (
            <div className="review-avatar default-avatar-icon">
              <i className="bi bi-person-fill"></i>
            </div>
          )}
        </div>
        <div className="review-user-info">
          <h4 className="review-user-name">{name}</h4>
          <span className="review-user-role">
            <i className="bi bi-patch-check-fill"></i>
            <span>{role}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
