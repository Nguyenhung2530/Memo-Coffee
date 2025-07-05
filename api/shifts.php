<?php
include '../config/connect.php';

header('Content-Type: application/json');

// Lấy danh sách ca làm việc hoặc một ca cụ thể
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Lấy thông tin một ca làm việc cụ thể
        $stmt = $conn->prepare("SELECT s.*, e.full_name 
                               FROM shift_management s 
                               JOIN employee e ON s.employee_id = e.employee_id 
                               WHERE s.shift_id = ?");
        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $shift = $result->fetch_assoc();
        echo json_encode($shift);
    } else {
        // Lấy tất cả ca làm việc với thông tin nhân viên
        $result = $conn->query("SELECT s.*, e.full_name 
                               FROM shift_management s 
                               JOIN employee e ON s.employee_id = e.employee_id 
                               ORDER BY s.shift_id ASC");
        $shifts = [];
        while ($row = $result->fetch_assoc()) {
            $shifts[] = $row;
        }
        echo json_encode($shifts);
    }
    exit;
}

// Thêm ca làm việc
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO shift_management (employee_id, date, start_time, end_time, shift_type, note) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssss", $data['employee_id'], $data['date'], $data['start_time'], $data['end_time'], $data['shift_type'], $data['note']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Sửa ca làm việc
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE shift_management SET employee_id=?, date=?, start_time=?, end_time=?, shift_type=?, note=? WHERE shift_id=?");
    $stmt->bind_param("isssssi", $data['employee_id'], $data['date'], $data['start_time'], $data['end_time'], $data['shift_type'], $data['note'], $data['shift_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}

// Xóa ca làm việc
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("DELETE FROM shift_management WHERE shift_id=?");
    $stmt->bind_param("i", $data['shift_id']);
    $stmt->execute();
    echo json_encode(["success" => $stmt->affected_rows > 0]);
    exit;
}
?> 