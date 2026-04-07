<?php
require_once __DIR__ . '/../../config/database.php';

class TestModel {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getStatus() {
        if ($this->conn) {
            echo "Database connection: Success";
        } else {
            echo "Error with connection";
        }
    }
}