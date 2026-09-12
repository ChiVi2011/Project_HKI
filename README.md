## I. Thông tin User dự án

    1. Nguyễn Chí Vĩ  - Nhóm trưởng
    2. Nguyễn Trần Nhật Long - Thành viên
    3. Dương Hoàng Phúc - Thành viên
    4. Hồ Thái Sơn - Thành viên

## II. Công nghệ dự án

    1. Frontend: React - Vite
    2. Backend: Node.js
    3. Database:  Mongo DB atlas
    4. Version Control: Git & GitHub

## III. Kiến trúc hệ thống

````text
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
                            -+
                            |
                            |
                            v
                    +-----------------------+
                    |      MongoDB          |
                    | - User                |
                    | - Product             |
                    | - Category            |
                    | - Order               |
                    | - Payment             |
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

    project-root/
    ├── frontend/               # React - Vite
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/
    │   │   ├── components/     # Component tái sử dụng
    │   │   ├── pages/          # Các trang (Home, Product, Cart, Admin...)
    │   │   ├── services/       # Gọi API
    │   │   ├── hooks/
    │   │   ├── context/
    │   │   └── App.jsx
    │   └── package.json
    │
    ├── backend/                 # Node.js - Express
    │   ├── src/
    │   │   ├── config/          # Kết nối SQL Server, MongoDB
    │   │   ├── controllers/
    │   │   ├── models/
    │   │   ├── routes/
    │   │   ├── middlewares/
    │   │   └── utils/
    │   ├── .env.example
    │   └── package.json
    │
    ├── database/
    │   ├── sql/                 # Script tạo bảng, dữ liệu mẫu (SQL Server)
    │   └── mongo/                # Schema/seed cho MongoDB
    │
    ├── docs/                     # Tài liệu dự án (xem mục XI)
    └── README.md
## VIII. Hướng dẫn cài đặt

    1. Yêu cầu môi trường
        - Node.js >= 18
        - MongoDB Atlas
        - Git

    2. Clone dự án
        git clone <repo-url>
        cd project-root

    3. Cài đặt Backend
        cd backend
        npm install
        cp .env.example .env      # điền thông tin kết nối DB, PORT, JWT_SECRET...
        npm run dev               # chạy server tại http://localhost:5000

    4. Cài đặt Frontend
        cd frontend
        npm install
        npm run dev                # chạy tại http://localhost:5173

    5. Khởi tạo Database
        - Chạy các script trong database/sql/ để tạo bảng cho SQL Server.
        - MongoDB tự tạo collection khi có dữ liệu đầu tiên được insert.

## IX. Quy trình Git
    1. Nhánh chính
        - main: code ổn định, đã kiểm thử, dùng để chạy demo/báo cáo.
        - dev: nhánh tích hợp, các nhánh feature merge vào đây trước.

    2. Đặt tên nhánh feature
        feature/<ten-chuc-nang>
        fix/<mo-ta-loi>

    3. Quy tắc commit message
        <loại>: <mô tả ngắn>
        VD:
        feat: thêm chức năng đăng nhập
        fix: sửa lỗi tính tổng giỏ hàng
        docs: cập nhật README
        Các loại thường dùng: feat, fix, docs, style, refactor, test, chore

    4. Quy trình làm việc
        - Tạo nhánh mới từ dev cho mỗi task.
        - Code xong, commit và push nhánh của mình.
        - Tạo Pull Request vào dev, ít nhất 1 thành viên khác review trước khi merge.
        - Định kỳ merge dev vào main khi đã test ổn định (VD: trước mỗi buổi báo cáo).

## X. Coding Convention (Quy tắc chung)
    1. Đặt tên
        - Biến, hàm: camelCase (VD: getUserById)
        - Component React, class: PascalCase (VD: ProductCard)
        - Tên file component: PascalCase.jsx; file thường: camelCase.js
        - Tên bảng/cột trong SQL Server: PascalCase hoặc snake_case (chọn 1 và dùng thống nhất toàn dự án)
        - Constant: UPPER_SNAKE_CASE (VD: MAX_CART_ITEMS)

    2. Định dạng code
        - Thu lề (indent) 2 hoặc 4 space, thống nhất trong toàn nhóm.
        - Dùng ESLint + Prettier cho cả frontend và backend.
        - Không để code thừa, console.log khi commit lên nhánh dev/main.

    3. Cấu trúc API
        - Response JSON theo chuẩn thống nhất, VD:
        { "success": true, "data": {...}, "message": "" }
        - Đặt tên endpoint theo RESTful: /api/products, /api/orders/:id

    4. Comment & tài liệu
        - Comment cho các hàm xử lý nghiệp vụ phức tạp.
        - Không cần comment cho code quá đơn giản, tự giải thích.

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
````
