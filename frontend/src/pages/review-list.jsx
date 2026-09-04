import { useState, useEffect } from "react";
import ReviewCard from "../components/reviewcard";
import "../style/card.css";

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: "Nguyễn Thị Minh Anh",
    role: "Mẹ bỉm sữa (Bé 2 tuổi)",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Bé nhà mình uống sữa ViDairy hợp lắm, không bị táo bón mà tiêu hóa cực tốt. Sữa thơm ngọt thanh tự nhiên, bé chịu hợp tác uống mỗi ngày!",
  },
  {
    id: 2,
    name: "Trần Văn Hoàng",
    role: "Khách hàng mua định kỳ",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Sản phẩm đóng gói rất cẩn thận, hạn sử dụng luôn mới tinh. Dịch vụ giao hàng tận nhà của ViDairy siêu nhanh và nhân viên rất lịch sự.",
  },
  {
    id: 3,
    name: "Phạm Lê Hương",
    role: "Khách hàng thân thiết",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Cả nhà mình từ ông bà đến các cháu đều tin dùng các dòng sữa của ViDairy. Chất lượng chuẩn sạch, vị thanh mát dễ uống vô cùng.",
  },
  {
    id: 4,
    name: "Lê Quốc Bảo",
    role: "Khách hàng xác thực",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Dòng sữa hạt dinh dưỡng ViDairy uống mỗi sáng cực kỳ năng lượng và thơm béo. Rất phù hợp cho người ăn uống lành mạnh như mình.",
  },
  {
    id: 5,
    name: "Vũ Hoàng Yến",
    role: "Khách hàng VIP",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Giá cả hợp lý mà chất lượng dinh dưỡng cao vượt trội. Mình đã giới thiệu cho rất nhiều đồng nghiệp và bạn bè cùng sử dụng.",
  },
];

export default function ReviewList({ reviews = DEFAULT_REVIEWS }) {
  const [activeIndex, setActiveIndex] = useState(2); // Mặc định chọn phần tử ở giữa
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const ITEM_WIDTH = 380; // Chiều rộng mỗi thẻ card (kèm padding)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  // Tự động chuyển review sau 4 giây (khi không rê chuột vào)
  useEffect(() => {
    if (isPaused || isDragging) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused, isDragging]);

  // Xử lý vuốt / kéo trên Mobile (Touch Events)
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setDragOffset(currentX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 50) {
      handlePrev();
    } else if (dragOffset < -50) {
      handleNext();
    }
    setDragOffset(0);
  };

  // Xử lý kéo thả bằng chuột trên PC (Mouse Events)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - startX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 50) {
      handlePrev();
    } else if (dragOffset < -50) {
      handleNext();
    }
    setDragOffset(0);
  };

  return (
    <div
      className="review-carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        if (isDragging) handleMouseUp();
      }}
    >
      {/* Nút lùi về trước */}
      <button
        type="button"
        className="review-nav-btn review-nav-prev"
        onClick={handlePrev}
        aria-label="Đánh giá trước"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      {/* Nút chuyển tiếp */}
      <button
        type="button"
        className="review-nav-btn review-nav-next"
        onClick={handleNext}
        aria-label="Đánh giá kế tiếp"
      >
        <i className="bi bi-chevron-right"></i>
      </button>

      {/* Khung chứa các slide đánh giá */}
      <div
        className="review-carousel-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="review-carousel-track"
          style={{
            transform: `translateX(calc(50% - ${
              activeIndex * ITEM_WIDTH + ITEM_WIDTH / 2
            }px + ${dragOffset}px))`,
            transition: isDragging
              ? "none"
              : "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {reviews.map((review, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={review.id || index}
                className={`review-slide-item ${isActive ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
              >
                <ReviewCard
                  name={review.name}
                  role={review.role}
                  avatar={review.avatar}
                  rating={review.rating}
                  comment={review.comment}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Chấm tròn điều hướng (Dots indicator) */}
      <div className="review-dots">
        {reviews.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`review-dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Chuyển đến đánh giá ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
