import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import productService from "../services/productService";
import "../style/admin.css";

// Dữ liệu mẫu khởi tạo (khớp cấu trúc 20 bảng SQL Server trong thư mục data/)
const INITIAL_ORDERS = [
  {
    id: 1,
    orderCode: "VD20260901001",
    customer: "Lê Minh Hoàng",
    phone: "0912345678",
    type: "DELIVERY",
    shippingAddress: "Số 88 Nam Kỳ Khởi Nghĩa, P. Bến Nghé, Quận 1, TP.HCM",
    items: [
      { name: "Sữa Bột ViDairy Kid Gold (Lon 800g)", qty: 2, price: 580000 },
    ],
    subTotal: 1160000,
    discount: 50000,
    total: 1110000,
    paymentMethod: "COD",
    paymentStatus: "Completed",
    orderStatus: "Completed",
    createdAt: "2026-09-01 09:30",
    hasVAT: false,
  },
  {
    id: 2,
    orderCode: "VD20260903002",
    customer: "Phạm Thùy Linh",
    phone: "0987654321",
    type: "DELIVERY",
    shippingAddress: "Tòa nhà Landmark 81, 720A Điện Biên Phủ, P.22, Q.Bình Thạnh, TP.HCM",
    items: [
      { name: "Sữa Bột ViDairy Mom Care (Lon 800g)", qty: 2, price: 560000 },
    ],
    subTotal: 1120000,
    discount: 112000,
    total: 1008000,
    paymentMethod: "BANKING_QR",
    paymentStatus: "Completed",
    orderStatus: "Shipping",
    createdAt: "2026-09-03 10:15",
    hasVAT: true,
    vatInfo: {
      company: "Công Ty TNHH Giải Pháp Công Nghệ Alpha",
      taxId: "0315899210",
      email: "ketoan@alphatech.vn",
      address: "Tầng 12, Tòa nhà Landmark 81, TP.HCM",
    },
  },
  {
    id: 3,
    orderCode: "VD20260904003",
    customer: "Lê Minh Hoàng",
    phone: "0912345678",
    type: "STORE_PICKUP",
    branchName: "ViDairy Flagship Store - Quận 1 (TP.HCM)",
    shippingAddress: "Nhận tại: 120 Nguyễn Huệ, P. Bến Nghé, Quận 1",
    items: [
      { name: "Sữa Bột ViDairy Grand Care (Lon 850g)", qty: 1, price: 620000 },
    ],
    subTotal: 620000,
    discount: 30000,
    total: 590000,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Processing",
    createdAt: "2026-09-04 08:45",
    hasVAT: false,
  },
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Sữa Bột ViDairy Kid Gold",
    category: "Sữa Bột Trẻ Em",
    brand: "ViDairy",
    variant: "Lon 800g",
    sku: "VDK-800G",
    price: 580000,
    originalPrice: 650000,
    stock: 350,
    ageGroup: "1 - 3 tuổi",
    status: 1,
    img: "/src/assets/img/cau_be_vidaiary.png",
  },
  {
    id: 2,
    name: "Sữa Bột ViDairy Mom Care",
    category: "Sữa Cho Mẹ Bầu & Sau Sinh",
    brand: "ViDairy",
    variant: "Lon 800g",
    sku: "VDM-800G",
    price: 560000,
    originalPrice: 620000,
    stock: 260,
    ageGroup: "Mẹ mang thai & cho con bú",
    status: 1,
    img: "/src/assets/img/me-bau_vidaiary.png",
  },
  {
    id: 3,
    name: "Sữa Bột ViDairy Grand Care",
    category: "Sữa Dinh Dưỡng Người Cao Tuổi",
    brand: "ViDairy",
    variant: "Lon 850g",
    sku: "VDG-850G",
    price: 620000,
    originalPrice: 690000,
    stock: 310,
    ageGroup: "Người từ 40 tuổi trở lên",
    status: 1,
    img: "/src/assets/img/ong_ba_vidairy.png",
  },
  {
    id: 4,
    name: "Sữa Hạt ViDairy Nutri Organic",
    category: "Sữa Hạt Dinh Dưỡng Tự Nhiên",
    brand: "ViDairy",
    variant: "Hộp 800g Dạng Bột",
    sku: "VDN-800G",
    price: 480000,
    originalPrice: 520000,
    stock: 220,
    ageGroup: "Cả gia đình (từ 3 tuổi)",
    status: 1,
    img: "/src/assets/img/sua_hat_vidairy.png",
  },
  {
    id: 5,
    name: "Sữa Bột NutralisBaby Pro Colostrum",
    category: "Sữa Bột Trẻ Em",
    brand: "NutralisBaby",
    variant: "Lon 800g",
    sku: "NLB-800G",
    price: 690000,
    originalPrice: 750000,
    stock: 180,
    ageGroup: "0 - 12 tháng",
    status: 1,
    img: "/src/assets/img/cau_be_vidaiary.png",
  },
  {
    id: 6,
    name: "Sữa Phục Hồi NutriCare Gold",
    category: "Sữa Dinh Dưỡng Người Cao Tuổi",
    brand: "NutriCare",
    variant: "Lon 900g",
    sku: "NCG-900G",
    price: 610000,
    originalPrice: 670000,
    stock: 210,
    ageGroup: "Người lớn tuổi",
    status: 1,
    img: "/src/assets/img/ong_ba_vidairy.png",
  },
];

const INITIAL_USERS = [
  {
    id: 1,
    code: "AD000001",
    fullName: "Nguyễn Chí Vĩ (Quản trị viên)",
    email: "chivinguyen1998@gmail.com",
    phone: "0989584592",
    role: "ADMIN",
    permissions: ["manage_products", "manage_orders", "manage_coupons", "manage_users"],
    status: 1,
    createdAt: "2026-08-01",
  },
  {
    id: 2,
    code: "NV000001",
    fullName: "Trần Thị Thu Hà (Nhân viên CSKH)",
    email: "staff@vidairy.vn",
    phone: "0901234567",
    role: "STAFF",
    status: 1,
    createdAt: "2026-08-15",
  },
  {
    id: 3,
    code: "KH000001",
    fullName: "Lê Minh Hoàng",
    email: "khachhang@gmail.com",
    phone: "0912345678",
    role: "CUSTOMER",
    status: 1,
    createdAt: "2026-09-01",
  },
  {
    id: 4,
    code: "KH000002",
    fullName: "Phạm Thùy Linh",
    email: "thuylinh.pham@gmail.com",
    phone: "0987654321",
    role: "CUSTOMER",
    status: 1,
    createdAt: "2026-09-02",
  },
];

const INITIAL_COUPONS = [
  {
    id: 1,
    code: "VIDAIRY50",
    desc: "Giảm ngay 50.000đ cho đơn từ 300.000đ",
    type: "FixedAmount",
    value: 50000,
    minOrder: 300000,
    usedCount: 42,
    limit: 500,
    status: 1,
    endDate: "2026-12-31",
  },
  {
    id: 2,
    code: "FREESHIP",
    desc: "Miễn phí vận chuyển toàn quốc cho đơn từ 250.000đ",
    type: "FixedAmount",
    value: 30000,
    minOrder: 250000,
    usedCount: 128,
    limit: 1000,
    status: 1,
    endDate: "2026-12-31",
  },
  {
    id: 3,
    code: "MEBAU20",
    desc: "Giảm 20% cho dòng sữa ViDairy Mom Care",
    type: "Percent",
    value: 20,
    minOrder: 500000,
    usedCount: 15,
    limit: 200,
    status: 1,
    endDate: "2026-12-31",
  },
  {
    id: 4,
    code: "CHAO2026",
    desc: "Giảm 100.000đ cho đơn hàng từ 800.000đ",
    type: "FixedAmount",
    value: 100000,
    minOrder: 800000,
    usedCount: 89,
    limit: 300,
    status: 1,
    endDate: "2026-12-31",
  },
];

const INITIAL_BRANCHES = [
  {
    id: 1,
    code: "CN001",
    name: "ViDairy Flagship Store - Quận 1",
    address: "Số 120 Nguyễn Huệ, Phường Bến Nghé, Quận 1",
    city: "TP. Hồ Chí Minh",
    phone: "0989 584 592",
    hours: "08:00 - 21:30 (Mở cửa cả tuần)",
    status: 1,
  },
  {
    id: 2,
    code: "CN002",
    name: "ViDairy Cầu Giấy - Hà Nội",
    address: "Số 45 Trần Thái Tông, Phường Dịch Vọng Hậu, Quận Cầu Giấy",
    city: "Hà Nội",
    phone: "0989 584 592",
    hours: "08:00 - 21:00 (Mở cửa cả tuần)",
    status: 1,
  },
  {
    id: 3,
    code: "CN003",
    name: "ViDairy Hải Châu - Đà Nẵng",
    address: "Số 88 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu",
    city: "Đà Nẵng",
    phone: "0989 584 592",
    hours: "08:00 - 21:00 (Mở cửa cả tuần)",
    status: 1,
  },
];


const PRESET_PRODUCT_IMAGES = [
  { label: "Sữa Trẻ Em", url: "/src/assets/img/cau_be_vidaiary.png" },
  { label: "Sữa Mẹ Bầu", url: "/src/assets/img/me-bau_vidaiary.png" },
  { label: "Sữa Người Cao Tuổi", url: "/src/assets/img/ong_ba_vidairy.png" },
  { label: "Sữa Hạt Organic", url: "/src/assets/img/sua_hat_vidairy.png" },
  { label: "Banner Mẹ & Bé", url: "/src/assets/img/mother_baby_banner.jpg" },
];

export default function AdminDashboard() {
  const { user, isAdmin, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

  // Filter & Search states
  const [orderFilterStatus, setOrderFilterStatus] = useState("ALL");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("ALL");

  // State & Handler cho Phân quyền tài khoản (Role & Permissions)
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleForm, setRoleForm] = useState({ role: "CUSTOMER", permissions: [] });

  // Đổi vai trò nhanh từ dropdown
  const handleQuickRoleChange = async (userId, newRole) => {
    try {
      const res = await productService.updateUserRole(userId, newRole, null, token);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        alert(res.message || "Không thể cập nhật vai trò!");
      }
    } catch (err) {
      alert("Lỗi kết nối khi cập nhật vai trò người dùng.");
    }
  };

  // Mở modal phân quyền chi tiết
  const handleOpenRoleModal = (userItem) => {
    setSelectedUserForRole(userItem);
    setRoleForm({
      role: userItem.role || "CUSTOMER",
      permissions: userItem.permissions || [],
    });
    setIsRoleModalOpen(true);
  };

  // Tắt/bật checkbox quyền chi tiết
  const handleTogglePermission = (permKey) => {
    setRoleForm((prev) => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permKey)
          : [...prev.permissions, permKey],
      };
    });
  };

  // Lưu phân quyền từ modal
  const handleSaveRolePermissions = async (e) => {
    e.preventDefault();
    if (!selectedUserForRole) return;

    try {
      const res = await productService.updateUserRole(
        selectedUserForRole.id,
        roleForm.role,
        roleForm.permissions,
        token
      );

      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUserForRole.id
              ? { ...u, role: roleForm.role, permissions: roleForm.permissions }
              : u
          )
        );
        alert(`🎉 Đã cập nhật phân quyền cho người dùng "${selectedUserForRole.fullName}" thành công!`);
        setIsRoleModalOpen(false);
      } else {
        alert(res.message || "Lỗi khi cập nhật phân quyền.");
      }
    } catch (err) {
      alert("Lỗi khi kết nối đến máy chủ.");
    }
  };

  // Modal thêm sản phẩm
  // State & Handler Quản lý Hình ảnh & Sửa Sản Phẩm
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Đọc file ảnh từ máy tính chuyển thành Base64
  const handleImageFileUpload = (e, setImgCallback) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh hợp lệ (.jpg, .png, .webp,...)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImgCallback(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Mở modal sửa sản phẩm
  const handleOpenEditProduct = (prod) => {
    setEditingProduct({
      id: prod.id,
      name: prod.name,
      category: prod.category || "Sữa Bột Trẻ Em",
      brand: prod.brand || "ViDairy",
      variant: prod.variant || "Lon 800g",
      price: prod.price || 0,
      originalPrice: prod.originalPrice || prod.price || 0,
      stock: prod.stock || 100,
      ageGroup: prod.ageGroup || "Mọi lứa tuổi",
      img: prod.img || "/src/assets/img/cau_be_vidaiary.png",
    });
    setIsEditProductOpen(true);
  };

  // Lưu chỉnh sửa sản phẩm
  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) {
      alert("Vui lòng nhập tên và giá sản phẩm!");
      return;
    }

    try {
      const catMap = {
        "Sữa Bột Trẻ Em": "san-pham-cho-be",
        "Sữa Cho Mẹ Bầu & Sau Sinh": "san-pham-cho-me",
        "Sữa Dinh Dưỡng Người Cao Tuổi": "san-pham-cho-nguoi-lon-tuoi",
        "Sữa Hạt Dinh Dưỡng Tự Nhiên": "dung-kem",
      };

      const payload = {
        ProductName: editingProduct.name,
        CategoryID: catMap[editingProduct.category] || "san-pham-cho-be",
        BrandName: editingProduct.brand || "ViDairy",
        packaging: editingProduct.variant || "Lon 800g",
        price: Number(editingProduct.price),
        targetUser: editingProduct.ageGroup || "Mọi lứa tuổi",
        stock: Number(editingProduct.stock || 100),
        imageUrl: editingProduct.img || "/src/assets/img/cau_be_vidaiary.png",
      };

      const res = await productService.updateProduct(editingProduct.id, payload);
      if (res.success || res.data) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                ...p,
                name: editingProduct.name,
                category: editingProduct.category,
                brand: editingProduct.brand,
                variant: editingProduct.variant,
                price: Number(editingProduct.price),
                stock: Number(editingProduct.stock),
                ageGroup: editingProduct.ageGroup,
                img: editingProduct.img,
              }
              : p
          )
        );
        alert(`🎉 Đã cập nhật thông tin và hình ảnh sản phẩm "${editingProduct.name}" thành công!`);
        setIsEditProductOpen(false);
      } else {
        alert(res.message || "Lỗi khi cập nhật sản phẩm.");
      }
    } catch (err) {
      alert("Lỗi khi kết nối đến máy chủ.");
    }
  };

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Sữa Bột Trẻ Em",
    brand: "ViDairy",
    variant: "Lon 800g",
    price: "",
    originalPrice: "",
    stock: "",
    ageGroup: "1 - 3 tuổi",
    img: "/src/assets/img/cau_be_vidaiary.png",
  });

  // Tải tất cả dữ liệu thực từ MongoDB Atlas
  const loadAllAdminData = async () => {
    setIsLoadingLive(true);
    try {
      // 1. Tải Đơn hàng
      productService
        .getOrders()
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setOrders(
              res.data.map((o) => ({
                id: o._id || o.OrderCode,
                orderCode: o.OrderCode,
                customer: o.ReceiverName,
                phone: o.ReceiverPhone,
                type: o.DeliveryType || "DELIVERY",
                branchName: o.BranchName || "",
                shippingAddress: o.ShippingAddress,
                items: (o.Items || []).map((it) => ({
                  name: it.ProductName,
                  qty: it.Quantity,
                  price: it.UnitPrice,
                  variant: it.VariantName,
                })),
                subTotal: o.SubTotal || o.TotalAmount,
                discount: o.Discount || 0,
                total: o.TotalAmount,
                paymentMethod: o.PaymentMethod,
                paymentStatus: o.PaymentStatus,
                orderStatus: o.OrderStatus,
                createdAt: new Date(o.createdAt).toLocaleString("vi-VN"),
                hasVAT: o.HasVAT || false,
                vatInfo: o.VATInfo || {},
                raw: o,
              }))
            );
          }
        })
        .catch((err) => console.warn("Lỗi tải orders admin:", err));

      // 2. Tải Sản phẩm
      productService
        .getProducts({ includeAll: "true" })
        .then((res) => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            setProducts(
              res.data.map((p) => ({
                id: p.id || p.ProductID,
                name: p.name,
                category:
                  p.categoryId === "san-pham-cho-be"
                    ? "Sữa Bột Trẻ Em"
                    : p.categoryId === "san-pham-cho-me"
                      ? "Sữa Cho Mẹ Bầu & Sau Sinh"
                      : p.categoryId === "san-pham-cho-nguoi-lon-tuoi"
                        ? "Sữa Dinh Dưỡng Người Cao Tuổi"
                        : "Sữa Hạt Dinh Dưỡng Tự Nhiên",
                categoryId: p.categoryId,
                brand: p.brand || "ViDairy",
                variant: p.packaging || "Lon 800g",
                sku: p.id,
                price: p.price,
                originalPrice: p.price,
                stock: 150,
                ageGroup: p.targetUser,
                status: p.raw?.Status !== false ? 1 : 0,
                img: p.imageUrl || p.ImageURL || p.img || "/src/assets/img/cau_be_vidaiary.png",
                raw: p,
              }))
            );
          }
        })
        .catch((err) => console.warn("Lỗi tải products admin:", err));

      // 3. Tải Người dùng
      fetch("http://localhost:3000/api/admin/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setUsers(
              res.data.map((u) => ({
                id: u._id || u.UserID,
                code: u.CustomerCode || "KH000001",
                fullName: u.FullName,
                email: u.Email,
                phone: u.Phone,
                role: u.Role,
                permissions: u.Permissions || [],
                status: u.Status ? 1 : 0,
                createdAt: new Date(u.createdAt).toLocaleDateString("vi-VN"),
              }))
            );
          }
        })
        .catch((err) => console.warn("Lỗi tải users admin:", err));

      // 4. Tải Coupons
      productService
        .getCoupons(true)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setCoupons(
              res.data.map((c) => ({
                id: c._id,
                code: c.CouponCode,
                desc:
                  c.DiscountType === "Percent"
                    ? `Giảm ${c.DiscountValue}% cho đơn từ ${c.MinimumOrderAmount.toLocaleString("vi-VN")}đ`
                    : `Giảm ${c.DiscountValue.toLocaleString("vi-VN")}đ cho đơn từ ${c.MinimumOrderAmount.toLocaleString("vi-VN")}đ`,
                type: c.DiscountType,
                value: c.DiscountValue,
                minOrder: c.MinimumOrderAmount,
                usedCount: 20,
                limit: 500,
                status: c.Status ? 1 : 0,
                endDate: new Date(c.EndDate).toLocaleDateString("vi-VN"),
              }))
            );
          }
        })
        .catch((err) => console.warn("Lỗi tải coupons admin:", err));

      // 5. Tải Chi nhánh
      productService
        .getBranches()
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setBranches(res.data);
          }
        })
        .catch((err) => console.warn("Lỗi tải branches admin:", err));
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [token]);

  // Cập nhật trạng thái đơn hàng (Đồng bộ trực tiếp DB)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await productService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId || o.orderCode === orderId
              ? { ...o, orderStatus: newStatus }
              : o
          )
        );
        if (
          selectedOrder &&
          (selectedOrder.id === orderId || selectedOrder.orderCode === orderId)
        ) {
          setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
        }
      } else {
        alert(res.message || "Lỗi khi cập nhật trạng thái đơn hàng.");
      }
    } catch (err) {
      alert("Lỗi kết nối khi cập nhật đơn hàng.");
    }
  };

  // Khóa / Mở khóa người dùng (Đồng bộ trực tiếp DB)
  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/users/${userId}/status`,
        {
          method: "PATCH",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, status: json.data?.Status ? 1 : 0 } : u
          )
        );
      }
    } catch (err) {
      alert("Lỗi khi chuyển trạng thái người dùng.");
    }
  };

  // Thêm sản phẩm mới vào Database MongoDB Atlas
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert("Vui lòng điền tên sản phẩm và giá bán!");
      return;
    }

    try {
      const catMap = {
        "Sữa Bột Trẻ Em": "san-pham-cho-be",
        "Sữa Cho Mẹ Bầu & Sau Sinh": "san-pham-cho-me",
        "Sữa Dinh Dưỡng Người Cao Tuổi": "san-pham-cho-nguoi-lon-tuoi",
        "Sữa Hạt Dinh Dưỡng Tự Nhiên": "dung-kem",
      };

      const payload = {
        name: newProduct.name,
        category: catMap[newProduct.category] || "san-pham-cho-be",
        brand: newProduct.brand || "ViDairy",
        packaging: newProduct.variant || "Lon 800g",
        price: Number(newProduct.price),
        targetUser: newProduct.ageGroup || "Mọi lứa tuổi",
        stock: Number(newProduct.stock || 100),
        imageUrl: newProduct.img || "/src/assets/img/cau_be_vidaiary.png",
      };

      const res = await productService.createProduct(payload);
      if (res.success && res.data) {
        alert("🎉 Đã thêm sản phẩm mới vào Database thành công!");
        setIsAddProductOpen(false);
        setNewProduct({
          name: "",
          category: "Sữa Bột Trẻ Em",
          brand: "ViDairy",
          variant: "Lon 800g",
          price: "",
          originalPrice: "",
          stock: "",
          ageGroup: "1 - 3 tuổi",
          img: "/src/assets/img/cau_be_vidaiary.png",
        });
        loadAllAdminData();
      } else {
        alert(res.message || "Lỗi tạo sản phẩm.");
      }
    } catch (err) {
      alert("Lỗi kết nối khi thêm sản phẩm: " + err.message);
    }
  };

  // Chuyển đổi trạng thái ẩn / hiện sản phẩm
  const handleToggleProductStatus = async (productId) => {
    try {
      const res = await productService.toggleProductStatus(productId);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, status: res.data?.Status ? 1 : 0 } : p
          )
        );
      }
    } catch (err) {
      alert("Lỗi khi chuyển trạng thái sản phẩm.");
    }
  };

  // Xóa sản phẩm khỏi Database
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi cơ sở dữ liệu?"))
      return;
    try {
      const res = await productService.deleteProduct(productId);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        alert("Đã xóa sản phẩm khỏi Database thành công!");
      }
    } catch (err) {
      alert("Lỗi khi xóa sản phẩm.");
    }
  };

  // Bật / Tắt trạng thái Voucher
  const handleToggleCouponStatus = async (couponCode) => {
    try {
      const res = await productService.toggleCouponStatus(couponCode);
      if (res.success) {
        setCoupons((prev) =>
          prev.map((c) =>
            c.code === couponCode ? { ...c, status: res.data?.Status ? 1 : 0 } : c
          )
        );
      }
    } catch (err) {
      alert("Lỗi khi đổi trạng thái voucher.");
    }
  };

  // Lọc đơn hàng
  const filteredOrders = orders.filter((o) => {
    const matchStatus =
      orderFilterStatus === "ALL" || o.orderStatus === orderFilterStatus;
    const matchSearch =
      o.orderCode.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchStatus && matchSearch;
  });

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      productCategoryFilter === "ALL" || p.category === productCategoryFilter;
    const matchSearch = p.name
      .toLowerCase()
      .includes(productSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Thống kê nhanh
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === "Processing" || o.orderStatus === "Pending"
  ).length;

  return (
    <div className="admin-layout">
      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img
            src="/src/assets/img/logo.png"
            alt="ViDairy Logo"
            className="admin-logo-img"
          />
        </div>

        <nav className="admin-nav">
          <span className="admin-nav-section-title">QUẢN TRỊ KINH DOANH</span>
          <button
            type="button"
            className={`admin-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="admin-nav-item-content">
              <i className="bi bi-grid-1x2-fill"></i>
              <span>Tổng quan (KPI)</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <div className="admin-nav-item-content">
              <i className="bi bi-box-seam-fill"></i>
              <span>Đơn hàng</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="admin-nav-badge">{pendingOrdersCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <div className="admin-nav-item-content">
              <i className="bi bi-cart4"></i>
              <span>Sản phẩm & Giá</span>
            </div>
            <span className="admin-nav-badge blue">{products.length}</span>
          </button>

          <span className="admin-nav-section-title">VẬN HÀNH & HỆ THỐNG</span>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "branches" ? "active" : ""}`}
            onClick={() => setActiveTab("branches")}
          >
            <div className="admin-nav-item-content">
              <i className="bi bi-shop"></i>
              <span>Chi nhánh (3)</span>
            </div>
          </button>

          <span className="admin-nav-section-title">KHÁCH HÀNG & CSKH</span>
          <button
            type="button"
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <div className="admin-nav-item-content">
              <i className="bi bi-people-fill"></i>
              <span>Khách hàng & User</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "coupons" ? "active" : ""}`}
            onClick={() => setActiveTab("coupons")}
          >
            <div className="admin-nav-item-content">
              <i className="bi bi-ticket-perforated-fill"></i>
              <span>Mã giảm giá (Voucher)</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "invoices" ? "active" : ""}`}
            onClick={() => setActiveTab("invoices")}
          >
            <div className="admin-nav-item-content">
              <i className="bi bi-receipt"></i>
              <span>Hóa đơn VAT</span>
            </div>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #23408e 0%, #003DFF 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              {user?.FullName ? user.FullName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.FullName || "Quản trị viên"}</span>
              <span className="admin-user-role">{user?.Role === "ADMIN" ? "Quản trị viên (Admin)" : "Nhân viên hệ thống"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h1 className="admin-page-heading">
              {activeTab === "dashboard" && "Bảng Điều Khiển Tổng Quan"}
              {activeTab === "orders" && "Quản Lý Đơn Đặt Hàng"}
              {activeTab === "products" && "Danh Mục & Quản Lý Sản Phẩm"}
              {activeTab === "users" && "Quản Lý Khách Hàng & Phân Quyền"}
              {activeTab === "coupons" && "Khuyến Mãi & Voucher Giảm Giá"}
              {activeTab === "invoices" && "Yêu Cầu Xuất Hóa Đơn Doanh Nghiệp (VAT)"}
              {activeTab === "branches" && "Hệ Thống Chi Nhánh Cửa Hàng ViDairy"}
            </h1>
          </div>

          <div className="admin-topbar-right">
            <Link
              to="/profile"
              className="btn-admin-store-link"
              style={{
                background: "#eef6ff",
                color: "#23408e",
                borderColor: "#bfdbfe",
                fontWeight: 600,
              }}
              title="Chuyển về Trang Thông Tin Người Dùng"
            >
              <i className="bi bi-person-circle"></i>
              <span>Chuyển về Trang User</span>
            </Link>
            <Link to="/" className="btn-admin-store-link">
              <i className="bi bi-arrow-up-right-square"></i>
              <span>Xem Web Bán Hàng</span>
            </Link>
            <button
              type="button"
              className="btn-admin-logout"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              style={{
                cursor: "pointer",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Body Content */}
        <div className="admin-body">
          {/* ---------------- 1. TAB: DASHBOARD ---------------- */}
          {activeTab === "dashboard" && (
            <div>
              {/* KPI Cards */}
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <div className="admin-kpi-info">
                    <span className="admin-kpi-label">Tổng Doanh Thu</span>
                    <span className="admin-kpi-val">
                      {totalRevenue.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="admin-kpi-trend up">
                      <i className="bi bi-arrow-up-circle-fill"></i> +18.5% so
                      với tuần trước
                    </span>
                  </div>
                  <div className="admin-kpi-icon-box green">
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-info">
                    <span className="admin-kpi-label">Đơn Hàng Mới</span>
                    <span className="admin-kpi-val">{orders.length} đơn</span>
                    <span className="admin-kpi-trend up">
                      <i className="bi bi-check-circle-fill"></i> Đang hoạt động
                    </span>
                  </div>
                  <div className="admin-kpi-icon-box blue">
                    <i className="bi bi-bag-check-fill"></i>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-info">
                    <span className="admin-kpi-label">Khách Hàng Đăng Ký</span>
                    <span className="admin-kpi-val">{users.length} tài khoản</span>
                    <span className="admin-kpi-trend up">
                      <i className="bi bi-person-plus-fill"></i> +4 người mới
                    </span>
                  </div>
                  <div className="admin-kpi-icon-box purple">
                    <i className="bi bi-people-fill"></i>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-info">
                    <span className="admin-kpi-label">Sản Phẩm Đang Bán</span>
                    <span className="admin-kpi-val">{products.length} dòng sữa</span>
                    <span className="admin-kpi-trend up">
                      <i className="bi bi-check-circle-fill"></i> Đang hiển thị
                    </span>
                  </div>
                  <div className="admin-kpi-icon-box orange">
                    <i className="bi bi-box-fill"></i>
                  </div>
                </div>
              </div>

              {/* Chart & Top Products */}
              <div className="admin-dashboard-split">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">
                      Thống Kê Doanh Thu 7 Ngày Gần Nhất
                    </h3>
                    <span className="status-badge active">Tuần Này</span>
                  </div>
                  <div className="admin-chart-bars">
                    <div className="admin-bar-col">
                      <div
                        className="admin-bar-fill"
                        style={{ height: "45%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 2</span>
                    </div>
                    <div className="admin-bar-col">
                      <div
                        className="admin-bar-fill"
                        style={{ height: "60%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 3</span>
                    </div>
                    <div className="admin-bar-col">
                      <div
                        className="admin-bar-fill"
                        style={{ height: "80%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 4</span>
                    </div>
                    <div className="admin-bar-col">
                      <div
                        className="admin-bar-fill"
                        style={{ height: "70%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 5</span>
                    </div>
                    <div className="admin-bar-col">
                      <div
                        className="admin-bar-fill"
                        style={{ height: "95%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 6</span>
                    </div>
                    <div className="admin-bar-col">
                      <div
                        className="admin-bar-fill"
                        style={{ height: "85%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 7</span>
                    </div>
                    <div className="admin-bar-col">
                      <div
                        className="admin-bar-fill"
                        style={{ height: "65%" }}
                      ></div>
                      <span className="admin-bar-label">CN</span>
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">Sản Phẩm Bán Chạy</h3>
                    <i className="bi bi-trophy-fill" style={{ color: "#ff6b00" }}></i>
                  </div>
                  <div className="top-selling-list">
                    {products.slice(0, 4).map((p) => (
                      <div key={p.id} className="top-selling-item">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="top-selling-img"
                        />
                        <div className="top-selling-info">
                          <span className="top-selling-name">{p.name}</span>
                          <span className="top-selling-sales">
                            Quy cách: {p.variant}
                          </span>
                        </div>
                        <span className="top-selling-revenue">
                          {p.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders in Dashboard */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">Đơn Hàng Cần Xử Lý Gần Đây</h3>
                  <button
                    type="button"
                    className="btn-admin-primary"
                    onClick={() => setActiveTab("orders")}
                  >
                    Xem Tất Cả Đơn Hàng
                  </button>
                </div>
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>MÃ ĐƠN</th>
                        <th>KHÁCH HÀNG</th>
                        <th>HÌNH THỨC</th>
                        <th>TỔNG TIỀN</th>
                        <th>THANH TOÁN</th>
                        <th>TRẠNG THÁI</th>
                        <th>THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td>
                            <strong>{o.orderCode}</strong>
                          </td>
                          <td>
                            <div>{o.customer}</div>
                            <small style={{ color: "#64748b" }}>{o.phone}</small>
                          </td>
                          <td>
                            {o.type === "DELIVERY" ? (
                              <span className="status-badge shipping">
                                <i className="bi bi-truck"></i> Giao tận nơi
                              </span>
                            ) : (
                              <span className="status-badge store-pickup">
                                <i className="bi bi-shop"></i> Nhận tại shop
                              </span>
                            )}
                          </td>
                          <td>
                            <strong style={{ color: "#23408e" }}>
                              {o.total.toLocaleString("vi-VN")}đ
                            </strong>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${o.paymentStatus === "Completed" ? "completed" : "pending"}`}
                            >
                              {o.paymentMethod} (
                              {o.paymentStatus === "Completed"
                                ? "Đã TT"
                                : "Chưa TT"}
                              )
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${o.orderStatus === "Completed"
                                ? "completed"
                                : o.orderStatus === "Shipping"
                                  ? "shipping"
                                  : "processing"
                                }`}
                            >
                              {o.orderStatus === "Completed" && "Hoàn thành"}
                              {o.orderStatus === "Shipping" && "Đang giao hàng"}
                              {o.orderStatus === "Processing" && "Đang chuẩn bị"}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-action-icon"
                              title="Xem chi tiết"
                              onClick={() => setSelectedOrder(o)}
                            >
                              <i className="bi bi-eye-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- 2. TAB: ORDERS ---------------- */}
          {activeTab === "orders" && (
            <div className="admin-card">
              <div className="admin-table-controls">
                <div className="admin-search-box">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Tìm mã đơn, tên khách, SĐT..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>

                <div className="admin-filter-group">
                  <select
                    className="admin-select"
                    value={orderFilterStatus}
                    onChange={(e) => setOrderFilterStatus(e.target.value)}
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="Processing">Đang chuẩn bị (Processing)</option>
                    <option value="Shipping">Đang giao hàng (Shipping)</option>
                    <option value="Completed">Hoàn thành (Completed)</option>
                    <option value="Cancelled">Đã hủy (Cancelled)</option>
                  </select>
                </div>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>MÃ ĐƠN</th>
                      <th>THỜI GIAN</th>
                      <th>KHÁCH HÀNG</th>
                      <th>SẢN PHẨM</th>
                      <th>TỔNG TIỀN</th>
                      <th>THANH TOÁN</th>
                      <th>HÓA ĐƠN VAT</th>
                      <th>TRẠNG THÁI</th>
                      <th>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <strong>{o.orderCode}</strong>
                        </td>
                        <td>{o.createdAt}</td>
                        <td>
                          <div>{o.customer}</div>
                          <small style={{ color: "#64748b" }}>{o.phone}</small>
                        </td>
                        <td>
                          {o.items.map((it, idx) => (
                            <div key={idx} style={{ fontSize: "12.5px" }}>
                              {it.name} <strong>x{it.qty}</strong>
                            </div>
                          ))}
                        </td>
                        <td>
                          <strong style={{ color: "#23408e" }}>
                            {o.total.toLocaleString("vi-VN")}đ
                          </strong>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${o.paymentStatus === "Completed" ? "completed" : "pending"}`}
                          >
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td>
                          {o.hasVAT ? (
                            <span className="status-badge completed">
                              <i className="bi bi-check-circle"></i> Có VAT
                            </span>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>-</span>
                          )}
                        </td>
                        <td>
                          <select
                            className="admin-select"
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                            value={o.orderStatus}
                            onChange={(e) =>
                              handleUpdateOrderStatus(o.id, e.target.value)
                            }
                          >
                            <option value="Processing">Đang chuẩn bị</option>
                            <option value="Shipping">Đang giao hàng</option>
                            <option value="Completed">Đã hoàn thành</option>
                            <option value="Cancelled">Hủy đơn</option>
                          </select>
                        </td>
                        <td>
                          <div className="admin-action-btn-group">
                            <button
                              type="button"
                              className="btn-action-icon"
                              title="Xem chi tiết"
                              onClick={() => setSelectedOrder(o)}
                            >
                              <i className="bi bi-eye-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------- 3. TAB: PRODUCTS ---------------- */}
          {activeTab === "products" && (
            <div className="admin-card">
              <div className="admin-table-controls">
                <div className="admin-search-box">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Tìm tên sản phẩm..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>

                <div className="admin-filter-group">
                  <select
                    className="admin-select"
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                  >
                    <option value="ALL">Tất cả danh mục</option>
                    <option value="Sữa Bột Trẻ Em">Sữa Bột Trẻ Em</option>
                    <option value="Sữa Cho Mẹ Bầu & Sau Sinh">
                      Sữa Cho Mẹ Bầu
                    </option>
                    <option value="Sữa Dinh Dưỡng Người Cao Tuổi">
                      Sữa Người Cao Tuổi
                    </option>
                    <option value="Sữa Hạt Dinh Dưỡng Tự Nhiên">Sữa Hạt</option>
                  </select>

                  <button
                    type="button"
                    className="btn-admin-primary"
                    onClick={() => setIsAddProductOpen(true)}
                  >
                    <i className="bi bi-plus-lg"></i> Thêm Sản Phẩm Mới
                  </button>
                </div>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>HÌNH ẢNH</th>
                      <th>TÊN SẢN PHẨM</th>
                      <th>DANH MỤC</th>
                      <th>QUY CÁCH (SKU)</th>
                      <th>GIÁ BÁN</th>
                      <th>ĐỐI TƯỢNG</th>
                      <th>TRẠNG THÁI</th>
                      <th>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.img || p.imageUrl || "/src/assets/img/cau_be_vidaiary.png"}
                            alt={p.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/src/assets/img/cau_be_vidaiary.png";
                            }}
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "8px",
                              objectFit: "cover",
                              border: "1px solid #e2e8f0",
                            }}
                          />
                        </td>
                        <td>
                          <strong>{p.name}</strong>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            Thương hiệu: {p.brand}
                          </div>
                        </td>
                        <td>{p.category}</td>
                        <td>
                          <div>{p.variant}</div>
                          <small style={{ color: "#94a3b8" }}>{p.sku}</small>
                        </td>
                        <td>
                          <strong style={{ color: "#23408e" }}>
                            {p.price.toLocaleString("vi-VN")}đ
                          </strong>
                          {p.originalPrice > p.price && (
                            <div
                              style={{
                                fontSize: "12px",
                                textDecoration: "line-through",
                                color: "#94a3b8",
                              }}
                            >
                              {p.originalPrice.toLocaleString("vi-VN")}đ
                            </div>
                          )}
                        </td>

                        <td>{p.ageGroup}</td>
                        <td>
                          <span
                            className={`status-badge ${p.status === 1 ? "active" : "blocked"}`}
                            style={{ cursor: "pointer" }}
                            title="Bấm để ẩn / mở bán sản phẩm trên website"
                            onClick={() => handleToggleProductStatus(p.id)}
                          >
                            <i className={`bi ${p.status === 1 ? "bi-check-circle-fill" : "bi-eye-slash-fill"}`} style={{ marginRight: "4px" }}></i>
                            {p.status === 1 ? "Đang bán" : "Tạm ngưng"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-btn-group">
                            <button
                              type="button"
                              className="btn-action-icon"
                              title={p.status === 1 ? "Ẩn khỏi cửa hàng" : "Mở bán lại"}
                              onClick={() => handleToggleProductStatus(p.id)}
                            >
                              <i className={`bi ${p.status === 1 ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                            <button
                              type="button"
                              className="btn-action-icon danger"
                              title="Xóa vĩnh viễn khỏi Database"
                              onClick={() => handleDeleteProduct(p.id)}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}



          {/* ---------------- 5. TAB: USERS & CUSTOMERS ---------------- */}
          {activeTab === "users" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">
                  Danh Sách Khách Hàng & Phân Quyền Tài Khoản
                </h3>
              </div>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>MÃ NGƯỜI DÙNG</th>
                      <th>HỌ VÀ TÊN</th>
                      <th>EMAIL</th>
                      <th>SỐ ĐIỆN THOẠI</th>
                      <th>VAI TRÒ</th>
                      <th>NGÀY TẠO</th>
                      <th>TRẠNG THÁI</th>
                      <th>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <strong>{u.code}</strong>
                        </td>
                        <td>{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>
                          <select
                            value={u.role}
                            onChange={(e) => handleQuickRoleChange(u.id, e.target.value)}
                            className={`admin-role-select role-${u.role?.toLowerCase()}`}
                            title="Thay đổi nhanh vai trò"
                          >
                            <option value="CUSTOMER">CUSTOMER (Khách)</option>
                            <option value="STAFF">STAFF (Nhân viên)</option>
                            <option value="MANAGER">MANAGER (Quản lý)</option>
                            <option value="ADMIN">ADMIN (Quản trị)</option>
                          </select>
                        </td>
                        <td>{u.createdAt}</td>
                        <td>
                          <span
                            className={`status-badge ${u.status === 1 ? "active" : "blocked"}`}
                          >
                            {u.status === 1 ? "Đang hoạt động" : "Đã khóa"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-btn-group">
                            <button
                              type="button"
                              className="btn-action-icon primary"
                              title="Phân quyền chi tiết"
                              onClick={() => handleOpenRoleModal(u)}
                            >
                              <i className="bi bi-shield-lock-fill"></i>
                            </button>
                            <button
                              type="button"
                              className={`btn-action-icon ${u.status === 1 ? "danger" : ""}`}
                              title={
                                u.status === 1
                                  ? "Khóa tài khoản"
                                  : "Mở khóa tài khoản"
                              }
                              onClick={() => handleToggleUserStatus(u.id)}
                            >
                              <i
                                className={`bi ${u.status === 1
                                  ? "bi-lock-fill"
                                  : "bi-unlock-fill"
                                  }`}
                              ></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------- 6. TAB: COUPONS & PROMOTIONS ---------------- */}
          {activeTab === "coupons" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Quản Lý Mã Giảm Giá & Voucher</h3>
                <button type="button" className="btn-admin-primary">
                  <i className="bi bi-plus-lg"></i> Tạo Voucher Mới
                </button>
              </div>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>MÃ VOUCHER</th>
                      <th>MÔ TẢ</th>
                      <th>LOẠI GIẢM</th>
                      <th>GIÁ TRỊ</th>
                      <th>ĐƠN TỐI THIỂU</th>
                      <th>ĐÃ DÙNG / GIỚI HẠN</th>
                      <th>HẠN SỬ DỤNG</th>
                      <th>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <strong
                            style={{
                              color: "#23408e",
                              backgroundColor: "#eef6ff",
                              padding: "4px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {c.code}
                          </strong>
                        </td>
                        <td>{c.desc}</td>
                        <td>
                          {c.type === "FixedAmount"
                            ? "Số tiền cố định"
                            : "Theo phần trăm (%)"}
                        </td>
                        <td>
                          <strong style={{ color: "#ff6b00" }}>
                            {c.type === "FixedAmount"
                              ? `${c.value.toLocaleString("vi-VN")}đ`
                              : `${c.value}%`}
                          </strong>
                        </td>
                        <td>{c.minOrder.toLocaleString("vi-VN")}đ</td>
                        <td>
                          {c.usedCount} / {c.limit} lượt
                        </td>
                        <td>{c.endDate}</td>
                        <td>
                          <span
                            className={`status-badge ${c.status === 1 ? "active" : "blocked"}`}
                            style={{ cursor: "pointer" }}
                            title="Nhấp để bật / tắt mã"
                            onClick={() => handleToggleCouponStatus(c.code)}
                          >
                            {c.status === 1 ? "Đang áp dụng" : "Đã tạm dừng"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------- 7. TAB: VAT INVOICES ---------------- */}
          {activeTab === "invoices" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">
                  Yêu Cầu Xuất Hóa Đơn Điện Tử (VAT)
                </h3>
              </div>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>MÃ ĐƠN HÀNG</th>
                      <th>TÊN CÔNG TY / ĐƠN VỊ</th>
                      <th>MÃ SỐ THUẾ</th>
                      <th>EMAIL NHẬN HÓA ĐƠN</th>
                      <th>ĐỊA CHỈ GPKD</th>
                      <th>SỐ HÓA ĐƠN</th>
                      <th>TRẠNG THÁI</th>
                      <th>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter((o) => o.hasVAT).length === 0 ? (
                      <tr>
                        <td
                          colSpan="8"
                          style={{
                            textAlign: "center",
                            padding: "24px",
                            color: "#666",
                          }}
                        >
                          Chưa có đơn hàng nào yêu cầu xuất hóa đơn VAT điện tử.
                        </td>
                      </tr>
                    ) : (
                      orders
                        .filter((o) => o.hasVAT)
                        .map((o) => (
                          <tr key={o.id}>
                            <td>
                              <strong>{o.orderCode}</strong>
                            </td>
                            <td>
                              <strong>
                                {o.vatInfo?.Company || "Chưa cung cấp"}
                              </strong>
                            </td>
                            <td>{o.vatInfo?.TaxId || "Chưa cung cấp"}</td>
                            <td>
                              {o.vatInfo?.Email ||
                                o.customer?.email ||
                                "Chưa cung cấp"}
                            </td>
                            <td>{o.vatInfo?.Address || "Chưa cung cấp"}</td>
                            <td>
                              <span
                                style={{
                                  fontFamily: "monospace",
                                  fontWeight: 700,
                                  color: "#23408e",
                                }}
                              >
                                {`HD-${o.orderCode?.replace(/[^0-9]/g, "").slice(-8) ||
                                  "202609-001"
                                  }`}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`status-badge ${o.orderStatus === "Completed"
                                  ? "completed"
                                  : "pending"
                                  }`}
                              >
                                {o.orderStatus === "Completed"
                                  ? "Đã phát hành"
                                  : "Chờ xử lý"}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn-action-icon"
                                title="Gửi lại email hóa đơn"
                                onClick={() =>
                                  alert(
                                    `Đã gửi lại thông tin hóa đơn cho đơn hàng ${o.orderCode} tới ${o.vatInfo?.Email || "email khách hàng"
                                    }!`
                                  )
                                }
                              >
                                <i className="bi bi-envelope-check-fill"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------- 8. TAB: BRANCHES ---------------- */}
          {activeTab === "branches" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">
                  Danh Sách Chi Nhánh Cửa Hàng ViDairy
                </h3>
                <button type="button" className="btn-admin-primary">
                  <i className="bi bi-plus-lg"></i> Thêm Chi Nhánh Mới
                </button>
              </div>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>MÃ CHI NHÁNH</th>
                      <th>TÊN CỬA HÀNG</th>
                      <th>ĐỊA CHỈ</th>
                      <th>TỈNH / THÀNH PHỐ</th>
                      <th>HOTLINE</th>
                      <th>GIỜ MỞ CỬA</th>
                      <th>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((b) => (
                      <tr key={b.id || b._id}>
                        <td>
                          <strong>{b.code}</strong>
                        </td>
                        <td>
                          <strong>{b.name}</strong>
                        </td>
                        <td>{b.address}</td>
                        <td>{b.city}</td>
                        <td>
                          <strong style={{ color: "#23408e" }}>{b.phone}</strong>
                        </td>
                        <td>{b.hours}</td>
                        <td>
                          <span
                            className={`status-badge ${b.status === 1 ? "active" : "blocked"
                              }`}
                          >
                            {b.status === 1 ? "Đang mở cửa" : "Tạm đóng cửa"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= MODAL: ORDER DETAILS ================= */}
      {selectedOrder && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                Chi Tiết Đơn Hàng #{selectedOrder.orderCode}
              </h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="admin-modal-body">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  padding: "14px",
                  backgroundColor: "#f8fbff",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <small style={{ color: "#64748b" }}>Người Nhận:</small>
                  <div style={{ fontWeight: 700, color: "#23408e" }}>
                    {selectedOrder.customer}
                  </div>
                  <div>SĐT: {selectedOrder.phone}</div>
                </div>
                <div>
                  <small style={{ color: "#64748b" }}>Hình Thức Nhận:</small>
                  <div style={{ fontWeight: 700 }}>
                    {selectedOrder.type === "DELIVERY"
                      ? "Giao hàng tận nơi"
                      : "Nhận tại điểm bán"}
                  </div>
                  <div style={{ fontSize: "12.5px" }}>
                    {selectedOrder.shippingAddress}
                  </div>
                </div>
              </div>

              <div>
                <h4
                  style={{
                    fontFamily: "ViDairy1",
                    fontSize: "14.5px",
                    color: "#23408e",
                    marginBottom: "8px",
                  }}
                >
                  Danh Sách Sản Phẩm Đã Đặt:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                      }}
                    >
                      <span>
                        {it.name} <strong>x{it.qty}</strong>
                      </span>
                      <strong>{(it.price * it.qty).toLocaleString("vi-VN")}đ</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px dashed #cbd5e1",
                  paddingTop: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "13.5px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Tiền hàng:</span>
                  <span>{selectedOrder.subTotal.toLocaleString("vi-VN")}đ</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#ff4d6d",
                    }}
                  >
                    <span>Giảm giá voucher:</span>
                    <span>-{selectedOrder.discount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 800,
                    fontSize: "16px",
                    color: "#23408e",
                  }}
                >
                  <span>Tổng thanh toán:</span>
                  <span>{selectedOrder.total.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              {selectedOrder.hasVAT && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                >
                  <strong style={{ color: "#1e40af" }}>
                    <i className="bi bi-receipt"></i> Thông Tin Hóa Đơn VAT:
                  </strong>
                  <div>Công ty: {selectedOrder.vatInfo?.company}</div>
                  <div>Mã số thuế: {selectedOrder.vatInfo?.taxId}</div>
                  <div>Email nhận: {selectedOrder.vatInfo?.email}</div>
                  <div>Địa chỉ: {selectedOrder.vatInfo?.address}</div>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn-admin-cancel"
                onClick={() => setSelectedOrder(null)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn-admin-primary"
                onClick={() => {
                  handleUpdateOrderStatus(selectedOrder.id, "Completed");
                  alert("Đã cập nhật trạng thái đơn hàng thành Hoàn Thành!");
                }}
              >
                <i className="bi bi-check2-all"></i> Đánh Dấu Hoàn Thành
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD PRODUCT ================= */}
      {isAddProductOpen && (
        <div
          className="admin-modal-overlay"
          onClick={() => setIsAddProductOpen(false)}
        >
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Thêm Sản Phẩm Mới</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsAddProductOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddProduct}>
              <div className="admin-modal-body">
                {/* Phần Quản Lý & Tải Ảnh Sản Phẩm */}
                <div className="product-img-upload-box">
                  <label className="admin-form-label">
                    <i className="bi bi-image-fill text-blue"></i> Hình Ảnh Sản Phẩm <span style={{ color: "red" }}>*</span>
                  </label>

                  <div className="img-upload-row">
                    {/* Khung Xem Trước Ảnh */}
                    <div className="img-preview-card">
                      {newProduct.img ? (
                        <img
                          src={newProduct.img}
                          alt="Preview"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/src/assets/img/cau_be_vidaiary.png";
                          }}
                        />
                      ) : (
                        <div className="no-img-text">Chưa có ảnh</div>
                      )}
                    </div>

                    <div className="img-upload-controls">
                      {/* Nút Tải ảnh từ máy tính */}
                      <label className="btn-upload-file">
                        <i className="bi bi-cloud-arrow-up-fill"></i> Tải ảnh từ máy tính...
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageFileUpload(e, (url) => setNewProduct({ ...newProduct, img: url }))}
                        />
                      </label>
                      {/* Thư viện ảnh gợi ý có sẵn */}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontFamily: "ViDairy1",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "#23408e",
                      display: "block",
                      marginBottom: "4px",
                      marginTop: "12px",
                    }}
                  >
                    Tên Sản Phẩm <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-select"
                    style={{ width: "100%", boxSizing: "border-box" }}
                    placeholder="VD: Sữa Bột ViDairy Kid Gold..."
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontFamily: "ViDairy1",
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "#23408e",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Danh Mục
                    </label>
                    <select
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, category: e.target.value })
                      }
                    >
                      <option value="Sữa Bột Trẻ Em">Sữa Bột Trẻ Em</option>
                      <option value="Sữa Cho Mẹ Bầu & Sau Sinh">
                        Sữa Cho Mẹ Bầu
                      </option>
                      <option value="Sữa Dinh Dưỡng Người Cao Tuổi">
                        Sữa Người Cao Tuổi
                      </option>
                      <option value="Sữa Hạt Dinh Dưỡng Tự Nhiên">Sữa Hạt</option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontFamily: "ViDairy1",
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "#23408e",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Thương Hiệu
                    </label>
                    <select
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      value={newProduct.brand}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, brand: e.target.value })
                      }
                    >
                      <option value="ViDairy">ViDairy</option>
                      <option value="NutralisBaby">NutralisBaby</option>
                      <option value="NutriCare">NutriCare</option>
                      <option value="Vinamilk">Vinamilk</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontFamily: "ViDairy1",
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "#23408e",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Quy Cách
                    </label>
                    <input
                      type="text"
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      placeholder="VD: Lon 800g"
                      value={newProduct.variant}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, variant: e.target.value })
                      }
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontFamily: "ViDairy1",
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "#23408e",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Độ Tuổi
                    </label>
                    <input
                      type="text"
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      placeholder="VD: 1 - 3 tuổi"
                      value={newProduct.ageGroup}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, ageGroup: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: "ViDairy1",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "#23408e",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Giá Bán (VNĐ) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="admin-select"
                    style={{ width: "100%", boxSizing: "border-box" }}
                    placeholder="580000"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-admin-cancel"
                  onClick={() => setIsAddProductOpen(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-admin-primary">
                  <i className="bi bi-check-lg"></i> Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PRODUCT ================= */}
      {isEditProductOpen && editingProduct && (
        <div
          className="admin-modal-overlay"
          onClick={() => setIsEditProductOpen(false)}
        >
          <div
            className="admin-modal-card"
            style={{ maxWidth: "680px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <i className="bi bi-pencil-square text-blue"></i> Chỉnh Sửa Sản Phẩm & Hình Ảnh
              </h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsEditProductOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct}>
              <div className="admin-modal-body">
                {/* Phần Tải & Đổi Ảnh Sản Phẩm */}
                <div className="product-img-upload-box">
                  <label className="admin-form-label">
                    <i className="bi bi-image-fill text-blue"></i> Hình Ảnh Sản Phẩm
                  </label>

                  <div className="img-upload-row">
                    <div className="img-preview-card">
                      {editingProduct.img ? (
                        <img
                          src={editingProduct.img}
                          alt="Preview"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/src/assets/img/cau_be_vidaiary.png";
                          }}
                        />
                      ) : (
                        <div className="no-img-text">Chưa có ảnh</div>
                      )}
                    </div>

                    <div className="img-upload-controls">
                      <label className="btn-upload-file">
                        <i className="bi bi-cloud-arrow-up-fill"></i> Tải ảnh mới từ máy tính...
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageFileUpload(e, (url) => setEditingProduct({ ...editingProduct, img: url }))}
                        />
                      </label>

                      <input
                        type="text"
                        className="admin-select"
                        style={{ width: "100%", marginTop: "6px", boxSizing: "border-box", fontSize: "13px" }}
                        placeholder="Hoặc dán URL hình ảnh mới"
                        value={editingProduct.img || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, img: e.target.value })}
                      />

                      <div className="preset-img-chips">
                        <span className="chip-label">Ảnh mẫu có sẵn:</span>
                        {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`chip-btn ${editingProduct.img === preset.url ? "active" : ""}`}
                            onClick={() => setEditingProduct({ ...editingProduct, img: preset.url })}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="admin-form-label">Tên Sản Phẩm *</label>
                  <input
                    type="text"
                    className="admin-select"
                    style={{ width: "100%", boxSizing: "border-box" }}
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label">Danh Mục</label>
                    <select
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    >
                      <option value="Sữa Bột Trẻ Em">Sữa Bột Trẻ Em</option>
                      <option value="Sữa Cho Mẹ Bầu & Sau Sinh">Sữa Cho Mẹ Bầu</option>
                      <option value="Sữa Dinh Dưỡng Người Cao Tuổi">Sữa Người Cao Tuổi</option>
                      <option value="Sữa Hạt Dinh Dưỡng Tự Nhiên">Sữa Hạt</option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label">Thương Hiệu</label>
                    <select
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      value={editingProduct.brand}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    >
                      <option value="ViDairy">ViDairy</option>
                      <option value="NutralisBaby">NutralisBaby</option>
                      <option value="NutriCare">NutriCare</option>
                      <option value="Vinamilk">Vinamilk</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label">Quy Cách</label>
                    <input
                      type="text"
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      value={editingProduct.variant}
                      onChange={(e) => setEditingProduct({ ...editingProduct, variant: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label">Độ Tuổi / Đối Tượng</label>
                    <input
                      type="text"
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      value={editingProduct.ageGroup}
                      onChange={(e) => setEditingProduct({ ...editingProduct, ageGroup: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label className="admin-form-label">Giá Bán (VNĐ) *</label>
                  <input
                    type="number"
                    className="admin-select"
                    style={{ width: "100%", boxSizing: "border-box" }}
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setIsEditProductOpen(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-admin-primary">
                  <i className="bi bi-check-lg"></i> Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL PHÂN QUYỀN TÀI KHOẢN ================= */}
      {isRoleModalOpen && selectedUserForRole && (
        <div className="admin-modal-overlay" onClick={() => setIsRoleModalOpen(false)}>
          <div className="admin-modal-content role-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                <i className="bi bi-shield-lock-fill text-blue"></i> Phân Quyền Tài Khoản
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsRoleModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveRolePermissions}>
              <div className="admin-modal-body">
                <div className="role-user-summary">
                  <div className="user-avatar-circle">
                    {selectedUserForRole.fullName ? selectedUserForRole.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="user-info-text">
                    <h4>{selectedUserForRole.fullName}</h4>
                    <p>{selectedUserForRole.email} &bull; Mã: {selectedUserForRole.code}</p>
                  </div>
                </div>

                <div className="admin-form-group margin-top">
                  <label className="admin-form-label">Chọn Vai Trò Hệ Thống (Role):</label>
                  <div className="role-radio-group">
                    <label className={`role-radio-card ${roleForm.role === "CUSTOMER" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="modalRole"
                        value="CUSTOMER"
                        checked={roleForm.role === "CUSTOMER"}
                        onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
                      />
                      <div className="role-card-info">
                        <strong>CUSTOMER (Khách hàng)</strong>
                        <span>Chỉ xem sản phẩm và mua hàng</span>
                      </div>
                    </label>

                    <label className={`role-radio-card ${roleForm.role === "STAFF" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="modalRole"
                        value="STAFF"
                        checked={roleForm.role === "STAFF"}
                        onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
                      />
                      <div className="role-card-info">
                        <strong>STAFF (Nhân viên CSKH)</strong>
                        <span>Xem đơn hàng, hỗ trợ tư vấn khách hàng</span>
                      </div>
                    </label>

                    <label className={`role-radio-card ${roleForm.role === "MANAGER" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="modalRole"
                        value="MANAGER"
                        checked={roleForm.role === "MANAGER"}
                        onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
                      />
                      <div className="role-card-info">
                        <strong>MANAGER (Quản lý cửa hàng)</strong>
                        <span>Quản lý sản phẩm và đơn hàng</span>
                      </div>
                    </label>

                    <label className={`role-radio-card ${roleForm.role === "ADMIN" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="modalRole"
                        value="ADMIN"
                        checked={roleForm.role === "ADMIN"}
                        onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
                      />
                      <div className="role-card-info">
                        <strong>ADMIN (Quản trị viên)</strong>
                        <span>Toàn quyền quản trị hệ thống</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="admin-form-group margin-top">
                  <label className="admin-form-label">Danh Sách Quyền Hạn Chi Tiết (Permissions):</label>
                  <div className="permissions-grid">
                    {[
                      { key: "manage_products", label: "Quản lý Sản Phẩm & Giá", desc: "Thêm, sửa, xóa danh mục và giá sản phẩm" },
                      { key: "manage_orders", label: "Quản lý Đơn Hàng", desc: "Xem, cập nhật trạng thái giao hàng" },
                      { key: "manage_coupons", label: "Quản lý Mã Giảm Giá", desc: "Tạo và bật/tắt voucher khuyến mãi" },
                      { key: "manage_users", label: "Quản lý Người Dùng & Phân Quyền", desc: "Xem danh sách và đổi quyền tài khoản" },
                    ].map((perm) => (
                      <label key={perm.key} className="permission-item-box">
                        <input
                          type="checkbox"
                          checked={roleForm.permissions.includes(perm.key)}
                          onChange={() => handleTogglePermission(perm.key)}
                        />
                        <div className="perm-text">
                          <strong>{perm.label}</strong>
                          <span>{perm.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={() => setIsRoleModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-admin-primary">
                  <i className="bi bi-shield-check"></i> Lưu Phân Quyền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


