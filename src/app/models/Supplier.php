<?php

require_once __DIR__ . '/BaseModel.php';

/**
 * Supplier model for managing supplier data, including creation, retrieval, updating, and deletion.
 * This model also handles the association of suppliers with products.
 */
class Supplier extends BaseModel {
    /**
     * Retrieves all suppliers along with the count of products associated with each supplier.
     * @return array The list of all suppliers with product counts.
     */
    public function getAllSuppliers() {
        $query = "SELECT s.*, 
                         COUNT(p.id)            AS product_count 
                  FROM supplier s
                  LEFT JOIN product p           ON s.id = p.supplier_id
                  GROUP BY s.id
                  ORDER BY s.name";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves a supplier by their ID.
     * @param int $id The ID of the supplier to retrieve.
     * @return object|false The supplier object if found, or false if not found.
     */
    public function getSupplierById($id) {
        $query = "SELECT * 
                  FROM supplier 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Creates a new supplier.
     * @param string $name The name of the supplier.
     * @param string $email The email of the supplier.
     * @param string $phone The phone number of the supplier.
     * @return bool True if the supplier was created successfully, false otherwise.
     */
    public function createSupplier($name, $email, $phone) {
        $query = "INSERT INTO supplier (name, email, phone)
                  VALUES (:name, :email, :phone)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':name', $name, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':phone', $phone, PDO::PARAM_STR);

        return $stmt->execute();
    }

    /**
     * Updates an existing supplier.
     * @param int $id The ID of the supplier to update.
     * @param string $name The new name of the supplier.
     * @param string $email The new email of the supplier.
     * @param string $phone The new phone number of the supplier.
     * @return bool True if the supplier was updated successfully, false otherwise.
     */
    public function updateSupplier($id, $name, $email, $phone) {
        $query = "UPDATE supplier
                  SET name = :name,
                      email = :email,
                      phone = :phone
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':name', $name, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':phone', $phone, PDO::PARAM_STR);

        return $stmt->execute();
    }

    /**
     * Deletes a supplier by their ID.
     * @param int $id The ID of the supplier to delete.
     * @return bool True if the supplier was deleted successfully, false otherwise.
     */
    public function deleteSupplier($id) {
        $query = "DELETE FROM supplier 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
