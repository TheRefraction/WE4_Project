<?php

abstract class BaseModel {
    protected PDO $conn;

    public function __construct(PDO $dbConnection) {
        $this->conn = $dbConnection;
    }
}
