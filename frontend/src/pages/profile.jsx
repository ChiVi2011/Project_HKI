import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/profile.css";

export default function Profile() {
  const { user, token, isLoggedIn, isAdmin, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'orders' | 'admin'
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Phone: "",
    Gender: true,
    DateOfBirth: "",
    Address: "",
  });

  // State thông báo & loading
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // Dữ liệu đơn hàng của tôi
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Dữ liệu danh sách người dùng dành cho Admin
  const [adminUsers, setAdminUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [systemActive, setSystemActive] = useState(true);

  // Bảo vệ route: nếu chưa đăng nhập thì chuyển hướng sang /login
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Nạp thông tin user vào form
  useEffect(() => {
    if (user) {
      setFormData({
        FullName: user.FullName || "",
        Email: user.Email || "",
        Phone: user.Phone || "",
        Gender: user.Gender !== undefined ? user.Gender : true,
        DateOfBirth: user.DateOfBirth ? user.DateOfBirth.slice(0, 10) : "",
        Address: user.Address || "",
      });
    }
  }, [user]);

  // Tự động xóa thông báo sau 4 giây
  useEffect(() => {
    if (!alert.message) return;
    const timer = setTimeout(() => setAlert({ type: "", message: "" }), 4000);
    return () => clearTimeout(timer);
  }, [alert]);

  // 1. Tải danh sách đơn hàng khi chuyển sang tab 'orders'
  useEffect(() => {
    if (activeTab === "orders" && token) {
      loadOrders();
    }
  }, [activeTab, token]);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch("http://localhost:3000/api/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch (err) {
      console.warn("Lỗi tải đơn hàng:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // 2. Tải danh sách người dùng khi Admin mở tab 'admin'
  useEffect(() => {
    if (activeTab === "admin" && isAdmin && token) {
      loadAdminUsers();
    }
  }, [activeTab, isAdmin, token]);

  const loadAdminUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAdminUsers(json.data);
      }
    } catch (err) {
      console.warn("Lỗi tải danh sách người dùng:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // 3. Cập nhật thông tin cá nhân
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setAlert({ type: "", message: "" });

    try {
      const res = await fetch("http://localhost:3000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Cập nhật thông tin thất bại!");
      }

      updateUser(data.data);
      setAlert({
        type: "success",
        message: "Cập nhật thông tin tài khoản thành công!",
      });
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  // 4. [ADMIN] Chuyển đổi trạng thái tài khoản người dùng
  const handleToggleUserStatus = async (targetUser) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/users/${targetUser.UserID || targetUser._id}/status`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Không thể chuyển đổi trạng thái.");
      }

      // Cập nhật state local
      setAdminUsers((prev) =>
        prev.map((u) =>
          (u.UserID || u._id) === (targetUser.UserID || targetUser._id)
            ? { ...u, Status: json.data?.Status }
            : u
        )
      );

      setAlert({
        type: "success",
        message: json.message || "Chuyển đổi trạng thái thành công!",
      });
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        {/* ================= BREADCRUMB ================= */}
        <div className="profile-breadcrumb">
          <Link to="/home">
            <i className="bi bi-house-door-fill"></i> Trang chủ
          </Link>
          <span className="sep">&gt;</span>
          <span className="current">Thông tin tài khoản</span>
        </div>

        {/* Thông báo Alert */}
        {alert.message && (
          <div className={`profile-toast-alert ${alert.type}`}>
            <i
              className={`bi ${
                alert.type === "success"
                  ? "bi-check-circle-fill"
                  : "bi-exclamation-triangle-fill"
              }`}
            ></i>
            <span>{alert.message}</span>
          </div>
        )}

        {/* ================= THẺ HEADER HỒ SƠ ================= */}
        <div className="profile-header-card">
          <div className="profile-avatar-wrap">
            <div className="avatar-circle">
              {user.FullName ? user.FullName.charAt(0).toUpperCase() : "U"}
            </div>
            {isAdmin && <span className="admin-star" title="Quản trị viên">★</span>}
          </div>

          <div className="profile-header-info">
            <div className="profile-name-row">
              <h2>{user.FullName}</h2>
              <span className={`badge-role ${user.Role?.toLowerCase()}`}>
                {user.Role === "ADMIN" ? "Quản trị viên hệ thống" : "Khách hàng thân thiết"}
              </span>
              <span className={`badge-status ${user.Status ? "active" : "blocked"}`}>
                <i className={`bi ${user.Status ? "bi-check-circle-fill" : "bi-slash-circle-fill"}`}></i>
                {user.Status ? "Đang hoạt động" : "Tạm khóa"}
              </span>
            </div>

            <div className="profile-meta-chips">
              <span className="meta-chip">
                <i className="bi bi-person-badge"></i>
                Mã thành viên: <strong>{user.CustomerCode || "KH000001"}</strong>
              </span>
              <span className="meta-chip">
                <i className="bi bi-envelope"></i>
                {user.Email}
              </span>
              {user.Phone && (
                <span className="meta-chip">
                  <i className="bi bi-telephone"></i>
                  {user.Phone}
                </span>
              )}
            </div>
          </div>

          <div className="profile-header-actions">
            {isAdmin && (
              <button
                type="button"
                className="btn-switch-admin"
                onClick={() => navigate("/admin")}
                title="Chuyển sang trang Quản trị (Admin Portal)"
              >
                <i className="bi bi-speedometer2"></i>
                <span>Chuyển qua Page Admin</span>
                <i className="bi bi-arrow-right-short"></i>
              </button>
            )}
            <button
              type="button"
              className="btn-logout"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              title="Đăng xuất khỏi tài khoản"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* ================= TABS ĐIỀU HƯỚNG ================= */}
        <div className="profile-tabs-nav">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <i className="bi bi-person-lines-fill"></i>
            <span>Thông tin cá nhân</span>
          </button>

          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <i className="bi bi-bag-check-fill"></i>
            <span>Đơn hàng của tôi</span>
          </button>

          {/* TAB ĐẶC QUYỀN DÀNH CHO ADMIN */}
          {isAdmin && (
            <button
              type="button"
              className="profile-tab-btn admin-tab"
              onClick={() => navigate("/admin")}
              title="Chuyển ngay sang Trang Quản Trị Hệ Thống"
            >
              <i className="bi bi-speedometer2"></i>
              <span>Chuyển qua Page Admin</span>
              <span className="admin-glow-dot"></span>
              <i className="bi bi-box-arrow-up-right" style={{ fontSize: "12px", marginLeft: "4px" }}></i>
            </button>
          )}
        </div>

        {/* ================= TAB 1: THÔNG TIN CÁ NHÂN ================= */}
        {activeTab === "info" && (
          <div className="profile-tab-panel">
            <div className="panel-header">
              <h3>Hồ Sơ Cá Nhân</h3>
              <p>Quản lý thông tin tài khoản để bảo mật và thuận tiện nhận hàng</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="FullName">Họ và tên *</label>
                <input
                  type="text"
                  id="FullName"
                  value={formData.FullName}
                  onChange={(e) =>
                    setFormData({ ...formData, FullName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="Email">Địa chỉ Email (Cố định)</label>
                <input
                  type="email"
                  id="Email"
                  value={formData.Email}
                  disabled
                  title="Email xác thực tài khoản không thể thay đổi"
                  style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="Phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="Phone"
                  value={formData.Phone}
                  onChange={(e) =>
                    setFormData({ ...formData, Phone: e.target.value })
                  }
                  placeholder="0912345678"
                />
              </div>

              <div className="form-group">
                <label htmlFor="DateOfBirth">Ngày sinh</label>
                <input
                  type="date"
                  id="DateOfBirth"
                  value={formData.DateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, DateOfBirth: e.target.value })
                  }
                />
              </div>

              <div className="form-group full-width">
                <label>Giới tính</label>
                <div className="gender-radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.Gender === true}
                      onChange={() => setFormData({ ...formData, Gender: true })}
                    />
                    <span>Nam</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.Gender === false}
                      onChange={() => setFormData({ ...formData, Gender: false })}
                    />
                    <span>Nữ</span>
                  </label>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="Address">Địa chỉ giao hàng mặc định</label>
                <input
                  type="text"
                  id="Address"
                  value={formData.Address}
                  onChange={(e) =>
                    setFormData({ ...formData, Address: e.target.value })
                  }
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
              </div>

              <div className="form-action full-width">
                <button
                  type="submit"
                  className="btn-save-profile"
                  disabled={isUpdating}
                >
                  <i className="bi bi-check2-circle"></i>
                  <span>{isUpdating ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 2: ĐƠN HÀNG CỦA TÔI ================= */}
        {activeTab === "orders" && (
          <div className="profile-tab-panel">
            <div className="panel-header">
              <h3>Lịch Sử Đơn Hàng</h3>
              <p>Theo dõi các đơn hàng sữa dinh dưỡng bạn đã đặt tại VitaDairy</p>
            </div>

            {isLoadingOrders ? (
              <div className="profile-loading-box">
                <i className="bi bi-arrow-repeat spin"></i>
                <p>Đang tải danh sách đơn hàng...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="profile-empty-box">
                <i className="bi bi-box-seam"></i>
                <h4>Bạn chưa có đơn hàng nào!</h4>
                <p>Hãy khám phá các dòng sữa dinh dưỡng chuẩn y tế từ VitaDairy.</p>
                <Link to="/products" className="btn-shop-now">
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              <div className="orders-table-wrap">
                <table className="profile-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Người nhận</th>
                      <th>Sản phẩm</th>
                      <th>Tổng tiền</th>
                      <th>Thanh toán</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord._id || ord.OrderCode}>
                        <td className="order-code">{ord.OrderCode}</td>
                        <td>
                          <strong>{ord.ReceiverName}</strong>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            {ord.ReceiverPhone}
                          </div>
                        </td>
                        <td>
                          {ord.Items?.map((it, i) => (
                            <div key={i} style={{ fontSize: "13px" }}>
                              • {it.ProductName} (x{it.Quantity})
                            </div>
                          ))}
                        </td>
                        <td className="order-price">
                          {Number(ord.TotalAmount).toLocaleString("vi-VN")}đ
                        </td>
                        <td>
                          <span className="badge-payment">{ord.PaymentMethod}</span>
                        </td>
                        <td>
                          <span className="badge-order-status">
                            {ord.OrderStatus || "Đang xử lý"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: DÀNH CHO ADMIN (NÚT CHUYỂN ĐỔI TRẠNG THÁI) ================= */}
        {activeTab === "admin" && isAdmin && (
          <div className="profile-tab-panel admin-panel">
            <div className="panel-header">
              <div className="admin-title-badge">
                <i className="bi bi-shield-shaded"></i>
                <h3>Bảng Quản Trị Hệ Thống & Chuyển Đổi Trạng Thái</h3>
              </div>
              <p>
                Dành riêng cho Quản trị viên (Admin) quản lý trạng thái máy chủ và phân quyền thành viên trong MongoDB Atlas
              </p>
            </div>

            {/* Khối nút chuyển đổi trạng thái: Chuyển sang page admin */}
            <div className="admin-status-switch-box">
              <div className="switch-info">
                <div className="switch-title">
                  <i className="bi bi-speedometer2"></i>
                  <strong>Chuyển sang Trang Quản Trị Hệ Thống:</strong>
                  <span className="system-status-indicator live">
                    Admin Portal Sẵn Sàng
                  </span>
                </div>
                <p>
                  Nhấp nút bên phải để chuyển sang Page Admin (Quản lý đơn hàng, danh mục, sản phẩm, tồn kho, thành viên và voucher giảm giá).
                </p>
              </div>

              <button
                type="button"
                className="btn-toggle-system active-mode"
                onClick={() => navigate("/admin")}
                title="Chuyển ngay sang trang Admin"
              >
                <i className="bi bi-box-arrow-up-right"></i>
                <span>Chuyển qua Page Admin</span>
              </button>
            </div>

            {/* Danh sách thành viên và nút chuyển đổi trạng thái từng tài khoản */}
            <div className="admin-users-management">
              <div className="section-head">
                <h4>
                  <i className="bi bi-people-fill"></i> Quản Lý Tài Khoản Thành Viên & Chuyển Đổi Trạng Thái
                </h4>
                <span className="user-count-badge">Tổng số: {adminUsers.length} tài khoản</span>
              </div>

              {isLoadingUsers ? (
                <div className="profile-loading-box">
                  <i className="bi bi-arrow-repeat spin"></i>
                  <p>Đang tải danh sách thành viên từ MongoDB Atlas...</p>
                </div>
              ) : (
                <div className="orders-table-wrap">
                  <table className="profile-table admin-users-table">
                    <thead>
                      <tr>
                        <th>Mã KH</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        <th>Trạng thái hiện tại</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((u) => (
                        <tr key={u.UserID || u._id} className={!u.Status ? "row-blocked" : ""}>
                          <td>
                            <strong>{u.CustomerCode || "KHxxxxxx"}</strong>
                          </td>
                          <td>{u.FullName}</td>
                          <td>{u.Email}</td>
                          <td>{u.Phone || "Chưa cập nhật"}</td>
                          <td>
                            <span className={`badge-role ${u.Role?.toLowerCase()}`}>
                              {u.Role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-pill ${u.Status ? "active" : "blocked"}`}>
                              <i className={`bi ${u.Status ? "bi-check-circle-fill" : "bi-slash-circle-fill"}`}></i>
                              {u.Status ? "Hoạt động" : "Tạm khóa"}
                            </span>
                          </td>
                          <td>
                            {/* NÚT CHUYỂN ĐỔI TRẠNG THÁI THEO YÊU CẦU */}
                            <button
                              type="button"
                              className={`btn-action-switch-status ${u.Status ? "btn-block" : "btn-activate"}`}
                              onClick={() => handleToggleUserStatus(u)}
                              title={u.Status ? "Chuyển sang Tạm khóa" : "Chuyển sang Hoạt động"}
                            >
                              <i className={`bi ${u.Status ? "bi-lock-fill" : "bi-unlock-fill"}`}></i>
                              <span>{u.Status ? "Khóa tài khoản" : "Mở khóa"}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
