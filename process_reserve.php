<?php
// Display errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = "localhost";
$user = "root";
$password = "";
$dbname = "voltspot_db"; // Make sure this matches phpMyAdmin

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = trim($_POST['fullname'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $phone    = trim($_POST['phone'] ?? '');
    $location = trim($_POST['location'] ?? '');
    $date     = trim($_POST['date'] ?? '');
    $time     = trim($_POST['time'] ?? '');

    $stmt = $conn->prepare("INSERT INTO reservations (fullname, email, phone, location, reservation_date, arrival_time) VALUES (?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssssss", $fullname, $email, $phone, $location, $date, $time);

    if ($stmt->execute()) {
        echo "<!DOCTYPE html><html><head><title>Reservation Success</title><link rel='stylesheet' href='styles.css'></head><body style='padding: 40px; font-family: sans-serif; background: #0a192f; color: #fff;'>";
        echo "<h2 style='color: #00d285;'>⚡ Reservation Successfully Submitted to Database!</h2>";
        echo "<p><strong>Driver:</strong> " . htmlspecialchars($fullname) . "</p>";
        echo "<p><strong>Location:</strong> " . htmlspecialchars($location) . "</p>";
        echo "<p><strong>Date & Time:</strong> " . htmlspecialchars($date) . " at " . htmlspecialchars($time) . "</p>";
        
        echo "<h3 style='margin-top: 30px;'>Recent Database Records:</h3>";
        $result = $conn->query("SELECT * FROM reservations ORDER BY created_at DESC LIMIT 5");
        
        echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%; border-color: #233554;'>";
        echo "<tr style='background: #112240;'><th>ID</th><th>Name</th><th>Location</th><th>Date</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr><td>{$row['id']}</td><td>" . htmlspecialchars($row['fullname']) . "</td><td>" . htmlspecialchars($row['location']) . "</td><td>{$row['reservation_date']}</td></tr>";
        }
        echo "</table>";
        
        echo "<br><br><a href='reserve.html' style='color: #00d285;'>&larr; Back to Reservation Form</a>";
        echo "</body></html>";
    } else {
        echo "Error recording reservation: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
