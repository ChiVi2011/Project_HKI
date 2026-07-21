## I. Thông tin User dự án

    1. Nguyễn Chí Vĩ  - Nhóm trưởng
    2. Nguyễn Trần Nhật Long - Thành viên
    3. Dương Hoàng Phúc - Thành viên
    4. Hồ Thái Sơn - Thành viên

## II. Công nghệ dự án

    1. Frontend: React - Vite
    2. Backend: Node.js
    3. Database: SQL Server 2022 + Mongo DB
    4. Version ControlL: Git & GitHub

## III. Kiến trúc hệ thống

```text
                 +----------------------+
                 |      Người dùng      |
                 +----------+-----------+
                            |
                            |
                     HTTP/HTTPS Request
                            |
                            v
                 +----------------------+
                 | React (Frontend)     |
                 | Vite,                |
                 +----------+-----------+
                            |
                        REST API
                            |
                            v
                 +----------------------+
                 | Node.js + Express.js |
                 |      Backend API     |
                 +----------+-----------+
                            |
          +-----------------+------------------+
          |                                    |
          |                                    |
          v                                    v
+-----------------------+          +----------------------+
| SQL Server 2022       |          | MongoDB             |
| - User                |          | - Activity Log      |
| - Product             |          | - Audit Log         |
| - Category            |          | - Search History    |
| - Order               |          | - Product View      |
| - Payment             |          +----------------------+
| - Inventory           |
+-----------------------+
```

    1. Người dùng thao tác trên giao diện React.
    2. Frontend gửi yêu cầu đến Backend thông qua RESTful API.
    3. Backend xử lý nghiệp vụ và xác thực dữ liệu.
    4. Backend truy vấn SQL Server hoặc MongoDB tùy theo loại dữ liệu.
    5. Kết quả được trả về Frontend để hiển thị cho người dùng.

## IV. Mô tả về dự án

    Xây dựng hệ thống Website thương mại điện tử bán sản phẩm sữa, hỗ trợ khách hàng tìm kiếm, đặt hàng, thanh toán và theo dõi đơn hàng; đồng thời cung cấp trang quản trị để quản lý sản phẩm, danh mục, tồn kho, đơn hàng, khách hàng và báo cáo thống kê.

## V. Chức năng người dùng

    1. Đăng nhập/ Đăng ký
    2. Xem sản phẩm
    3. Tìm kiếm
    4. Giỏ hàng
    5. Đặt hàng
    6. Thanh toán
    7. Theo dõi đơn hàng

## VI. Chức năng quản trị viên

    1. Quản lý sản phẩm
    2. Quản lý danh mục
    3. Quản lý thương hiệu
    4. Quản lý tồn kho
    5. Quản lý đơn hàng
    6. Quản lý khách hàng
    7. Quản lý khuyến mãi
    8. Dashboard thống kê

## VII. Cấu trúc hệ thống

    1. frontend
    2. backend
    3. database
    4. README.md

## VIII. Hướng dẫn cài đặt

## IX. Quy trình Git

## X. Coding Convention (Quy tắc chung)

## XI. Tài liệu dự án (docs/)
    1. Requirement
    2. Sitemap
    3. UserFlow
    4. ERD
    5. Wireframe
    6. DesignSystem
    7. API
    8. Database
    9. TestCase