### Khách hàng

- Đăng ký tài khoản
- Đăng nhập
- Xem sản phẩm
- Tìm kiếm sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng
- Thanh toán
- Theo dõi đơn hàng
- Quản lý thông tin cá nhân

### Quản trị viên

- Quản lý sản phẩm
- Quản lý danh mục
- Quản lý thương hiệu
- Quản lý tồn kho
- Quản lý đơn hàng
- Quản lý khách hàng
- Quản lý khuyến mãi
- Xem Dashboard thống kê

---

## 3. Chức năng hệ thống

### Khách hàng

- Đăng ký
- Đăng nhập
- Đăng xuất
- Quên mật khẩu
- Xem danh sách sản phẩm
- Xem chi tiết sản phẩm
- Tìm kiếm sản phẩm
- Lọc sản phẩm
- Giỏ hàng
- Thanh toán
- Theo dõi đơn hàng

### Quản trị viên

- CRUD Sản phẩm
- CRUD Danh mục
- CRUD Thương hiệu
- CRUD Khuyến mãi
- CRUD Khách hàng
- CRUD Đơn hàng
- Dashboard thống kê

### Quản trị viên

- CRUD Sản phẩm
- CRUD Danh mục
- CRUD Thương hiệu
- CRUD Khuyến mãi
- CRUD Khách hàng
- CRUD Đơn hàng
- Dashboard thống kê

---

### Quản lý sản phẩm

- Một sản phẩm thuộc một danh mục.
- Một sản phẩm thuộc một thương hiệu.
- Một sản phẩm có thể có nhiều hình ảnh.
- Một sản phẩm có giá bán.

### Quản lý đơn hàng

- Khách hàng có thể tạo nhiều đơn hàng.
- Một đơn hàng có nhiều sản phẩm.
- Đơn hàng có trạng thái.

### Quản lý lô hàng (Batch)

- Mỗi lô có mã lô riêng.
- Có ngày sản xuất.
- Có hạn sử dụng.
- Có số lượng tồn.

### Xuất kho

- Ưu tiên xuất lô có hạn sử dụng gần nhất (FEFO).

### Tồn kho

- Không cho phép bán vượt số lượng tồn.
- Khi thanh toán thành công, hệ thống cập nhật tồn kho theo transaction.

## 5. Quy tắc nghiệp vụ

- Không cho phép đặt hàng khi hết hàng.
- Không cho phép số lượng âm.
- Chỉ Admin được quản lý sản phẩm.
- Chỉ khách đã đăng nhập mới được đặt hàng.
- Sau khi thanh toán thành công phải cập nhật tồn kho.

---

## 6. Phi chức năng

- Responsive trên Desktop và Mobile.
- Giao diện thân thiện.
- API phản hồi dưới 2 giây (đối với dữ liệu thông thường).
- Mật khẩu được mã hóa.
- Xác thực bằng JWT.

---

## 7. Phạm vi MVP

Bao gồm:

- Đăng nhập
- Đăng ký
- Quản lý sản phẩm
- Giỏ hàng
- Thanh toán
- Quản lý đơn hàng
- Dashboard Admin

Không bao gồm:

- Chat
- AI
- Livestream
- Loyalty Point