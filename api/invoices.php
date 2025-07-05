<?php
include '../config/connect.php';

header('Content-Type: application/json');

// Lấy danh sách hóa đơn hoặc một hóa đơn cụ thể
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Lấy thông tin một hóa đơn cụ thể
        $stmt = $conn->prepare("SELECT i.*, e.full_name as employee_name, c.name as registered_customer_name, c.customer_type, c.loyalty_points
                               FROM invoice i 
                               JOIN employee e ON i.employee_id = e.employee_id 
                               LEFT JOIN customer c ON i.customer_id = c.customer_id 
                               WHERE i.invoice_id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $invoice = $result->fetch_assoc();
        echo json_encode($invoice);
    } elseif (isset($_GET['stats'])) {
        // Lấy thống kê hóa đơn
        $result = $conn->query("SELECT 
                                COUNT(*) as total_invoices,
                                SUM(total_amount) as total_revenue,
                                AVG(total_amount) as avg_invoice,
                                COUNT(CASE WHEN customer_id IS NOT NULL THEN 1 END) as member_invoices,
                                COUNT(CASE WHEN customer_id IS NULL THEN 1 END) as guest_invoices
                               FROM invoice");
        $stats = $result->fetch_assoc();
        echo json_encode($stats);
    } else {
        // Lấy tất cả hóa đơn với thông tin nhân viên và khách hàng
        $result = $conn->query("SELECT i.*, e.full_name as employee_name, c.name as registered_customer_name, c.customer_type, c.loyalty_points
                               FROM invoice i 
                               JOIN employee e ON i.employee_id = e.employee_id 
                               LEFT JOIN customer c ON i.customer_id = c.customer_id 
                               ORDER BY i.invoice_id ASC");
        $invoices = [];
        while ($row = $result->fetch_assoc()) {
            $invoices[] = $row;
        }
        echo json_encode($invoices);
    }
    exit;
}

// Thêm hóa đơn (hỗ trợ cả khách lẻ và thành viên)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Xử lý customer_id và customer_name
    $customer_id = isset($data['customer_id']) && !empty($data['customer_id']) ? $data['customer_id'] : null;
    $customer_name = isset($data['customer_name']) && !empty($data['customer_name']) ? $data['customer_name'] : 'Khách lẻ';
    $customer_phone = isset($data['customer_phone']) ? $data['customer_phone'] : null;
    $invoice_type = isset($data['invoice_type']) ? $data['invoice_type'] : 'store';
    
    // Nếu có customer_id, lấy thông tin từ database
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
    
    $stmt = $conn->prepare("INSERT INTO invoice (employee_id, customer_id, customer_name, customer_phone, total_amount, payment_method, discount, invoice_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iissdsis", $data['employee_id'], $customer_id, $customer_name, $customer_phone, $data['total_amount'], $data['payment_method'], $data['discount'], $invoice_type);
    $stmt->execute();
    
    // Cập nhật điểm tích lũy nếu là khách thành viên
    if ($customer_id && isset($data['loyalty_points_earned']) && $data['loyalty_points_earned'] > 0) {
        $stmt = $conn->prepare("UPDATE customer SET loyalty_points = loyalty_points + ? WHERE customer_id = ?");
        $stmt->bind_param("ii", $data['loyalty_points_earned'], $customer_id);
        $stmt->execute();
    }
    
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Sửa hóa đơn
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $customer_id = isset($data['customer_id']) && !empty($data['customer_id']) ? $data['customer_id'] : null;
    $customer_name = isset($data['customer_name']) && !empty($data['customer_name']) ? $data['customer_name'] : 'Khách lẻ';
    $customer_phone = isset($data['customer_phone']) ? $data['customer_phone'] : null;
    $invoice_type = isset($data['invoice_type']) ? $data['invoice_type'] : 'store';
    
    // Nếu có customer_id, lấy thông tin từ database
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
    
    $stmt = $conn->prepare("UPDATE invoice SET employee_id=?, customer_id=?, customer_name=?, customer_phone=?, total_amount=?, payment_method=?, discount=?, invoice_type=? WHERE invoice_id=?");
    $stmt->bind_param("iissdsssi", $data['employee_id'], $customer_id, $customer_name, $customer_phone, $data['total_amount'], $data['payment_method'], $data['discount'], $invoice_type, $data['invoice_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Xóa hóa đơn
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("DELETE FROM invoice WHERE invoice_id=?");
    $stmt->bind_param("i", $data['invoice_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}
?> 