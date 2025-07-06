<?php
include '../config/connect.php';
include '../config/auto_increment_utils.php';

header('Content-Type: application/json');

// Lấy danh sách khách hàng hoặc một khách hàng cụ thể
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Lấy thông tin một khách hàng cụ thể
        $stmt = $conn->prepare("SELECT * FROM customer WHERE customer_id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $customer = $result->fetch_assoc();
        echo json_encode($customer);
    } elseif (isset($_GET['type'])) {
        // Lấy khách hàng theo loại (vip, member, online)
        $stmt = $conn->prepare("SELECT * FROM customer WHERE customer_type = ? AND status = 'active' ORDER BY customer_id ASC");
        $stmt->bind_param("s", $_GET['type']);
        $stmt->execute();
        $result = $stmt->get_result();
        $customers = [];
        while ($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
        echo json_encode($customers);
    } elseif (isset($_GET['phone'])) {
        // Tìm khách hàng theo số điện thoại (cho việc tích điểm nhanh)
        $stmt = $conn->prepare("SELECT * FROM customer WHERE phone = ? AND status = 'active'");
        $stmt->bind_param("s", $_GET['phone']);
        $stmt->execute();
        $result = $stmt->get_result();
        $customer = $result->fetch_assoc();
        echo json_encode($customer);
    } else {
        // Lấy tất cả khách hàng thành viên (không bao gồm khách lẻ)
        $result = $conn->query("SELECT * FROM customer WHERE status = 'active' ORDER BY customer_id ASC");
        $customers = [];
        while ($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
        echo json_encode($customers);
    }
    exit;
}

// Thêm khách hàng (chỉ cho VIP hoặc thành viên)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Đặt customer_type mặc định là 'member' nếu không được chỉ định
    $customer_type = isset($data['customer_type']) ? $data['customer_type'] : 'member';
    $registration_source = isset($data['registration_source']) ? $data['registration_source'] : 'store';
    $status = isset($data['status']) ? $data['status'] : 'active';
    
    $stmt = $conn->prepare("INSERT INTO customer (name, phone, email, date_of_birth, loyalty_points, customer_type, registration_source, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssisss", $data['name'], $data['phone'], $data['email'], $data['date_of_birth'], $data['loyalty_points'], $customer_type, $registration_source, $status);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Sửa khách hàng
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE customer SET name=?, phone=?, email=?, date_of_birth=?, loyalty_points=?, customer_type=?, registration_source=?, status=? WHERE customer_id=?");
    $stmt->bind_param("ssssisssi", $data['name'], $data['phone'], $data['email'], $data['date_of_birth'], $data['loyalty_points'], $data['customer_type'], $data['registration_source'], $data['status'], $data['customer_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Xóa khách hàng (chuyển trạng thái thành inactive thay vì xóa)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($data['permanent']) && $data['permanent'] === true) {
        // Xóa vĩnh viễn (chỉ admin)
        $stmt = $conn->prepare("DELETE FROM customer WHERE customer_id=?");
        $stmt->bind_param("i", $data['customer_id']);
        $stmt->execute();
        $success = $stmt->affected_rows > 0;
        
        // Reset AUTO_INCREMENT sau khi xóa
        if ($success) {
            resetTableAutoIncrement($conn, 'customer');
        }
        
        echo json_encode(["success" => $success]);
    } else {
        // Chuyển trạng thái thành inactive
        $stmt = $conn->prepare("UPDATE customer SET status='inactive' WHERE customer_id=?");
        $stmt->bind_param("i", $data['customer_id']);
        $stmt->execute();
        echo json_encode(["success" => $stmt->affected_rows > 0]);
    }
    
    exit;
}
?> 