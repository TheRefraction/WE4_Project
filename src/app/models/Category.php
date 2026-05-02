<?php

require_once __DIR__ . '/BaseModel.php';

/**
 * Category model for managing product categories, including creation, retrieval, updating, and deletion.
 * This model also handles the association of categories with products.
 */
class Category extends BaseModel {
    /**
     * Retrieves all product categories with their associated product counts.
     * @return array An array of category objects with a 'product_count' property.
     */
    public function getAllCategories() {
        $query = "SELECT pc.*, COUNT(ptc.product_id) AS product_count 
                  FROM product_category pc
                  LEFT JOIN product_to_category ptc ON pc.id = ptc.category_id
                  GROUP BY pc.id
                  ORDER BY pc.name";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves a category by its ID.
     * @param int $id The ID of the category to retrieve.
     * @return object|false The category object if found, or false if not found.
     */
    public function getCategoryById($id) {
        $query = "SELECT * FROM product_category 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves the IDs of categories associated with a specific product.
     * @param int $productId The ID of the product.
     * @return array An array of category IDs.
     */
    public function getProductCategoryIds($productId) {
        $query = "SELECT category_id
                  FROM product_to_category
                  WHERE product_id = :productId";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':productId', $productId, PDO::PARAM_INT);
        $stmt->execute();

        // Return an array of category IDs associated with the product
        return array_map(
            fn($row) => (int) $row->category_id,
            $stmt->fetchAll(PDO::FETCH_OBJ)
        );
    }

    /**
     * Creates a new product category.
     * @param string $name The name of the category to create.
     * @return bool True if the category was created successfully, false otherwise.
     */
    public function createCategory($name) {
        $query = "INSERT INTO product_category (name) 
                  VALUES (:name)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':name', $name, PDO::PARAM_STR);

        return $stmt->execute();
    }

    /**
     * Updates an existing product category.
     * @param int $id The ID of the category to update.
     * @param string $name The new name of the category.
     * @return bool True if the category was updated successfully, false otherwise.
     */
    public function updateCategory($id, $name) {
        $query = "UPDATE product_category 
                  SET name = :name 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':name', $name, PDO::PARAM_STR);

        return $stmt->execute();
    }
    
    /**
     * Deletes a product category.
     * @param int $id The ID of the category to delete.
     * @return bool True if the category was deleted successfully, false otherwise.
     */
    public function deleteCategory($id) {
        $query = "DELETE FROM product_category 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Checks if a category with the given name already exists.
     * @param string $name The name of the category to check.
     * @return bool True if the category exists, false otherwise.
     */
    public function categoryExists(string $name): bool {
        $query = "SELECT COUNT(*) 
                  FROM product_category 
                  WHERE name = :name";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':name', $name, PDO::PARAM_STR);
        $stmt->execute();

        return (int) $stmt->fetchColumn() > 0;
    }

    /**
     * Checks if a category has any dependencies (e.g., associated products or customization slots).
     * This is used to prevent deletion of categories that are still in use.
     * @param int $categoryId The ID of the category to check for dependencies.
     * @return bool True if the category has dependencies, false otherwise.
     */
    public function categoryHasDependencies(int $categoryId): bool {
        $query = "SELECT
                    (SELECT COUNT(*) FROM product_customization_slot WHERE category_id = :id) +
                    (SELECT COUNT(*) FROM product_to_category WHERE category_id = :id)
                  AS cnt";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindValue(':id', $categoryId, PDO::PARAM_INT);
        $stmt->execute();

        return (int) $stmt->fetchColumn() > 0;
    }
}
