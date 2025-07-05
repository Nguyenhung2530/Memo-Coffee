<?php
include '../config/connect.php';

header('Content-Type: application/json');

// Add new columns to online_order if they don't exist
try {
    $conn->query("ALTER TABLE online_order ADD COLUMN customer_name VARCHAR(100) AFTER customer_id");
    $conn->query("ALTER TABLE online_order ADD COLUMN customer_phone VARCHAR(20) AFTER customer_name");
    $conn->query("ALTER TABLE online_order ADD COLUMN order_note TEXT AFTER delivery_address");
} catch (Exception $e) {
    // Columns might already exist, ignore errors
}

// Lấy danh sách đơn hàng hoặc một đơn hàng cụ thể
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Lấy thông tin một đơn hàng cụ thể với thông tin khách hàng nếu có
        $stmt = $conn->prepare("SELECT o.*, c.name as registered_customer_name, c.customer_type, c.loyalty_points 
                               FROM online_order o 
                               LEFT JOIN customer c ON o.customer_id = c.customer_id 
                               WHERE o.order_id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $order = $result->fetch_assoc();
        echo json_encode($order);
    } elseif (isset($_GET['stats'])) {
        // Lấy thống kê đơn hàng online
        $result = $conn->query("SELECT 
                                COUNT(*) as total_orders,
                                SUM(total_amount) as total_revenue,
                                AVG(total_amount) as avg_order,
                                COUNT(CASE WHEN customer_id IS NOT NULL THEN 1 END) as member_orders,
                                COUNT(CASE WHEN customer_id IS NULL THEN 1 END) as guest_orders,
                                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders
                               FROM online_order");
        $stats = $result->fetch_assoc();
        echo json_encode($stats);
    } else {
        // Lấy tất cả đơn hàng với thông tin khách hàng nếu có (sắp xếp theo thời gian tăng dần)
        $result = $conn->query("SELECT o.*, c.name as registered_customer_name, c.customer_type, c.loyalty_points 
                               FROM online_order o 
                               LEFT JOIN customer c ON o.customer_id = c.customer_id 
                               ORDER BY o.order_time ASC, o.order_id ASC");
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
        echo json_encode($orders);
    }
    exit;
}

// Thêm đơn hàng (hỗ trợ cả khách lẻ và thành viên)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // customer_id là optional - có thể null cho khách lẻ
    $customer_id = isset($data['customer_id']) && !empty($data['customer_id']) ? $data['customer_id'] : null;
    
    // customer_name và customer_phone là bắt buộc
    $customer_name = $data['customer_name'];
    $customer_phone = $data['customer_phone'];
    
    // Nếu có customer_id, có thể lấy thông tin từ database
    if ($customer_id) {
        $stmt = $conn->prepare("SELECT name, phone FROM customer WHERE customer_id = ?");
        $stmt->bind_param("i", $customer_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($customer = $result->fetch_assoc()) {
            // Ưu tiên thông tin từ database nếu có
            $customer_name = $customer['name'];
            $customer_phone = $customer['phone'];
        }
    }
    
    $delivery_address = isset($data['delivery_address']) ? $data['delivery_address'] : '';
    $order_note = isset($data['order_note']) ? $data['order_note'] : '';
    $status = isset($data['status']) ? $data['status'] : 'pending';
    $payment_status = isset($data['payment_status']) ? $data['payment_status'] : 'unpaid';
    
    $stmt = $conn->prepare("INSERT INTO online_order (customer_id, customer_name, customer_phone, delivery_address, order_note, total_amount, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssdss", $customer_id, $customer_name, $customer_phone, $delivery_address, $order_note, $data['total_amount'], $status, $payment_status);
    $stmt->execute();
    
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Sửa đơn hàng
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $customer_id = isset($data['customer_id']) && !empty($data['customer_id']) ? $data['customer_id'] : null;
    $customer_name = $data['customer_name'];
    $customer_phone = $data['customer_phone'];
    
    // Nếu có customer_id, có thể lấy thông tin từ database
    if ($customer_id) {
        $stmt = $conn->prepare("SELECT name, phone FROM customer WHERE customer_id = ?");
        $stmt->bind_param("i", $customer_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($customer = $result->fetch_assoc()) {
            $customer_name = $customer['name'];
            $customer_phone = $customer['phone'];
        }
    }
    
    $delivery_address = isset($data['delivery_address']) ? $data['delivery_address'] : '';
    $order_note = isset($data['order_note']) ? $data['order_note'] : '';
    
    $stmt = $conn->prepare("UPDATE online_order SET customer_id=?, customer_name=?, customer_phone=?, delivery_address=?, order_note=?, total_amount=?, status=?, payment_status=? WHERE order_id=?");
    $stmt->bind_param("issssdsi", $customer_id, $customer_name, $customer_phone, $delivery_address, $order_note, $data['total_amount'], $data['status'], $data['payment_status'], $data['order_id']);
    $stmt->execute();
    
    // Cập nhật điểm tích lũy nếu đơn hàng hoàn thành và có customer_id
    if ($customer_id && $data['status'] === 'completed' && isset($data['loyalty_points_earned']) && $data['loyalty_points_earned'] > 0) {
        $stmt = $conn->prepare("UPDATE customer SET loyalty_points = loyalty_points + ? WHERE customer_id = ?");
        $stmt->bind_param("ii", $data['loyalty_points_earned'], $customer_id);
        $stmt->execute();
    }
    
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Xóa đơn hàng
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("DELETE FROM online_order WHERE order_id=?");
    $stmt->bind_param("i", $data['order_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}
?> 