
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
    5.  
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------

# Warehouses    
    1. Warehouses
    | Cột           | Kiểu dữ liệu      | Ý nghĩa                          | Ràng buộc         |
| ------------- | ----------------- | -------------------------------- | ----------------- |
| WarehouseID   | INT IDENTITY(1,1) | Mã kho                           | Primary Key       |
| WarehouseName | NVARCHAR(100)     | Tên kho                          | NOT NULL          |
| Address       | NVARCHAR(255)     | Địa chỉ kho                      | NOT NULL          |
| Status        | BIT               | 1 = Hoạt động, 0 = Ngừng sử dụng | DEFAULT 1         |
CreatedAt	      DATETIME	          Ngày tạo	                        DEFAULT GETDATE()
UpdatedAt	      DATETIME	          Ngày cập nhật	                    NULL
    2. Inventory
| Cột           | Kiểu dữ liệu      | Ý nghĩa                          | Ràng buộc         |
| ------------- | ----------------- | -------------------------------- | ----------------- |
InventoryID	      INT IDENTITY(1,1)	    Mã tồn kho	                      Primary Key
WarehouseID	      INT	                  Kho lưu trữ                   Foreign Key (Warehouses)
ProductVariantID  INT                 Biến thể sản phẩm          Foreign Key (ProductVariants)
Quantity	      INT	              Số lượng tồn kho	                  NOT NULL
UpdatedAt	      DATETIME	          Ngày cập nhật tồn kho	              NULL


    3. Suppliers
    | Cột          | Kiểu dữ liệu      | Ý nghĩa                        | Ràng buộc   |
| ------------ | ----------------- | ------------------------------ | ----------- |
| SupplierID   | INT IDENTITY(1,1) | Mã nhà cung cấp                | Primary Key |
| SupplierName | NVARCHAR(200)     | Tên nhà cung cấp               | NOT NULL    |
| PhoneNumber  | VARCHAR(15)       | Số điện thoại                  | NULL        |
| Email        | VARCHAR(100)      | Email liên hệ                  | NULL        |
| Address      | NVARCHAR(255)     | Địa chỉ                        | NULL        |
| Status       | BIT               | 1 = Hợp tác, 0 = Ngừng hợp tác | DEFAULT 1   |


# Shopping
    Carts
    CartItems

# Orders
    Orders
    OrderItems
    OrderStatusHistory

# Payment
    PaymentMethods
    Payments

# Shipping
    ShippingMethods
    Shipments

# Promotion
    Coupons
    Promotions

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
