<?php
require_once 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = trim($_POST['fullname'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $phone    = trim($_POST['phone'] ?? '');
    $location = trim($_POST['location'] ?? '');
    $date     = trim($_POST['date'] ?? '');
    $time     = trim($_POST['time'] ?? '');

    if (empty($fullname) || empty($email) || empty($phone) || empty($location) || empty($date) || empty($time)) {
        die("Error: All fields are required.");
    }

    $stmt = $conn->prepare("INSERT INTO reservations (fullname, email, phone, location, reservation_date, arrival_time) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $fullname, $email, $phone, $location, $date, $time);

    if ($stmt->execute()) {
        echo "<!DOCTYPE html>
        <html>
        <head>
            <title>Reservation Confirmed</title>
            <link rel='stylesheet' href='styles.css'>
        </head>
        <body style='padding: 40px; font-family: sans-serif; background: #0a192f; color: #fff;'>
            <h2 style='color: #00d285;'>⚡ Reservation Successfully Recorded in MySQL!</h2>
            <p><strong>Driver:</strong> " . htmlspecialchars($fullname) . "</p>
            <p><strong>Location:</strong> " . htmlspecialchars($location) . "</p>
            <p><strong>Date & Time:</strong> " . htmlspecialchars($date) . " at " . htmlspecialchars($time) . "</p>
            
            <h3 style='margin-top: 30px;'>Recent Database Records:</h3>";

        $result = $conn->query("SELECT * FROM reservations ORDER BY created_at DESC LIMIT 5");
        
        echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%; border-color: #233554;'>
                <tr style='background: #112240; color: #00d285;'>
                    <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Date</th>
                </tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>
                    <td>{$row['id']}</td>
                    <td>" . htmlspecialchars($row['fullname']) . "</td>
                    <td>" . htmlspecialchars($row['email']) . "</td>
                    <td>" . htmlspecialchars($row['phone']) . "</td>
                    <td>" . htmlspecialchars($row['location']) . "</td>
                    <td>{$row['reservation_date']}</td>
                  </tr>";
        }
        echo "</table>
            <br><br>
            <a href='reserve.html' class='btn' style='display:inline-block; padding:10px 15px; background:#00d285; color:#0a192f; text-decoration:none; border-radius:5px; font-weight:bold;'>&larr; Make Another Reservation</a>
        </body>
        </html>";
    } else {
        echo "Error saving reservation: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}
?>
