# Giải pháp Reset AUTO_INCREMENT

## Vấn đề
Khi xóa dữ liệu trong MySQL, AUTO_INCREMENT không tự động reset về ID nhỏ nhất có thể. Ví dụ: nếu bạn xóa hàng có ID 15, hàng mới thêm sẽ có ID 16 thay vì 15.

## Giải pháp đã triển khai

### 1. Tự động reset khi xóa
- Tất cả các API đã được cập nhật để tự động reset AUTO_INCREMENT sau khi xóa dữ liệu
- Chỉ reset khi xóa thành công
- Áp dụng cho tất cả các bảng: employee, customer, drink, ingredient, invoice, orders, users, recipes, shifts

### 2. Công cụ quản lý cho Admin
- Truy cập: `api/admin_tools.php`
- Kiểm tra trạng thái AUTO_INCREMENT của tất cả bảng
- Reset thủ công cho từng bảng hoặc tất cả bảng cùng lúc

### 3. Cách hoạt động
- **resetAutoIncrement()**: Reset AUTO_INCREMENT cho một bảng cụ thể
- **resetAllAutoIncrement()**: Reset AUTO_INCREMENT cho tất cả bảng
- **resetTableAutoIncrement()**: Reset AUTO_INCREMENT cho bảng được chỉ định

### 4. Ví dụ sử dụng
```php
// Trong API delete
$stmt->execute();
$success = $stmt->affected_rows > 0;

// Reset AUTO_INCREMENT sau khi xóa
if ($success) {
    resetTableAutoIncrement($conn, 'customer');
}
```

## Lưu ý
- Việc reset AUTO_INCREMENT có thể ảnh hưởng đến hiệu suất với bảng lớn
- Không nên reset quá thường xuyên
- Backup dữ liệu trước khi sử dụng công cụ reset hàng loạt

## Test
Để test chức năng:
1. Thêm một số dữ liệu vào bảng
2. Xóa một hàng ở giữa
3. Thêm hàng mới - ID sẽ tiếp tục từ ID lớn nhất + 1 thay vì tăng từ AUTO_INCREMENT cũ 