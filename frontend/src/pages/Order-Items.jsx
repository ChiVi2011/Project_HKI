import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import productService from "../services/productService";
import "../style/order.css";

const VIETNAM_CITIES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

const SAMPLE_WARDS = [
  "Phường Bến Nghé",
  "Phường Bến Thành",
  "Phường Phạm Ngũ Lão",
  "Phường Cầu Ông Lãnh",
  "Phường Đa Kao",
  "Phường Tân Định",
  "Phường Tràng Tiền",
  "Phường Hàng Bạc",
  "Phường Hàng Đào",
  "Phường Hàng Gai",
  "Phường Cửa Đông",
  "Phường Dịch Vọng",
  "Phường Dịch Vọng Hậu",
  "Phường Quan Hoa",
  "Phường Yên Hòa",
  "Phường Trung Hòa",
  "Phường Mễ Trì",
  "Phường Mỹ Đình 1",
  "Phường Mỹ Đình 2",
  "Phường Xuân Tảo",
  "Phường Cổ Nhuế 1",
  "Phường Cổ Nhuế 2",
  "Phường Linh Trung",
  "Phường Linh Chiểu",
  "Phường Hiệp Phú",
  "Phường Thảo Điền",
  "Phường An Phú",
  "Phường Hải Châu 1",
  "Phường Hải Châu 2",
  "Phường Thạch Thang",
  "Phường Hòa Cường Bắc",
  "Phường Hòa Cường Nam",
  "Xã Tân Triều",
  "Xã An Khánh",
  "Xã Kim Chung",
  "Xã Thanh Liệt",
  "Xã Bình Hưng",
  "Xã Phong Phú",
  "Xã Vĩnh Lộc A",
  "Xã Vĩnh Lộc B",
  "Thị trấn Trâu Quỳ",
  "Thị trấn Nhà Bè",
  "Thị trấn Cần Thạnh",
];

export default function Order() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("gtn");
  const [fullName, setFullName] = useState(user?.FullName || "");
  const [phone, setPhone] = useState(user?.Phone || "");
  const [address, setAddress] = useState(user?.Address || "");
  const [note, setNote] = useState("");

  const [selectedCity, setSelectedCity] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const cityDropdownRef = useRef(null);

  const [selectedWard, setSelectedWard] = useState("");
  const [isWardOpen, setIsWardOpen] = useState(false);
  const [wardSearchTerm, setWardSearchTerm] = useState("");
  const wardDropdownRef = useRef(null);

  // Chi nhánh cửa hàng
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  // Hóa đơn VAT
  const [isVatRequested, setIsVatRequested] = useState(false);
  const [vatCompany, setVatCompany] = useState("");
  const [vatTaxId, setVatTaxId] = useState("");
  const [vatAddress, setVatAddress] = useState("");
  const [vatEmail, setVatEmail] = useState("");

  // Thanh toán & Voucher
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ text: "", isError: false });
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tải danh sách chi nhánh cửa hàng từ API
  useEffect(() => {
    productService
      .getBranches()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setBranches(res.data);
          setSelectedBranch(res.data[0].name);
        }
      })
      .catch((err) => console.warn("Lỗi tải chi nhánh:", err));
  }, []);

  const shippingFee = totalPrice >= 300000 || activeTab === "ch" ? 0 : 30000;
  const finalTotal = Math.max(0, totalPrice + shippingFee - couponDiscount);

  // Kiểm tra mã voucher giảm giá
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMsg({ text: "Vui lòng nhập mã ưu đãi.", isError: true });
      return;
    }
    setIsCheckingCoupon(true);
    setCouponMsg({ text: "", isError: false });
    try {
      const res = await productService.validateCoupon(couponCode, totalPrice);
      if (res.success) {
        setCouponDiscount(res.data.discount);
        setCouponMsg({ text: res.message || "Áp dụng thành công!", isError: false });
      } else {
        setCouponDiscount(0);
        setCouponMsg({ text: res.message || "Mã không hợp lệ.", isError: true });
      }
    } catch (err) {
      setCouponDiscount(0);
      setCouponMsg({ text: "Lỗi kết nối kiểm tra mã.", isError: true });
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  // Gửi tạo đơn hàng lên Database MongoDB Atlas
  const handleSubmitOrder = async (e) => {
    if (e) e.preventDefault();
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.");
      return;
    }
    if (!fullName.trim() || !phone.trim()) {
      alert("Vui lòng điền đầy đủ Họ và Tên và Số điện thoại nhận hàng.");
      return;
    }
    if (activeTab === "gtn" && !address.trim()) {
      alert("Vui lòng điền địa chỉ giao hàng cụ thể.");
      return;
    }
    if (isVatRequested && (!vatCompany.trim() || !vatTaxId.trim())) {
      alert("Vui lòng điền đầy đủ Tên công ty và Mã số thuế để xuất hóa đơn VAT.");
      return;
    }

    setIsSubmitting(true);
    try {
      const shippingAddress =
        activeTab === "gtn"
          ? `${address.trim()}${selectedWard ? `, ${selectedWard}` : ""}${selectedCity ? `, ${selectedCity}` : ""}`
          : `Nhận tại chi nhánh: ${selectedBranch}`;

      const orderPayload = {
        UserID: user?._id || user?.id || null,
        ReceiverName: fullName.trim(),
        ReceiverPhone: phone.trim(),
        ShippingAddress: shippingAddress,
        DeliveryType: activeTab === "gtn" ? "DELIVERY" : "STORE_PICKUP",
        BranchName: activeTab === "ch" ? selectedBranch : "",
        Items: cartItems.map((it) => ({
          ProductID: it.id,
          ProductName: it.name,
          VariantName: it.volume || "Lon tiêu chuẩn",
          Quantity: it.quantity,
          UnitPrice: it.price,
          ImageURL: it.image || "",
        })),
        SubTotal: totalPrice,
        Discount: couponDiscount,
        ShippingFee: shippingFee,
        TotalAmount: finalTotal,
        CouponCode: couponCode.trim().toUpperCase(),
        PaymentMethod:
          paymentMethod === "cod"
            ? "COD"
            : paymentMethod === "banking"
            ? "Banking"
            : paymentMethod === "wallet"
            ? "VNPay"
            : "Thẻ ATM/Visa",
        HasVAT: isVatRequested,
        VATInfo: isVatRequested
          ? {
              Company: vatCompany.trim(),
              TaxId: vatTaxId.trim(),
              Email: vatEmail.trim(),
              Address: vatAddress.trim(),
            }
          : {},
        Note: note.trim(),
      };

      const res = await productService.createOrder(orderPayload);
      if (!res.success) {
        throw new Error(res.message || "Tạo đơn hàng thất bại.");
      }

      clearCart();
      alert(
        `🎉 ĐẶT HÀNG THÀNH CÔNG!\nMã đơn hàng: ${res.data.OrderCode}\nTổng tiền: ${finalTotal.toLocaleString("vi-VN")}đ\nCảm ơn bạn đã tin tưởng ViDairy!`
      );
      navigate("/profile");
    } catch (err) {
      alert("Lỗi khi đặt hàng: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target)
      ) {
        setIsCityOpen(false);
      }
      if (
        wardDropdownRef.current &&
        !wardDropdownRef.current.contains(e.target)
      ) {
        setIsWardOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = VIETNAM_CITIES.filter((city) =>
    city.toLowerCase().includes(citySearchTerm.toLowerCase()),
  );

  const filteredWards = SAMPLE_WARDS.filter((ward) =>
    ward.toLowerCase().includes(wardSearchTerm.toLowerCase()),
  );

  return (
    <div className="order-container">
      <div className="order-left">
        <h1 className="order-page-title">Thanh toán</h1>

        <div className="btn-change-order">
          <div className="btn-change-order-switcher">
            <button
              type="button"
              className={`btn-change-order-btn ${activeTab === "gtn" ? "active" : ""}`}
              onClick={() => setActiveTab("gtn")}
            >
              <i className="bi bi-truck"></i> Giao hàng tận nơi
            </button>
            <button
              type="button"
              className={`btn-change-order-btn ${activeTab === "ch" ? "active" : ""}`}
              onClick={() => setActiveTab("ch")}
            >
              <i className="bi bi-shop"></i> Nhận tại cửa hàng
            </button>
          </div>

          {activeTab === "gtn" && (
            <div className="order-form" style={{ marginTop: "20px" }}>
              <form
                className="order-form-card"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="order-form-section-title">
                  Thông tin nhận hàng
                </label>
                <div className="gtn-user">
                  <input
                    type="text"
                    placeholder="Nhập Họ và Tên *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <label className="order-form-section-title">
                  Địa chỉ nhận hàng
                </label>
                <div className="gtn-address">
                  <input
                    type="text"
                    placeholder="Địa chỉ của bạn (Số nhà, tên đường...) *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="gtn-location-row">
                  <div className="gtn-city" ref={cityDropdownRef}>
                    <div
                      className={`city-select-trigger ${selectedCity ? "has-value" : "placeholder"}`}
                      onClick={() => setIsCityOpen(!isCityOpen)}
                    >
                      <span>{selectedCity || "Chọn Tỉnh / Thành phố"}</span>
                      <i
                        className={`bi ${
                          isCityOpen ? "bi-chevron-up" : "bi-chevron-down"
                        }`}
                        style={{ color: "#23408e" }}
                      ></i>
                    </div>

                    {isCityOpen && (
                      <div className="city-dropdown-menu">
                        <div className="city-search-box">
                          <i className="bi bi-search"></i>
                          <input
                            type="text"
                            placeholder="Tìm kiếm Tỉnh / Thành phố..."
                            value={citySearchTerm}
                            onChange={(e) => setCitySearchTerm(e.target.value)}
                            autoFocus
                          />
                          {citySearchTerm && (
                            <i
                              className="bi bi-x-circle-fill"
                              onClick={() => setCitySearchTerm("")}
                              style={{ cursor: "pointer", color: "#94a3b8" }}
                            ></i>
                          )}
                        </div>

                        <div className="city-options-list">
                          {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <div
                                key={city}
                                className={`dropdown-option-item ${selectedCity === city ? "selected" : ""}`}
                                onClick={() => {
                                  setSelectedCity(city);
                                  setIsCityOpen(false);
                                  setCitySearchTerm("");
                                }}
                              >
                                {city}
                              </div>
                            ))
                          ) : (
                            <div className="dropdown-no-results">
                              Không tìm thấy tỉnh/thành nào
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="WardCode" ref={wardDropdownRef}>
                    <div
                      className={`ward-select-trigger ${selectedWard ? "has-value" : "placeholder"}`}
                      onClick={() => setIsWardOpen(!isWardOpen)}
                    >
                      <span>{selectedWard || "Chọn Phường / Xã"}</span>
                      <i
                        className={`bi ${
                          isWardOpen ? "bi-chevron-up" : "bi-chevron-down"
                        }`}
                        style={{ color: "#23408e" }}
                      ></i>
                    </div>

                    {isWardOpen && (
                      <div className="ward-dropdown-menu">
                        <div className="ward-search-box">
                          <i className="bi bi-search"></i>
                          <input
                            type="text"
                            placeholder="Tìm kiếm Phường / Xã..."
                            value={wardSearchTerm}
                            onChange={(e) => setWardSearchTerm(e.target.value)}
                            autoFocus
                          />
                          {wardSearchTerm && (
                            <i
                              className="bi bi-x-circle-fill"
                              onClick={() => setWardSearchTerm("")}
                              style={{ cursor: "pointer", color: "#94a3b8" }}
                            ></i>
                          )}
                        </div>

                        <div className="ward-options-list">
                          {filteredWards.length > 0 ? (
                            filteredWards.map((ward) => (
                              <div
                                key={ward}
                                className={`dropdown-option-item ${selectedWard === ward ? "selected" : ""}`}
                                onClick={() => {
                                  setSelectedWard(ward);
                                  setIsWardOpen(false);
                                  setWardSearchTerm("");
                                }}
                              >
                                {ward}
                              </div>
                            ))
                          ) : (
                            <div className="dropdown-no-results">
                              Không tìm thấy phường/xã nào
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="gtn-checkbox">
                  <label htmlFor="agreeDeliveryTerms">
                    <input type="checkbox" id="agreeDeliveryTerms" />
                    Tôi đồng ý với điều kiện giao hàng
                  </label>
                </div>
              </form>
            </div>
          )}
          {activeTab === "ch" && (
            <div className="order-form" style={{ marginTop: "20px" }}>
              <div className="order-form-card">
                <label className="order-form-section-title">
                  Thông tin người nhận hàng
                </label>
                <div className="gtn-user">
                  <input
                    type="text"
                    placeholder="Nhập Họ và Tên *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <label className="order-form-section-title" style={{ marginTop: "18px" }}>
                  Chọn chi nhánh cửa hàng ViDairy
                </label>
                <div className="store-branches-list">
                  {branches.map((b) => (
                    <div
                      key={b.code || b._id}
                      className={`store-branch-card ${selectedBranch === b.name ? "selected" : ""}`}
                      onClick={() => setSelectedBranch(b.name)}
                    >
                      <div className="store-branch-radio">
                        <input
                          type="radio"
                          name="selectedStore"
                          checked={selectedBranch === b.name}
                          onChange={() => setSelectedBranch(b.name)}
                        />
                      </div>
                      <div className="store-branch-info">
                        <h4>{b.name}</h4>
                        <p><i className="bi bi-geo-alt-fill text-danger"></i> {b.address}, {b.city}</p>
                        <span className="store-branch-hours">
                          <i className="bi bi-clock-fill"></i> {b.hours} • Hotline: {b.phone}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Phần Hóa đơn VAT */}
        <div className="order-vat-section">
          <div
            className="order-vat-header"
            onClick={() => setIsVatRequested(!isVatRequested)}
          >
            <div className="order-vat-title-wrap">
              <i className="bi bi-receipt-cutoff"></i>
              <div>
                <h3 className="order-vat-title">Hóa đơn công ty (VAT)</h3>
                <span className="order-vat-subtitle">
                  Hóa đơn điện tử theo quy định của Bộ Tài Chính
                </span>
              </div>
            </div>
            <label
              className="order-vat-switch"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                id="vatCheckbox"
                checked={isVatRequested}
                onChange={(e) => setIsVatRequested(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {isVatRequested && (
            <div className="order-vat-form">
              <div className="vat-input-group">
                <label>
                  Tên công ty / Đơn vị <span className="req">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên đầy đủ của doanh nghiệp / tổ chức"
                  value={vatCompany}
                  onChange={(e) => setVatCompany(e.target.value)}
                />
              </div>

              <div className="vat-input-row">
                <div className="vat-input-group flex-1">
                  <label>
                    Mã số thuế <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 0101234567"
                    value={vatTaxId}
                    onChange={(e) => setVatTaxId(e.target.value)}
                  />
                </div>
                <div className="vat-input-group flex-1">
                  <label>
                    Email nhận hóa đơn <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="ketoan@congty.com"
                    value={vatEmail}
                    onChange={(e) => setVatEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="vat-input-group">
                <label>
                  Địa chỉ công ty (theo GPKD) <span className="req">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Địa chỉ trụ sở chính đăng ký kinh doanh"
                  value={vatAddress}
                  onChange={(e) => setVatAddress(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        {/* Phần Phương thức thanh toán */}
        <div className="order-payment-section">
          <div className="payment-section-header">
            <h3 className="order-form-section-title">Phương thức thanh toán</h3>
            <span className="payment-section-subtitle">
              Vui lòng chọn hình thức thanh toán thuận tiện nhất
            </span>
          </div>

          <div className="payment-methods-list">
            {/* 1. COD */}
            <div
              className={`payment-method-card ${paymentMethod === "cod" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="payment-method-radio-wrap">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="pay_cod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
              </div>
              <div className="payment-method-info">
                <h4 className="payment-method-name">
                  Thanh toán khi nhận hàng (COD)
                </h4>
                <p className="payment-method-desc">
                  Thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng khi
                  nhận
                </p>
              </div>
            </div>

            {/* 2. Chuyển khoản QR */}
            <div
              className={`payment-method-card ${paymentMethod === "banking" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("banking")}
            >
              <div className="payment-method-radio-wrap">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="pay_banking"
                  value="banking"
                  checked={paymentMethod === "banking"}
                  onChange={() => setPaymentMethod("banking")}
                />
              </div>
              <div className="payment-method-info">
                <div className="payment-method-badge-row">
                  <h4 className="payment-method-name">
                    Chuyển khoản Ngân hàng (VietQR 24/7)
                  </h4>
                </div>
                <p className="payment-method-desc">
                  Quét mã QR qua mọi ứng dụng ngân hàng nhanh chóng & hoàn toàn
                  miễn phí
                </p>
              </div>
            </div>

            {/* 3. Ví điện tử */}
            <div
              className={`payment-method-card ${paymentMethod === "wallet" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("wallet")}
            >
              <div className="payment-method-radio-wrap">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="pay_wallet"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={() => setPaymentMethod("wallet")}
                />
              </div>
              <div className="payment-method-info">
                <h4 className="payment-method-name">
                  Ví điện tử (MoMo / VNPay / ZaloPay)
                </h4>
                <p className="payment-method-desc">
                  Liên kết tài khoản ví điện tử thanh toán an toàn, bảo mật cao
                </p>
              </div>
            </div>

            {/* 4. Thẻ ATM / Visa / Mastercard */}
            <div
              className={`payment-method-card ${paymentMethod === "card" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="payment-method-radio-wrap">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="pay_card"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
              </div>
              <div className="payment-method-info">
                <h4 className="payment-method-name">
                  Thẻ ATM Nội địa / Thẻ Quốc tế (Visa, Mastercard, JCB)
                </h4>
                <p className="payment-method-desc">
                  Thanh toán qua cổng Napas hoặc thẻ tín dụng / ghi nợ quốc tế
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-right">
        <h1 className="order-page-title">Kiện hàng</h1>
        <div className="order-summary-card">
          <div className="order-summary-header">
            <h3>Đơn hàng của bạn</h3>
            <span>{cartItems.length} sản phẩm</span>
          </div>

          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <i className="bi bi-cart-x" style={{ fontSize: "42px", color: "#94a3b8" }}></i>
              <p style={{ color: "#64748b", margin: "10px 0 16px" }}>Giỏ hàng chưa có sản phẩm nào</p>
              <Link to="/products" className="btn btn-primary" style={{ background: "#23408e", border: "none", borderRadius: "8px", padding: "8px 20px" }}>
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            <>
              <div className="order-items-scroll">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.volume}`} className="order-item-mini">
                    <img src={item.image} alt={item.name} />
                    <div className="order-item-mini-info">
                      <h4>{item.name}</h4>
                      <p>Quy cách: {item.volume} • SL: {item.quantity}</p>
                    </div>
                    <div className="order-item-mini-price">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                ))}
              </div>

              {/* Ô Nhập Voucher */}
              <div className="order-coupon-wrap">
                <div className="order-coupon-input-group">
                  <input
                    type="text"
                    placeholder="Mã ưu đãi (VD: VIDAIRY10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <button type="button" onClick={handleApplyCoupon} disabled={isCheckingCoupon}>
                    {isCheckingCoupon ? "Kiểm tra..." : "Áp dụng"}
                  </button>
                </div>
                {couponMsg.text && (
                  <p className={`coupon-msg ${couponMsg.isError ? "error" : "success"}`}>
                    <i className={`bi ${couponMsg.isError ? "bi-exclamation-circle" : "bi-check-circle"}`}></i>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Bảng giá chi tiết */}
              <div className="order-breakdown">
                <div className="order-price-line">
                  <span>Tạm tính:</span>
                  <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="order-price-line">
                  <span>Phí giao hàng:</span>
                  <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="order-price-line discount">
                    <span>Mã ưu đãi giảm:</span>
                    <span>-{couponDiscount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                <div className="order-price-line total-line">
                  <span>Tổng thanh toán:</span>
                  <span className="grand-total">{finalTotal.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              {/* Ghi chú đơn hàng */}
              <textarea
                className="order-note-input"
                rows="2"
                placeholder="Ghi chú thêm cho người giao hàng (Ví dụ: Giao giờ hành chính, gọi trước khi đến...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>

              <div style={{ marginTop: "18px" }}>
                <button
                  type="button"
                  className="btn-submit-order-final"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      <span>Đang tạo đơn hàng...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check"></i>
                      <span>XÁC NHẬN ĐẶT HÀNG</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
