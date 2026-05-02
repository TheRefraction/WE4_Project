<?php

require_once __DIR__ . '/BaseModel.php';

/** 
 * Menu class for handling menu-related database operations.
 * This class provides methods to manage menus, menu slots, and the products associated with those slots.
 */
class Menu extends BaseModel {
    /** 
     * Retrieve all menus from the database.
     * @return array An array of menu objects.
     */
    public function getAllMenus() {
        $query = "SELECT * 
                  FROM menu 
                  ORDER BY name";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /** 
     * Retrieve a menu by its ID.
     * @param int $id The menu ID.
     * @return object|false The menu object or false if not found.
     */
    public function getMenuById($id) {
        $query = "SELECT * 
                  FROM menu 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',         $id,        PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /** 
     * Create a new menu.
     * @param string $name The menu name.
     * @param string $description The menu description.
     * @return bool True if the menu was created successfully, false otherwise.
     */
    public function createMenu($name, $description) {
        $query = "INSERT INTO menu (name, description) 
                  VALUES (:name, :description)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':name',           $name,          PDO::PARAM_STR);
        $stmt->bindValue(':description',    $description,   PDO::PARAM_STR);

        return $stmt->execute();
    }

    /** 
     * Update an existing menu.
     * @param int $id The menu ID.
     * @param string $name The updated menu name.
     * @param string $description The updated menu description.
     * @return bool True if the menu was updated successfully, false otherwise.
     */
    public function updateMenu($id, $name, $description) {
        $query = "UPDATE menu 
                  SET name = :name, 
                      description = :description 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',             $id,            PDO::PARAM_INT);
        $stmt->bindValue(':name',           $name,          PDO::PARAM_STR);
        $stmt->bindValue(':description',    $description,   PDO::PARAM_STR);

        return $stmt->execute();
    }

    /** 
     * Delete a menu by its ID.
     * @param int $id The menu ID.
     * @return bool True if the menu was deleted successfully, false otherwise.
     */
    public function deleteMenu($id) {
        $query = "DELETE FROM menu 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',             $id,            PDO::PARAM_INT);

        return $stmt->execute();
    }

    /** 
     * Check if a menu has any dependencies (i.e., if it has any associated menu slots).
     * @param int $menuId The menu ID.
     * @return bool True if the menu has dependencies, false otherwise.
     */
    public function menuHasDependencies($menuId) {
        $query = "SELECT COUNT(*) 
                  FROM menu_slot 
                  WHERE menu_id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',         $menuId,        PDO::PARAM_INT);
        $stmt->execute();

        return (int) $stmt->fetchColumn() > 0;
    }

    /** 
     * Retrieve a menu slot by its ID.
     * @param int $id The menu slot ID.
     * @return object|false The menu slot object or false if not found.
     */
    public function getMenuSlotById($id) {
        $query = "SELECT * 
        FROM menu_slot
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',         $id,            PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /** 
     * Retrieve a menu slot by its name and associated menu ID.
     * @param int $menuId The menu ID.
     * @param string $name The menu slot name.
     * @return object|false The menu slot object or false if not found.
     */
    public function getMenuSlotByName($menuId, $name) {
        $query = "SELECT * 
                  FROM menu_slot
                  WHERE menu_id = :menuId 
                    AND name = :name";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':menuId',     $menuId,    PDO::PARAM_INT);
        $stmt->bindValue(':name',       $name,      PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /** 
     * Retrieve all menu slots for a given menu ID.
     * @param int $menuId The menu ID.
     * @return array An array of menu slot objects.
     */
    public function getMenuSlotsWithMenuId($menuId) {
        $query = "SELECT * 
                  FROM menu_slot
                  WHERE menu_id = :menuId
                  ORDER BY display_order";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':menuId', $menuId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /** 
     * Create a new menu slot.
     * @param int $menu_id The menu ID.
     * @param string $name The menu slot name.
     * @param int $min_select The minimum number of selections allowed.
     * @param int $max_select The maximum number of selections allowed.
     * @param int $display_order The display order of the menu slot.
     * @return bool True if the menu slot was created, false otherwise.
     */
    public function createMenuSlot($menu_id, $name, $min_select, $max_select, $display_order) {
        $query = "INSERT INTO menu_slot (menu_id, name, min_select, max_select, display_order)
                  VALUES (:menuId, :name, :minSelect, :maxSelect, :displayOrder)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':menuId',         $menu_id,           PDO::PARAM_INT);
        $stmt->bindValue(':name',           $name,              PDO::PARAM_STR);
        $stmt->bindValue(':minSelect',      $min_select,        PDO::PARAM_INT);
        $stmt->bindValue(':maxSelect',      $max_select,        PDO::PARAM_INT);
        $stmt->bindValue(':displayOrder',   $display_order,     PDO::PARAM_INT);

        return $stmt->execute();
    }

    /** 
     * Update an existing menu slot.
     * @param int $id The menu slot ID.
     * @param string $name The menu slot name.
     * @param int $min_select The minimum number of selections allowed.
     * @param int $max_select The maximum number of selections allowed.
     * @param int $display_order The display order of the menu slot.
     * @return bool True if the menu slot was updated, false otherwise.
     */
    public function updateMenuSlot($id, $name, $min_select, $max_select, $display_order) {
        $query = "UPDATE menu_slot
                  SET name = :name, 
                      min_select = :minSelect, 
                      max_select = :maxSelect, 
                      display_order = :displayOrder
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',             $id,                PDO::PARAM_INT);
        $stmt->bindValue(':name',           $name,              PDO::PARAM_STR);
        $stmt->bindValue(':minSelect',      $min_select,        PDO::PARAM_INT);
        $stmt->bindValue(':maxSelect',      $max_select,        PDO::PARAM_INT);
        $stmt->bindValue(':displayOrder',   $display_order,     PDO::PARAM_INT);

        return $stmt->execute();
    }

    /** 
     * Delete a menu slot.
     * @param int $id The menu slot ID.
     * @return bool True if the menu slot was deleted, false otherwise.
     */
    public function deleteMenuSlot($id) {
        $query = "DELETE FROM menu_slot 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /** 
     * Get products associated with a menu slot.
     * @param int $slotId The menu slot ID.
     * @return array The products associated with the menu slot.
     */
    public function getMenuSlotProducts($slotId) {
        $query = "SELECT msp.*, 
                         p.name                     AS product_name, 
                         p.price
                  FROM menu_slot_product msp
                  JOIN product p                    ON msp.product_id = p.id
                  WHERE msp.menu_slot_id = :slotId
                  ORDER BY msp.display_order, p.name";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':slotId',         $slotId,        PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /** 
     * Get menu slots with associated products.
     * @param int $menuId The menu ID.
     * @return array The menu slots with products.
     */
    public function getMenuSlotsWithProducts($menuId) {
        $query = "SELECT ms.*, 
                         msp.product_id, 
                         msp.price_delta, 
                         msp.is_default, 
                         p.name                     AS product_name
                  FROM menu_slot ms
                  LEFT JOIN menu_slot_product msp   ON ms.id = msp.menu_slot_id
                  LEFT JOIN product p               ON msp.product_id = p.id
                  WHERE ms.menu_id = :menuId
                  ORDER BY ms.display_order, p.name";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':menuId',         $menuId,        PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /** 
     * Add a product to a menu slot.
     * @param int $slotId The menu slot ID.
     * @param int $productId The product ID.
     * @param float $priceDelta The price delta.
     * @param bool $isDefault Whether the product is default.
     * @param int $displayOrder The display order.
     * @return bool True if the product was added, false otherwise.
     */
    public function addProductToMenuSlot($slotId, $productId, $priceDelta, $isDefault, $displayOrder) {
        $query = "INSERT INTO menu_slot_product (menu_slot_id, product_id, price_delta, is_default, display_order)
                  VALUES (:slotId, :productId, :priceDelta, :isDefault, :displayOrder)
                  ON DUPLICATE KEY UPDATE
                    price_delta = :priceDelta,
                    is_default = :isDefault,
                    display_order = :displayOrder";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':slotId',         $slotId,                PDO::PARAM_INT);
        $stmt->bindValue(':productId',      $productId,             PDO::PARAM_INT);
        $stmt->bindValue(':priceDelta',     $priceDelta,            PDO::PARAM_DECIMAL);
        $stmt->bindValue(':isDefault',      (bool) $isDefault,      PDO::PARAM_BOOL);
        $stmt->bindValue(':displayOrder',   $displayOrder,          PDO::PARAM_INT);

        return $stmt->execute();
    }

    /** 
     * Remove a product from a menu slot.
     * @param int $slotId The menu slot ID.
     * @param int $productId The product ID.
     * @return bool True if the product was removed, false otherwise.
     */
    public function removeProductFromMenuSlot($slotId, $productId) {
        $query = "DELETE FROM menu_slot_product
                  WHERE menu_slot_id = :slotId 
                    AND product_id = :productId";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':slotId',         $slotId,        PDO::PARAM_INT);
        $stmt->bindValue(':productId',      $productId,     PDO::PARAM_INT);

        return $stmt->execute();
    }
}