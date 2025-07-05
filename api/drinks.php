<?php
include '../config/connect.php';

header('Content-Type: application/json');

// Lấy danh sách thức uống hoặc một thức uống cụ thể
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Lấy thông tin một thức uống cụ thể
        $stmt = $conn->prepare("SELECT * FROM drink WHERE drink_id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $drink = $result->fetch_assoc();
        echo json_encode($drink);
    } else {
        // Lấy tất cả thức uống
        $result = $conn->query("SELECT * FROM drink ORDER BY drink_id ASC");
        $drinks = [];
        while ($row = $result->fetch_assoc()) {
            $drinks[] = $row;
        }
        echo json_encode($drinks);
    }
    exit;
}

// Thêm thức uống
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO drink (name, category, price, is_available, description, size) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdibs", $data['name'], $data['category'], $data['price'], $data['is_available'], $data['description'], $data['size']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Sửa thức uống
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE drink SET name=?, category=?, price=?, is_available=?, description=?, size=? WHERE drink_id=?");
    $stmt->bind_param("ssdibsi", $data['name'], $data['category'], $data['price'], $data['is_available'], $data['description'], $data['size'], $data['drink_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Xóa thức uống
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("DELETE FROM drink WHERE drink_id=?");
    $stmt->bind_param("i", $data['drink_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}
?> 