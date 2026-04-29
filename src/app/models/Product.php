<?php

class Product {
    private $conn;

    public function __construct(PDO $dbConnection) {
        $this->conn = $dbConnection;
    }

    public function create($id, $name, $description, $price, $supplier_id) {
        $query = "INSERT INTO product (id, name, description, prince, supplier_id)
            VALUES (:id, :name, :description, :price, :supplier_id);";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":id", $id);
        $stmt->bindValue(":name", $name);
        $stmt->bindValue(":description", $description);
        $stmt->bindValue(":price", $price);
        $stmt->bindValue(":supplier_id", $supplier_id);

        return $stmt->execute();
    }

    public function getAll() {
        $query = "SELECT * FROM product;";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getById($id) {
        $query = "SELECT product.*, c.name AS category_name,
          s.name AS supplier_name, s.email AS supplier_email,
          s.phone AS supplier_phone
          FROM product 
          INNER JOIN product_to_category ptc ON product.id = ptc.product_id 
          INNER JOIN product_category c ON ptc.category_id = c.id
          INNER JOIN supplier s ON product.supplier_id = s.id 
          WHERE product.id = :id
          GROUP BY product.id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute(['id' => $id]);
        
        return $stmt->fetch(PDO::FETCH_OBJ);
    }
}
