<?php
include '../config/connect.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Thiếu thông tin email và mật khẩu'], JSON_UNESCAPED_UNICODE);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];

try {
    // Tìm user trong database (có thể tìm theo email hoặc username)
    $stmt = $conn->prepare("SELECT user_id, username, password, role, status FROM user_account WHERE (username = ? OR username = ?) AND status = 'active'");
    $stmt->bind_param("ss", $email, $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    // Kiểm tra mật khẩu
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Mật khẩu không chính xác'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // Cập nhật thời gian đăng nhập cuối
    $updateStmt = $conn->prepare("UPDATE user_account SET last_login = NOW() WHERE user_id = ?");
    $updateStmt->bind_param("i", $user['user_id']);
    $updateStmt->execute();
    
    // Xác định redirect URL dựa trên role
    $redirectUrl = '';
    $dashboardRoles = ['admin', 'manager', 'employee', 'cashier', 'barista', 'server', 'staff', 'supervisor'];
    
    if (in_array(strtolower($user['role']), $dashboardRoles)) {
        $redirectUrl = 'index.html'; // Dashboard
    } else if (strtolower($user['role']) === 'customer') {
        $redirectUrl = 'frontend/assets/websites.html'; // Frontend website
    } else {
        // Default to dashboard for unknown roles
        $redirectUrl = 'index.html';
    }
    
    // Trả về thông tin đăng nhập thành công
    echo json_encode([
        'success' => true,
        'message' => 'Đăng nhập thành công',
        'user' => [
            'id' => $user['user_id'],
            'username' => $user['username'],
            'role' => $user['role']
        ],
        'redirect_url' => $redirectUrl
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Lỗi hệ thống: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?> 