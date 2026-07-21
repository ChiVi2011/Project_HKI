
# 1. Tổng quan

Hệ thống sử dụng mô hình cơ sở dữ liệu kết hợp:

- SQL Server: Lưu trữ dữ liệu giao dịch và dữ liệu có tính toàn vẹn cao.
- MongoDB: Lưu trữ dữ liệu phi cấu trúc, nội dung CMS và nhật ký hệ thống.

# Authentication
    Users
    Password
    Roles
    UserRoles

# Products
    Categories
    Brands
    Products
    ProductVariants
    ProductImages

# Warehouses
    Warehouses
    ProductBatches
    Inventory
    InventoryTransactions
    Suppliers
    PurchaseOrders
    PurchaseOrderDetails

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
    Settings (SQL)


# Naming Convention
    - Primary Key: TableNameID
    - Foreign Key: ReferenceTableID
    - Table Name: PascalCase
    - Column Name: PascalCase