<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "coffee_management";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
mysqli_set_charset($conn, "utf8");
?>