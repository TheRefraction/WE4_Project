<?php
class Account {
    private $conn;

    public function __construct(PDO $dbConnection) {
        $this->conn = $dbConnection;
    }

    public function create($firstName, $lastName, $email, $phone, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $query = "INSERT INTO account (first_name, last_name, email, phone, password) 
        VALUES (:firstName, :lastName, :email, :phone, :password)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':firstName', $firstName);
        $stmt->bindValue(':lastName', $lastName);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':phone', $phone);
        $stmt->bindValue(':password', $hashedPassword);

        return $stmt->execute();
    }

    public function findByEmail($email) {
        $query = "SELECT * FROM account WHERE email = :email";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':email', $email);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}