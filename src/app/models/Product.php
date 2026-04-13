<?php

class Product
{

    private $conn;

    public function __construct(PDO $dbConnection) {
        $this->conn = $dbConnection;
    }

    public function create($id, $name, $description, $price, $supplier_id) {
        $query = "INSERT INTO product (id, name, description, prince, supplier_id)
            VALUES (:id, :name, :description, :price, :supplier_id)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":id", $id);
        $stmt->bindValue(":name", $name);
        $stmt->bindValue(":description", $description);
        $stmt->bindValue(":price", $price);
        $stmt->bindValue(":supplier_id", $supplier_id);

        return $stmt->execute();
    }

    public function getAll() {
        $query = "SELECT * FROM product";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
}
