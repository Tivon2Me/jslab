<?php
require_once 'db.php';

// PHP Form Processing using POST (Requirement 5 & 6)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = trim($_POST['fullname']);
    $email    = trim($_POST['email']);
    $phone    = trim($_POST['phone']);
    $location = trim($_POST['location']);
    $date     = trim($_POST['date']);
    $time     = trim($_POST['time']);

    // Data Insertion (Requirement 6)
    $stmt = $conn->prepare("INSERT INTO reservations (fullname, email, phone, location, reservation_date, arrival_time) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $fullname, $email, $phone, $location, $date, $time);

    if ($stmt->execute()) {
        echo "<h2 style='color: #00d285;'>⚡ Reservation Successfully Submitted to Database!</h2>";
        echo "<p><strong>Driver:</strong> " . htmlspecialchars($fullname) . "</p>";
        echo "<p><strong>Location:</strong> " . htmlspecialchars($location) . "</p>";
        echo "<p><strong>Date & Time:</strong> " . htmlspecialchars($date) . " at " . htmlspecialchars($time) . "</p>";
        
        // Data Retrieval & Display (Requirement 6)
        echo "<h3>Recent Reservations in System:</h3>";
        $result = $conn->query("SELECT * FROM reservations ORDER BY created_at DESC LIMIT 5");
        
        echo "<table border='1' cellpadding='8' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>ID</th><th>Name</th><th>Location</th><th>Date</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr><td>{$row['id']}</td><td>" . htmlspecialchars($row['fullname']) . "</td><td>" . htmlspecialchars($row['location']) . "</td><td>{$row['reservation_date']}</td></tr>";
        }
        echo "</table>";
        
        echo "<br><a href='reserve.html'>Back to Reservation Form</a>";
    } else {
        echo "Error recording reservation: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}
?>
