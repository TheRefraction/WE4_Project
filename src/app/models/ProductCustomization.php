<?php

require_once __DIR__ . '/BaseModel.php';

/**
 * ProductCustomization model for managing product customization slots and options.
 * This model provides methods to create, retrieve, update, and delete customization slots and options for products. 
 * It also handles the relationships between products, categories, and customization options.
 */
class ProductCustomization extends BaseModel {
    /** Retrieves all customization slots along with the associated product and category names.
     * @return array An array of customization slot objects with product and category information.
     */
    public function getAllCustomizationSlots() {
        $query = "SELECT pcs.*, 
                         p.name                     AS product_name, 
                         pc.name                    AS category_name
                  FROM product_customization_slot pcs
                  LEFT JOIN product p               ON pcs.product_id = p.id
                  LEFT JOIN product_category pc     ON pcs.category_id = pc.id
                  ORDER BY p.name, pc.name, pcs.display_order";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves all customization slots for a given product, including the associated product and category names.
     * @param int $productId The ID of the product for which to retrieve customization slots.
     * @return array An array of customization slot objects with product and category information.
     */
    public function getCustomizationSlotsByProductId($productId) {
        $query = "SELECT pcs.*, 
                         p.name                     AS product_name, 
                         pc.name                    AS category_name
                  FROM product_customization_slot pcs
                  LEFT JOIN product p               ON pcs.product_id = p.id
                  LEFT JOIN product_category pc     ON pcs.category_id = pc.id
                  WHERE p.id = :product_id
                  ORDER BY pcs.display_order";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':product_id',     $productId,     PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves a customization slot by its ID, including the associated product and category names.
     * @param int $id The ID of the customization slot to retrieve.
     * @return object|false The customization slot object or false if not found.
     */
    public function getCustomizationSlotById($id) {
        $query = "SELECT pcs.*, 
                         p.id                       AS product_id, 
                         p.name                     AS product_name, 
                         pc.name                    AS category_name
                  FROM product_customization_slot pcs
                  LEFT JOIN product p               ON pcs.product_id = p.id
                  LEFT JOIN product_category pc     ON pcs.category_id = pc.id
                  WHERE pcs.id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',             $id,                PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves a customization slot for a specific product and category.
     * @param int $productId The ID of the product.
     * @param int $categoryId The ID of the category.
     * @return object|false The customization slot object or false if not found.
     */
    public function getCustomizationSlotByProductCategory($productId, $categoryId) {
        $query = "SELECT * 
                  FROM product_customization_slot
                  WHERE product_id = :product_id 
                    AND category_id = :category_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':product_id',     $productId,        PDO::PARAM_INT);
        $stmt->bindValue(':category_id',    $categoryId,       PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Creates a new customization slot.
     * @param int $productId The ID of the product.
     * @param int $categoryId The ID of the category.
     * @param int $minSelect The minimum number of options that can be selected.
     * @param int $maxSelect The maximum number of options that can be selected.
     * @param int $displayOrder The order in which the slot should be displayed.
     * @return bool True if the slot was created successfully, false otherwise.
     */
    public function createCustomizationSlot($productId, $categoryId, $minSelect, $maxSelect, $displayOrder) {
        $query = "INSERT INTO product_customization_slot (product_id, category_id, min_select, max_select, display_order)
                  VALUES (:product_id, :category_id, :min_select, :max_select, :display_order)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':product_id',     $productId,        PDO::PARAM_INT);
        $stmt->bindValue(':category_id',    $categoryId,       PDO::PARAM_INT);
        $stmt->bindValue(':min_select',     $minSelect,        PDO::PARAM_INT);
        $stmt->bindValue(':max_select',     $maxSelect,        PDO::PARAM_INT);
        $stmt->bindValue(':display_order',  $displayOrder,     PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Updates an existing customization slot.
     * @param int $id The ID of the customization slot to update.
     * @param int $minSelect The minimum number of options that can be selected.
     * @param int $maxSelect The maximum number of options that can be selected.
     * @param int $displayOrder The order in which the slot should be displayed.
     * @return bool True if the slot was updated successfully, false otherwise.
     */
    public function updateCustomizationSlot($id, $minSelect, $maxSelect, $displayOrder) {
        $query = "UPDATE product_customization_slot
                  SET min_select = :min_select, 
                      max_select = :max_select, 
                      display_order = :display_order
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',             $id,                PDO::PARAM_INT);
        $stmt->bindValue(':min_select',     $minSelect,         PDO::PARAM_INT);
        $stmt->bindValue(':max_select',     $maxSelect,         PDO::PARAM_INT);
        $stmt->bindValue(':display_order',  $displayOrder,      PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Deletes a customization slot.
     * @param int $id The ID of the customization slot to delete.
     * @return bool True if the slot was deleted successfully, false otherwise.
     */
    public function deleteCustomizationSlot($id) {
        $query = "DELETE FROM product_customization_slot
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id',     $id,    PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Creates a new customization option for a given slot.
     * @param int $slotId The ID of the customization slot.
     * @param int $optionProductId The ID of the product that serves as the option.
     * @param float $priceDelta The price difference for selecting this option.
     * @param bool $isDefault Whether this option is the default selection (1 for true, 0 for false).
     * @param int $displayOrder The order in which the option should be displayed within the slot.
     * @return bool True if the option was created successfully, false otherwise.
     */
    public function createCustomizationOption($slotId, $optionProductId, $priceDelta, $isDefault, $displayOrder) {
        $query = "INSERT INTO product_customization_slot_option (product_customization_slot_id, option_product_id, price_delta, is_default, display_order) 
                  VALUES (:slotId, :optionProductId, :priceDelta, :isDefault, :displayOrder)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':slotId',             $slotId,            PDO::PARAM_INT);
        $stmt->bindValue(':optionProductId',    $optionProductId,   PDO::PARAM_INT);
        $stmt->bindValue(':priceDelta',         $priceDelta,        PDO::PARAM_DECIMAL);
        $stmt->bindValue(':isDefault',          (bool) $isDefault,  PDO::PARAM_BOOL);
        $stmt->bindValue(':displayOrder',       $displayOrder,      PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Updates an existing customization option.
     * @param int $id The ID of the customization option to update.
     * @param int $optionProductId The ID of the product that serves as the option.
     * @param float $priceDelta The price difference for selecting this option.
     * @param bool $isDefault Whether this option is the default selection (1 for true, 0 for false).
     * @param int $displayOrder The order in which the option should be displayed within the slot.
     * @return bool True if the option was updated successfully, false otherwise.
     */
    public function updateCustomizationOption($id, $optionProductId, $priceDelta, $isDefault, $displayOrder) {
        $query = "UPDATE product_customization_slot_option 
                  SET option_product_id = :optionProductId, 
                      price_delta = :priceDelta, 
                      is_default = :isDefault, 
                      display_order = :displayOrder 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',                 $id,                PDO::PARAM_INT);
        $stmt->bindValue(':optionProductId',    $optionProductId,   PDO::PARAM_INT);
        $stmt->bindValue(':priceDelta',         $priceDelta,        PDO::PARAM_DECIMAL);
        $stmt->bindValue(':isDefault',          (bool) $isDefault,  PDO::PARAM_BOOL);
        $stmt->bindValue(':displayOrder',       $displayOrder,      PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Deletes a customization option.
     * @param int $id The ID of the customization option to delete.
     * @return bool True if the option was deleted successfully, false otherwise.
     */
    public function deleteCustomizationOption($id) {
        $query = "DELETE FROM product_customization_slot_option 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',             $id,                PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Retrieves a customization option by its ID.
     * @param int $id The ID of the customization option to retrieve.
     * @return object|false The customization option object, or false if not found.
     */
    public function getCustomizationOptionById($id) {
        $query = "SELECT o.*, p.name            AS option_product_name
                  FROM product_customization_slot_option o
                  LEFT JOIN product p           ON o.option_product_id = p.id
                  WHERE o.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id',             $id,                PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves all customization options for a given slot.
     * @param int $slotId The ID of the slot for which to retrieve options.
     * @return array An array of customization option objects.
     */
    public function getCustomizationOptionsBySlot($slotId) {
        $query = "SELECT o.*, 
                         p.name             AS option_product_name
                  FROM product_customization_slot_option o
                  LEFT JOIN product p       ON o.option_product_id = p.id
                  WHERE o.product_customization_slot_id = :slotId
                  ORDER BY o.display_order";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':slotId',         $slotId,            PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves a customization option for a specific product and slot.
     * @param int $productId The ID of the product.
     * @param int $slotId The ID of the customization slot.
     * @return object|false The customization option object, or false if not found.
     */
    public function getCustomizationOptionByProductSlot($productId, $slotId) {
        $query = "SELECT * 
                  FROM product_customization_slot_option
                  WHERE option_product_id = :product_id 
                    AND product_customization_slot_id = :slot_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':product_id',     $productId,        PDO::PARAM_INT);
        $stmt->bindValue(':slot_id',        $slotId,           PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }
}
