
# 1. Tổng quan

Hệ thống sử dụng mô hình cơ sở dữ liệu kết hợp:

- SQL Server: Lưu trữ dữ liệu giao dịch và dữ liệu có tính toàn vẹn cao.
- MongoDB: Lưu trữ dữ liệu phi cấu trúc, nội dung CMS và nhật ký hệ thống.

# Authentication
    1. Users
    Cột 	    Kiểu dữ liệu	    Ý nghĩa                Ràng buộc
    ------------------------------------------------------------------
    UesrID      INT IDENTITY(1,1)   Mã ID                  Primary Key
    FullName    NVARCHAR(100)       Họ và tên              NOT NULL
    Email	    VARCHAR(100)	    Email đăng nhập        NOT NULL, UNIQUE
    PhoneNumber VARCHAR(15)	        Số điện thoại          NULL, UNIQUE
    Status	    BIT	                Trạng thái tài khoản   1 = Active, 0 = Blocked
    CreatedAt	DATETIME	        Ngày tạo tài khoản	   DEFAULT GETDATE()
    UpdatedAt   DATETIME            Ngày cập nhật gần nhất NULL

    2. Password
    Cột 	      Kiểu dữ liệu	     Ý nghĩa               Ràng buộc
    ------------------------------------------------------------------
    PasswordID	  INT IDENTITY(1,1)	 Mã hồ sơ mật khẩu	   Primary Key
    UserID	      INT	             Mã người dùng sở hữu  Foreign Key (Users)
    PasswordHash  VARCHAR(255)	     Mật khẩu đã mã hóa	   NOT NULL (Dùng BCrypt/Argon2)
    <!-- Roles
    UserRoles -->

# Products
    1. Categories 
    Cột 	    Kiểu dữ liệu	     Ý nghĩa       Ràng buộc
    ---------------------------------------------------------
    CategoryID	  INT IDENTITY(1,1)	 Mã danh mục     Primary Key
    CategoryName  NVARCHAR(100)	     Tên danh mục    NOT NULL
    
    2. Brands
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------
    BrandID	       INT	            Mã thương hiệu
    BrandName	   NVARCHAR(100)	Tên thương hiệu (NutralisBaby, AmoraCare...)
    Description    NVARCHAR(500)	Mô tả thương hiệu
    Status	       BIT	            1 = Hoạt động, 0 = Ngừng sử dụng
    CreatedAt	   DATETIME	        Ngày tạo
    UpdatedAt      DATETIME	        Ngày cập nhật

    3. Products
    Cột 	    Kiểu dữ liệu	   Ý nghĩa                                    Ràng buộc
    ----------------------------------------------------------------------------------------
    ProductID	INT IDENTITY(1,1)  Mã sản phẩm	                              Primary Key
    CategoryID	INT	               Mã danh mục	                              Foreign Key (Categories)
    BrandID	    INT	               Mã thương hiệu                             Foreign Key (Brands)
    ProductName	NVARCHAR(200)	   Tên sản phẩm                               NOT NULL
    Description	NVARCHAR(MAX)	   Bài viết mô tả chi tiết	                  NULL
    AgeGroup	NVARCHAR(100)	   Độ tuổi sử dụng (vd: 1-3 tuổi, người lớn)  Đặc thù ngành sữa
    Status	    BIT	               Trạng thái kinh doanh	                  1 = Đang bán, 0 = Ngừng bán
    ImageURL	NVARCHAR(500)	   Đường dẫn đến file ảnh	                  NOT NULL

    4. ProductVariants
    Cột 	            Kiểu dữ liệu	    Ý nghĩa                                Ràng buộc
    -----------------------------------------------------------------------------------------------------
    ProductVariantID	INT IDENTITY(1,1)	Mã biến thể sản phẩm	               Primary Key
    ProductID	        INT	                Mã sản phẩm gốc	                       Foreign Key (Products)
    VariantName	        NVARCHAR(100)	    Quy cách (vd: Lon 800g, Lốc 4x180ml)   NOT NULL
    Price	            DECIMAL(18,0)	    Giá niêm yết	                       NOT NULL
# Warehouses    
    1. Warehouses
    Cột             Kiểu dữ liệu         Ý nghĩa                Ràng buộc
    ---------------------------------------------------------------------------
    WarehouseID     INT IDENTITY(1,1)    Mã kho                 Primary Key
    WarehouseName   NVARCHAR(100)        Tên kho                NOT NULL
    Address         NVARCHAR(255)        Địa chỉ kho            NOT NULL

    2. Inventory
    Cột                Kiểu dữ liệu         Ý nghĩa                 Ràng buộc
    ---------------------------------------------------------------------------------------
    InventoryID        INT IDENTITY(1,1)    Mã tồn kho              Primary Key
    WarehouseID        INT                  Kho lưu trữ             Foreign Key (Warehouses)
    ProductVariantID   INT                  Biến thể sản phẩm       Foreign Key (ProductVariants)
    Quantity           INT                  Số lượng tồn kho        NOT NULL

    3. Suppliers
    Cột             Kiểu dữ liệu         Ý nghĩa                Ràng buộc
    ---------------------------------------------------------------------------
    SupplierID      INT IDENTITY(1,1)    Mã nhà cung cấp        Primary Key
    SupplierName    NVARCHAR(200)        Tên nhà cung cấp       NOT NULL
    PhoneNumber     VARCHAR(15)          Số điện thoại          NULL
    Address         NVARCHAR(255)        Địa chỉ                NULL

    4. PurchaseOrders
    Cột               Kiểu dữ liệu         Ý nghĩa                Ràng buộc
    ---------------------------------------------------------------------------------
    PurchaseOrderID   INT IDENTITY(1,1)    Mã phiếu nhập          Primary Key
    SupplierID        INT                  Nhà cung cấp           Foreign Key (Suppliers)
    WarehouseID       INT                  Kho nhập               Foreign Key (Warehouses)
    OrderDate         DATETIME             Ngày lập phiếu         DEFAULT GETDATE()
    Status            VARCHAR(20)          Trạng thái phiếu nhập  DEFAULT 'Pending'

    5. PurchaseOrderDetails
    Cột                     Kiểu dữ liệu         Ý nghĩa                 Ràng buộc
    -------------------------------------------------------------------------------------------------
    PurchaseOrderDetailID   INT IDENTITY(1,1)    Mã chi tiết phiếu nhập Primary Key
    PurchaseOrderID         INT                  Phiếu nhập              Foreign Key (PurchaseOrders)
    ProductVariantID        INT                  Biến thể sản phẩm       Foreign Key (ProductVariants)
    Quantity                INT                  Số lượng nhập           NOT NULL
    UnitPrice               DECIMAL(18,0)        Đơn giá nhập            NOT NULL

# Shopping
    1. Carts
    Cột        Kiểu dữ liệu         Ý nghĩa                  Ràng buộc
    -------------------------------------------------------------------------
    CartID     INT IDENTITY(1,1)    Mã giỏ hàng              Primary Key
    UserID     INT                  Người sở hữu giỏ hàng    Foreign Key (Users), UNIQUE

    2. CartItems
    Cột                Kiểu dữ liệu         Ý nghĩa                 Ràng buộc
    ------------------------------------------------------------------------------------
    CartItemID         INT IDENTITY(1,1)    Mã sản phẩm trong giỏ  Primary Key
    CartID             INT                  Mã giỏ hàng             Foreign Key (Carts)
    ProductVariantID   INT                  Biến thể sản phẩm      Foreign Key (ProductVariants)
    Quantity           INT                  Số lượng sản phẩm      NOT NULL

# Orders
    1. Orders
    Cột               Kiểu dữ liệu         Ý nghĩa                       Ràng buộc
    ---------------------------------------------------------------------------------------------
    OrderID           INT IDENTITY(1,1)    Mã đơn hàng                   Primary Key
    UserID            INT                  Người đặt hàng                Foreign Key (Users)
    CouponID          INT                  Mã giảm giá đã sử dụng        Foreign Key (Coupons), NULL
    ReceiverName      NVARCHAR(100)        Tên người nhận                NOT NULL
    ReceiverPhone     VARCHAR(15)          Số điện thoại người nhận      NOT NULL
    ShippingAddress   NVARCHAR(255)        Địa chỉ giao hàng             NOT NULL
    TotalAmount       DECIMAL(18,0)        Tổng tiền thanh toán          NOT NULL
    Status            VARCHAR(20)          Trạng thái đơn hàng           DEFAULT 'Pending'
    CreatedAt         DATETIME             Ngày đặt hàng                 DEFAULT GETDATE()

    2. OrderItems
    Cột                Kiểu dữ liệu         Ý nghĩa                        Ràng buộc
    ------------------------------------------------------------------------------------------
    OrderItemID        INT IDENTITY(1,1)    Mã chi tiết đơn hàng          Primary Key
    OrderID            INT                  Mã đơn hàng                   Foreign Key (Orders)
    ProductVariantID   INT                  Biến thể sản phẩm             Foreign Key (ProductVariants)
    Quantity           INT                  Số lượng mua                  NOT NULL
    UnitPrice          DECIMAL(18,0)        Giá sản phẩm tại lúc mua      NOT NULL

# Payment
    1. Payments
    Cột               Kiểu dữ liệu         Ý nghĩa                       Ràng buộc
    -----------------------------------------------------------------------------------------
    PaymentID         INT IDENTITY(1,1)    Mã thanh toán                 Primary Key
    OrderID           INT                  Mã đơn hàng                   Foreign Key (Orders), UNIQUE
    PaymentMethod     NVARCHAR(50)         Phương thức thanh toán        NOT NULL
    Amount            DECIMAL(18,0)        Số tiền thanh toán            NOT NULL
    Status            VARCHAR(20)          Trạng thái thanh toán         DEFAULT 'Pending'
    PaidAt            DATETIME             Thời gian thanh toán          NULL

# Shipping
    1. Shipments
    Cột               Kiểu dữ liệu         Ý nghĩa                       Ràng buộc
    -----------------------------------------------------------------------------------------
    ShipmentID        INT IDENTITY(1,1)    Mã vận chuyển                 Primary Key
    OrderID           INT                  Mã đơn hàng                   Foreign Key (Orders), UNIQUE
    ShippingMethod    NVARCHAR(50)         Phương thức vận chuyển        NOT NULL
    ShippingFee       DECIMAL(18,0)        Phí vận chuyển                DEFAULT 0
    TrackingNumber    VARCHAR(100)         Mã vận đơn                    NULL
    Status            VARCHAR(20)          Trạng thái vận chuyển         DEFAULT 'Preparing'

# Promotion
    1. Coupons
    Cột                  Kiểu dữ liệu         Ý nghĩa                       Ràng buộc
    ---------------------------------------------------------------------------------------------
    CouponID             INT IDENTITY(1,1)    Mã giảm giá                   Primary Key
    CouponCode           VARCHAR(50)          Mã khách hàng nhập            NOT NULL, UNIQUE
    DiscountType         VARCHAR(20)          Percent hoặc FixedAmount      NOT NULL
    DiscountValue        DECIMAL(18,0)        Giá trị giảm                   NOT NULL
    MinimumOrderAmount   DECIMAL(18,0)        Giá trị đơn tối thiểu          DEFAULT 0
    StartDate            DATETIME             Ngày bắt đầu                  NOT NULL
    EndDate              DATETIME             Ngày kết thúc                 NOT NULL
    Status               BIT                  1 = Hoạt động, 0 = Ngừng dùng DEFAULT 1

# Review (NoSQL)
   Reviews

# CMS (NoSQL)
    Notifications
    Banners
    News

# System 
    AuditLogs (NoSQL)
    <!-- Settings (SQL) -->


# Naming Convention
    - Primary Key: TableNameID
    - Foreign Key: ReferenceTableID
    - Table Name: PascalCase
    - Column Name: PascalCase
