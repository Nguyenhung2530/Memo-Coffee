<?php
// Hàm tiện ích để reset AUTO_INCREMENT sau khi xóa dữ liệu
function resetAutoIncrement($conn, $table_name, $id_column) {
    try {
        // Lấy ID lớn nhất hiện có trong bảng
        $result = $conn->query("SELECT MAX($id_column) as max_id FROM $table_name");
        $row = $result->fetch_assoc();
        $max_id = $row['max_id'];
        
        // Nếu bảng trống, set AUTO_INCREMENT về 1
        if ($max_id === null) {
            $next_id = 1;
        } else {
            $next_id = $max_id + 1;
        }
        
        // Reset AUTO_INCREMENT
        $conn->query("ALTER TABLE $table_name AUTO_INCREMENT = $next_id");
        
        return true;
    } catch (Exception $e) {
        return false;
    }
}

// Hàm reset AUTO_INCREMENT cho tất cả các bảng
function resetAllAutoIncrement($conn) {
    $tables = [
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
    
    $results = [];
    foreach ($tables as $table => $id_column) {
        $results[$table] = resetAutoIncrement($conn, $table, $id_column);
    }
    
    return $results;
}

// Hàm reset AUTO_INCREMENT cho bảng cụ thể
function resetTableAutoIncrement($conn, $table_name) {
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
    
    if (isset($table_configs[$table_name])) {
        return resetAutoIncrement($conn, $table_name, $table_configs[$table_name]);
    }
    
    return false;
}
?> 