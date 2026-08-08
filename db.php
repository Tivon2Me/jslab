<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "voltspot_db";

// MySQLi Connection (Requirement 6 - 8 Marks)
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}
?>
