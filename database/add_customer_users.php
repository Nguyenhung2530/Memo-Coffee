<?php
include '../config/connect.php';

// Thêm user mẫu có role "customer" để test phân quyền
$customerUsers = [
    ['username' => 'customer1', 'password' => 'password', 'role' => 'customer'],
    ['username' => 'customer2', 'password' => 'password', 'role' => 'customer'],
    ['username' => 'khachhang1', 'password' => 'password', 'role' => 'customer'],
    ['username' => 'khachhang2', 'password' => 'password', 'role' => 'customer']
];

echo "Đang thêm customer users vào database...\n";

foreach ($customerUsers as $user) {
    // Kiểm tra xem user đã tồn tại chưa
    $checkStmt = $conn->prepare("SELECT username FROM user_account WHERE username = ?");
    $checkStmt->bind_param("s", $user['username']);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows > 0) {
        echo "User {$user['username']} đã tồn tại, bỏ qua.\n";
        continue;
    }
    
    // Hash password
    $hashedPassword = password_hash($user['password'], PASSWORD_DEFAULT);
    
    // Thêm user mới
    $stmt = $conn->prepare("INSERT INTO user_account (username, password, role, status) VALUES (?, ?, ?, 'active')");
    $stmt->bind_param("sss", $user['username'], $hashedPassword, $user['role']);
    
    if ($stmt->execute()) {
        echo "✓ Đã thêm user: {$user['username']} (role: {$user['role']})\n";
    } else {
        echo "✗ Lỗi khi thêm user: {$user['username']}\n";
    }
}

echo "\nHoàn thành! Các user customer đã được thêm vào database.\n";
echo "Thông tin đăng nhập:\n";
echo "- customer1 / password\n";
echo "- customer2 / password\n";
echo "- khachhang1 / password\n";
echo "- khachhang2 / password\n";

$conn->close();
?> 