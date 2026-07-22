
# 1. Tổng quan

Hệ thống sử dụng mô hình cơ sở dữ liệu kết hợp:

- SQL Server: Lưu trữ dữ liệu giao dịch và dữ liệu có tính toàn vẹn cao.
- MongoDB: Lưu trữ dữ liệu phi cấu trúc, nội dung CMS và nhật ký hệ thống.

# Authentication
    1. Users
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------
    UesrID     INT IDENTITY(1,1)     Mã ID
    

    2. Password
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------
    <!-- Roles
    UserRoles -->

# Products
    1. Categories 
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------

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
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------

    4. ProductVariants
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------
    5.  
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------

# Warehouses    
    1. Warehouses
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------
    2. ProductBatches *****
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------
    3. Inventory
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------
    4. InventoryTransactions
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------
    5. Suppliers
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------
    6. PurchaseOrders
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------
    7. PurchaseOrderDetails
    Cột 	    Kiểu dữ liệu	    Ý nghĩa
    ---------------------------------------

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