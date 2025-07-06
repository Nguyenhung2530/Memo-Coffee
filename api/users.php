<?php
include '../config/connect.php';
include '../config/auto_increment_utils.php';

header('Content-Type: application/json; charset=utf-8');

// Lấy danh sách tài khoản hoặc một tài khoản cụ thể
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Lấy thông tin một tài khoản cụ thể (không trả về password)
        $stmt = $conn->prepare("SELECT user_id, username, role, created_at, last_login, status FROM user_account WHERE user_id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        echo json_encode($user, JSON_UNESCAPED_UNICODE);
    } else {
        // Lấy tất cả tài khoản (không trả về password)
        $result = $conn->query("SELECT user_id, username, role, created_at, last_login, status FROM user_account ORDER BY user_id ASC");
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode($users, JSON_UNESCAPED_UNICODE);
    }
    exit;
}

// Thêm tài khoản
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Hash password trước khi lưu
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO user_account (username, password, role, status) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $data['username'], $hashedPassword, $data['role'], $data['status']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0], JSON_UNESCAPED_UNICODE);
    exit;
}

// Sửa tài khoản
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!empty($data['password'])) {
        // Cập nhật cả password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE user_account SET username=?, password=?, role=?, status=? WHERE user_id=?");
        $stmt->bind_param("ssssi", $data['username'], $hashedPassword, $data['role'], $data['status'], $data['user_id']);
    } else {
        // Cập nhật không có password
        $stmt = $conn->prepare("UPDATE user_account SET username=?, role=?, status=? WHERE user_id=?");
        $stmt->bind_param("sssi", $data['username'], $data['role'], $data['status'], $data['user_id']);
    }
    
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0], JSON_UNESCAPED_UNICODE);
    exit;
}

// Xóa tài khoản
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("DELETE FROM user_account WHERE user_id=?");
    $stmt->bind_param("i", $data['user_id']);
    $stmt->execute();
    $success = $stmt->affected_rows > 0;
    
    // Reset AUTO_INCREMENT sau khi xóa
    if ($success) {
        resetTableAutoIncrement($conn, 'user_account');
    }
    
    echo json_encode(["success" => $success], JSON_UNESCAPED_UNICODE);
    exit;
}
?> 