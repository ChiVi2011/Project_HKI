import { useState, useEffect, useMemo } from "react";
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
    hasVAT: true,
    vatInfo: {
      company: "Công Ty Cổ Phần Dinh Dưỡng Quốc Tế Care",
      taxId: "0108923456",
      email: "ketoan@careintl.vn",
      address: "Tầng 5, Tòa nhà Sunwah, Quận 1, TP.HCM",
    },
  },
  {
    id: 2,
    orderCode: "VD20260903002",
    customer: "Phạm Thùy Linh",
    phone: "0987654321",
    type: "DELIVERY",
    shippingAddress:
      "Tòa nhà Landmark 81, 720A Điện Biên Phủ, P.22, Q.Bình Thạnh, TP.HCM",
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
  {
    id: 4,
    orderCode: "VD20260905004",
    customer: "Trần Bảo Ngọc",
    phone: "0934567890",
    type: "DELIVERY",
    shippingAddress: "25 Hoàng Văn Thụ, P.8, Q.Phú Nhuận, TP.HCM",
    items: [
      { name: "Sữa Bột ViDairy Kid Gold (Lon 800g)", qty: 3, price: 580000 },
    ],
    subTotal: 1740000,
    discount: 50000,
    total: 1690000,
    paymentMethod: "MOMO",
    paymentStatus: "Completed",
    orderStatus: "Completed",
    createdAt: "2026-09-05 14:20",
    hasVAT: true,
    vatInfo: {
      company: "Trường Quốc Tế Mầm Non Ánh Dương",
      taxId: "0314778899",
      email: "taichinh@anhduongschool.edu.vn",
      address: "Số 25 Hoàng Văn Thụ, P.8, Q.Phú Nhuận, TP.HCM",
    },
  },
  {
    id: 5,
    orderCode: "VD20260906005",
    customer: "Nguyễn Văn Hùng",
    phone: "0901234567",
    type: "DELIVERY",
    shippingAddress: "150 Nguyễn Trãi, Phường 3, Quận 5, TP.HCM",
    items: [{ name: "Sữa Hạt ViDairy Nutri Organic", qty: 4, price: 480000 }],
    subTotal: 1920000,
    discount: 100000,
    total: 1820000,
    paymentMethod: "BANKING_QR",
    paymentStatus: "Completed",
    orderStatus: "Completed",
    createdAt: "2026-09-06 16:00",
    hasVAT: true,
    vatInfo: {
      company: "Phòng Khám Đa Khoa Sức Khỏe Vàng",
      taxId: "0316223344",
      email: "hoadon@suckhoevang.vn",
      address: "Số 150 Nguyễn Trãi, Quận 5, TP.HCM",
    },
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
    fullName: "Quản trị viên VitaDairy",
    email: "admin@vidairy.vn",
    phone: "0989584592",
    role: "ADMIN",
    permissions: [
      "manage_products",
      "manage_orders",
      "manage_coupons",
      "manage_users",
    ],
    status: 1,
    createdAt: "2026-08-01",
  },
  {
    id: 2,
    code: "QL000001",
    fullName: "Nguyễn Chí Vĩ (Quản lý cửa hàng)",
    email: "chivinguyen1998@gmail.com",
    phone: "0989584592",
    role: "MANAGER",
    permissions: ["manage_products", "manage_orders"],
    status: 1,
    createdAt: "2026-08-10",
  },
  {
    id: 3,
    code: "NV000001",
    fullName: "Trần Thị Thu Hà (Nhân viên CSKH)",
    email: "staff@vidairy.vn",
    phone: "0901234567",
    role: "STAFF",
    status: 1,
    createdAt: "2026-08-15",
  },
  {
    id: 4,
    code: "KH000001",
    fullName: "Lê Minh Hoàng",
    email: "khachhang@gmail.com",
    phone: "0912345678",
    role: "CUSTOMER",
    status: 1,
    createdAt: "2026-09-01",
  },
  {
    id: 5,
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
  const { user, isSuperAdmin, isAdmin, canAccessAdmin, token, logout } =
    useAuth();
  const navigate = useNavigate();

  const roleUpper = user?.Role
    ? String(user.Role).toUpperCase()
    : user?.role
      ? String(user.role).toUpperCase()
      : "";

  const isSuper = Boolean(
    isSuperAdmin ||
    roleUpper === "SUPERADMIN" ||
    user?.Email === "superadmin@vidairy.vn",
  );

  const isManagerUser = Boolean(roleUpper === "MANAGER");

  const isAdminUser = Boolean(
    isSuper ||
    isAdmin ||
    roleUpper === "ADMIN" ||
    roleUpper === "MANAGER" ||
    user?.Email === "admin@vidairy.vn",
  );

  // Chặn người chưa đăng nhập hoặc khách hàng (CUSTOMER) truy cập trang Admin
  useEffect(() => {
    if (!token && !user) {
      navigate("/login");
      return;
    }
    if (user && user.Role === "CUSTOMER") {
      alert(
        "⚠️ Tài khoản Khách hàng (CUSTOMER) không có quyền truy cập trang Quản trị!",
      );
      navigate("/home");
    }
  }, [user, token, navigate]);

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

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceSortAsc, setInvoiceSortAsc] = useState(true);

  // Timeframe states cho Dashboard (Năm / Quý / Tháng)
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [dashboardTimeframe, setDashboardTimeframe] = useState("QUARTER"); // "YEAR" | "QUARTER" | "MONTH"
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedQuarter, setSelectedQuarter] = useState(3);
  const [selectedMonth, setSelectedMonth] = useState(9);

  // State in hóa đơn VAT
  const [printableInvoiceOrder, setPrintableInvoiceOrder] = useState(null);

  // State Banners
  const [banners, setBanners] = useState([
    {
      id: "banner-hero-cover",
      BannerID: "banner-hero-cover",
      title: "VitaDairy Luôn Đồng Hành Cùng Mẹ Và Bé",
      position: "Trang Sản Phẩm (Cover Hero)",
      page: "product-list",
      imageUrl: "/src/assets/img/mother_baby_banner.jpg",
      linkUrl: "/products",
      description:
        "ViDairy hướng tới sản xuất các sản phẩm sữa chăm sóc sức khỏe người tiêu dùng ở nhiều lứa tuổi...",
      displayOrder: 1,
      status: 1,
    },
    {
      id: "banner-home-hero",
      BannerID: "banner-home-hero",
      title: "Dinh Dưỡng Vàng Cho Tương Lai Khỏe Mạnh",
      position: "Trang Chủ (Hero Banner)",
      page: "home",
      imageUrl: "/src/assets/img/ViDairy_banner_1536x816.png",
      linkUrl: "/products",
      description: "Kháng thể tự nhiên ColosIgG 24h nhập khẩu độc quyền từ Mỹ",
      displayOrder: 2,
      status: 1,
    },
    {
      id: "banner-child-care",
      BannerID: "banner-child-care",
      title: "Dinh Dưỡng Vượt Trội Cho Bé Yêu",
      position: "Danh Mục Trẻ Em",
      page: "product-list",
      imageUrl: "/src/assets/img/cau_be_vidaiary.png",
      linkUrl: "/products?category=san-pham-cho-be",
      description: "Phát triển não bộ và tăng cường miễn dịch",
      displayOrder: 3,
      status: 1,
    },
    {
      id: "banner-nut-milk",
      BannerID: "banner-nut-milk",
      title: "Sống Khỏe Mỗi Ngày Với Sữa Hạt Tự Nhiên",
      position: "Danh Mục Sữa Hạt",
      page: "product-list",
      imageUrl: "/src/assets/img/sua_hat_vidairy.png",
      linkUrl: "/products?category=dung-kem",
      description: "Thuần thực vật thanh nhẹ giàu chất chống oxy hóa",
      displayOrder: 4,
      status: 1,
    },
  ]);

  // State Cài đặt hệ thống (Settings)
  const [settings, setSettings] = useState({
    settingKey: "general_settings",
    siteName: "ViDairy - Sữa Dinh Dưỡng Chuẩn Y Học",
    logoUrl: "/src/assets/img/logo.png",
    faviconUrl: "/src/assets/favicon/favicon.ico",
    hotline: "0989 584 592",
    email: "cskh@vidairy.vn",
    address: "Số 120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    productPageBanner: "/src/assets/img/mother_baby_banner.jpg",
    productPageTitle: "VitaDairy Luôn Đồng Hành Cùng Mẹ Và Bé",
    productPageDescription:
      "ViDairy hướng tới sản xuất các sản phẩm sữa chăm sóc sức khỏe người tiêu dùng ở nhiều lứa tuổi từ những sản phẩm cung cấp năng lượng cho người lớn, sản phẩm chuyên biệt dành cho người bệnh, sản phẩm cho trẻ biếng ăn, suy dinh dưỡng thấp còi đến các dòng sản phẩm giúp bé phát triển trí não, tăng chiều cao...",
    homeHeroTitle: "Dinh Dưỡng Vàng Cho Tương Lai Khỏe Mạnh",
    homeHeroSubtitle:
      "Kháng thể tự nhiên ColosIgG 24h nhập khẩu độc quyền từ Mỹ",
    homeHeroBanner: "/src/assets/img/ViDairy_banner_1536x816.png",
    brandSlogan: "ViDairy - Trao Sức Khỏe, Trọn Yêu Thương",
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // State Banner Modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    position: "Trang Sản Phẩm (Cover Hero)",
    page: "product-list",
    imageUrl: "/src/assets/img/mother_baby_banner.jpg",
    linkUrl: "/products",
    description: "",
    displayOrder: 1,
    status: 1,
  });

  // State & Handler cho Phân quyền tài khoản (Role & Permissions)
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleForm, setRoleForm] = useState({
    role: "CUSTOMER",
    permissions: [],
  });

  // Đổi vai trò nhanh từ dropdown
  const handleQuickRoleChange = async (userId, newRole) => {
    const currentUserId = user?.UserID || user?.id || user?._id;
    const targetUser = users.find((u) => u.id === userId);

    const isTargetSuperAdmin =
      targetUser?.role === "SUPERADMIN" ||
      targetUser?.email === "superadmin@vidairy.vn";

    if (isTargetSuperAdmin) {
      alert(
        "⚠️ Tài khoản Super Admin là cấp cao nhất tối cao của hệ thống, không thể can thiệp!",
      );
      return;
    }

    if (currentUserId && String(userId) === String(currentUserId)) {
      alert("⚠️ Bạn không thể tự thay đổi vai trò của chính mình!");
      return;
    }

    if (
      !user ||
      !["SUPERADMIN", "ADMIN", "MANAGER"].includes(user.Role?.toUpperCase())
    ) {
      alert(
        "⚠️ Chỉ Super Admin, Quản trị viên và Quản lý mới có quyền thay đổi vai trò người dùng!",
      );
      return;
    }

    if (newRole === "SUPERADMIN") {
      alert("⚠️ Vai trò Super Admin là tối cao và duy nhất!");
      return;
    }

    if (newRole === "ADMIN" && !isSuper) {
      alert(
        "⚠️ Chỉ Super Admin mới có quyền chỉ định vai trò Quản trị viên (ADMIN)!",
      );
      return;
    }

    if (targetUser?.role === "ADMIN" && !isSuper) {
      alert(
        "⚠️ Chỉ Super Admin mới có quyền thay đổi vai trò của Quản trị viên (ADMIN)!",
      );
      return;
    }

    try {
      const res = await productService.updateUserRole(
        userId,
        newRole,
        null,
        token,
      );
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
        alert(
          `🎉 Đã cập nhật vai trò của "${targetUser?.fullName}" thành "${newRole}" thành công!`,
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
    const currentUserId = user?.UserID || user?.id || user?._id;
    const isTargetSuperAdmin =
      userItem.role === "SUPERADMIN" ||
      userItem.email === "superadmin@vidairy.vn";

    if (isTargetSuperAdmin) {
      alert(
        "⚠️ Tài khoản Super Admin có toàn quyền tối cao toàn hệ thống và không thể can thiệp!",
      );
      return;
    }

    if (currentUserId && String(userItem.id) === String(currentUserId)) {
      alert("⚠️ Bạn không thể tự phân quyền cho chính mình!");
      return;
    }

    if (
      !user ||
      !["SUPERADMIN", "ADMIN", "MANAGER"].includes(user.Role?.toUpperCase())
    ) {
      alert(
        "⚠️ Chỉ Super Admin, Quản trị viên và Quản lý mới có quyền phân quyền cho tài khoản khác!",
      );
      return;
    }

    if (userItem.role === "ADMIN" && !isSuper) {
      alert(
        "⚠️ Chỉ Super Admin mới có quyền phân quyền cho Quản trị viên (ADMIN)!",
      );
      return;
    }

    if (userItem.role === "CUSTOMER") {
      alert(
        "⚠️ Tài khoản Khách hàng (CUSTOMER) không có phân quyền chi tiết trong trang quản trị!",
      );
      return;
    }

    setSelectedUserForRole(userItem);
    setRoleForm({
      role: userItem.role || "STAFF",
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

    const currentUserId = user?.UserID || user?.id || user?._id;
    const isTargetSuperAdmin =
      selectedUserForRole.role === "SUPERADMIN" ||
      selectedUserForRole.email === "superadmin@vidairy.vn";

    if (isTargetSuperAdmin) {
      alert("⚠️ Tài khoản Super Admin tối cao cố định và không thể can thiệp!");
      return;
    }

    if (
      currentUserId &&
      String(selectedUserForRole.id) === String(currentUserId)
    ) {
      alert("⚠️ Bạn không thể tự phân quyền hoặc đổi vai trò cho chính mình!");
      return;
    }

    if (
      !user ||
      !["SUPERADMIN", "ADMIN", "MANAGER"].includes(user.Role?.toUpperCase())
    ) {
      alert(
        "⚠️ Chỉ Super Admin, Quản trị viên và Quản lý mới có quyền phân quyền cho tài khoản khác!",
      );
      return;
    }

    if (roleForm.role === "SUPERADMIN") {
      alert("⚠️ Không thể gán vai trò Super Admin!");
      return;
    }

    if (roleForm.role === "ADMIN" && !isSuper) {
      alert("⚠️ Chỉ Super Admin mới có quyền chỉ định Quản trị viên (ADMIN)!");
      return;
    }

    const finalPermissions =
      roleForm.role === "CUSTOMER" ? [] : roleForm.permissions;

    try {
      const res = await productService.updateUserRole(
        selectedUserForRole.id,
        roleForm.role,
        finalPermissions,
        token,
      );

      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUserForRole.id
              ? { ...u, role: roleForm.role, permissions: finalPermissions }
              : u,
          ),
        );
        alert(
          `🎉 Đã cập nhật phân quyền cho người dùng "${selectedUserForRole.fullName}" thành công!`,
        );
        setIsRoleModalOpen(false);
      } else {
        alert(res.message || "Lỗi khi cập nhật phân quyền.");
      }
    } catch (err) {
      alert("Lỗi khi kết nối đến máy chủ.");
    }
  };

  // Lưu cấu hình cài đặt hệ thống & nội dung
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await productService.updateSettings(settings);
      if (res.success) {
        alert(
          "🎉 Đã lưu và đồng bộ toàn bộ Cài đặt Hệ thống lên MongoDB Atlas thành công!",
        );
      } else {
        alert(res.message || "Lỗi khi lưu cài đặt.");
      }
    } catch (err) {
      alert("Lỗi kết nối khi lưu cài đặt hệ thống.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Khôi phục cài đặt mặc định
  const handleResetSettings = async () => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn khôi phục cài đặt hệ thống về mặc định ViDairy?",
      )
    )
      return;
    try {
      const res = await productService.resetSettings();
      if (res.success && res.data) {
        setSettings(res.data);
        alert("🎉 Đã khôi phục cài đặt hệ thống về mặc định thành công!");
      }
    } catch (err) {
      alert("Lỗi khi khôi phục cài đặt.");
    }
  };

  // Mở modal thêm Banner
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: "",
      position: "Trang Sản Phẩm (Cover Hero)",
      page: "product-list",
      imageUrl: "/src/assets/img/mother_baby_banner.jpg",
      linkUrl: "/products",
      description: "",
      displayOrder: banners.length + 1,
      status: 1,
    });
    setIsBannerModalOpen(true);
  };

  // Mở modal sửa Banner
  const handleOpenEditBanner = (b) => {
    setEditingBanner(b);
    setBannerForm({
      title: b.title || "",
      position: b.position || "Trang Sản Phẩm (Cover Hero)",
      page: b.page || "product-list",
      imageUrl: b.imageUrl || "/src/assets/img/mother_baby_banner.jpg",
      linkUrl: b.linkUrl || "/products",
      description: b.description || "",
      displayOrder: b.displayOrder || 1,
      status: b.status !== undefined ? b.status : 1,
    });
    setIsBannerModalOpen(true);
  };

  // Lưu Banner (Tạo mới hoặc Sửa)
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!bannerForm.title || !bannerForm.imageUrl) {
      alert("Vui lòng nhập tiêu đề và link hình ảnh banner!");
      return;
    }

    try {
      if (editingBanner) {
        const bannerId =
          editingBanner.BannerID || editingBanner.id || editingBanner._id;
        const res = await productService.updateBanner(bannerId, bannerForm);
        if (res.success) {
          setBanners((prev) =>
            prev.map((b) =>
              b.BannerID === bannerId || b.id === bannerId || b._id === bannerId
                ? { ...b, ...bannerForm }
                : b,
            ),
          );
          alert(`🎉 Đã cập nhật banner "${bannerForm.title}" thành công!`);
          setIsBannerModalOpen(false);
        } else {
          alert(res.message || "Lỗi khi cập nhật banner.");
        }
      } else {
        const res = await productService.createBanner(bannerForm);
        if (res.success && res.data) {
          setBanners((prev) => [res.data, ...prev]);
          alert(`🎉 Đã tạo banner mới "${bannerForm.title}" thành công!`);
          setIsBannerModalOpen(false);
        } else {
          alert(res.message || "Lỗi khi tạo banner.");
        }
      }
    } catch (err) {
      alert("Lỗi kết nối khi lưu banner.");
    }
  };

  // Bật/tắt trạng thái banner
  const handleToggleBannerStatus = async (bannerItem) => {
    const bannerId = bannerItem.BannerID || bannerItem.id || bannerItem._id;
    try {
      const res = await productService.toggleBannerStatus(bannerId);
      if (res.success) {
        setBanners((prev) =>
          prev.map((b) =>
            b.BannerID === bannerId || b.id === bannerId || b._id === bannerId
              ? { ...b, status: b.status === 1 ? 0 : 1 }
              : b,
          ),
        );
      } else {
        alert(res.message || "Lỗi khi đổi trạng thái banner.");
      }
    } catch (err) {
      alert("Lỗi kết nối khi đổi trạng thái banner.");
    }
  };

  // Xóa banner
  const handleDeleteBanner = async (bannerItem) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa banner "${bannerItem.title}" khỏi cơ sở dữ liệu?`,
      )
    )
      return;
    const bannerId = bannerItem.BannerID || bannerItem.id || bannerItem._id;
    try {
      const res = await productService.deleteBanner(bannerId);
      if (res.success) {
        setBanners((prev) =>
          prev.filter(
            (b) =>
              b.BannerID !== bannerId &&
              b.id !== bannerId &&
              b._id !== bannerId,
          ),
        );
        alert("Đã xóa banner thành công!");
      } else {
        alert(res.message || "Lỗi khi xóa banner.");
      }
    } catch (err) {
      alert("Lỗi kết nối khi xóa banner.");
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

      const res = await productService.updateProduct(
        editingProduct.id,
        payload,
      );
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
              : p,
          ),
        );
        alert(
          `🎉 Đã cập nhật thông tin và hình ảnh sản phẩm "${editingProduct.name}" thành công!`,
        );
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
              })),
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
                img:
                  p.imageUrl ||
                  p.ImageURL ||
                  p.img ||
                  "/src/assets/img/cau_be_vidaiary.png",
                raw: p,
              })),
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
              })),
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
              })),
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

      // 6. Tải Banners
      productService
        .getBanners()
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setBanners(res.data);
          }
        })
        .catch((err) => console.warn("Lỗi tải banners admin:", err));

      // 7. Tải Cài đặt hệ thống (Settings)
      productService
        .getSettings()
        .then((res) => {
          if (res.success && res.data) {
            setSettings(res.data);
          }
        })
        .catch((err) => console.warn("Lỗi tải settings admin:", err));
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
              : o,
          ),
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
    const currentUserId = user?.UserID || user?.id || user?._id;
    const targetUser = users.find((u) => u.id === userId);

    if (
      targetUser?.role === "SUPERADMIN" ||
      targetUser?.email === "superadmin@vidairy.vn"
    ) {
      alert(
        "⚠️ Không thể can thiệp hoặc khóa tài khoản Super Admin cấp cao nhất của hệ thống!",
      );
      return;
    }

    if (
      (targetUser?.role === "ADMIN" ||
        targetUser?.email === "admin@vidairy.vn") &&
      !isSuper
    ) {
      alert(
        "⚠️ Chỉ Super Admin mới có quyền khóa hoặc mở khóa tài khoản Quản trị viên (ADMIN)!",
      );
      return;
    }

    if (currentUserId && String(userId) === String(currentUserId)) {
      alert("⚠️ Bạn không thể tự khóa tài khoản của chính mình!");
      return;
    }

    if (
      !user ||
      !["SUPERADMIN", "ADMIN", "MANAGER"].includes(user.Role?.toUpperCase())
    ) {
      alert(
        "⚠️ Chỉ Super Admin, Quản trị viên và Quản lý mới có quyền thay đổi trạng thái tài khoản!",
      );
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/users/${userId}/status`,
        {
          method: "PATCH",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, status: json.data?.Status ? 1 : 0 } : u,
          ),
        );
      } else {
        alert(json.message || "Lỗi khi chuyển trạng thái người dùng.");
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
            p.id === productId ? { ...p, status: res.data?.Status ? 1 : 0 } : p,
          ),
        );
      }
    } catch (err) {
      alert("Lỗi khi chuyển trạng thái sản phẩm.");
    }
  };

  // Xóa sản phẩm khỏi Database
  const handleDeleteProduct = async (productId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa sản phẩm này khỏi cơ sở dữ liệu?",
      )
    )
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
            c.code === couponCode
              ? { ...c, status: res.data?.Status ? 1 : 0 }
              : c,
          ),
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

  // Hàm tạo & chuẩn hóa số hóa đơn VAT
  const getInvoiceNumber = (o) => {
    if (o.invoiceNumber) return o.invoiceNumber;
    if (o.InvoiceNumber) return o.InvoiceNumber;
    if (o.vatInfo?.invoiceNumber) return o.vatInfo.invoiceNumber;
    const digits = (o.orderCode || o.OrderCode || "").replace(/\D/g, "");
    if (digits.length >= 6) {
      return `HD-${digits.slice(-8)}`;
    }
    const idVal =
      typeof o.id === "number"
        ? o.id
        : parseInt(String(o.id).replace(/\D/g, ""), 10) || 1;
    return `HD-${String(idVal).padStart(6, "0")}`;
  };

  // Lọc và sắp xếp danh sách Hóa đơn VAT theo thứ tự số hóa đơn tăng dần (hoặc giảm dần nếu bấm đảo chiều)
  const vatOrders = orders.filter((o) => o.hasVAT);
  const filteredVatOrders = vatOrders
    .filter((o) => {
      const invNo = getInvoiceNumber(o).toLowerCase();
      const code = (o.orderCode || "").toLowerCase();
      const comp = (
        o.vatInfo?.company ||
        o.vatInfo?.Company ||
        ""
      ).toLowerCase();
      const tax = (o.vatInfo?.taxId || o.vatInfo?.TaxId || "").toLowerCase();
      const em = (
        o.vatInfo?.email ||
        o.vatInfo?.Email ||
        o.customer ||
        ""
      ).toLowerCase();
      const q = invoiceSearch.toLowerCase();
      return (
        !q ||
        invNo.includes(q) ||
        code.includes(q) ||
        comp.includes(q) ||
        tax.includes(q) ||
        em.includes(q)
      );
    })
    .sort((a, b) => {
      const invA = getInvoiceNumber(a);
      const invB = getInvoiceNumber(b);
      const cmp = invA.localeCompare(invB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return invoiceSortAsc ? cmp : -cmp;
    });

  // Thống kê Doanh thu & Đơn hàng theo Năm / Quý / Tháng
  const dashboardStats = useMemo(() => {
    const rawYears = orders.map((o) => {
      const d = new Date(o.createdAt);
      return isNaN(d.getFullYear()) ? 2026 : d.getFullYear();
    });
    const orderYears = Array.from(
      new Set([2026, 2025, 2024, ...rawYears]),
    ).sort((a, b) => b - a);

    const filteredOrders = orders.filter((o) => {
      const d = new Date(o.createdAt);
      if (isNaN(d.getTime())) return true;
      const yr = d.getFullYear();
      const mo = d.getMonth() + 1;
      const qtr = Math.ceil(mo / 3);

      if (yr !== Number(selectedYear)) return false;

      if (dashboardTimeframe === "QUARTER") {
        return qtr === Number(selectedQuarter);
      }
      if (dashboardTimeframe === "MONTH") {
        return mo === Number(selectedMonth);
      }
      return true; // Mode YEAR
    });

    const revenue = filteredOrders.reduce(
      (sum, o) => sum + (Number(o.total) || 0),
      0,
    );
    const orderCount = filteredOrders.length;
    const completedCount = filteredOrders.filter(
      (o) => o.orderStatus === "Completed",
    ).length;
    const processingCount = filteredOrders.filter(
      (o) =>
        o.orderStatus === "Processing" ||
        o.orderStatus === "Pending" ||
        o.orderStatus === "Shipping",
    ).length;
    const avgOrderValue = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

    // Dữ liệu biểu đồ cột
    let chartBars = [];

    if (dashboardTimeframe === "YEAR") {
      const quarterNames = [
        "Quý 1 (T1-T3)",
        "Quý 2 (T4-T6)",
        "Quý 3 (T7-T9)",
        "Quý 4 (T10-T12)",
      ];
      const quarterRevs = [0, 0, 0, 0];
      const quarterOrders = [0, 0, 0, 0];

      orders.forEach((o) => {
        const d = new Date(o.createdAt);
        if (isNaN(d.getTime())) return;
        if (d.getFullYear() === Number(selectedYear)) {
          const qIdx = Math.min(
            3,
            Math.max(0, Math.ceil((d.getMonth() + 1) / 3) - 1),
          );
          quarterRevs[qIdx] += Number(o.total) || 0;
          quarterOrders[qIdx] += 1;
        }
      });

      const maxRev = Math.max(...quarterRevs, 1);
      chartBars = quarterNames.map((name, idx) => ({
        label: name,
        revenue: quarterRevs[idx],
        orderCount: quarterOrders[idx],
        heightPercent:
          quarterRevs[idx] > 0
            ? Math.max(12, Math.round((quarterRevs[idx] / maxRev) * 100))
            : 6,
      }));
    } else if (dashboardTimeframe === "QUARTER") {
      const startMonth = (Number(selectedQuarter) - 1) * 3 + 1;
      const monthNames = [
        `Tháng ${startMonth}`,
        `Tháng ${startMonth + 1}`,
        `Tháng ${startMonth + 2}`,
      ];
      const monthRevs = [0, 0, 0];
      const monthOrders = [0, 0, 0];

      filteredOrders.forEach((o) => {
        const d = new Date(o.createdAt);
        if (isNaN(d.getTime())) return;
        const mo = d.getMonth() + 1;
        const idx = mo - startMonth;
        if (idx >= 0 && idx < 3) {
          monthRevs[idx] += Number(o.total) || 0;
          monthOrders[idx] += 1;
        }
      });

      const maxRev = Math.max(...monthRevs, 1);
      chartBars = monthNames.map((name, idx) => ({
        label: name,
        revenue: monthRevs[idx],
        orderCount: monthOrders[idx],
        heightPercent:
          monthRevs[idx] > 0
            ? Math.max(12, Math.round((monthRevs[idx] / maxRev) * 100))
            : 6,
      }));
    } else {
      // Mode MONTH: Chia 4 tuần
      const weekNames = [
        "Tuần 1 (1-7)",
        "Tuần 2 (8-14)",
        "Tuần 3 (15-21)",
        "Tuần 4 (22+)",
      ];
      const weekRevs = [0, 0, 0, 0];
      const weekOrders = [0, 0, 0, 0];

      filteredOrders.forEach((o) => {
        const d = new Date(o.createdAt);
        if (isNaN(d.getTime())) return;
        const day = d.getDate();
        let wIdx = 0;
        if (day >= 22) wIdx = 3;
        else if (day >= 15) wIdx = 2;
        else if (day >= 8) wIdx = 1;
        else wIdx = 0;

        weekRevs[wIdx] += Number(o.total) || 0;
        weekOrders[wIdx] += 1;
      });

      const maxRev = Math.max(...weekRevs, 1);
      chartBars = weekNames.map((name, idx) => ({
        label: name,
        revenue: weekRevs[idx],
        orderCount: weekOrders[idx],
        heightPercent:
          weekRevs[idx] > 0
            ? Math.max(12, Math.round((weekRevs[idx] / maxRev) * 100))
            : 6,
      }));
    }

    let timeframeLabel = "";
    if (dashboardTimeframe === "YEAR") {
      timeframeLabel = `Năm ${selectedYear}`;
    } else if (dashboardTimeframe === "QUARTER") {
      timeframeLabel = `Quý ${selectedQuarter}/${selectedYear}`;
    } else {
      timeframeLabel = `Tháng ${selectedMonth}/${selectedYear}`;
    }

    // Top selling trong khoảng thời gian đã chọn
    const productSalesMap = {};
    filteredOrders.forEach((o) => {
      (o.items || []).forEach((it) => {
        const key = it.name || it.productName || "Sản phẩm";
        if (!productSalesMap[key]) {
          productSalesMap[key] = {
            name: key,
            qty: 0,
            revenue: 0,
            variant: it.variant || "Lon tiêu chuẩn",
            img: it.img || it.image || "/src/assets/img/product_1.jpg",
          };
        }
        productSalesMap[key].qty += Number(it.qty) || 1;
        productSalesMap[key].revenue +=
          (Number(it.price) || 0) * (Number(it.qty) || 1);
      });
    });

    const topSelling = Object.values(productSalesMap).sort(
      (a, b) => b.revenue - a.revenue,
    );

    return {
      orderYears,
      filteredOrders,
      revenue,
      orderCount,
      completedCount,
      processingCount,
      avgOrderValue,
      chartBars,
      timeframeLabel,
      topSelling,
    };
  }, [
    orders,
    dashboardTimeframe,
    selectedYear,
    selectedQuarter,
    selectedMonth,
  ]);

  // Thống kê nhanh toàn thời gian
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === "Processing" || o.orderStatus === "Pending",
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
              <span>Đơn hàng toàn sàn</span>
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
              <span>Hóa đơn VAT ({vatOrders.length})</span>
            </div>
          </button>

          <span className="admin-nav-section-title">
            QUẢN TRỊ NỘI DUNG & HỆ THỐNG
          </span>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "banners" ? "active" : ""}`}
            onClick={() => setActiveTab("banners")}
          >
            <div className="admin-nav-item-content">
              <i className="bi bi-images"></i>
              <span>Banner & Hình Ảnh</span>
            </div>
            <span className="admin-nav-badge blue">{banners.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <div className="admin-nav-item-content">
              <i className="bi bi-gear-wide-connected"></i>
              <span>Cài Đặt & Nội Dung</span>
            </div>
          </button>

          <span className="admin-nav-section-title">
            NGƯỜI DÙNG & CHI NHÁNH
          </span>
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
            className={`admin-nav-item ${activeTab === "branches" ? "active" : ""}`}
            onClick={() => setActiveTab("branches")}
          >
            <div className="admin-nav-item-content">
              <i className="bi bi-shop"></i>
              <span>Chi nhánh (3)</span>
            </div>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: isSuper ? "#fef08a" : "#e0e7ff",
                color: isSuper ? "#854d0e" : "#3730a3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              {isSuper
                ? "👑"
                : user?.FullName
                  ? user.FullName.charAt(0).toUpperCase()
                  : "A"}
            </div>
            <div className="admin-user-details">
              <span
                className="admin-user-name"
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {user?.FullName ||
                  (isSuper ? "Super Administrator" : "Quản trị viên")}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: isSuper ? "#eab308" : "#6366f1",
                  fontWeight: 600,
                }}
              >
                {isSuper ? "Cấp Tối Cao (SuperAdmin)" : "Quản Trị Viên (Admin)"}
              </span>
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
              {activeTab === "orders" && "Quản Lý Đơn Đặt Hàng Toàn Sàn"}
              {activeTab === "products" && "Danh Mục & Quản Lý Sản Phẩm"}
              {activeTab === "users" &&
                "Quản Lý Khách Hàng & Phân Quyền (Tối Cao)"}
              {activeTab === "coupons" && "Khuyến Mãi & Voucher Giảm Giá"}
              {activeTab === "invoices" &&
                "Yêu Cầu Xuất Hóa Đơn Doanh Nghiệp (VAT)"}
              {activeTab === "banners" && "Quản Lý Banner & Hình Ảnh Hệ Thống"}
              {activeTab === "settings" &&
                "Cài Đặt Toàn Hệ Thống & Nội Dung Website (MongoDB Atlas)"}
              {activeTab === "branches" &&
                "Hệ Thống Chi Nhánh Cửa Hàng ViDairy"}
            </h1>
          </div>

          <div className="admin-topbar-right">
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
                <div
                  className="admin-kpi-card"
                  onClick={() => setIsRevenueModalOpen(true)}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    border: "1.5px solid #bfdbfe",
                    boxShadow: "0 4px 16px rgba(35, 64, 142, 0.08)",
                    transition: "all 0.2s ease",
                  }}
                  title="Nhấn để xem chi tiết theo Quý & Năm"
                >
                  <div className="admin-kpi-info">
                    <span className="admin-kpi-label">Tổng Doanh Thu</span>
                    <span className="admin-kpi-val">
                      {totalRevenue.toLocaleString("vi-VN")}đ
                    </span>
                    <span
                      className="admin-kpi-trend up"
                      style={{ fontSize: "11.5px" }}
                    >
                      <i className="bi bi-pie-chart-fill"></i> Chi tiết theo Quý
                      / Năm ➔
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
                    <span className="admin-kpi-val">
                      {users.length} tài khoản
                    </span>
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
                    <span className="admin-kpi-val">
                      {products.length} dòng sữa
                    </span>
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
                    <div>
                      <h3 className="admin-card-title">
                        Thống Kê Doanh Thu 7 Ngày Gần Nhất
                      </h3>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        Biểu đồ tuần hiện tại
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span className="status-badge active">Tuần Này</span>
                      <button
                        type="button"
                        onClick={() => setIsRevenueModalOpen(true)}
                        style={{
                          background: "var(--admin-primary-light)",
                          color: "var(--admin-primary)",
                          border: "1px solid #bfdbfe",
                          padding: "5px 12px",
                          borderRadius: "6px",
                          fontSize: "12.5px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <i className="bi bi-pie-chart-fill"></i> Chi tiết Quý /
                        Năm ➔
                      </button>
                    </div>
                  </div>
                  <div className="admin-chart-bars">
                    <div className="admin-bar-col" title="Thứ 2: 1.110.000đ">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "var(--admin-primary)",
                        }}
                      >
                        1.1Tr
                      </span>
                      <div
                        className="admin-bar-fill"
                        style={{ height: "45%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 2</span>
                    </div>
                    <div className="admin-bar-col" title="Thứ 3: 0đ">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#94a3b8",
                        }}
                      >
                        0đ
                      </span>
                      <div
                        className="admin-bar-fill"
                        style={{ height: "15%", background: "#e2e8f0" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 3</span>
                    </div>
                    <div className="admin-bar-col" title="Thứ 4: 590.000đ">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "var(--admin-primary)",
                        }}
                      >
                        590K
                      </span>
                      <div
                        className="admin-bar-fill"
                        style={{ height: "35%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 4</span>
                    </div>
                    <div className="admin-bar-col" title="Thứ 5: 1.690.000đ">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "var(--admin-primary)",
                        }}
                      >
                        1.7Tr
                      </span>
                      <div
                        className="admin-bar-fill"
                        style={{ height: "70%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 5</span>
                    </div>
                    <div className="admin-bar-col" title="Thứ 6: 2.760.000đ">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "var(--admin-primary)",
                        }}
                      >
                        2.8Tr
                      </span>
                      <div
                        className="admin-bar-fill"
                        style={{ height: "95%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 6</span>
                    </div>
                    <div className="admin-bar-col" title="Thứ 7: 1.820.000đ">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "var(--admin-primary)",
                        }}
                      >
                        1.8Tr
                      </span>
                      <div
                        className="admin-bar-fill"
                        style={{ height: "65%" }}
                      ></div>
                      <span className="admin-bar-label">Thứ 7</span>
                    </div>
                    <div className="admin-bar-col" title="Chủ Nhật: 0đ">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#94a3b8",
                        }}
                      >
                        0đ
                      </span>
                      <div
                        className="admin-bar-fill"
                        style={{ height: "15%", background: "#e2e8f0" }}
                      ></div>
                      <span className="admin-bar-label">CN</span>
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">Sản Phẩm Bán Chạy</h3>
                    <i
                      className="bi bi-trophy-fill"
                      style={{ color: "#ff6b00", fontSize: "18px" }}
                    ></i>
                  </div>
                  <div className="top-selling-list">
                    {products.slice(0, 4).map((p) => (
                      <div key={p.id} className="top-selling-item">
                        <img
                          src={p.img || "/src/assets/img/product_1.jpg"}
                          alt={p.name}
                          className="top-selling-img"
                        />
                        <div className="top-selling-info">
                          <span className="top-selling-name">{p.name}</span>
                          <span className="top-selling-sales">
                            Quy cách: {p.variant || "Chuẩn"}
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
                  <div>
                    <h3 className="admin-card-title">
                      Đơn Hàng Cần Xử Lý Gần Đây
                    </h3>
                    <span
                      style={{
                        fontSize: "12.5px",
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Tổng cộng {pendingOrdersCount} đơn hàng chờ xử lý
                    </span>
                  </div>
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
                      {orders.slice(0, 6).map((o) => (
                        <tr key={o.id}>
                          <td>
                            <strong>{o.orderCode}</strong>
                          </td>
                          <td>
                            <div>{o.customer}</div>
                            <small style={{ color: "#64748b" }}>
                              {o.phone}
                            </small>
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
                              {(Number(o.total) || 0).toLocaleString("vi-VN")}đ
                            </strong>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${
                                o.paymentStatus === "Completed"
                                  ? "completed"
                                  : "pending"
                              }`}
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
                              className={`status-badge ${
                                o.orderStatus === "Completed"
                                  ? "completed"
                                  : o.orderStatus === "Shipping"
                                    ? "shipping"
                                    : "processing"
                              }`}
                            >
                              {o.orderStatus === "Completed" && "Hoàn thành"}
                              {o.orderStatus === "Shipping" && "Đang giao hàng"}
                              {o.orderStatus === "Processing" &&
                                "Đang chuẩn bị"}
                              {o.orderStatus === "Pending" && "Chờ xử lý"}
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
                    <option value="Processing">
                      Đang chuẩn bị (Processing)
                    </option>
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

                  {(!false || isSuper || isAdminUser) && (
                    <button
                      type="button"
                      className="btn-admin-primary"
                      onClick={() => setIsAddProductOpen(true)}
                    >
                      <i className="bi bi-plus-lg"></i> Thêm Sản Phẩm Mới
                    </button>
                  )}
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
                            src={
                              p.img ||
                              p.imageUrl ||
                              "/src/assets/img/cau_be_vidaiary.png"
                            }
                            alt={p.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "/src/assets/img/cau_be_vidaiary.png";
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
                            style={{
                              cursor:
                                false && !isSuper && !isAdminUser
                                  ? "default"
                                  : "pointer",
                            }}
                            title={
                              false && !isSuper && !isAdminUser
                                ? "Trạng thái hiển thị sản phẩm"
                                : "Bấm để ẩn / mở bán sản phẩm trên website"
                            }
                            onClick={() => {
                              if (!false || isSuper || isAdminUser) {
                                handleToggleProductStatus(p.id);
                              }
                            }}
                          >
                            <i
                              className={`bi ${p.status === 1 ? "bi-check-circle-fill" : "bi-eye-slash-fill"}`}
                              style={{ marginRight: "4px" }}
                            ></i>
                            {p.status === 1 ? "Đang bán" : "Tạm ngưng"}
                          </span>
                        </td>
                        <td>
                          {false && !isSuper && !isAdminUser ? (
                            <button
                              type="button"
                              className="btn-admin-primary"
                              style={{
                                padding: "5px 10px",
                                fontSize: "12px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                              onClick={() => {
                                handlePosAddToCart(p);
                                setActiveTab("store_pos");
                              }}
                            >
                              <i className="bi bi-cart-plus-fill"></i> Bán tại
                              quầy
                            </button>
                          ) : (
                            <div className="admin-action-btn-group">
                              <button
                                type="button"
                                className="btn-action-icon"
                                title={
                                  p.status === 1
                                    ? "Ẩn khỏi cửa hàng"
                                    : "Mở bán lại"
                                }
                                onClick={() => handleToggleProductStatus(p.id)}
                              >
                                <i
                                  className={`bi ${p.status === 1 ? "bi-eye-slash" : "bi-eye"}`}
                                ></i>
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
                          )}
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
                    {users.map((u) => {
                      const currentUserId =
                        user?.UserID || user?.id || user?._id;
                      const isTargetSuperAdmin =
                        u.role === "SUPERADMIN" ||
                        u.email === "superadmin@vidairy.vn";
                      const isTargetAdmin =
                        u.role === "ADMIN" || u.email === "admin@vidairy.vn";
                      const isSelf = Boolean(
                        currentUserId && String(u.id) === String(currentUserId),
                      );
                      const canManageUsers = Boolean(
                        user &&
                        ["SUPERADMIN", "ADMIN", "MANAGER"].includes(
                          user.Role?.toUpperCase(),
                        ),
                      );

                      return (
                        <tr key={u.id}>
                          <td>
                            <strong>{u.code}</strong>
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: isTargetSuperAdmin ? 700 : 500,
                                }}
                              >
                                {u.fullName}
                              </span>
                              {isTargetAdmin && !isTargetSuperAdmin && (
                                <span
                                  className="admin-pill-unique"
                                  title="Tài khoản Quản trị viên hệ thống"
                                >
                                  Admin
                                </span>
                              )}

                              {isSelf &&
                                !isTargetSuperAdmin &&
                                !isTargetAdmin && (
                                  <span
                                    className="admin-pill-self"
                                    title="Tài khoản của bạn"
                                  >
                                    Bạn
                                  </span>
                                )}
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>
                            {isTargetSuperAdmin ? (
                              <span
                                className="admin-role-badge-super"
                                title="Tài khoản Super Admin có toàn quyền tối cao"
                              >
                                <i className="bi bi-shield-fill-check"></i>{" "}
                                SUPERADMIN
                              </span>
                            ) : isSelf || !canManageUsers ? (
                              <span
                                className={`admin-role-badge-locked role-${u.role?.toLowerCase()}`}
                                title={
                                  isSelf
                                    ? "Không thể tự thay đổi vai trò của chính mình"
                                    : "Chỉ Super Admin, Quản trị viên và Quản lý mới có quyền đổi vai trò"
                                }
                              >
                                {u.role === "MANAGER"
                                  ? "MANAGER"
                                  : u.role === "STAFF"
                                    ? "STAFF"
                                    : u.role === "ADMIN"
                                      ? "ADMIN"
                                      : "CUSTOMER"}
                              </span>
                            ) : isTargetAdmin && !isSuper ? (
                              <span
                                className="admin-role-badge-locked role-admin"
                                title="Chỉ Super Admin mới có quyền đổi vai trò của Quản trị viên (ADMIN)"
                              >
                                ADMIN
                              </span>
                            ) : (
                              <select
                                value={u.role}
                                onChange={(e) =>
                                  handleQuickRoleChange(u.id, e.target.value)
                                }
                                className={`admin-role-select role-${u.role?.toLowerCase()}`}
                                title="Thay đổi nhanh vai trò"
                              >
                                <option value="CUSTOMER">CUSTOMER</option>
                                <option value="STAFF">STAFF (Nhân viên)</option>
                                <option value="MANAGER">MANAGER</option>
                                {isSuper && (
                                  <option value="ADMIN">ADMIN</option>
                                )}
                              </select>
                            )}
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
                            {isTargetSuperAdmin ? (
                              <span
                                className="admin-super-action-locked"
                                title="Tài khoản Super Admin tối cao cố định không thể can thiệp"
                              >
                                <i className="bi bi-shield-fill-check"></i> Toàn
                                quyền
                              </span>
                            ) : isSelf ? (
                              <span
                                className="admin-super-action-locked self"
                                title="Không thể tự phân quyền hoặc khóa tài khoản của chính mình"
                              >
                                <i className="bi bi-person-check-fill"></i>{" "}
                                Chính bạn
                              </span>
                            ) : isTargetAdmin && !isSuper ? (
                              <span
                                className="admin-super-action-locked"
                                title="Chỉ Super Admin mới có quyền can thiệp tài khoản Quản trị viên"
                              >
                                <i className="bi bi-lock-fill"></i> Cố định
                              </span>
                            ) : canManageUsers ? (
                              <div className="admin-action-btn-group">
                                {u.role !== "CUSTOMER" && (
                                  <button
                                    type="button"
                                    className="btn-action-icon primary"
                                    title="Phân quyền chi tiết cho nhân sự"
                                    onClick={() => handleOpenRoleModal(u)}
                                  >
                                    <i className="bi bi-shield-lock-fill"></i>
                                  </button>
                                )}
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
                                    className={`bi ${
                                      u.status === 1
                                        ? "bi-lock-fill"
                                        : "bi-unlock-fill"
                                    }`}
                                  ></i>
                                </button>
                              </div>
                            ) : (
                              <span
                                style={{ color: "#9ca3af", fontSize: "13px" }}
                              >
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------- 6. TAB: COUPONS & PROMOTIONS ---------------- */}
          {activeTab === "coupons" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">
                    Quản Lý Mã Giảm Giá & Voucher
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    Tra cứu và áp dụng các mã khuyến mãi, voucher giảm giá cho
                    khách hàng mua tại quầy hoặc online.
                  </p>
                </div>
                {(!false || isSuper || isAdminUser) && (
                  <button type="button" className="btn-admin-primary">
                    <i className="bi bi-plus-lg"></i> Tạo Voucher Mới
                  </button>
                )}
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
                      {false && !isSuper && !isAdminUser && (
                        <th>THAO TÁC</th>
                      )}
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
                            {c.type === "Percent"
                              ? `${c.value}%`
                              : `${Number(c.value).toLocaleString("vi-VN")}đ`}
                          </strong>
                        </td>
                        <td>
                          {(Number(c.minOrder) || 0).toLocaleString("vi-VN")}đ
                        </td>
                        <td>
                          {c.usedCount} / {c.limit} lượt
                        </td>
                        <td>{c.endDate}</td>
                        <td>
                          <span
                            className={`status-badge ${c.status === 1 ? "active" : "blocked"}`}
                            style={{
                              cursor:
                                false && !isSuper && !isAdminUser
                                  ? "default"
                                  : "pointer",
                            }}
                            title={
                              false && !isSuper && !isAdminUser
                                ? "Trạng thái áp dụng"
                                : "Nhấp để bật / tắt mã"
                            }
                            onClick={() => {
                              if (!false || isSuper || isAdminUser) {
                                handleToggleCouponStatus(c.code);
                              }
                            }}
                          >
                            {c.status === 1 ? "Đang áp dụng" : "Đã tạm dừng"}
                          </span>
                        </td>
                        {false && !isSuper && !isAdminUser && (
                          <td>
                            <button
                              type="button"
                              className="btn-admin-primary"
                              style={{
                                padding: "4px 8px",
                                fontSize: "11.5px",
                                backgroundColor: "#16a34a",
                                borderColor: "#16a34a",
                              }}
                              onClick={() => {
                                (() => {})(c.code);
                                setActiveTab("store_pos");
                              }}
                            >
                              <i className="bi bi-tag-fill"></i> Dùng mã tại
                              quầy
                            </button>
                          </td>
                        )}
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
                <div>
                  <h3 className="admin-card-title">
                    <i
                      className="bi bi-receipt-cutoff"
                      style={{ color: "#23408e", marginRight: "8px" }}
                    ></i>
                    Yêu Cầu Xuất Hóa Đơn Điện Tử (VAT)
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    Danh sách hóa đơn được sắp xếp mặc định theo{" "}
                    <strong>Số hóa đơn tăng dần (HD-...)</strong>
                  </p>
                </div>
              </div>

              <div className="admin-table-controls">
                <div className="admin-search-box" style={{ flex: 1 }}>
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Tìm theo Số hóa đơn (HD-...), Mã đơn, Tên công ty, MST, Email..."
                    value={invoiceSearch}
                    onChange={(e) => setInvoiceSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: "50px", textAlign: "center" }}>
                        STT
                      </th>
                      <th style={{ minWidth: "140px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer",
                            userSelect: "none",
                            color: "#23408e",
                          }}
                          onClick={() => setInvoiceSortAsc((prev) => !prev)}
                          title="Bấm để đổi sắp xếp"
                        >
                          <span>SỐ HÓA ĐƠN</span>
                          <i
                            className={`bi ${
                              invoiceSortAsc
                                ? "bi-arrow-up-short"
                                : "bi-arrow-down-short"
                            }`}
                            style={{ fontSize: "16px" }}
                          ></i>
                        </div>
                      </th>
                      <th>MÃ ĐƠN HÀNG</th>
                      <th>TÊN CÔNG TY / ĐƠN VỊ</th>
                      <th>MÃ SỐ THUẾ</th>
                      <th>EMAIL NHẬN HÓA ĐƠN</th>
                      <th>ĐỊA CHỈ GPKD</th>
                      <th>TỔNG TIỀN (VAT)</th>
                      <th>TRẠNG THÁI</th>
                      <th>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVatOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan="10"
                          style={{
                            textAlign: "center",
                            padding: "32px",
                            color: "#64748b",
                          }}
                        >
                          <i
                            className="bi bi-inbox"
                            style={{
                              fontSize: "32px",
                              display: "block",
                              marginBottom: "8px",
                              color: "#94a3b8",
                            }}
                          ></i>
                          Không tìm thấy hóa đơn VAT nào phù hợp với điều kiện
                          tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      filteredVatOrders.map((o, idx) => {
                        const invoiceNo = getInvoiceNumber(o);
                        return (
                          <tr key={o.id || o.orderCode}>
                            <td
                              style={{
                                textAlign: "center",
                                color: "#64748b",
                                fontWeight: 600,
                              }}
                            >
                              {idx + 1}
                            </td>
                            <td>
                              <span
                                style={{
                                  fontFamily: "monospace",
                                  fontWeight: 700,
                                  fontSize: "13.5px",
                                  color: "#23408e",
                                  backgroundColor: "#eff6ff",
                                  border: "1px solid #bfdbfe",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  display: "inline-block",
                                }}
                              >
                                {invoiceNo}
                              </span>
                            </td>
                            <td>
                              <strong>{o.orderCode}</strong>
                            </td>
                            <td>
                              <strong style={{ color: "#0f172a" }}>
                                {o.vatInfo?.company ||
                                  o.vatInfo?.Company ||
                                  "Chưa cung cấp"}
                              </strong>
                            </td>
                            <td>
                              <code
                                style={{
                                  backgroundColor: "#f1f5f9",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  color: "#334155",
                                  fontWeight: 600,
                                }}
                              >
                                {o.vatInfo?.taxId ||
                                  o.vatInfo?.TaxId ||
                                  "Chưa cung cấp"}
                              </code>
                            </td>
                            <td>
                              {o.vatInfo?.email ||
                                o.vatInfo?.Email ||
                                o.customer?.email ||
                                o.customer ||
                                "Chưa cung cấp"}
                            </td>
                            <td>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#64748b",
                                  maxWidth: "220px",
                                  lineHeight: 1.35,
                                }}
                              >
                                {o.vatInfo?.address ||
                                  o.vatInfo?.Address ||
                                  "Chưa cung cấp"}
                              </div>
                            </td>
                            <td>
                              <strong style={{ color: "#23408e" }}>
                                {o.total?.toLocaleString("vi-VN")}đ
                              </strong>
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  o.orderStatus === "Completed"
                                    ? "completed"
                                    : "pending"
                                }`}
                              >
                                {o.orderStatus === "Completed"
                                  ? "Đã phát hành"
                                  : "Chờ phát hành"}
                              </span>
                            </td>
                            <td>
                              <div className="admin-action-btn-group">
                                <button
                                  type="button"
                                  className="btn-action-icon"
                                  title="Xem chi tiết đơn hàng"
                                  onClick={() => setSelectedOrder(o)}
                                >
                                  <i className="bi bi-eye-fill"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn-action-icon"
                                  title="In / Xuất Hóa Đơn VAT"
                                  onClick={() => setPrintableInvoiceOrder(o)}
                                >
                                  <i className="bi bi-printer-fill"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn-action-icon"
                                  title="Gửi lại email hóa đơn điện tử"
                                  onClick={() =>
                                    alert(
                                      `🎉 Đã gửi lại hóa đơn điện tử ${invoiceNo} cho đơn hàng ${
                                        o.orderCode
                                      } tới email: ${
                                        o.vatInfo?.email ||
                                        o.vatInfo?.Email ||
                                        "email khách hàng"
                                      }!`,
                                    )
                                  }
                                >
                                  <i className="bi bi-envelope-check-fill"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
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
                          <strong style={{ color: "#23408e" }}>
                            {b.phone}
                          </strong>
                        </td>
                        <td>{b.hours}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              b.status === 1 ? "active" : "blocked"
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

          {/* ---------------- 9. TAB: BANNERS & MEDIA (SUPER ADMIN / ADMIN) ---------------- */}
          {activeTab === "banners" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">
                    <i
                      className="bi bi-images"
                      style={{ color: "#23408e", marginRight: "8px" }}
                    ></i>
                    Quản Lý Banner & Hình Ảnh Hệ Thống
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    Tùy chỉnh các banner quảng cáo, cover trang sản phẩm, hero
                    trang chủ và pop-up khuyến mãi trên toàn hệ thống.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-admin-primary"
                  onClick={handleOpenAddBanner}
                >
                  <i className="bi bi-plus-lg"></i> Thêm Banner Mới
                </button>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: "50px", textAlign: "center" }}>
                        STT
                      </th>
                      <th style={{ width: "160px" }}>HÌNH ẢNH BANNER</th>
                      <th>TIÊU ĐỀ & MÔ TẢ</th>
                      <th>VỊ TRÍ HIỂN THỊ</th>
                      <th>ĐƯỜNG DẪN LIÊN KẾT</th>
                      <th style={{ textAlign: "center" }}>THỨ TỰ</th>
                      <th>TRẠNG THÁI</th>
                      <th style={{ textAlign: "center" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.length === 0 ? (
                      <tr>
                        <td
                          colSpan="8"
                          style={{
                            textAlign: "center",
                            padding: "32px",
                            color: "#64748b",
                          }}
                        >
                          <i
                            className="bi bi-card-image"
                            style={{
                              fontSize: "32px",
                              display: "block",
                              marginBottom: "8px",
                              color: "#94a3b8",
                            }}
                          ></i>
                          Chưa có banner nào. Hãy nhấp "Thêm Banner Mới" để tạo
                          banner cho hệ thống!
                        </td>
                      </tr>
                    ) : (
                      banners.map((b, idx) => (
                        <tr key={b.BannerID || b.id || b._id || idx}>
                          <td
                            style={{
                              textAlign: "center",
                              color: "#64748b",
                              fontWeight: 600,
                            }}
                          >
                            {idx + 1}
                          </td>
                          <td>
                            <div
                              style={{
                                width: "130px",
                                height: "64px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "1px solid #e2e8f0",
                                backgroundColor: "#f8fafc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <img
                                src={b.imageUrl}
                                alt={b.title}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "/src/assets/img/mother_baby_banner.jpg";
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <strong
                              style={{
                                color: "#0f172a",
                                fontSize: "14px",
                                display: "block",
                              }}
                            >
                              {b.title}
                            </strong>
                            {b.description && (
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#64748b",
                                  display: "block",
                                  marginTop: "2px",
                                }}
                              >
                                {b.description}
                              </span>
                            )}
                          </td>
                          <td>
                            <span
                              style={{
                                backgroundColor: "#eff6ff",
                                color: "#1e40af",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: 600,
                                display: "inline-block",
                                border: "1px solid #bfdbfe",
                              }}
                            >
                              {b.position || "Trang Sản Phẩm (Cover Hero)"}
                            </span>
                          </td>
                          <td>
                            <code
                              style={{
                                fontSize: "12px",
                                color: "#475569",
                                backgroundColor: "#f1f5f9",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              {b.linkUrl || "/products"}
                            </code>
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              fontWeight: 700,
                              color: "#23408e",
                            }}
                          >
                            {b.displayOrder || 1}
                          </td>
                          <td>
                            <span
                              className={`status-badge ${b.status === 1 ? "active" : "blocked"}`}
                              style={{ cursor: "pointer" }}
                              title="Bấm để bật / tắt hiển thị banner"
                              onClick={() => handleToggleBannerStatus(b)}
                            >
                              {b.status === 1 ? "Đang hiển thị" : "Đã ẩn"}
                            </span>
                          </td>
                          <td>
                            <div
                              className="admin-action-btn-group"
                              style={{ justifyContent: "center" }}
                            >
                              <button
                                type="button"
                                className="btn-action-icon primary"
                                title="Chỉnh sửa banner"
                                onClick={() => handleOpenEditBanner(b)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                type="button"
                                className="btn-action-icon danger"
                                title="Xóa banner khỏi hệ thống"
                                onClick={() => handleDeleteBanner(b)}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------- 10. TAB: SYSTEM & CONTENT SETTINGS (SUPER ADMIN SUPREME) ---------------- */}
          {activeTab === "settings" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">
                    <i
                      className="bi bi-gear-wide-connected"
                      style={{ color: "#23408e", marginRight: "8px" }}
                    ></i>
                    Cài Đặt Toàn Bộ Hệ Thống & Nội Dung Website
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    Quyền hạn tối cao Super Admin: Tùy chỉnh thông tin thương
                    hiệu, hình ảnh trang sản phẩm, banner trang chủ và lưu trực
                    tiếp lên cơ sở dữ liệu MongoDB Atlas.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={handleResetSettings}
                    title="Khôi phục nội dung về mặc định ban đầu"
                  >
                    <i className="bi bi-arrow-counterclockwise"></i> Khôi Phục
                    Mặc Định
                  </button>
                  <button
                    type="button"
                    className="btn-admin-primary"
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                  >
                    {isSavingSettings ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                          style={{
                            width: 16,
                            height: 16,
                            border: "2px solid #fff",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            display: "inline-block",
                          }}
                        ></span>{" "}
                        Đang Lưu MongoDB...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cloud-arrow-up-fill"></i> Lưu & Đồng
                        Bộ Hệ Thống
                      </>
                    )}
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSaveSettings}
                style={{ padding: "20px 24px" }}
              >
                {/* SECTION 1: THÔNG TIN DOANH NGHIỆP & THƯƠNG HIỆU */}
                <div
                  style={{
                    marginBottom: "28px",
                    backgroundColor: "#f8fafc",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "ViDairy1",
                      fontSize: "16px",
                      color: "#1e3a8a",
                      margin: "0 0 16px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="bi bi-building-fill"
                      style={{ color: "#2563eb" }}
                    ></i>{" "}
                    1. Thông Tin Doanh Nghiệp & Thương Hiệu
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "6px",
                        }}
                      >
                        Tên Website / Thương Hiệu{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="admin-select"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        value={settings.siteName || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, siteName: e.target.value })
                        }
                        placeholder="VD: ViDairy - Sữa Dinh Dưỡng Chuẩn Y Học"
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "6px",
                        }}
                      >
                        Slogan Thương Hiệu
                      </label>
                      <input
                        type="text"
                        className="admin-select"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        value={settings.brandSlogan || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            brandSlogan: e.target.value,
                          })
                        }
                        placeholder="VD: ViDairy - Trao Sức Khỏe, Trọn Yêu Thương"
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "6px",
                        }}
                      >
                        Hotline Tổng Đài CSKH
                      </label>
                      <input
                        type="text"
                        className="admin-select"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        value={settings.hotline || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, hotline: e.target.value })
                        }
                        placeholder="VD: 0989 584 592 hoặc 1900 633 559"
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "6px",
                        }}
                      >
                        Email Hỗ Trợ Khách Hàng
                      </label>
                      <input
                        type="email"
                        className="admin-select"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        value={settings.email || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, email: e.target.value })
                        }
                        placeholder="VD: cskh@vidairy.vn"
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "6px",
                        }}
                      >
                        Địa Chỉ Trụ Sở Doanh Nghiệp
                      </label>
                      <input
                        type="text"
                        className="admin-select"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        value={settings.address || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, address: e.target.value })
                        }
                        placeholder="VD: Số 120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: TÙY CHỈNH TRANG SẢN PHẨM (PRODUCT PAGE) */}
                <div
                  style={{
                    marginBottom: "28px",
                    backgroundColor: "#f8fafc",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "ViDairy1",
                      fontSize: "16px",
                      color: "#1e3a8a",
                      margin: "0 0 16px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="bi bi-cart-check-fill"
                      style={{ color: "#2563eb" }}
                    ></i>{" "}
                    2. Tùy Chỉnh Trang Danh Sách Sản Phẩm (Product Page)
                  </h4>

                  {/* Banner Image Upload & Preview */}
                  <div
                    className="product-img-upload-box"
                    style={{ marginBottom: "16px" }}
                  >
                    <label className="admin-form-label">
                      <i className="bi bi-image-fill text-blue"></i> Ảnh Cover
                      Hero Banner Trang Sản Phẩm
                    </label>
                    <div className="img-upload-row">
                      <div
                        className="img-preview-card"
                        style={{ width: "220px", height: "85px" }}
                      >
                        {settings.productPageBanner ? (
                          <img
                            src={settings.productPageBanner}
                            alt="Product Banner Preview"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "/src/assets/img/mother_baby_banner.jpg";
                            }}
                          />
                        ) : (
                          <div className="no-img-text">Chưa có ảnh</div>
                        )}
                      </div>
                      <div className="img-upload-controls">
                        <label className="btn-upload-file">
                          <i className="bi bi-cloud-arrow-up-fill"></i> Tải ảnh
                          banner từ máy tính...
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleImageFileUpload(e, (url) =>
                                setSettings({
                                  ...settings,
                                  productPageBanner: url,
                                }),
                              )
                            }
                          />
                        </label>
                        <input
                          type="text"
                          className="admin-select"
                          style={{ width: "100%", fontSize: "12.5px" }}
                          value={settings.productPageBanner || ""}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              productPageBanner: e.target.value,
                            })
                          }
                          placeholder="Hoặc dán trực tiếp đường dẫn URL ảnh banner tại đây..."
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "6px",
                        }}
                      >
                        Tiêu Đề Banner Trang Sản Phẩm
                      </label>
                      <input
                        type="text"
                        className="admin-select"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        value={settings.productPageTitle || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            productPageTitle: e.target.value,
                          })
                        }
                        placeholder="VD: VitaDairy Luôn Đồng Hành Cùng Mẹ Và Bé"
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "6px",
                        }}
                      >
                        Mô Tả Giới Thiệu Dòng Sản Phẩm
                      </label>
                      <textarea
                        className="admin-select"
                        rows="3"
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          resize: "vertical",
                        }}
                        value={settings.productPageDescription || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            productPageDescription: e.target.value,
                          })
                        }
                        placeholder="Nhập đoạn mô tả giới thiệu tổng quan về các sản phẩm dinh dưỡng ViDairy..."
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: TÙY CHỈNH TRANG CHỦ (HOMEPAGE HERO) */}
                <div
                  style={{
                    marginBottom: "28px",
                    backgroundColor: "#f8fafc",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "ViDairy1",
                      fontSize: "16px",
                      color: "#1e3a8a",
                      margin: "0 0 16px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="bi bi-house-door-fill"
                      style={{ color: "#2563eb" }}
                    ></i>{" "}
                    3. Tùy Chỉnh Trang Chủ (Hero Banner & Thông Điệp)
                  </h4>

                  {/* Home Hero Image Upload & Preview */}
                  <div
                    className="product-img-upload-box"
                    style={{ marginBottom: "16px" }}
                  >
                    <label className="admin-form-label">
                      <i className="bi bi-image-fill text-blue"></i> Ảnh Banner
                      Chính Trang Chủ
                    </label>
                    <div className="img-upload-row">
                      <div
                        className="img-preview-card"
                        style={{ width: "220px", height: "85px" }}
                      >
                        {settings.homeHeroBanner ? (
                          <img
                            src={settings.homeHeroBanner}
                            alt="Home Banner Preview"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "/src/assets/img/ViDairy_banner_1536x816.png";
                            }}
                          />
                        ) : (
                          <div className="no-img-text">Chưa có ảnh</div>
                        )}
                      </div>
                      <div className="img-upload-controls">
                        <label className="btn-upload-file">
                          <i className="bi bi-cloud-arrow-up-fill"></i> Tải
                          banner trang chủ từ máy tính...
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleImageFileUpload(e, (url) =>
                                setSettings({
                                  ...settings,
                                  homeHeroBanner: url,
                                }),
                              )
                            }
                          />
                        </label>
                        <input
                          type="text"
                          className="admin-select"
                          style={{ width: "100%", fontSize: "12.5px" }}
                          value={settings.homeHeroBanner || ""}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              homeHeroBanner: e.target.value,
                            })
                          }
                          placeholder="Hoặc dán URL ảnh banner trang chủ tại đây..."
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "6px",
                        }}
                      >
                        Tiêu Đề Nổi Bật Trang Chủ
                      </label>
                      <input
                        type="text"
                        className="admin-select"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        value={settings.homeHeroTitle || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            homeHeroTitle: e.target.value,
                          })
                        }
                        placeholder="VD: Dinh Dưỡng Vàng Cho Tương Lai Khỏe Mạnh"
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "6px",
                        }}
                      >
                        Thông Điệp Phụ / Phụ Đề
                      </label>
                      <input
                        type="text"
                        className="admin-select"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        value={settings.homeHeroSubtitle || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            homeHeroSubtitle: e.target.value,
                          })
                        }
                        placeholder="VD: Kháng thể tự nhiên ColosIgG 24h nhập khẩu độc quyền từ Mỹ"
                      />
                    </div>
                  </div>
                </div>

                {/* BOTTOM SAVE BUTTON */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "16px",
                  }}
                >
                  <button
                    type="button"
                    className="btn-admin-secondary"
                    onClick={handleResetSettings}
                  >
                    Khôi Phục Mặc Định
                  </button>
                  <button
                    type="submit"
                    className="btn-admin-primary"
                    disabled={isSavingSettings}
                  >
                    <i className="bi bi-cloud-arrow-up-fill"></i> Lưu Tất Cả Cài
                    Đặt (MongoDB Atlas)
                  </button>
                </div>
              </form>
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
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
                      <strong>
                        {(it.price * it.qty).toLocaleString("vi-VN")}đ
                      </strong>
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
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
                    <span>
                      -{selectedOrder.discount.toLocaleString("vi-VN")}đ
                    </span>
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <strong style={{ color: "#1e40af" }}>
                      <i className="bi bi-receipt"></i> Thông Tin Hóa Đơn VAT:
                    </strong>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontWeight: 700,
                        backgroundColor: "#23408e",
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {getInvoiceNumber(selectedOrder)}
                    </span>
                  </div>
                  <div>
                    Công ty:{" "}
                    <strong>
                      {selectedOrder.vatInfo?.company ||
                        selectedOrder.vatInfo?.Company}
                    </strong>
                  </div>
                  <div>
                    Mã số thuế:{" "}
                    <code>
                      {selectedOrder.vatInfo?.taxId ||
                        selectedOrder.vatInfo?.TaxId}
                    </code>
                  </div>
                  <div>
                    Email nhận:{" "}
                    {selectedOrder.vatInfo?.email ||
                      selectedOrder.vatInfo?.Email}
                  </div>
                  <div>
                    Địa chỉ:{" "}
                    {selectedOrder.vatInfo?.address ||
                      selectedOrder.vatInfo?.Address}
                  </div>
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
                    <i className="bi bi-image-fill text-blue"></i> Hình Ảnh Sản
                    Phẩm <span style={{ color: "red" }}>*</span>
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
                            e.target.src =
                              "/src/assets/img/cau_be_vidaiary.png";
                          }}
                        />
                      ) : (
                        <div className="no-img-text">Chưa có ảnh</div>
                      )}
                    </div>

                    <div className="img-upload-controls">
                      {/* Nút Tải ảnh từ máy tính */}
                      <label className="btn-upload-file">
                        <i className="bi bi-cloud-arrow-up-fill"></i> Tải ảnh từ
                        máy tính...
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleImageFileUpload(e, (url) =>
                              setNewProduct({ ...newProduct, img: url }),
                            )
                          }
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
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="Sữa Bột Trẻ Em">Sữa Bột Trẻ Em</option>
                      <option value="Sữa Cho Mẹ Bầu & Sau Sinh">
                        Sữa Cho Mẹ Bầu
                      </option>
                      <option value="Sữa Dinh Dưỡng Người Cao Tuổi">
                        Sữa Người Cao Tuổi
                      </option>
                      <option value="Sữa Hạt Dinh Dưỡng Tự Nhiên">
                        Sữa Hạt
                      </option>
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
                        setNewProduct({
                          ...newProduct,
                          variant: e.target.value,
                        })
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
                        setNewProduct({
                          ...newProduct,
                          ageGroup: e.target.value,
                        })
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
                <i className="bi bi-pencil-square text-blue"></i> Chỉnh Sửa Sản
                Phẩm & Hình Ảnh
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
                    <i className="bi bi-image-fill text-blue"></i> Hình Ảnh Sản
                    Phẩm
                  </label>

                  <div className="img-upload-row">
                    <div className="img-preview-card">
                      {editingProduct.img ? (
                        <img
                          src={editingProduct.img}
                          alt="Preview"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "/src/assets/img/cau_be_vidaiary.png";
                          }}
                        />
                      ) : (
                        <div className="no-img-text">Chưa có ảnh</div>
                      )}
                    </div>

                    <div className="img-upload-controls">
                      <label className="btn-upload-file">
                        <i className="bi bi-cloud-arrow-up-fill"></i> Tải ảnh
                        mới từ máy tính...
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleImageFileUpload(e, (url) =>
                              setEditingProduct({
                                ...editingProduct,
                                img: url,
                              }),
                            )
                          }
                        />
                      </label>

                      <input
                        type="text"
                        className="admin-select"
                        style={{
                          width: "100%",
                          marginTop: "6px",
                          boxSizing: "border-box",
                          fontSize: "13px",
                        }}
                        placeholder="Hoặc dán URL hình ảnh mới"
                        value={editingProduct.img || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            img: e.target.value,
                          })
                        }
                      />

                      <div className="preset-img-chips">
                        <span className="chip-label">Ảnh mẫu có sẵn:</span>
                        {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`chip-btn ${editingProduct.img === preset.url ? "active" : ""}`}
                            onClick={() =>
                              setEditingProduct({
                                ...editingProduct,
                                img: preset.url,
                              })
                            }
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
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div
                  style={{ display: "flex", gap: "12px", marginTop: "12px" }}
                >
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label">Danh Mục</label>
                    <select
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="Sữa Bột Trẻ Em">Sữa Bột Trẻ Em</option>
                      <option value="Sữa Cho Mẹ Bầu & Sau Sinh">
                        Sữa Cho Mẹ Bầu
                      </option>
                      <option value="Sữa Dinh Dưỡng Người Cao Tuổi">
                        Sữa Người Cao Tuổi
                      </option>
                      <option value="Sữa Hạt Dinh Dưỡng Tự Nhiên">
                        Sữa Hạt
                      </option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label">Thương Hiệu</label>
                    <select
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      value={editingProduct.brand}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          brand: e.target.value,
                        })
                      }
                    >
                      <option value="ViDairy">ViDairy</option>
                      <option value="NutralisBaby">NutralisBaby</option>
                      <option value="NutriCare">NutriCare</option>
                      <option value="Vinamilk">Vinamilk</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{ display: "flex", gap: "12px", marginTop: "12px" }}
                >
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label">Quy Cách</label>
                    <input
                      type="text"
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      value={editingProduct.variant}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          variant: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label">
                      Độ Tuổi / Đối Tượng
                    </label>
                    <input
                      type="text"
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      value={editingProduct.ageGroup}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          ageGroup: e.target.value,
                        })
                      }
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
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
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
        <div
          className="admin-modal-overlay"
          onClick={() => setIsRoleModalOpen(false)}
        >
          <div
            className="admin-modal-content role-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>
                <i className="bi bi-shield-lock-fill text-blue"></i> Phân Quyền
                Tài Khoản
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
                    {selectedUserForRole.fullName
                      ? selectedUserForRole.fullName.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="user-info-text">
                    <h4>{selectedUserForRole.fullName}</h4>
                    <p>
                      {selectedUserForRole.email} &bull; Mã:{" "}
                      {selectedUserForRole.code}
                    </p>
                  </div>
                </div>

                <div className="admin-form-group margin-top">
                  <label className="admin-form-label">
                    Chọn Vai Trò Hệ Thống (Role):
                  </label>
                  <div className="role-radio-group">
                    <label
                      className={`role-radio-card ${roleForm.role === "CUSTOMER" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="modalRole"
                        value="CUSTOMER"
                        checked={roleForm.role === "CUSTOMER"}
                        onChange={(e) =>
                          setRoleForm({ ...roleForm, role: e.target.value })
                        }
                      />
                      <div className="role-card-info">
                        <strong>CUSTOMER (Khách hàng)</strong>
                        <span>Chỉ xem sản phẩm và mua hàng</span>
                      </div>
                    </label>

                    <label
                      className={`role-radio-card ${roleForm.role === "STAFF" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="modalRole"
                        value="STAFF"
                        checked={roleForm.role === "STAFF"}
                        onChange={(e) =>
                          setRoleForm({ ...roleForm, role: e.target.value })
                        }
                      />
                      <div className="role-card-info">
                        <strong>STAFF (Nhân viên CSKH)</strong>
                        <span>Xem đơn hàng, hỗ trợ tư vấn khách hàng</span>
                      </div>
                    </label>

                    <label
                      className={`role-radio-card ${roleForm.role === "MANAGER" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="modalRole"
                        value="MANAGER"
                        checked={roleForm.role === "MANAGER"}
                        onChange={(e) =>
                          setRoleForm({ ...roleForm, role: e.target.value })
                        }
                      />
                      <div className="role-card-info">
                        <strong>MANAGER (Quản lý cửa hàng)</strong>
                        <span>Quản lý sản phẩm và đơn hàng</span>
                      </div>
                    </label>

                    {isSuper && (
                      <label
                        className={`role-radio-card ${roleForm.role === "ADMIN" ? "active" : ""}`}
                        style={{
                          borderColor:
                            roleForm.role === "ADMIN" ? "#2563eb" : "#93c5fd",
                        }}
                      >
                        <input
                          type="radio"
                          name="modalRole"
                          value="ADMIN"
                          checked={roleForm.role === "ADMIN"}
                          onChange={(e) =>
                            setRoleForm({ ...roleForm, role: e.target.value })
                          }
                        />
                        <div className="role-card-info">
                          <strong style={{ color: "#1e40af" }}>
                            👑 ADMIN (Quản trị viên)
                          </strong>
                          <span>
                            Toàn quyền quản trị kinh doanh, sản phẩm, đơn hàng &
                            nhân sự
                          </span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div className="admin-form-group margin-top">
                  <label className="admin-form-label">
                    Danh Sách Quyền Hạn Chi Tiết (Permissions):
                  </label>
                  {roleForm.role === "CUSTOMER" ? (
                    <div
                      style={{
                        padding: "14px 16px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "10px",
                        border: "1px dashed #cbd5e1",
                        color: "#64748b",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <i
                        className="bi bi-info-circle-fill"
                        style={{ color: "#2563eb", fontSize: "16px" }}
                      ></i>
                      <span>
                        Tài khoản Khách hàng (CUSTOMER) chỉ có quyền mua hàng và
                        không có quyền truy cập quản trị hệ thống.
                      </span>
                    </div>
                  ) : (
                    <div className="permissions-grid">
                      {[
                        {
                          key: "manage_products",
                          label: "Quản lý Sản Phẩm & Giá",
                          desc: "Thêm, sửa, xóa danh mục và giá sản phẩm",
                        },
                        {
                          key: "manage_orders",
                          label: "Quản lý Đơn Hàng",
                          desc: "Xem, cập nhật trạng thái giao hàng",
                        },
                        {
                          key: "manage_coupons",
                          label: "Quản lý Mã Giảm Giá",
                          desc: "Tạo và bật/tắt voucher khuyến mãi",
                        },
                        {
                          key: "manage_users",
                          label: "Quản lý Người Dùng & Phân Quyền",
                          desc: "Xem danh sách và đổi quyền tài khoản",
                        },
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
                  )}
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

      {/* ================= MODAL: ADD / EDIT BANNER ================= */}
      {isBannerModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={() => setIsBannerModalOpen(false)}
        >
          <div
            className="admin-modal-card"
            style={{ maxWidth: "600px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <i
                  className="bi bi-images text-blue"
                  style={{ marginRight: "8px" }}
                ></i>
                {editingBanner ? "Chỉnh Sửa Banner" : "Thêm Banner Mới"}
              </h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsBannerModalOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveBanner}>
              <div className="admin-modal-body">
                {/* Upload & Preview */}
                <div className="product-img-upload-box">
                  <label className="admin-form-label">
                    <i className="bi bi-image-fill text-blue"></i> Hình Ảnh
                    Banner <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="img-upload-row">
                    <div
                      className="img-preview-card"
                      style={{ width: "160px", height: "70px" }}
                    >
                      {bannerForm.imageUrl ? (
                        <img
                          src={bannerForm.imageUrl}
                          alt="Banner Preview"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "/src/assets/img/mother_baby_banner.jpg";
                          }}
                        />
                      ) : (
                        <div className="no-img-text">Chưa có ảnh</div>
                      )}
                    </div>
                    <div className="img-upload-controls">
                      <label className="btn-upload-file">
                        <i className="bi bi-cloud-arrow-up-fill"></i> Tải ảnh từ
                        máy tính...
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleImageFileUpload(e, (url) =>
                              setBannerForm({ ...bannerForm, imageUrl: url }),
                            )
                          }
                        />
                      </label>
                      <input
                        type="text"
                        className="admin-select"
                        style={{ width: "100%", fontSize: "12px" }}
                        placeholder="Hoặc dán URL ảnh tại đây..."
                        value={bannerForm.imageUrl}
                        onChange={(e) =>
                          setBannerForm({
                            ...bannerForm,
                            imageUrl: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#334155",
                        marginBottom: "4px",
                      }}
                    >
                      Tiêu Đề Banner <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="admin-select"
                      style={{ width: "100%", boxSizing: "border-box" }}
                      placeholder="VD: Khuyến Mãi Sữa Bột ViDairy Kid..."
                      value={bannerForm.title}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "4px",
                        }}
                      >
                        Vị Trí Hiển Thị
                      </label>
                      <select
                        className="admin-select"
                        style={{ width: "100%" }}
                        value={bannerForm.position}
                        onChange={(e) =>
                          setBannerForm({
                            ...bannerForm,
                            position: e.target.value,
                          })
                        }
                      >
                        <option value="Trang Sản Phẩm (Cover Hero)">
                          Trang Sản Phẩm (Cover Hero)
                        </option>
                        <option value="Trang Chủ (Hero Slider)">
                          Trang Chủ (Hero Slider)
                        </option>
                        <option value="Trang Chủ (Banner Phụ)">
                          Trang Chủ (Banner Phụ)
                        </option>
                        <option value="Popup Khuyến Mãi">
                          Popup Khuyến Mãi
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "4px",
                        }}
                      >
                        Trang Áp Dụng
                      </label>
                      <select
                        className="admin-select"
                        style={{ width: "100%" }}
                        value={bannerForm.page}
                        onChange={(e) =>
                          setBannerForm({
                            ...bannerForm,
                            page: e.target.value,
                          })
                        }
                      >
                        <option value="product-list">
                          Trang Sản Phẩm (product-list)
                        </option>
                        <option value="home">Trang Chủ (home)</option>
                        <option value="all">Toàn Bộ Hệ Thống (all)</option>
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "4px",
                        }}
                      >
                        Đường Dẫn Liên Kết (Link)
                      </label>
                      <input
                        type="text"
                        className="admin-select"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        placeholder="VD: /products hoặc /products/san-pham-cho-be"
                        value={bannerForm.linkUrl}
                        onChange={(e) =>
                          setBannerForm({
                            ...bannerForm,
                            linkUrl: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: "4px",
                        }}
                      >
                        Thứ Tự Hiển Thị
                      </label>
                      <input
                        type="number"
                        className="admin-select"
                        style={{ width: "100%", boxSizing: "border-box" }}
                        min="1"
                        value={bannerForm.displayOrder}
                        onChange={(e) =>
                          setBannerForm({
                            ...bannerForm,
                            displayOrder: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#334155",
                        marginBottom: "4px",
                      }}
                    >
                      Mô Tả Phụ (Tùy chọn)
                    </label>
                    <textarea
                      className="admin-select"
                      rows="2"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        resize: "vertical",
                      }}
                      placeholder="Mô tả tóm tắt nội dung chương trình banner..."
                      value={bannerForm.description}
                      onChange={(e) =>
                        setBannerForm({
                          ...bannerForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#334155",
                        marginBottom: "4px",
                      }}
                    >
                      Trạng Thái Hoạt Động
                    </label>
                    <select
                      className="admin-select"
                      style={{ width: "100%" }}
                      value={bannerForm.status}
                      onChange={(e) =>
                        setBannerForm({
                          ...bannerForm,
                          status: Number(e.target.value),
                        })
                      }
                    >
                      <option value={1}>1 - Đang hiển thị công khai</option>
                      <option value={0}>0 - Tạm ẩn banner</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-admin-cancel"
                  onClick={() => setIsBannerModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-admin-primary">
                  <i className="bi bi-check-lg"></i>{" "}
                  {editingBanner ? "Lưu Cập Nhật" : "Tạo Banner Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ================= MODAL: CHI TIẾT DOANH THU THEO NĂM / QUÝ / THÁNG ================= */}
      {isRevenueModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={() => setIsRevenueModalOpen(false)}
        >
          <div
            className="admin-modal-card"
            style={{
              maxWidth: "1000px",
              width: "95%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">
                  <i
                    className="bi bi-bar-chart-line-fill text-blue"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Báo Cáo Chi Tiết Doanh Thu (Theo Quý & Theo Năm)
                </h3>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--admin-text-muted)",
                  }}
                >
                  Phân tích doanh thu & dữ liệu tài chính đa chiều ViDairy
                </span>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsRevenueModalOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="admin-modal-body" style={{ padding: "20px 24px" }}>
              {/* Bộ lọc thời gian */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  background: "#f8fbff",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  border: "1px solid #dbeafe",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <span style={{ fontSize: "13px", color: "#475569" }}>
                    Thời gian đang xem:{" "}
                    <strong
                      style={{
                        color: "var(--admin-primary)",
                        fontSize: "15px",
                      }}
                    >
                      {dashboardStats.timeframeLabel}
                    </strong>
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Nút chọn chế độ */}
                  <div
                    style={{
                      display: "inline-flex",
                      background: "#e2e8f0",
                      padding: "3px",
                      borderRadius: "8px",
                      gap: "4px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setDashboardTimeframe("YEAR")}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "6px",
                        border: "none",
                        fontWeight: "700",
                        fontSize: "12.5px",
                        cursor: "pointer",
                        background:
                          dashboardTimeframe === "YEAR"
                            ? "var(--admin-primary)"
                            : "transparent",
                        color:
                          dashboardTimeframe === "YEAR" ? "#ffffff" : "#475569",
                        transition: "all 0.2s",
                      }}
                    >
                      <i
                        className="bi bi-calendar-range"
                        style={{ marginRight: "5px" }}
                      ></i>
                      Theo Năm
                    </button>

                    <button
                      type="button"
                      onClick={() => setDashboardTimeframe("QUARTER")}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "6px",
                        border: "none",
                        fontWeight: "700",
                        fontSize: "12.5px",
                        cursor: "pointer",
                        background:
                          dashboardTimeframe === "QUARTER"
                            ? "var(--admin-primary)"
                            : "transparent",
                        color:
                          dashboardTimeframe === "QUARTER"
                            ? "#ffffff"
                            : "#475569",
                        transition: "all 0.2s",
                      }}
                    >
                      <i
                        className="bi bi-pie-chart-fill"
                        style={{ marginRight: "5px" }}
                      ></i>
                      Theo Quý
                    </button>

                    <button
                      type="button"
                      onClick={() => setDashboardTimeframe("MONTH")}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "6px",
                        border: "none",
                        fontWeight: "700",
                        fontSize: "12.5px",
                        cursor: "pointer",
                        background:
                          dashboardTimeframe === "MONTH"
                            ? "var(--admin-primary)"
                            : "transparent",
                        color:
                          dashboardTimeframe === "MONTH"
                            ? "#ffffff"
                            : "#475569",
                        transition: "all 0.2s",
                      }}
                    >
                      <i
                        className="bi bi-calendar-month"
                        style={{ marginRight: "5px" }}
                      ></i>
                      Theo Tháng
                    </button>
                  </div>

                  {/* Dropdown Năm */}
                  <select
                    className="admin-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    style={{
                      padding: "6px 12px",
                      fontSize: "13px",
                      fontWeight: "700",
                      borderColor: "var(--admin-primary)",
                      color: "var(--admin-primary)",
                    }}
                  >
                    {dashboardStats.orderYears.map((yr) => (
                      <option key={yr} value={yr}>
                        Năm {yr}
                      </option>
                    ))}
                  </select>

                  {/* Dropdown Quý */}
                  {dashboardTimeframe === "QUARTER" && (
                    <select
                      className="admin-select"
                      value={selectedQuarter}
                      onChange={(e) =>
                        setSelectedQuarter(Number(e.target.value))
                      }
                      style={{
                        padding: "6px 12px",
                        fontSize: "13px",
                        fontWeight: "700",
                        borderColor: "var(--admin-accent)",
                        color: "var(--admin-accent)",
                      }}
                    >
                      <option value={1}>Quý 1 (Tháng 1 - Tháng 3)</option>
                      <option value={2}>Quý 2 (Tháng 4 - Tháng 6)</option>
                      <option value={3}>Quý 3 (Tháng 7 - Tháng 9)</option>
                      <option value={4}>Quý 4 (Tháng 10 - Tháng 12)</option>
                    </select>
                  )}

                  {/* Dropdown Tháng */}
                  {dashboardTimeframe === "MONTH" && (
                    <select
                      className="admin-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      style={{
                        padding: "6px 12px",
                        fontSize: "13px",
                        fontWeight: "700",
                        borderColor: "var(--admin-accent)",
                        color: "var(--admin-accent)",
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          Tháng {m}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* 3 KPI mini cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    borderRadius: "10px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "12.5px",
                        color: "#065f46",
                        fontWeight: "600",
                      }}
                    >
                      Doanh Thu ({dashboardStats.timeframeLabel})
                    </span>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#047857",
                        marginTop: "4px",
                        fontFamily: "'ViDairy1', sans-serif",
                      }}
                    >
                      {dashboardStats.revenue.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "#d1fae5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#059669",
                      fontSize: "20px",
                    }}
                  >
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                </div>

                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "10px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "12.5px",
                        color: "#1e40af",
                        fontWeight: "600",
                      }}
                    >
                      Đơn Hàng ({dashboardStats.timeframeLabel})
                    </span>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "var(--admin-primary)",
                        marginTop: "4px",
                        fontFamily: "'ViDairy1', sans-serif",
                      }}
                    >
                      {dashboardStats.orderCount} đơn
                    </div>
                  </div>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "#dbeafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--admin-primary)",
                      fontSize: "20px",
                    }}
                  >
                    <i className="bi bi-bag-check-fill"></i>
                  </div>
                </div>

                <div
                  style={{
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: "10px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "12.5px",
                        color: "#9a3412",
                        fontWeight: "600",
                      }}
                    >
                      Giá Trị Trung Bình / Đơn
                    </span>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "var(--admin-accent)",
                        marginTop: "4px",
                        fontFamily: "'ViDairy1', sans-serif",
                      }}
                    >
                      {dashboardStats.avgOrderValue.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "#ffedd5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--admin-accent)",
                      fontSize: "20px",
                    }}
                  >
                    <i className="bi bi-calculator-fill"></i>
                  </div>
                </div>
              </div>

              {/* Biểu đồ phân bổ */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "10px",
                  padding: "18px 20px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "var(--admin-primary)",
                    }}
                  >
                    Biểu Đồ Doanh Thu - {dashboardStats.timeframeLabel}
                  </h4>
                  <span className="status-badge active">
                    {dashboardStats.timeframeLabel}
                  </span>
                </div>

                <div className="admin-chart-bars" style={{ height: "160px" }}>
                  {dashboardStats.chartBars.map((bar, idx) => (
                    <div
                      key={idx}
                      className="admin-bar-col"
                      title={`${bar.label}: ${bar.revenue.toLocaleString("vi-VN")}đ (${bar.orderCount} đơn)`}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color:
                            bar.revenue > 0
                              ? "var(--admin-primary)"
                              : "#94a3b8",
                        }}
                      >
                        {bar.revenue > 0
                          ? bar.revenue >= 1000000
                            ? `${(bar.revenue / 1000000).toFixed(1)}Tr`
                            : `${(bar.revenue / 1000).toFixed(0)}K`
                          : "0đ"}
                      </span>
                      <div
                        className="admin-bar-fill"
                        style={{
                          height: `${bar.heightPercent}%`,
                          background:
                            bar.revenue > 0
                              ? undefined
                              : "linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%)",
                        }}
                      ></div>
                      <span className="admin-bar-label">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bảng phân bổ chi tiết */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "10px",
                  padding: "18px 20px",
                  marginBottom: "20px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 14px 0",
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "var(--admin-primary)",
                  }}
                >
                  Bảng Thống Kê Chi Tiết Từng Kỳ (
                  {dashboardStats.timeframeLabel})
                </h4>
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>GIAI ĐOẠN / KỲ</th>
                        <th>DOANH THU (VND)</th>
                        <th>SỐ ĐƠN HÀNG</th>
                        <th>TỶ TRỌNG TRONG KỲ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.chartBars.map((bar, idx) => {
                        const pct =
                          dashboardStats.revenue > 0
                            ? Math.round(
                                (bar.revenue / dashboardStats.revenue) * 100,
                              )
                            : 0;
                        return (
                          <tr key={idx}>
                            <td>
                              <strong>{bar.label}</strong>
                            </td>
                            <td>
                              <strong style={{ color: "var(--admin-primary)" }}>
                                {bar.revenue.toLocaleString("vi-VN")}đ
                              </strong>
                            </td>
                            <td>{bar.orderCount} đơn</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <div
                                  style={{
                                    flex: 1,
                                    height: "8px",
                                    background: "#e2e8f0",
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${pct}%`,
                                      height: "100%",
                                      background: "var(--admin-primary)",
                                    }}
                                  ></div>
                                </div>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    color: "#475569",
                                    minWidth: "35px",
                                  }}
                                >
                                  {pct}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Danh sách đơn hàng trong kỳ */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "10px",
                  padding: "18px 20px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 14px 0",
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "var(--admin-primary)",
                  }}
                >
                  Danh Sách Đơn Hàng Trong Kỳ (
                  {dashboardStats.filteredOrders.length} đơn)
                </h4>
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>MÃ ĐƠN</th>
                        <th>KHÁCH HÀNG</th>
                        <th>NGÀY ĐẶT</th>
                        <th>TỔNG TIỀN</th>
                        <th>THANH TOÁN</th>
                        <th>TRẠNG THÁI</th>
                        <th>THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.filteredOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              color: "var(--admin-text-muted)",
                            }}
                          >
                            Không có đơn hàng nào trong khoảng thời gian{" "}
                            {dashboardStats.timeframeLabel}
                          </td>
                        </tr>
                      ) : (
                        dashboardStats.filteredOrders.map((o) => (
                          <tr key={o.id}>
                            <td>
                              <strong>{o.orderCode}</strong>
                            </td>
                            <td>
                              <div>{o.customer}</div>
                              <small style={{ color: "#64748b" }}>
                                {o.phone}
                              </small>
                            </td>
                            <td>
                              <span style={{ fontSize: "12px" }}>
                                {o.createdAt}
                              </span>
                            </td>
                            <td>
                              <strong style={{ color: "var(--admin-primary)" }}>
                                {(Number(o.total) || 0).toLocaleString("vi-VN")}
                                đ
                              </strong>
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  o.paymentStatus === "Completed"
                                    ? "completed"
                                    : "pending"
                                }`}
                              >
                                {o.paymentMethod}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  o.orderStatus === "Completed"
                                    ? "completed"
                                    : o.orderStatus === "Shipping"
                                      ? "shipping"
                                      : "processing"
                                }`}
                              >
                                {o.orderStatus === "Completed" && "Hoàn thành"}
                                {o.orderStatus === "Shipping" && "Đang giao"}
                                {o.orderStatus === "Processing" &&
                                  "Đang chuẩn bị"}
                                {o.orderStatus === "Pending" && "Chờ xác nhận"}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn-action-icon"
                                title="Xem chi tiết"
                                onClick={() => {
                                  setSelectedOrder(o);
                                }}
                              >
                                <i className="bi bi-eye-fill"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn-admin-primary"
                onClick={() => setIsRevenueModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: XUẤT & IN HÓA ĐƠN BÁN LẺ / HÓA ĐƠN VAT (POS & INVOICES) ================= */}
      {printableInvoiceOrder && (
        <div
          className="admin-modal-overlay"
          onClick={() => setPrintableInvoiceOrder(null)}
          style={{ zIndex: 9999 }}
        >
          <div
            className="admin-modal-card"
            style={{ maxWidth: "620px", padding: 0, overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="admin-modal-header"
              style={{
                backgroundColor: "#23408e",
                color: "#ffffff",
                padding: "16px 20px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <i
                  className="bi bi-receipt-cutoff"
                  style={{ fontSize: "20px" }}
                ></i>
                <h3
                  className="admin-modal-title"
                  style={{ color: "#ffffff", margin: 0, fontSize: "16px" }}
                >
                  {printableInvoiceOrder.hasVAT
                    ? "Hóa Đơn Giá Trị Gia Tăng (VAT Điện Tử)"
                    : "Phiếu Thu Tiền & Hóa Đơn Bán Lẻ Tại Quầy"}
                </h3>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                style={{ color: "#ffffff", opacity: 0.85 }}
                onClick={() => setPrintableInvoiceOrder(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Printable Receipt Paper Container */}
            <div
              id="vidairy-printable-receipt"
              style={{
                padding: "24px 28px",
                backgroundColor: "#ffffff",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#0f172a",
                fontSize: "13px",
                lineHeight: "1.45",
              }}
            >
              {/* Store Header */}
              <div
                style={{
                  textAlign: "center",
                  borderBottom: "1.5px dashed #cbd5e1",
                  paddingBottom: "14px",
                  marginBottom: "14px",
                }}
              >
                <img
                  src="/src/assets/img/logo.png"
                  alt="ViDairy"
                  style={{ height: "42px", marginBottom: "6px" }}
                />
                <h2
                  style={{
                    fontSize: "15px",
                    fontWeight: "800",
                    color: "#23408e",
                    margin: "0 0 4px 0",
                    textTransform: "uppercase",
                  }}
                >
                  CÔNG TY CỔ PHẦN DINH DƯỠNG QUỐC TẾ VIDAIRY
                </h2>
                <div style={{ fontSize: "12px", color: "#475569" }}>
                  Chi nhánh:{" "}
                  {printableInvoiceOrder.branchName ||
                    "ViDairy Flagship Store - Quận 1 (TP.HCM)"}
                </div>
                <div style={{ fontSize: "12px", color: "#475569" }}>
                  Đ/C:{" "}
                  {printableInvoiceOrder.shippingAddress ||
                    "120 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP.HCM"}
                </div>
                <div style={{ fontSize: "12px", color: "#475569" }}>
                  Hotline CSKH: <strong>0989 584 592</strong> • MST:{" "}
                  <strong>0316889988</strong>
                </div>
              </div>

              {/* Title & Metadata */}
              <div style={{ textAlign: "center", marginBottom: "14px" }}>
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: "800",
                    margin: "0 0 4px 0",
                    color: "#0f172a",
                    letterSpacing: "0.5px",
                  }}
                >
                  {printableInvoiceOrder.hasVAT
                    ? "HÓA ĐƠN GIÁ TRỊ GIA TĂNG (VAT)"
                    : "HÓA ĐƠN BÁN LẺ KIÊM PHIẾU XUẤT KHO"}
                </h3>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Mã đơn: <strong>{printableInvoiceOrder.orderCode}</strong> • Số
                  HĐ:{" "}
                  <strong style={{ color: "#23408e" }}>
                    {getInvoiceNumber(printableInvoiceOrder)}
                  </strong>
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                  Thời gian:{" "}
                  {printableInvoiceOrder.createdAt ||
                    new Date().toLocaleString("vi-VN")}
                </div>
              </div>

              {/* Customer & Cashier info */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  marginBottom: "14px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12.5px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                  }}
                >
                  <div>
                    <span style={{ color: "#64748b" }}>Khách hàng:</span>{" "}
                    <strong>
                      {printableInvoiceOrder.customer || "Khách lẻ tại quầy"}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>SĐT:</span>{" "}
                    <strong>
                      {printableInvoiceOrder.phone || "0989584592"}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Thu ngân:</span>{" "}
                    <span>
                      {printableInvoiceOrder.cashier ||
                        user?.FullName ||
                        "Nhân viên CSKH"}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Phương thức:</span>{" "}
                    <strong style={{ color: "#16a34a" }}>
                      {printableInvoiceOrder.paymentMethod === "CASH"
                        ? "Tiền mặt"
                        : printableInvoiceOrder.paymentMethod === "BANKING_QR"
                          ? "Chuyển khoản QR"
                          : printableInvoiceOrder.paymentMethod === "CARD"
                            ? "Quẹt thẻ POS"
                            : printableInvoiceOrder.paymentMethod || "Tiền mặt"}
                    </strong>
                  </div>
                </div>

                {/* VAT Details if applicable */}
                {printableInvoiceOrder.hasVAT && (
                  <div
                    style={{
                      marginTop: "8px",
                      borderTop: "1px dashed #cbd5e1",
                      paddingTop: "6px",
                      fontSize: "12px",
                    }}
                  >
                    <div>
                      <span style={{ color: "#64748b" }}>Đơn vị xuất VAT:</span>{" "}
                      <strong>
                        {printableInvoiceOrder.vatInfo?.company ||
                          printableInvoiceOrder.vatInfo?.Company ||
                          "Công ty TNHH Khách Hàng"}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: "#64748b" }}>
                        Mã số thuế (MST):
                      </span>{" "}
                      <strong>
                        {printableInvoiceOrder.vatInfo?.taxId ||
                          printableInvoiceOrder.vatInfo?.TaxId ||
                          "0315899210"}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: "#64748b" }}>Email nhận HĐ:</span>{" "}
                      <span>
                        {printableInvoiceOrder.vatInfo?.email ||
                          printableInvoiceOrder.vatInfo?.Email ||
                          "ketoan@khachhang.vn"}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#64748b" }}>Địa chỉ:</span>{" "}
                      <span>
                        {printableInvoiceOrder.vatInfo?.address ||
                          printableInvoiceOrder.vatInfo?.Address ||
                          "TP. Hồ Chí Minh"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "14px",
                  fontSize: "12.5px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1.5px solid #0f172a",
                      backgroundColor: "#f1f5f9",
                    }}
                  >
                    <th
                      style={{
                        padding: "6px 4px",
                        textAlign: "center",
                        width: "30px",
                      }}
                    >
                      #
                    </th>
                    <th style={{ padding: "6px 8px", textAlign: "left" }}>
                      Tên sản phẩm
                    </th>
                    <th
                      style={{
                        padding: "6px 8px",
                        textAlign: "right",
                        width: "90px",
                      }}
                    >
                      Đơn giá
                    </th>
                    <th
                      style={{
                        padding: "6px 4px",
                        textAlign: "center",
                        width: "40px",
                      }}
                    >
                      SL
                    </th>
                    <th
                      style={{
                        padding: "6px 8px",
                        textAlign: "right",
                        width: "100px",
                      }}
                    >
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(printableInvoiceOrder.items || []).map((it, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <td
                        style={{
                          padding: "6px 4px",
                          textAlign: "center",
                          color: "#64748b",
                        }}
                      >
                        {idx + 1}
                      </td>
                      <td style={{ padding: "6px 8px" }}>
                        <div style={{ fontWeight: "600" }}>
                          {it.name || it.productName}
                        </div>
                        {it.variant && (
                          <small style={{ color: "#64748b" }}>
                            Quy cách: {it.variant}
                          </small>
                        )}
                      </td>
                      <td style={{ padding: "6px 8px", textAlign: "right" }}>
                        {(Number(it.price || it.unitPrice) || 0).toLocaleString(
                          "vi-VN",
                        )}
                        đ
                      </td>
                      <td
                        style={{
                          padding: "6px 4px",
                          textAlign: "center",
                          fontWeight: "700",
                        }}
                      >
                        {it.qty || it.quantity || 1}
                      </td>
                      <td
                        style={{
                          padding: "6px 8px",
                          textAlign: "right",
                          fontWeight: "700",
                        }}
                      >
                        {(
                          (Number(it.price || it.unitPrice) || 0) *
                          (Number(it.qty || it.quantity) || 1)
                        ).toLocaleString("vi-VN")}
                        đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Calculations */}
              <div
                style={{
                  borderTop: "1.5px dashed #cbd5e1",
                  paddingTop: "10px",
                  marginBottom: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#475569" }}>Tổng tiền hàng:</span>
                  <strong>
                    {(
                      Number(printableInvoiceOrder.subTotal) ||
                      Number(printableInvoiceOrder.total) ||
                      0
                    ).toLocaleString("vi-VN")}
                    đ
                  </strong>
                </div>

                {Number(printableInvoiceOrder.discount) > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#16a34a",
                    }}
                  >
                    <span>
                      Chiết khấu / Voucher (
                      {printableInvoiceOrder.appliedCoupon || "Ưu đãi"}):
                    </span>
                    <strong>
                      -
                      {Number(printableInvoiceOrder.discount).toLocaleString(
                        "vi-VN",
                      )}
                      đ
                    </strong>
                  </div>
                )}

                {printableInvoiceOrder.hasVAT && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#2563eb",
                    }}
                  >
                    <span>Thuế GTGT (VAT 10%):</span>
                    <strong>
                      +
                      {Math.round(
                        (Number(
                          printableInvoiceOrder.subTotal ||
                            printableInvoiceOrder.total,
                        ) -
                          Number(printableInvoiceOrder.discount || 0)) *
                          0.1,
                      ).toLocaleString("vi-VN")}
                      đ
                    </strong>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    borderTop: "1.5px solid #0f172a",
                    paddingTop: "8px",
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14.5px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                    }}
                  >
                    Tổng Thanh Toán:
                  </span>
                  <strong
                    style={{
                      fontSize: "20px",
                      color: "#23408e",
                      fontFamily: "ViDairy1, sans-serif",
                    }}
                  >
                    {(Number(printableInvoiceOrder.total) || 0).toLocaleString(
                      "vi-VN",
                    )}
                    đ
                  </strong>
                </div>
              </div>

              {/* Footer barcode & gratitude */}
              <div
                style={{
                  textAlign: "center",
                  borderTop: "1.5px dashed #cbd5e1",
                  paddingTop: "12px",
                  fontSize: "11.5px",
                  color: "#64748b",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    color: "#0f172a",
                    marginBottom: "2px",
                  }}
                >
                  CẢM ƠN QUÝ KHÁCH & HẸN GẶP LẠI!
                </div>
                <div>
                  Quý khách vui lòng kiểm tra kỹ hàng hóa và hóa đơn trước khi
                  rời quầy.
                </div>
                <div>
                  Website tra cứu:{" "}
                  <strong>https://vidairy.vn/tra-cuu-hoa-don</strong>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div
              className="admin-modal-footer"
              style={{
                backgroundColor: "#f8fafc",
                borderTop: "1px solid #e2e8f0",
                padding: "12px 20px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={() => setPrintableInvoiceOrder(null)}
c              >
                Đóng
              </button>
              <button
                type="button"
                className="btn-admin-primary"
                style={{
                  backgroundColor: "#23408e",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onClick={() => window.print()}
              >
                <i className="bi bi-printer-fill"></i> In Hóa Đơn (Print)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
