<?php
include '../config/connect.php';

header('Content-Type: application/json');

// Lấy danh sách công thức hoặc một công thức cụ thể
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Lấy thông tin một công thức cụ thể
        $stmt = $conn->prepare("SELECT r.*, d.name as drink_name 
                               FROM recipe r 
                               JOIN drink d ON r.drink_id = d.drink_id 
                               WHERE r.recipe_id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $recipe = $result->fetch_assoc();
        echo json_encode($recipe);
    } else {
        // Lấy tất cả công thức với thông tin thức uống
        $result = $conn->query("SELECT r.*, d.name as drink_name 
                               FROM recipe r 
                               JOIN drink d ON r.drink_id = d.drink_id 
                               ORDER BY r.recipe_id ASC");
        $recipes = [];
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
        echo json_encode($recipes);
    }
    exit;
}

// Thêm công thức
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO recipe (drink_id, steps, preparation_time) VALUES (?, ?, ?)");
    $stmt->bind_param("isi", $data['drink_id'], $data['steps'], $data['preparation_time']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Sửa công thức
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE recipe SET drink_id=?, steps=?, preparation_time=? WHERE recipe_id=?");
    $stmt->bind_param("isii", $data['drink_id'], $data['steps'], $data['preparation_time'], $data['recipe_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Xóa công thức
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("DELETE FROM recipe WHERE recipe_id=?");
    $stmt->bind_param("i", $data['recipe_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}
?> 