# Coffee Management System

## Mô tả dự án
Hệ thống quản lý quán cà phê với đầy đủ chức năng quản lý nhân viên, thực đơn, hóa đơn, khách hàng và đơn hàng online.

## Cấu trúc thư mục

```
Memo-Coffee/
├── assets/                  # Tài nguyên frontend
│   ├── css/                 # File CSS
│   │   └── styles.css       # Stylesheet chính
│   ├── js/                  # File JavaScript
│   │   └── script.js        # Script chính
│   └── images/              # Hình ảnh (hiện tại trống)
├── api/                     # API endpoints
│   ├── customers.php        # API quản lý khách hàng
│   ├── drinks.php           # API quản lý thức uống
│   ├── employees.php        # API quản lý nhân viên
│   ├── ingredients.php      # API quản lý nguyên liệu
│   ├── invoices.php         # API quản lý hóa đơn
│   ├── orders.php           # API quản lý đơn hàng
│   ├── recipes.php          # API quản lý công thức
│   ├── shifts.php           # API quản lý ca làm việc
│   └── users.php            # API quản lý tài khoản
├── config/                  # Cấu hình hệ thống
│   └── connect.php          # Kết nối database
├── database/                # Database
│   └── database.sql         # Schema và dữ liệu mẫu
├── index.html               # Trang chính
└── README.md               # Tài liệu này
```

## Chức năng chính

### 1. Quản lý tài khoản
- Thêm/sửa/xóa tài khoản người dùng
- Phân quyền: Admin, Manager, Employee

### 2. Quản lý nhân viên
- Thông tin chi tiết nhân viên
- Quản lý ca làm việc
- Theo dõi lương

### 3. Quản lý thực đơn
- Danh mục thức uống
- Công thức pha chế
- Quản lý nguyên liệu

### 4. Quản lý khách hàng
- Khách hàng thành viên
- Hệ thống tích điểm
- Phân loại khách hàng (VIP, thường)

### 5. Quản lý hóa đơn
- Tạo hóa đơn tại quầy
- Nhiều phương thức thanh toán
- Báo cáo doanh thu

### 6. Quản lý đơn hàng online
- Đơn hàng giao tại nhà
- Theo dõi trạng thái đơn hàng
- Tích hợp với hệ thống khách hàng

## Cài đặt

### Yêu cầu
- Web server (Apache/Nginx)
- PHP 7.4+
- MySQL 5.7+
- Browser hiện đại

### Cấu hình
1. Import database từ `database/database.sql`
2. Cấu hình kết nối database trong `config/connect.php`
3. Truy cập `index.html` để sử dụng

### Cấu hình Database
```php
$host = "localhost";
$user = "root";
$pass = "";
$db = "coffee_management";
```

## Công nghệ sử dụng

### Frontend
- HTML5, CSS3, JavaScript ES6
- Font Awesome Icons
- Responsive Design

### Backend
- PHP 7.4+
- MySQL
- RESTful API

### Tính năng
- SPA (Single Page Application)
- AJAX Data Loading
- Real-time Notifications
- Mobile Responsive

## API Documentation

### Endpoints
Tất cả API endpoints đều hỗ trợ CRUD operations:

- `GET /api/{resource}.php` - Lấy danh sách
- `GET /api/{resource}.php?id={id}` - Lấy chi tiết
- `POST /api/{resource}.php` - Thêm mới
- `PUT /api/{resource}.php` - Cập nhật
- `DELETE /api/{resource}.php` - Xóa

### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

## Bảo mật
- Prepared statements để chống SQL injection
- Input validation
- Session management
- CORS configuration

## Phát triển

### Thêm tính năng mới
1. Tạo API endpoint trong thư mục `api/`
2. Cập nhật frontend trong `assets/js/script.js`
3. Thêm CSS tương ứng trong `assets/css/styles.css`

### Cấu trúc Database
Xem chi tiết trong file `database/database.sql`

## Tác giả
Coffee Management System v1.0

## Giấy phép
MIT License 