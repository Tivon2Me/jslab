-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS voltspot_db;

-- Switch to the database
USE voltspot_db;

-- Create the reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(50) NOT NULL,
    reservation_date DATE NOT NULL,
    arrival_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
