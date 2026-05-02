<?php

require_once __DIR__ . '/BaseModel.php';

/**
 * Product model that handles all database interactions related to products.
 * This includes CRUD operations and any product-specific queries.
 */
class Product extends BaseModel {
    
    /**
     * Creates a new product in the database.
     * @param int $id The unique identifier for the product.
     * @param string $name The name of the product.
     * @param string|null $description A description of the product.
     * @param float $price The price of the product.
     * @param int $supplier_id The ID of the supplier providing the product.
     * @return bool Returns true on successful creation, false otherwise.
     */
    public function createProduct($id, $name, $description, $price, $supplier_id) {
        $query = "INSERT INTO product (id, name, description, price, supplier_id)
                  VALUES (:id, :name, :description, :price, :supplier_id);";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(":id",             $id,            PDO::PARAM_INT);
        $stmt->bindValue(":name",           $name,          PDO::PARAM_STR);
        $stmt->bindValue(":description",    $description,   PDO::PARAM_STR);
        $stmt->bindValue(":price",          $price);
        $stmt->bindValue(":supplier_id",    $supplier_id,   PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Retrieves all products from the database.
     *
     * @return array An array of product objects.
     */
    public function getAllProducts() {
        $query = "SELECT * 
                  FROM product;";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves all products along with their associated supplier and categories.
     * This is used for the admin product listing page to show comprehensive product details.
     *
     * @return array An array of product objects, each containing supplier name and a comma-separated list of categories.
     */
    public function getAllProductsWithSupplierAndCategories() {
        $query = "SELECT p.*, s.name                            AS supplier_name,
                         GROUP_CONCAT(pc.name SEPARATOR ', ')   AS categories
                  FROM product p
                  LEFT JOIN supplier s                          ON p.supplier_id = s.id
                  LEFT JOIN product_to_category ptc             ON p.id = ptc.product_id
                  LEFT JOIN product_category pc                 ON ptc.category_id = pc.id
                  GROUP BY p.id
                  ORDER BY p.name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves a product by its ID.
     *
     * @param int $id The ID of the product to retrieve.
     * @return object|false The product object if found, or false if not found.
     */
    public function getProductById($id) {
        $query = "SELECT p.*, 
                         s.name             AS supplier_name, 
                         s.email            AS supplier_email,
                         s.phone            AS supplier_phone
                  FROM product p
                  LEFT JOIN supplier s      ON p.supplier_id = s.id
                  WHERE p.id = :id";;

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Reusable product details used by admin edit forms.
     */
    public function getProductByIdWithSupplier($id) {
        $query = "SELECT p.*, s.name                            AS supplier_name 
                  FROM product p
                  LEFT JOIN supplier s                          ON p.supplier_id = s.id
                  WHERE p.id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Creates a new product with associated categories.
     *
     * @param string $name The name of the product.
     * @param string $description The description of the product.
     * @param float $price The price of the product.
     * @param int $supplierId The ID of the supplier.
     * @param bool $hidden Whether the product is hidden.
     * @param array $categoryIds An array of category IDs to associate with the product.
     * @return bool True if the product was created successfully, false otherwise.
     */
    public function createProductWithCategories($name, $description, $price, $supplierId, $hidden, array $categoryIds) {
        // Start a transaction to ensure data integrity
        $this->conn->beginTransaction();

        // Insert the product first
        try {
            $query = "INSERT INTO product (name, description, price, supplier_id, hidden)
                      VALUES (:name, :description, :price, :supplierId, :hidden)";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':name',           $name,              PDO::PARAM_STR);
            $stmt->bindValue(':description',    $description,       PDO::PARAM_STR);
            $stmt->bindValue(':price',          $price);
            $stmt->bindValue(':supplierId',     $supplierId,        PDO::PARAM_INT);
            $stmt->bindValue(':hidden',         (bool) $hidden,     PDO::PARAM_BOOL);
            $stmt->execute();

            // Get the ID of the newly created product
            $productId = (int) $this->conn->lastInsertId();

            // Link product to categories if any are provided
            if (!empty($categoryIds)) {
                $linkQuery = "INSERT INTO product_to_category (product_id, category_id)
                              VALUES (:productId, :categoryId)";

                $linkStmt = $this->conn->prepare($linkQuery);

                // Loop through each category ID and create the link
                foreach ($categoryIds as $categoryId) {
                    $linkStmt->bindValue(':productId',          $productId,             PDO::PARAM_INT);
                    $linkStmt->bindValue(':categoryId',         (int) $categoryId,      PDO::PARAM_INT);
                    $linkStmt->execute();
                }
            }

            // Commit the transaction if everything was successful
            $this->conn->commit();
            return true;
        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log('Product creation failed: ' . $e->getMessage()); 
            return false;
        }
    }

    /**
     * Updates a product with associated categories.
     *
     * @param int $id The ID of the product to update.
     * @param string $name The updated name of the product.
     * @param string $description The updated description of the product.
     * @param float $price The updated price of the product.
     * @param int $supplierId The updated ID of the supplier.
     * @param bool $hidden Whether the product is hidden.
     * @param array $categoryIds An array of category IDs to associate with the product.
     * @return bool True if the product was updated successfully, false otherwise.
     */
    public function updateProductWithCategories($id, $name, $description, $price, $supplierId, $hidden, array $categoryIds) {
        // Start a transaction to ensure data integrity
        $this->conn->beginTransaction();

        // Update the product details
        try {
            $query = "UPDATE product
                      SET name = :name,
                          description = :description,
                          price = :price,
                          supplier_id = :supplierId,
                          hidden = :hidden
                      WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':id',             $id,                PDO::PARAM_INT);
            $stmt->bindValue(':name',           $name,              PDO::PARAM_STR);
            $stmt->bindValue(':description',    $description,       PDO::PARAM_STR);
            $stmt->bindValue(':price',          $price);
            $stmt->bindValue(':supplierId',     $supplierId,        PDO::PARAM_INT);
            $stmt->bindValue(':hidden',         (bool) $hidden,     PDO::PARAM_BOOL);
            $stmt->execute();

            // Remove existing category links for the product
            $deleteQuery = "DELETE FROM product_to_category 
                            WHERE product_id = :productId";

            $deleteStmt = $this->conn->prepare($deleteQuery);

            $deleteStmt->bindValue(':productId',    $id,    PDO::PARAM_INT);
            $deleteStmt->execute();

            // Link product to categories if any are provided
            if (!empty($categoryIds)) {
                $linkQuery = "INSERT INTO product_to_category (product_id, category_id)
                              VALUES (:productId, :categoryId)";

                $linkStmt = $this->conn->prepare($linkQuery);

                // Loop through each category ID and create the link
                foreach ($categoryIds as $categoryId) {
                    $linkStmt->bindValue(':productId',      $id,                    PDO::PARAM_INT);
                    $linkStmt->bindValue(':categoryId',     (int) $categoryId,      PDO::PARAM_INT);
                    $linkStmt->execute();
                }
            }

            // Commit the transaction if everything was successful
            $this->conn->commit();
            return true;
        } catch (Throwable $e) {
            // Rollback the transaction if any error occurred
            $this->conn->rollBack();
            error_log('Product update failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Deletes a product by its ID.
     *
     * @param int $id The ID of the product to delete.
     * @return bool True if the product was deleted successfully, false otherwise.
     */
    public function deleteProduct($id) {
        $query = "DELETE FROM product 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
