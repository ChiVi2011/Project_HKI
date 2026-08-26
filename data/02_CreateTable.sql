USE ViDairyDB;
GO

-- =====================================================
-- 1. AUTHENTICATION MODULE
-- =====================================================

-- Table: Users
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(15) NULL UNIQUE,
    Status BIT NOT NULL DEFAULT 1, -- 1 = Active, 0 = Blocked
    Role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER', -- 'CUSTOMER', 'ADMIN', 'STAFF'
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL
);
GO
select * from Users
-- Table: Passwords
CREATE TABLE Passwords (
    PasswordID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL, -- BCrypt/Argon2
    CONSTRAINT FK_Passwords_Users FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
GO
select * from Passwords
-- =====================================================
-- 2. PRODUCTS MODULE
-- =====================================================

-- Table: Categories
CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL
);
GO
select * from Categories
-- Table: Brands
CREATE TABLE Brands (
    BrandID INT IDENTITY(1,1) PRIMARY KEY,
    BrandName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NULL,
    Status BIT NOT NULL DEFAULT 1, -- 1 = Hoạt động, 0 = Ngừng sử dụng
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL
);
GO
select * from Brands
-- Table: Products
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryID INT NOT NULL,
    BrandID INT NOT NULL,
    ProductName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    AgeGroup NVARCHAR(100) NULL, -- Đặc thù ngành sữa (vd: 1-3 tuổi, người lớn)
    Status BIT NOT NULL DEFAULT 1, -- 1 = Đang bán, 0 = Ngừng bán
    ImageURL NVARCHAR(500) NOT NULL,
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    CONSTRAINT FK_Products_Brands FOREIGN KEY (BrandID) REFERENCES Brands(BrandID)
);
GO
select * from Products
-- Table: ProductVariants
CREATE TABLE ProductVariants (
    ProductVariantID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    VariantName NVARCHAR(100) NOT NULL, -- Quy cách (vd: Lon 800g, Lốc 4x180ml)
    Price DECIMAL(18,0) NOT NULL,
    CONSTRAINT FK_ProductVariants_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO
select * from ProductVariants
-- =====================================================
-- 3. WAREHOUSES MODULE
-- =====================================================

-- Table: Warehouses
CREATE TABLE Warehouses (
    WarehouseID INT IDENTITY(1,1) PRIMARY KEY,
    WarehouseName NVARCHAR(100) NOT NULL,
    Address NVARCHAR(255) NOT NULL
);
GO
select * from Warehouses
-- Table: Inventory
CREATE TABLE Inventory (
    InventoryID INT IDENTITY(1,1) PRIMARY KEY,
    WarehouseID INT NOT NULL,
    ProductVariantID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Inventory_Warehouses FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID),
    CONSTRAINT FK_Inventory_ProductVariants FOREIGN KEY (ProductVariantID) REFERENCES ProductVariants(ProductVariantID)
);
GO
select * from Inventory
-- Table: Suppliers
CREATE TABLE Suppliers (
    SupplierID INT IDENTITY(1,1) PRIMARY KEY,
    SupplierName NVARCHAR(200) NOT NULL,
    PhoneNumber VARCHAR(15) NULL,
    Address NVARCHAR(255) NULL
);
GO
select * from Suppliers
-- Table: PurchaseOrders
CREATE TABLE PurchaseOrders (
    PurchaseOrderID INT IDENTITY(1,1) PRIMARY KEY,
    SupplierID INT NOT NULL,
    WarehouseID INT NOT NULL,
    OrderDate DATETIME NOT NULL DEFAULT GETDATE(),
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    CONSTRAINT FK_PurchaseOrders_Suppliers FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
    CONSTRAINT FK_PurchaseOrders_Warehouses FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID)
);
GO
select * from PurchaseOrders
-- Table: PurchaseOrderDetails
CREATE TABLE PurchaseOrderDetails (
    PurchaseOrderDetailID INT IDENTITY(1,1) PRIMARY KEY,
    PurchaseOrderID INT NOT NULL,
    ProductVariantID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,0) NOT NULL,
    CONSTRAINT FK_PurchaseOrderDetails_PurchaseOrders FOREIGN KEY (PurchaseOrderID) REFERENCES PurchaseOrders(PurchaseOrderID),
    CONSTRAINT FK_PurchaseOrderDetails_ProductVariants FOREIGN KEY (ProductVariantID) REFERENCES ProductVariants(ProductVariantID)
);
GO
select * from PurchaseOrderDetails
-- =====================================================
-- 4. SHOPPING MODULE
-- =====================================================

CREATE TABLE CartItems (
    CartItemID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    ProductVariantID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_CartItems_Users FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    CONSTRAINT FK_CartItems_ProductVariants FOREIGN KEY (ProductVariantID) REFERENCES ProductVariants(ProductVariantID),
    CONSTRAINT UQ_User_Variant UNIQUE (UserID, ProductVariantID) -- Mỗi biến thể chỉ xuất hiện 1 lần trong giỏ hàng
);
GO
select * from CartItems
-- =====================================================
-- 5. PROMOTION MODULE
-- =====================================================

-- Table: Coupons
CREATE TABLE Coupons (
    CouponID INT IDENTITY(1,1) PRIMARY KEY,
    CouponCode VARCHAR(50) NOT NULL UNIQUE,
    DiscountType VARCHAR(20) NOT NULL, -- 'Percent' hoặc 'FixedAmount'
    DiscountValue DECIMAL(18,0) NOT NULL,
    MinimumOrderAmount DECIMAL(18,0) NOT NULL DEFAULT 0,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    Status BIT NOT NULL DEFAULT 1 -- 1 = Hoạt động, 0 = Ngừng dùng
);
GO
select * from Coupons
-- =====================================================
-- 6. ORDERS MODULE
-- =====================================================

-- Table: Orders
CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    CouponID INT NULL,
    ReceiverName NVARCHAR(100) NOT NULL,
    ReceiverPhone VARCHAR(15) NOT NULL,
    ShippingAddress NVARCHAR(255) NOT NULL,
    TotalAmount DECIMAL(18,0) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Orders_Coupons FOREIGN KEY (CouponID) REFERENCES Coupons(CouponID)
);
GO
select * from Orders
-- Table: OrderItems
CREATE TABLE OrderItems (
    OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductVariantID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,0) NOT NULL,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    CONSTRAINT FK_OrderItems_ProductVariants FOREIGN KEY (ProductVariantID) REFERENCES ProductVariants(ProductVariantID)
);
GO
select * from OrderItems
-- =====================================================
-- 7. PAYMENT MODULE
-- =====================================================

-- Table: Payments
CREATE TABLE Payments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL UNIQUE,
    PaymentMethod NVARCHAR(50) NOT NULL,
    Amount DECIMAL(18,0) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    PaidAt DATETIME NULL,
    CONSTRAINT FK_Payments_Orders FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);
GO
select * from Payments
-- =====================================================
-- 8. SHIPPING MODULE
-- =====================================================

-- Table: Shipments
CREATE TABLE Shipments (
    ShipmentID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL UNIQUE,
    ShippingMethod NVARCHAR(50) NOT NULL,
    ShippingFee DECIMAL(18,0) NOT NULL DEFAULT 0,
    TrackingNumber VARCHAR(100) NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Preparing',
    CONSTRAINT FK_Shipments_Orders FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);
GO
select * from Shipments