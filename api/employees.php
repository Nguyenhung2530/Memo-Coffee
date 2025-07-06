<?php
include '../config/connect.php';
include '../config/auto_increment_utils.php';

header('Content-Type: application/json');

// Lấy danh sách nhân viên hoặc một nhân viên cụ thể
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Lấy thông tin một nhân viên cụ thể
        $stmt = $conn->prepare("SELECT * FROM employee WHERE employee_id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $employee = $result->fetch_assoc();
        echo json_encode($employee);
    } else {
        // Lấy tất cả nhân viên
        $result = $conn->query("SELECT * FROM employee ORDER BY employee_id ASC");
        $employees = [];
        while ($row = $result->fetch_assoc()) {
            $employees[] = $row;
        }
        echo json_encode($employees);
    }
    exit;
}

// Thêm nhân viên
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO employee (full_name, birth_date, phone, email, position, hire_date, address, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"); // Changed table name
    $stmt->bind_param("sssssssd", $data['full_name'], $data['birth_date'], $data['phone'], $data['email'], $data['position'], $data['hire_date'], $data['address'], $data['salary']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Sửa nhân viên
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE employee SET full_name=?, birth_date=?, phone=?, email=?, position=?, hire_date=?, address=?, salary=? WHERE employee_id=?"); // Changed table name
    $stmt->bind_param("ssssssdsi", $data['full_name'], $data['birth_date'], $data['phone'], $data['email'], $data['position'], $data['hire_date'], $data['address'], $data['salary'], $data['employee_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Xóa nhân viên
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("DELETE FROM employee WHERE employee_id=?"); // Changed table name
    $stmt->bind_param("i", $data['employee_id']);
    $stmt->execute();
    $success = $stmt->affected_rows > 0;
    
    // Reset AUTO_INCREMENT sau khi xóa
    if ($success) {
        resetTableAutoIncrement($conn, 'employee');
    }
    
    echo json_encode(["success" => $success]);
    exit;
}
?>