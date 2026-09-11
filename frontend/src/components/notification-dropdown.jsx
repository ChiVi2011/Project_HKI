import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style/notification.css";

function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [copiedCode, setCopiedCode] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Đóng khi click ra ngoài hoặc bấm Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // Kiểm tra xem click có bắt nguồn từ nút bell trên header không (nút cha)
        const bellBtn = document.querySelector(".header-notification-btn");
        if (bellBtn && bellBtn.contains(e.target)) {
          return;
        }
        onClose();
      }
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Lọc theo tab
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  // Tính thời gian hiển thị tương đối
  const formatTimeAgo = (dateInput) => {
    if (!dateInput) return "Vừa xong";
    const now = new Date();
    const date = new Date(dateInput);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return "Hôm qua";
    return `${diffDays} ngày trước`;
  };

  // Sao chép mã coupon
  const handleCopyCode = (e, code) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  // Click vào thông báo
  const handleItemClick = (item) => {
    const id = item._id || item.id;
    if (!item.isRead && onMarkAsRead) {
      onMarkAsRead(id);
    }
    if (item.link) {
      onClose();
      navigate(item.link);
    }
  };

  // Render icon theo loại
  const renderIcon = (type) => {
    switch (type) {
      case "promotion":
        return (
          <div className="notif-icon-box promo-icon">
            <i className="bi bi-gift-fill"></i>
          </div>
        );
      case "order":
        return (
          <div className="notif-icon-box order-icon">
            <i className="bi bi-truck"></i>
          </div>
        );
      case "news":
        return (
          <div className="notif-icon-box news-icon">
            <i className="bi bi-newspaper"></i>
          </div>
        );
      default:
        return (
          <div className="notif-icon-box sys-icon">
            <i className="bi bi-bell-fill"></i>
          </div>
        );
    }
  };

  return (
    <div
      className="notification-dropdown-wrapper"
      ref={dropdownRef}
      role="dialog"
      aria-label="Hộp thông báo"
    >
      {/* Tam giác chỉ vị trí chuông */}
      <div className="dropdown-arrow"></div>

      {/* Header */}
      <div className="notif-header">
        <div className="notif-header-title">
          <i className="bi bi-bell-fill notif-title-icon"></i>
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <span className="notif-unread-pill">{unreadCount} mới</span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="notif-mark-all-btn"
            onClick={onMarkAllAsRead}
            title="Đánh dấu tất cả thông báo là đã đọc"
          >
            <i className="bi bi-check2-all"></i>
            <span>Đã đọc tất cả</span>
          </button>
        )}
      </div>

      {/* Tabs lọc */}
      <div className="notif-tabs">
        <button
          type="button"
          className={`notif-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả
        </button>
        <button
          type="button"
          className={`notif-tab ${activeTab === "promotion" ? "active" : ""}`}
          onClick={() => setActiveTab("promotion")}
        >
          Ưu đãi
        </button>
        <button
          type="button"
          className={`notif-tab ${activeTab === "order" ? "active" : ""}`}
          onClick={() => setActiveTab("order")}
        >
          Đơn hàng
        </button>
        <button
          type="button"
          className={`notif-tab ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          Tin tức
        </button>
      </div>

      {/* Danh sách thông báo */}
      <div className="notif-body">
        {filteredNotifications.length === 0 ? (
          <div className="notif-empty-state">
            <i className="bi bi-bell-slash notif-empty-icon"></i>
            <p className="notif-empty-text">Hiện chưa có thông báo nào trong mục này</p>
            <span className="notif-empty-sub">
              Các thông tin khuyến mãi & đơn hàng mới sẽ xuất hiện tại đây
            </span>
          </div>
        ) : (
          <div className="notif-list">
            {filteredNotifications.map((item) => {
              const id = item._id || item.id;
              return (
                <div
                  key={id}
                  className={`notif-item ${!item.isRead ? "unread" : "read"}`}
                  onClick={() => handleItemClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleItemClick(item);
                  }}
                >
                  {/* Icon */}
                  {renderIcon(item.type)}

                  {/* Nội dung */}
                  <div className="notif-content">
                    <div className="notif-top-row">
                      <h4 className="notif-item-title">{item.title}</h4>
                      {!item.isRead && <span className="notif-unread-dot" title="Chưa đọc"></span>}
                    </div>

                    <p className="notif-item-message">{item.message}</p>

                    {/* Voucher Code nếu có */}
                    {item.couponCode && (
                      <div className="notif-coupon-wrapper">
                        <span className="notif-coupon-code">{item.couponCode}</span>
                        {item.couponCode === "NEWMEMBER" && (
                          <span className="notif-welcome-tag">✨ Quà tân thủ</span>
                        )}
                        <button
                          type="button"
                          className={`notif-copy-btn ${copiedCode === item.couponCode ? "copied" : ""}`}
                          onClick={(e) => handleCopyCode(e, item.couponCode)}
                          title="Sao chép mã giảm giá"
                        >
                          <i
                            className={
                              copiedCode === item.couponCode
                                ? "bi bi-check2"
                                : "bi bi-clipboard"
                            }
                          ></i>
                          <span>
                            {copiedCode === item.couponCode ? "Đã chép" : "Chép mã"}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Footer thông báo: thời gian & nút hành động */}
                    <div className="notif-item-footer">
                      <span className="notif-time">
                        <i className="bi bi-clock"></i> {formatTimeAgo(item.createdAt)}
                      </span>
                      {item.actionText && (
                        <span className="notif-action-link">
                          {item.actionText} <i className="bi bi-chevron-right"></i>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Dropdown */}
      <div className="notif-footer">
        <span>ViDairy • Đồng hành dinh dưỡng cùng gia đình Việt</span>
      </div>
    </div>
  );
}

export default NotificationDropdown;
