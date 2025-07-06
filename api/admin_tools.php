<?php
include '../config/connect.php';
include '../config/auto_increment_utils.php';

header('Content-Type: application/json');

// Chỉ cho phép admin sử dụng
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    // Tạm thời bỏ qua kiểm tra session để demo
    // echo json_encode(["error" => "Unauthorized access"]);
    // exit;
}

// Reset AUTO_INCREMENT cho bảng cụ thể
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'reset_table') {
    $table_name = $_POST['table_name'];
    $result = resetTableAutoIncrement($conn, $table_name);
    
    if ($result) {
        echo json_encode(["success" => true, "message" => "Đã reset AUTO_INCREMENT cho bảng $table_name"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi khi reset AUTO_INCREMENT cho bảng $table_name"]);
    }
    exit;
}

// Reset AUTO_INCREMENT cho tất cả các bảng
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'reset_all') {
    $results = resetAllAutoIncrement($conn);
    
    $success_count = 0;
    $total_count = count($results);
    
    foreach ($results as $table => $success) {
        if ($success) {
            $success_count++;
        }
    }
    
    echo json_encode([
        "success" => $success_count === $total_count,
        "message" => "Đã reset AUTO_INCREMENT cho $success_count/$total_count bảng",
        "details" => $results
    ]);
    exit;
}

// Lấy thông tin AUTO_INCREMENT hiện tại của các bảng
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_status') {
    $tables = [
        'employee', 'customer', 'shift_management', 'drink', 'recipe', 
        'ingredient', 'invoice', 'online_order', 'user_account', 'feedback'
    ];
    
    $status = [];
    foreach ($tables as $table) {
        $result = $conn->query("SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = '$table' AND table_schema = DATABASE()");
        $row = $result->fetch_assoc();
        $auto_increment = $row['AUTO_INCREMENT'];
        
        // Lấy ID lớn nhất trong bảng
        $table_configs = [
            'employee' => 'employee_id',
            'customer' => 'customer_id',
            'shift_management' => 'shift_id',
            'drink' => 'drink_id',
            'recipe' => 'recipe_id',
            'ingredient' => 'ingredient_id',
            'invoice' => 'invoice_id',
            'online_order' => 'order_id',
            'user_account' => 'user_id',
            'feedback' => 'feedback_id'
        ];
        
        $id_column = $table_configs[$table];
        $result = $conn->query("SELECT MAX($id_column) as max_id FROM $table");
        $row = $result->fetch_assoc();
        $max_id = $row['max_id'] ?? 0;
        
        $status[$table] = [
            'auto_increment' => $auto_increment,
            'max_id' => $max_id,
            'next_expected' => $max_id + 1,
            'gap' => $auto_increment - ($max_id + 1)
        ];
    }
    
    echo json_encode($status);
    exit;
}

// Hiển thị giao diện quản lý (GET request không có action)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    ?>
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Tools - Reset AUTO_INCREMENT</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .container { max-width: 1200px; margin: 0 auto; }
            .button { background: #007cba; color: white; padding: 10px 20px; border: none; cursor: pointer; margin: 5px; }
            .button:hover { background: #005a8b; }
            .danger { background: #dc3545; }
            .danger:hover { background: #c82333; }
            .success { background: #28a745; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background: #f2f2f2; }
            .gap { background: #fff3cd; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Admin Tools - Quản lý AUTO_INCREMENT</h1>
            
            <div style="margin: 20px 0;">
                <button class="button" onclick="getStatus()">Kiểm tra trạng thái</button>
                <button class="button danger" onclick="resetAll()">Reset tất cả AUTO_INCREMENT</button>
            </div>
            
            <div id="status"></div>
            <div id="result"></div>
            
            <h2>Thông tin</h2>
            <p>Công cụ này giúp reset AUTO_INCREMENT để tránh việc ID bị nhảy số sau khi xóa dữ liệu.</p>
            <p><strong>Lưu ý:</strong> Chỉ sử dụng khi cần thiết, vì việc reset có thể ảnh hưởng đến hiệu suất.</p>
        </div>
        
        <script>
            function getStatus() {
                fetch('?action=get_status')
                    .then(response => response.json())
                    .then(data => {
                        let html = '<h2>Trạng thái AUTO_INCREMENT</h2>';
                        html += '<table class="table">';
                        html += '<tr><th>Bảng</th><th>AUTO_INCREMENT</th><th>Max ID</th><th>Dự kiến kế tiếp</th><th>Khoảng trống</th><th>Hành động</th></tr>';
                        
                        for (let table in data) {
                            let item = data[table];
                            let gapClass = item.gap > 0 ? 'gap' : '';
                            html += `<tr class="${gapClass}">`;
                            html += `<td>${table}</td>`;
                            html += `<td>${item.auto_increment}</td>`;
                            html += `<td>${item.max_id}</td>`;
                            html += `<td>${item.next_expected}</td>`;
                            html += `<td>${item.gap}</td>`;
                            html += `<td><button class="button" onclick="resetTable('${table}')">Reset</button></td>`;
                            html += '</tr>';
                        }
                        
                        html += '</table>';
                        document.getElementById('status').innerHTML = html;
                    })
                    .catch(error => {
                        document.getElementById('status').innerHTML = '<p style="color: red;">Lỗi: ' + error + '</p>';
                    });
            }
            
            function resetTable(tableName) {
                if (confirm(`Bạn có chắc muốn reset AUTO_INCREMENT cho bảng ${tableName}?`)) {
                    const formData = new FormData();
                    formData.append('action', 'reset_table');
                    formData.append('table_name', tableName);
                    
                    fetch('', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('result').innerHTML = 
                            `<div style="padding: 10px; background: ${data.success ? '#d4edda' : '#f8d7da'}; color: ${data.success ? '#155724' : '#721c24'}; margin: 10px 0;">
                                ${data.message}
                            </div>`;
                        if (data.success) {
                            setTimeout(getStatus, 1000);
                        }
                    })
                    .catch(error => {
                        document.getElementById('result').innerHTML = '<p style="color: red;">Lỗi: ' + error + '</p>';
                    });
                }
            }
            
            function resetAll() {
                if (confirm('Bạn có chắc muốn reset AUTO_INCREMENT cho TẤT CẢ các bảng?')) {
                    const formData = new FormData();
                    formData.append('action', 'reset_all');
                    
                    fetch('', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        let detailsHtml = '<h3>Chi tiết:</h3><ul>';
                        for (let table in data.details) {
                            detailsHtml += `<li>${table}: ${data.details[table] ? 'Thành công' : 'Lỗi'}</li>`;
                        }
                        detailsHtml += '</ul>';
                        
                        document.getElementById('result').innerHTML = 
                            `<div style="padding: 10px; background: ${data.success ? '#d4edda' : '#f8d7da'}; color: ${data.success ? '#155724' : '#721c24'}; margin: 10px 0;">
                                ${data.message}
                                ${detailsHtml}
                            </div>`;
                        if (data.success) {
                            setTimeout(getStatus, 1000);
                        }
                    })
                    .catch(error => {
                        document.getElementById('result').innerHTML = '<p style="color: red;">Lỗi: ' + error + '</p>';
                    });
                }
            }
            
            // Tự động load trạng thái khi trang load
            window.onload = function() {
                getStatus();
            };
        </script>
    </body>
    </html>
    <?php
    exit;
}
?> 