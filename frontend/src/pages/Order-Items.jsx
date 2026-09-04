import { useState, useRef, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState("gtn");
  const [selectedCity, setSelectedCity] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const cityDropdownRef = useRef(null);

  const [selectedWard, setSelectedWard] = useState("");
  const [isWardOpen, setIsWardOpen] = useState(false);
  const [wardSearchTerm, setWardSearchTerm] = useState("");
  const wardDropdownRef = useRef(null);

  const [isVatRequested, setIsVatRequested] = useState(false);
  const [vatCompany, setVatCompany] = useState("");
  const [vatTaxId, setVatTaxId] = useState("");
  const [vatAddress, setVatAddress] = useState("");
  const [vatEmail, setVatEmail] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cod");

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
                  <input type="text" placeholder="Nhập Họ và Tên" />
                  <input type="tel" placeholder="Nhập số điện thoại" />
                </div>

                <label className="order-form-section-title">
                  Địa chỉ nhận hàng
                </label>
                <div className="gtn-address">
                  <input
                    type="text"
                    placeholder="Địa chỉ của bạn (Số nhà, tên đường...)"
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
            <div className="ch-form">
              <div className="ch-403-card">
                <div className="ch-403-header-badge">
                  <i className="bi bi-shield-exclamation"></i>
                  <span>TẠM THỜI CHƯA KHẢ DỤNG</span>
                </div>

                <div className="ch-403-illustration">
                  <div className="ch-403-icon-wrapper">
                    <i className="bi bi-shop-window"></i>
                  </div>
                </div>

                <div className="ch-403-text-wrap">
                  <h3 className="ch-403-title">
                    403 - Chưa Có Thông Tin Cửa Hàng
                  </h3>
                  <p className="ch-403-desc">
                    Hệ thống điểm bán trực tiếp của <strong>ViDairy</strong> tại
                    khu vực này đang được nâng cấp cơ sở dữ liệu.
                  </p>
                  <div className="ch-403-tip-box">
                    <i className="bi bi-info-circle-fill"></i>
                    <span>
                      Để không làm gián đoạn đơn hàng, vui lòng chọn hình thức{" "}
                      <strong>Giao hàng tận nơi</strong>. ViDairy hỗ trợ giao
                      nhanh toàn quốc!
                    </span>
                  </div>
                </div>

                <div className="ch-403-actions">
                  <button
                    type="button"
                    className="btn-switch-gtn"
                    onClick={() => setActiveTab("gtn")}
                  >
                    <i className="bi bi-truck"></i> Chuyển sang Giao hàng tận
                    nơi
                  </button>

                  <div className="ch-403-support">
                    <span>Cần hỗ trợ đặt hàng nhanh?</span>
                    <a href="tel:0989584592" className="ch-support-link">
                      <i className="bi bi-telephone-fill"></i> 0989 584 592
                    </a>
                  </div>
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
      </div>
    </div>
  );
}
