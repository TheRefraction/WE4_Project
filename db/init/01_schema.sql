CREATE DATABASE IF NOT EXISTS test_db;
USE test_db;

CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          price DECIMAL(10,2) NOT NULL
);