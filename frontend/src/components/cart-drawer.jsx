import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import productService from "../services/productService";
import "../style/cart-drawer.css";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    setQuantityDirect,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const formatPrice = (amount) => {
    return (amount || 0).toLocaleString("vi-VN") + "đ";
  };

  const originalTotalPrice = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0,
  );
  const discountAmount = Math.max(0, originalTotalPrice - totalPrice);
  const finalTotal = Math.max(0, totalPrice - voucherDiscount);

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-wrapper">
      {/* Lớp nền mờ Backdrop */}
      <div
        className="cart-backdrop"
        onClick={closeCart}
        title="Bấm để đóng giỏ hàng"
      />

      {/* Khung trượt góc phải */}
      <aside className="cart-drawer-panel" aria-label="Khung giỏ hàng góc phải">
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="header-css"></div>
          <div className="cart-header-title-wrap">
            <h3>Giỏ Hàng</h3>
            <button
              type="button"
              className="cart-btn-close"
              onClick={closeCart}
              title="Đóng giỏ hàng"
              aria-label="Đóng giỏ hàng"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        {/* Danh sách sản phẩm trong giỏ */}
        <div className="cart-drawer-body">
          {cartItems.length > 0 ? (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.volume}`}
                  className="cart-item-card"
                >
                  <div className="cart-item-left">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-center">
                    <Link
                      to={`/product/${item.id}`}
                      onClick={closeCart}
                      className="cart-item-name-link"
                    >
                      <h4 className="cart-item-name">{item.name}</h4>
                    </Link>
                    <div className="cart-item-details">
                      <div className="cart-item-volume-tag">
                        <span>Phân loại: {item.volume}</span>
                      </div>
                    </div>
                    <div className="cart-item-actions-row">
                      <div className="qty-stepper">
                        <button
                          type="button"
                          className="qty-btn minus"
                          onClick={() =>
                            updateQuantity(item.id, item.volume, -1)
                          }
                          title="Giảm 1"
                          aria-label="Giảm 1"
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="qty-number-input"
                          value={item.quantity}
                          min={1}
                          max={50}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== "") {
                              setQuantityDirect(item.id, item.volume, val);
                            }
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (isNaN(val) || val < 1) {
                              setQuantityDirect(item.id, item.volume, 1);
                            } else if (val > 50) {
                              setQuantityDirect(item.id, item.volume, 50);
                            }
                          }}
                          title="Nhập số lượng (Tối đa 50)"
                        />
                        <button
                          type="button"
                          className="qty-btn plus"
                          onClick={() =>
                            updateQuantity(item.id, item.volume, 1)
                          }
                          disabled={item.quantity >= 50}
                          title={item.quantity >= 50 ? "Tối đa 50 hộp" : "Tăng 1"}
                          aria-label="Tăng 1"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <button
                      type="button"
                      className="cart-item-remove-btn"
                      onClick={() => removeFromCart(item.id, item.volume)}
                      title="Xóa khỏi giỏ hàng"
                      aria-label="Xóa sản phẩm"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="cart-item-original-price">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cart-empty-state">
              <div className="empty-cart-icon">
                <i className="bi bi-bag-x"></i>
              </div>
              <h4>Giỏ hàng của bạn đang trống</h4>
              <p>
                Hãy khám phá các sản phẩm dinh dưỡng chất lượng cao từ ViDairy
                nhé!
              </p>
              <Link
                to="/products"
                onClick={closeCart}
                className="btn-continue-shopping"
              >
                <span>Khám phá sản phẩm ngay</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          )}
        </div>

        {/* Footer tổng tiền & Thanh toán theo thiết kế */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span className="summary-label">Tổng tiền hàng</span>
              <span className="summary-val">
                {formatPrice(
                  originalTotalPrice > 0 ? originalTotalPrice : totalPrice,
                )}
              </span>
            </div>

            <div className="cart-summary-row">
              <span className="summary-label">Giảm giá sản phẩm</span>
              <span className="summary-val discount-val">
                {discountAmount > 0 ? `-${formatPrice(discountAmount)}` : "-0đ"}
              </span>
            </div>

            <div className="cart-summary-row">
              <span className="summary-label">Voucher giảm giá</span>
              <span className="summary-val">
                {voucherDiscount > 0
                  ? `-${formatPrice(voucherDiscount)}`
                  : "0đ"}
              </span>
            </div>

            {/* Khung Thêm Voucher Giảm Giá */}
            <div
              className="cart-voucher-box"
              onClick={async () => {
                const code = prompt(
                  "Nhập mã Voucher giảm giá (Ví dụ: VIDAIRY10, VIDAIRY50, FREESHIP):",
                );
                if (code && code.trim()) {
                  try {
                    const res = await productService.validateCoupon(code.trim(), totalPrice);
                    if (res.success) {
                      setVoucherDiscount(res.data.discount);
                      alert(res.message || `Áp dụng thành công voucher ${res.data.code}!`);
                    } else {
                      alert(res.message || "Mã voucher không hợp lệ hoặc đã hết hạn!");
                    }
                  } catch (err) {
                    alert("Lỗi khi kiểm tra mã voucher: " + err.message);
                  }
                }
              }}
              title="Bấm để thêm voucher giảm giá"
            >
              <div className="voucher-icon-box">
                <i className="bi bi-ticket-perforated"></i>
              </div>
              <div className="voucher-text-box">
                <span>
                  {voucherDiscount > 0
                    ? `Đã áp dụng voucher (-${formatPrice(voucherDiscount)})`
                    : "Thêm voucher để giảm giá"}
                </span>
                <i className="bi bi-plus-lg"></i>
              </div>
            </div>

            {/* Dòng Tổng cộng */}
            <div className="cart-summary-row total-row">
              <span className="summary-label total-label">Tổng</span>
              <span className="summary-total-price">
                {formatPrice(finalTotal)}
              </span>
            </div>

            <div className="cart-footer-buttons">
              <button
                type="button"
                className="btn-checkout-now"
                onClick={() => {
                  closeCart();
                  navigate("/order");
                }}
              >
                <span>TIẾN HÀNH ĐẶT HÀNG</span>
                <i className="bi bi-shield-check"></i>
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
