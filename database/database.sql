-- Tạo cơ sở dữ liệu coffee_management nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS coffee_management;
USE coffee_management;

-- 1. employee
CREATE TABLE IF NOT EXISTS employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    phone VARCHAR(15),
    email VARCHAR(100),
    position VARCHAR(50),
    hire_date DATE,
    address TEXT,
    salary DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. customer (cập nhật để optional và phân loại)
CREATE TABLE IF NOT EXISTS customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    member_since DATE DEFAULT (CURRENT_DATE),
    date_of_birth DATE,
    loyalty_points INT DEFAULT 0,
    customer_type ENUM('vip', 'member', 'online') DEFAULT 'member',
    registration_source ENUM('store', 'online', 'app') DEFAULT 'store',
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- 3. shift_management
CREATE TABLE IF NOT EXISTS shift_management (
    shift_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    shift_type VARCHAR(20) DEFAULT 'normal',  
    note VARCHAR(255),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE
);

-- 4. drink
CREATE TABLE IF NOT EXISTS drink (
    drink_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    description TEXT,
    size VARCHAR(20) DEFAULT 'medium'
);

-- 5. recipe
CREATE TABLE IF NOT EXISTS recipe (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    drink_id INT NOT NULL,
    steps TEXT,
    preparation_time INT,
    FOREIGN KEY (drink_id) REFERENCES drink(drink_id) ON DELETE CASCADE
);

-- 6. ingredient
CREATE TABLE IF NOT EXISTS ingredient (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(20),
    quantity_in_stock DECIMAL(10,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    supplier VARCHAR(100)
);

-- 7. invoice (cập nhật để customer_id optional và thêm customer info)
CREATE TABLE IF NOT EXISTS invoice (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    customer_id INT NULL,
    customer_name VARCHAR(100) DEFAULT 'Khách lẻ',
    customer_phone VARCHAR(20) NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(20),
    discount DECIMAL(10,2) DEFAULT 0,
    invoice_type ENUM('store', 'online') DEFAULT 'store',
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE SET NULL
);

-- 8. online_order (cập nhật để không bắt buộc customer_id)
CREATE TABLE IF NOT EXISTS online_order (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_address TEXT,
    order_note TEXT,
    total_amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE SET NULL
);

-- 9. user_account
CREATE TABLE IF NOT EXISTS user_account (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'active'
);

-- 10. feedback
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE SET NULL
);

-- Thêm dữ liệu mẫu
INSERT IGNORE INTO employee (full_name, birth_date, phone, email, position, hire_date, address, salary) VALUES
('Nguyễn Văn A', '1990-05-15', '0123456789', 'nguyenvana@gmail.com', 'Quản lý', '2023-01-15', '123 Đường ABC, Quận 1, TP.HCM', 15000000),
('Trần Thị B', '1995-08-20', '0987654321', 'tranthib@gmail.com', 'Nhân viên pha chế', '2023-03-10', '456 Đường XYZ, Quận 2, TP.HCM', 8000000),
('Lê Văn C', '1992-12-03', '0111222333', 'levanc@gmail.com', 'Thu ngân', '2023-02-01', '789 Đường DEF, Quận 3, TP.HCM', 7000000),
('Phạm Thị D', '1993-07-22', '0234567890', 'phamthid@gmail.com', 'Nhân viên pha chế', '2023-04-05', '321 Đường GHI, Quận 4, TP.HCM', 7500000),
('Hoàng Văn E', '1988-11-10', '0345678901', 'hoangvane@gmail.com', 'Phó quản lý', '2022-12-15', '654 Đường JKL, Quận 5, TP.HCM', 12000000),
('Vũ Thị F', '1996-03-18', '0456789012', 'vuthif@gmail.com', 'Thu ngân', '2023-05-20', '987 Đường MNO, Quận 6, TP.HCM', 7200000),
('Đỗ Văn G', '1991-09-25', '0567890123', 'dovang@gmail.com', 'Nhân viên pha chế', '2023-06-10', '147 Đường PQR, Quận 7, TP.HCM', 7800000),
('Bùi Thị H', '1994-01-14', '0678901234', 'buithih@gmail.com', 'Nhân viên phục vụ', '2023-07-01', '258 Đường STU, Quận 8, TP.HCM', 6500000),
('Lý Văn I', '1989-06-30', '0789012345', 'lyvani@gmail.com', 'Nhân viên kho', '2023-03-25', '369 Đường VWX, Quận 9, TP.HCM', 7000000),
('Trịnh Thị K', '1997-12-08', '0890123456', 'trinhthik@gmail.com', 'Nhân viên phục vụ', '2023-08-15', '741 Đường YZ, Quận 10, TP.HCM', 6800000),
('Ngô Văn L', '1992-04-17', '0901234567', 'ngovanl@gmail.com', 'Nhân viên pha chế', '2023-09-01', '852 Đường AB, Quận 11, TP.HCM', 7600000),
('Cao Thị M', '1995-10-03', '0912345678', 'caothim@gmail.com', 'Thu ngân', '2023-09-20', '963 Đường CD, Quận 12, TP.HCM', 7100000),
('Phan Văn N', '1990-08-26', '0923456789', 'phanvann@gmail.com', 'Nhân viên phục vụ', '2023-10-05', '174 Đường EF, Bình Thạnh, TP.HCM', 6700000),
('Mai Thị O', '1993-02-19', '0934567890', 'maithio@gmail.com', 'Nhân viên pha chế', '2023-10-20', '285 Đường GH, Tân Bình, TP.HCM', 7400000),
('Kiều Văn P', '1996-05-12', '0945678901', 'kieuvanp@gmail.com', 'Nhân viên phục vụ', '2023-11-01', '396 Đường IJ, Phú Nhuận, TP.HCM', 6600000);

-- Cập nhật dữ liệu mẫu khách hàng với phân loại
INSERT IGNORE INTO customer (name, phone, email, member_since, date_of_birth, loyalty_points, customer_type, registration_source) VALUES
('Nguyễn Thị D - VIP', '0999888777', 'vip1@gmail.com', '2023-01-01', '1985-06-10', 500, 'vip', 'store'),
('Trần Văn E - Thành viên', '0888777666', 'member1@gmail.com', '2023-02-15', '1992-11-25', 150, 'member', 'store'),
('Lê Thị F - Online', '0777666555', 'online1@gmail.com', '2023-03-20', '1988-03-08', 75, 'online', 'online'),
('Phạm Minh G', '0666555444', 'phammingg@gmail.com', '2023-01-20', '1990-04-15', 320, 'vip', 'store'),
('Hoàng Thu H', '0555444333', 'hoangthuh@gmail.com', '2023-02-28', '1987-09-22', 180, 'member', 'store'),
('Vũ Đức I', '0444333222', 'vuduci@gmail.com', '2023-03-15', '1995-12-05', 95, 'online', 'online'),
('Đỗ Lan J', '0333222111', 'dolanj@gmail.com', '2023-04-10', '1993-07-18', 250, 'member', 'app'),
('Bùi Hạnh K', '0222111000', 'buihanhk@gmail.com', '2023-05-05', '1989-11-30', 420, 'vip', 'store'),
('Lý Tâm L', '0111000999', 'lytaml@gmail.com', '2023-06-01', '1996-02-14', 65, 'online', 'online'),
('Trịnh Mai M', '0000999888', 'tinhmaim@gmail.com', '2023-06-25', '1991-08-07', 135, 'member', 'store'),
('Ngô Phong N', '0999000111', 'ngophongn@gmail.com', '2023-07-12', '1994-03-25', 275, 'member', 'app'),
('Cao Hương O', '0888111222', 'caohuongo@gmail.com', '2023-08-08', '1986-10-12', 380, 'vip', 'store'),
('Phan Đức P', '0777222333', 'phanducp@gmail.com', '2023-09-03', '1997-05-28', 45, 'online', 'online'),
('Mai Linh Q', '0666333444', 'mailinhq@gmail.com', '2023-09-20', '1992-01-16', 195, 'member', 'store'),
('Kiều Anh R', '0555666777', 'kieuanhr@gmail.com', '2023-10-15', '1988-06-09', 310, 'vip', 'app');

INSERT IGNORE INTO drink (name, category, price, is_available, description, size) VALUES
('Cà phê đen', 'coffee', 25000, TRUE, 'Cà phê đen đậm đà', 'medium'),
('Cà phê sữa', 'coffee', 30000, TRUE, 'Cà phê sữa thơm ngon', 'medium'),
('Trà xanh', 'tea', 20000, TRUE, 'Trà xanh thanh mát', 'medium'),
('Sinh tố dâu', 'smoothie', 45000, TRUE, 'Sinh tố dâu tươi', 'large'),
('Cappuccino', 'coffee', 35000, TRUE, 'Cappuccino Ý nguyên chất', 'medium'),
('Latte', 'coffee', 40000, TRUE, 'Latte thơm béo', 'large'),
('Americano', 'coffee', 28000, TRUE, 'Americano đậm đà', 'medium'),
('Espresso', 'coffee', 22000, TRUE, 'Espresso nguyên chất', 'small'),
('Trà đào', 'tea', 25000, TRUE, 'Trà đào ngọt mát', 'large'),
('Trà sữa', 'tea', 30000, TRUE, 'Trà sữa Thái Lan', 'medium'),
('Sinh tố xoài', 'smoothie', 42000, TRUE, 'Sinh tố xoài thơm ngon', 'large'),
('Nước cam', 'juice', 18000, TRUE, 'Nước cam tươi', 'medium'),
('Bánh croissant', 'pastry', 15000, TRUE, 'Bánh croissant bơ', 'small'),
('Bánh muffin', 'pastry', 12000, TRUE, 'Bánh muffin chocolate', 'small'),
('Sandwich', 'snack', 35000, TRUE, 'Sandwich thịt nguội', 'medium');

INSERT IGNORE INTO ingredient (name, unit, quantity_in_stock, supplier) VALUES
('Cà phê hạt', 'kg', 50.5, 'Nhà cung cấp A'),
('Sữa tươi', 'lít', 20.0, 'Nhà cung cấp B'),
('Đường', 'kg', 15.5, 'Nhà cung cấp C'),
('Trà xanh', 'kg', 5.0, 'Nhà cung cấp D'),
('Bột cacao', 'kg', 8.2, 'Nhà cung cấp E'),
('Kem tươi', 'lít', 12.3, 'Nhà cung cấp B'),
('Siro vani', 'chai', 25, 'Nhà cung cấp F'),
('Đá viên', 'kg', 100.0, 'Nhà cung cấp G'),
('Trà đào', 'kg', 3.5, 'Nhà cung cấp D'),
('Xoài tươi', 'kg', 15.8, 'Nhà cung cấp H'),
('Dâu tây', 'kg', 8.7, 'Nhà cung cấp H'),
('Cam tươi', 'kg', 25.4, 'Nhà cung cấp H'),
('Bánh mì', 'ổ', 50, 'Nhà cung cấp I'),
('Thịt nguội', 'kg', 5.2, 'Nhà cung cấp J'),
('Bơ', 'kg', 3.8, 'Nhà cung cấp K');

INSERT IGNORE INTO user_account (username, password, role, status) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active'),
('manager1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 'active'),
('employee1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 'active'),
('manager2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 'active'),
('employee2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 'active'),
('employee3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 'active'),
('cashier1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', 'active'),
('cashier2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', 'active'),
('barista1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'barista', 'active'),
('barista2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'barista', 'active'),
('server1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'server', 'active'),
('server2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'server', 'active'),
('staff1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'active'),
('staff2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'active'),
('supervisor1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'supervisor', 'active');

-- Thêm dữ liệu mẫu hóa đơn với khách lẻ và khách thành viên
INSERT IGNORE INTO invoice (employee_id, customer_id, customer_name, customer_phone, total_amount, payment_method, discount, invoice_type) VALUES
(1, 1, 'Nguyễn Thị D - VIP', '0999888777', 65000, 'cash', 5000, 'store'),
(2, NULL, 'Khách lẻ', NULL, 25000, 'cash', 0, 'store'),
(3, NULL, 'Khách lẻ', NULL, 50000, 'card', 0, 'store'),
(2, 2, 'Trần Văn E - Thành viên', '0888777666', 35000, 'cash', 2000, 'store'),
(1, 4, 'Phạm Minh G', '0666555444', 120000, 'card', 10000, 'store'),
(3, NULL, 'Khách lẻ', NULL, 18000, 'cash', 0, 'store'),
(4, 5, 'Hoàng Thu H', '0555444333', 85000, 'cash', 5000, 'store'),
(5, NULL, 'Khách lẻ', NULL, 42000, 'card', 0, 'store'),
(2, 8, 'Bùi Hạnh K', '0222111000', 95000, 'cash', 8000, 'store'),
(6, NULL, 'Khách lẻ', NULL, 30000, 'cash', 0, 'store'),
(3, 12, 'Cao Hương O', '0888111222', 150000, 'card', 15000, 'store'),
(7, NULL, 'Khách lẻ', NULL, 22000, 'cash', 0, 'store'),
(1, 15, 'Kiều Anh R', '0555666777', 75000, 'cash', 5000, 'store'),
(8, NULL, 'Khách lẻ', NULL, 55000, 'card', 0, 'store'),
(2, 11, 'Ngô Phong N', '0999000111', 68000, 'cash', 3000, 'store');

-- Thêm dữ liệu mẫu cho shift_management
INSERT IGNORE INTO shift_management (employee_id, date, start_time, end_time, shift_type, note) VALUES
(1, '2024-01-15', '08:00:00', '16:00:00', 'morning', 'Ca sáng quản lý'),
(2, '2024-01-15', '09:00:00', '17:00:00', 'day', 'Ca pha chế chính'),
(3, '2024-01-15', '14:00:00', '22:00:00', 'evening', 'Ca chiều thu ngân'),
(4, '2024-01-16', '08:30:00', '16:30:00', 'morning', 'Ca sáng pha chế'),
(5, '2024-01-16', '10:00:00', '18:00:00', 'day', 'Ca phó quản lý'),
(6, '2024-01-16', '15:00:00', '23:00:00', 'evening', 'Ca tối thu ngân'),
(7, '2024-01-17', '09:00:00', '17:00:00', 'day', 'Ca pha chế'),
(8, '2024-01-17', '13:00:00', '21:00:00', 'evening', 'Ca chiều phục vụ'),
(9, '2024-01-17', '07:00:00', '15:00:00', 'morning', 'Ca sáng kho'),
(10, '2024-01-18', '14:00:00', '22:00:00', 'evening', 'Ca tối phục vụ'),
(11, '2024-01-18', '08:00:00', '16:00:00', 'morning', 'Ca sáng pha chế'),
(12, '2024-01-18', '16:00:00', '24:00:00', 'night', 'Ca đêm thu ngân'),
(13, '2024-01-19', '10:00:00', '18:00:00', 'day', 'Ca ngày phục vụ'),
(14, '2024-01-19', '09:00:00', '17:00:00', 'day', 'Ca pha chế chính'),
(15, '2024-01-19', '12:00:00', '20:00:00', 'evening', 'Ca chiều phục vụ');

-- Thêm dữ liệu mẫu cho recipe
INSERT IGNORE INTO recipe (drink_id, steps, preparation_time) VALUES
(1, 'Pha cà phê đen: 1. Đun nước sôi 2. Cho cà phê vào phin 3. Đổ nước sôi 4. Chờ 5 phút', 5),
(2, 'Pha cà phê sữa: 1. Cho sữa đặc vào ly 2. Pha cà phê đen 3. Đổ cà phê xuống ly', 6),
(3, 'Pha trà xanh: 1. Đun nước 80°C 2. Cho trà vào ấm 3. Đổ nước 4. Ủ 3 phút', 8),
(4, 'Làm sinh tố dâu: 1. Rửa dâu 2. Cho vào máy xay 3. Thêm sữa và đường 4. Xay nhuyễn', 10),
(5, 'Pha Cappuccino: 1. Pha espresso 2. Đánh bọt sữa 3. Đổ sữa vào cà phê 4. Trang trí', 8),
(6, 'Pha Latte: 1. Pha espresso 2. Hâm nóng sữa 3. Đổ sữa từ từ 4. Tạo latte art', 10),
(7, 'Pha Americano: 1. Pha espresso đậm 2. Thêm nước nóng 3. Khuấy đều', 4),
(8, 'Pha Espresso: 1. Xay cà phê mịn 2. Nén bột 3. Pha qua máy espresso', 3),
(9, 'Pha trà đào: 1. Pha trà xanh 2. Thêm đào thái lát 3. Cho đá 4. Thêm đường', 7),
(10, 'Pha trà sữa: 1. Pha trà đậm 2. Thêm sữa đặc 3. Khuấy đều 4. Cho đá', 6),
(11, 'Làm sinh tố xoài: 1. Gọt xoài 2. Cho vào máy xay 3. Thêm sữa tươi 4. Xay nhuyễn', 12),
(12, 'Vắt nước cam: 1. Chọn cam tươi 2. Lăn cam 3. Vắt bằng máy 4. Lọc bỏ xác', 5),
(13, 'Nướng croissant: 1. Lấy bánh từ tủ lạnh 2. Nướng 180°C 3. Quét bơ 4. Nướng 15 phút', 20),
(14, 'Nướng muffin: 1. Hâm lò 170°C 2. Để bánh vào khay 3. Nướng 12 phút', 15),
(15, 'Làm sandwich: 1. Nướng bánh mì 2. Phết bơ 3. Xếp thịt và rau 4. Cắt đôi', 8);

-- Thêm dữ liệu mẫu cho online_order
INSERT IGNORE INTO online_order (customer_id, customer_name, customer_phone, order_time, delivery_address, order_note, total_amount, status, payment_status) VALUES
(3, 'Lê Thị F - Online', '0777666555', '2024-01-15 10:30:00', '123 Nguyễn Văn Cừ, Q.5', 'Giao trước 12h', 85000, 'completed', 'paid'),
(6, 'Vũ Đức I', '0444333222', '2024-01-15 14:15:00', '456 Lê Văn Việt, Q.9', 'Không đường', 42000, 'completed', 'paid'),
(9, 'Lý Tâm L', '0111000999', '2024-01-16 09:45:00', '789 Võ Văn Ngân, Thủ Đức', 'Ít đá', 55000, 'processing', 'paid'),
(13, 'Phan Đức P', '0777222333', '2024-01-16 16:20:00', '321 Phan Văn Trị, Gò Vấp', 'Giao tận nhà', 67000, 'pending', 'unpaid'),
(NULL, 'Khách hàng mới', '0123987654', '2024-01-17 11:00:00', '654 Điện Biên Phủ, Q.3', 'Gọi trước khi giao', 38000, 'completed', 'paid'),
(7, 'Đỗ Lan J', '0333222111', '2024-01-17 15:30:00', '987 Cách Mạng Tháng 8, Q.10', 'Để ở bảo vệ', 72000, 'completed', 'paid'),
(NULL, 'Nguyễn Khách', '0987123456', '2024-01-18 08:45:00', '147 Nguyễn Thị Minh Khai, Q.1', 'Tầng 5', 29000, 'processing', 'paid'),
(10, 'Trịnh Mai M', '0000999888', '2024-01-18 13:15:00', '258 Hoàng Văn Thụ, Tân Bình', 'Văn phòng', 95000, 'pending', 'unpaid'),
(NULL, 'Trần Khách', '0456789123', '2024-01-19 10:20:00', '369 Trường Chinh, Q.12', 'Giao nhanh', 46000, 'completed', 'paid'),
(14, 'Mai Linh Q', '0666333444', '2024-01-19 16:45:00', '741 Nguyễn Văn Linh, Q.7', 'Không cay', 58000, 'processing', 'paid'),
(NULL, 'Lê Khách', '0321654987', '2024-01-20 09:10:00', '852 Lạc Long Quân, Q.11', 'Tầng 2', 33000, 'completed', 'paid'),
(15, 'Kiều Anh R', '0555666777', '2024-01-20 14:30:00', '963 Âu Cơ, Tân Phú', 'Đóng gói kỹ', 81000, 'pending', 'unpaid'),
(NULL, 'Phạm Khách', '0654321098', '2024-01-21 11:40:00', '174 Võ Thị Sáu, Q.3', 'Giao buổi chiều', 52000, 'processing', 'paid'),
(8, 'Bùi Hạnh K', '0222111000', '2024-01-21 17:00:00', '285 Pasteur, Q.1', 'Văn phòng tầng 8', 74000, 'completed', 'paid'),
(NULL, 'Hoàng Khách', '0789456123', '2024-01-22 12:25:00', '396 Hai Bà Trưng, Q.1', 'Gọi khi đến', 41000, 'pending', 'unpaid');

-- Thêm dữ liệu mẫu cho feedback
INSERT IGNORE INTO feedback (customer_id, content, rating, submitted_at, response_date) VALUES
(1, 'Cà phê rất ngon, phục vụ tận tình. Sẽ quay lại!', 5, '2024-01-15 18:30:00', '2024-01-16 09:00:00'),
(2, 'Đồ uống chất lượng tốt, giá cả hợp lý.', 4, '2024-01-16 20:15:00', '2024-01-17 10:30:00'),
(3, 'Sinh tố dâu rất tươi ngon, giao hàng nhanh.', 5, '2024-01-17 14:20:00', NULL),
(4, 'Cappuccino đậm đà, không gian thoải mái.', 4, '2024-01-18 16:45:00', '2024-01-19 08:15:00'),
(5, 'Nhân viên nhiệt tình, đồ uống ngon.', 5, '2024-01-19 11:30:00', NULL),
(6, 'Trà sữa hơi ngọt, mong có thể điều chỉnh.', 3, '2024-01-20 15:10:00', '2024-01-21 09:45:00'),
(7, 'Bánh muffin tươi ngon, cà phê thơm.', 4, '2024-01-21 12:40:00', NULL),
(8, 'Phục vụ nhanh chóng, chất lượng ổn định.', 4, '2024-01-22 17:20:00', '2024-01-23 08:30:00'),
(9, 'Americano đúng gu, không gian yên tĩnh.', 5, '2024-01-23 10:15:00', NULL),
(10, 'Latte art đẹp, vị cà phê cân bằng.', 5, '2024-01-24 14:30:00', '2024-01-25 09:00:00'),
(11, 'Sandwich thịt nguội ngon, bánh mì giòn.', 4, '2024-01-25 13:45:00', NULL),
(12, 'Espresso đậm đà, phục vụ chuyên nghiệp.', 5, '2024-01-26 16:20:00', '2024-01-27 10:15:00'),
(13, 'Nước cam tươi ngon, giá hợp lý.', 4, '2024-01-27 11:10:00', NULL),
(14, 'Trà đào mát lành, phù hợp mùa hè.', 4, '2024-01-28 15:35:00', '2024-01-29 08:45:00'),
(15, 'Tổng thể rất hài lòng, sẽ giới thiệu bạn bè.', 5, '2024-01-29 18:50:00', NULL); 