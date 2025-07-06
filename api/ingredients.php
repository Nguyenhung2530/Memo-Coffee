<?php
include '../config/connect.php';
include '../config/auto_increment_utils.php';

header('Content-Type: application/json');

// Lấy danh sách nguyên liệu hoặc một nguyên liệu cụ thể
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Lấy thông tin một nguyên liệu cụ thể
        $stmt = $conn->prepare("SELECT * FROM ingredient WHERE ingredient_id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $ingredient = $result->fetch_assoc();
        echo json_encode($ingredient);
    } else {
        // Lấy tất cả nguyên liệu
        $result = $conn->query("SELECT * FROM ingredient ORDER BY ingredient_id ASC");
        $ingredients = [];
        while ($row = $result->fetch_assoc()) {
            $ingredients[] = $row;
        }
        echo json_encode($ingredients);
    }
    exit;
}

// Thêm nguyên liệu
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO ingredient (name, unit, quantity_in_stock, supplier) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssds", $data['name'], $data['unit'], $data['quantity_in_stock'], $data['supplier']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Sửa nguyên liệu
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE ingredient SET name=?, unit=?, quantity_in_stock=?, supplier=? WHERE ingredient_id=?");
    $stmt->bind_param("ssdsi", $data['name'], $data['unit'], $data['quantity_in_stock'], $data['supplier'], $data['ingredient_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Xóa nguyên liệu
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("DELETE FROM ingredient WHERE ingredient_id=?");
    $stmt->bind_param("i", $data['ingredient_id']);
    $stmt->execute();
    $success = $stmt->affected_rows > 0;
    
    // Reset AUTO_INCREMENT sau khi xóa
    if ($success) {
        resetTableAutoIncrement($conn, 'ingredient');
    }
    
    echo json_encode(["success" => $success]);
    exit;
}
?> 