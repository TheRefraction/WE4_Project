<?php
class Admin {
    private $conn;

    public function __construct(PDO $dbConnection) {
        $this->conn = $dbConnection;
    }

    // ========== ACCOUNTS ==========
    public function getAllAccounts() {
        $query = "SELECT a.*, r.name as role_name FROM account a
                  LEFT JOIN role r ON a.role_id = r.id
                  ORDER BY a.date_creation DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAccountById($id) {
        $query = "SELECT a.*, r.name as role_name FROM account a
                  LEFT JOIN role r ON a.role_id = r.id
                  WHERE a.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateAccount($id, $firstName, $lastName, $email, $phone, $roleId) {
        $query = "UPDATE account 
                  SET first_name = :firstName,
                      last_name = :lastName,
                      email = :email,
                      phone = :phone,
                      role_id = :roleId
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':firstName', $firstName);
        $stmt->bindValue(':lastName', $lastName);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':phone', $phone);
        $stmt->bindValue(':roleId', $roleId, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function deleteAccount($id) {
        $query = "DELETE FROM account WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // ========== PRODUCTS ==========
    public function getAllProducts() {
        $query = "SELECT p.*, s.name as supplier_name,
                         GROUP_CONCAT(pc.name SEPARATOR ', ') as categories
                  FROM product p
                  LEFT JOIN supplier s ON p.supplier_id = s.id
                  LEFT JOIN product_to_category ptc ON p.id = ptc.product_id
                  LEFT JOIN product_category pc ON ptc.category_id = pc.id
                  GROUP BY p.id
                  ORDER BY p.name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getProductById($id) {
        $query = "SELECT p.*, s.name as supplier_name FROM product p
                  LEFT JOIN supplier s ON p.supplier_id = s.id
                  WHERE p.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createProduct($name, $description, $price, $supplierId, $hidden, array $categoryIds) {
        $this->conn->beginTransaction();

        try {
            $query = "INSERT INTO product (name, description, price, supplier_id, hidden)
                    VALUES (:name, :description, :price, :supplierId, :hidden)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':name', $name);
            $stmt->bindValue(':description', $description);
            $stmt->bindValue(':price', $price);
            $stmt->bindValue(':supplierId', $supplierId, PDO::PARAM_INT);
            $stmt->bindValue(':hidden', (bool) $hidden, PDO::PARAM_BOOL);
            $stmt->execute();

            $productId = (int) $this->conn->lastInsertId();

            // Link product to categories (Many-to-Many)
            if (!empty($categoryIds)) {
                $linkQuery = "INSERT INTO product_to_category (product_id, category_id)
                            VALUES (:productId, :categoryId)";
                $linkStmt = $this->conn->prepare($linkQuery);

                foreach ($categoryIds as $categoryId) {
                    $linkStmt->bindValue(':productId', $productId, PDO::PARAM_INT);
                    $linkStmt->bindValue(':categoryId', (int) $categoryId, PDO::PARAM_INT);
                    $linkStmt->execute();
                }
            }

            $this->conn->commit();
            return true;
        } catch (Throwable $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function updateProduct($id, $name, $description, $price, $supplierId, $hidden, array $categoryIds) {
        $this->conn->beginTransaction();

        try {
            $query = "UPDATE product
                    SET name = :name,
                        description = :description,
                        price = :price,
                        supplier_id = :supplierId,
                        hidden = :hidden
                    WHERE id = :id";
            
            // Update product details
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->bindValue(':name', $name);
            $stmt->bindValue(':description', $description);
            $stmt->bindValue(':price', $price);
            $stmt->bindValue(':supplierId', $supplierId, PDO::PARAM_INT);
            $stmt->bindValue(':hidden', (bool) $hidden, PDO::PARAM_BOOL);
            $stmt->execute();

            // Destroy existing category links
            $deleteQuery = "DELETE FROM product_to_category WHERE product_id = :productId";
            $deleteStmt = $this->conn->prepare($deleteQuery);
            $deleteStmt->bindValue(':productId', $id, PDO::PARAM_INT);
            $deleteStmt->execute();

            // Link product to categories (Many-to-Many)
            if (!empty($categoryIds)) {
                $linkQuery = "INSERT INTO product_to_category (product_id, category_id)
                            VALUES (:productId, :categoryId)";
                $linkStmt = $this->conn->prepare($linkQuery);

                foreach ($categoryIds as $categoryId) {
                    $linkStmt->bindValue(':productId', $id, PDO::PARAM_INT);
                    $linkStmt->bindValue(':categoryId', (int) $categoryId, PDO::PARAM_INT);
                    $linkStmt->execute();
                }
            }

            $this->conn->commit();
            return true;
        } catch (Throwable $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function deleteProduct($id) {
        $query = "DELETE FROM product WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // ========== PRODUCT CUSTOMIZATIONS ==========
    public function getCustomizationSlots($id) {
        $query = "SELECT pcs.*, p.name as product_name, pc.name as category_name
                  FROM product_customization_slot pcs
                  LEFT JOIN product p ON pcs.product_id = p.id
                  LEFT JOIN product_category pc ON pcs.category_id = pc.id
                  WHERE p.id = :id
                  ORDER BY pcs.display_order";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCustomizationSlotById($id) {
        $query = "SELECT pcs.*, p.id as product_id, p.name as product_name, pc.name as category_name
                  FROM product_customization_slot pcs
                  LEFT JOIN product p ON pcs.product_id = p.id
                  LEFT JOIN product_category pc ON pcs.category_id = pc.id
                  WHERE pcs.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Checks if a customization slot already exists for a product-category pair.
     * @param int $productId
     * @param int $categoryId
     * @return array|null
     */
    public function getCustomizationSlotByProductCategory($productId, $categoryId) {
        $query = "SELECT * FROM product_customization_slot 
                WHERE product_id = :product_id AND category_id = :category_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':product_id', $productId, PDO::PARAM_INT);
        $stmt->bindValue(':category_id', $categoryId, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Creates a new customization slot.
     * @param int $productId
     * @param int $categoryId
     * @param int $minSelect
     * @param int $maxSelect
     * @param int $displayOrder
     * @return bool
     */
    public function createCustomizationSlot($productId, $categoryId, $minSelect = 0, $maxSelect = 1, $displayOrder = 0) {
        $query = "INSERT INTO product_customization_slot (product_id, category_id, min_select, max_select, display_order) 
        VALUES (:product_id, :category_id, :min_select, :max_select, :display_order)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':product_id', $productId, PDO::PARAM_INT);
        $stmt->bindValue(':category_id', $categoryId, PDO::PARAM_INT);
        $stmt->bindValue(':min_select', $minSelect, PDO::PARAM_INT);
        $stmt->bindValue(':max_select', $maxSelect, PDO::PARAM_INT);
        $stmt->bindValue(':display_order', $displayOrder, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Updates an existing customization slot.
     * @param int $id
     * @param int $minSelect
     * @param int $maxSelect
     * @param int $displayOrder
     * @return bool
     */
    public function updateCustomizationSlot($id, $minSelect, $maxSelect, $displayOrder) {
        $query = "UPDATE product_customization_slot 
                SET min_select = :min_select, max_select = :max_select, display_order = :display_order 
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':min_select', $minSelect, PDO::PARAM_INT);
        $stmt->bindValue(':max_select', $maxSelect, PDO::PARAM_INT);
        $stmt->bindValue(':display_order', $displayOrder, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Deletes a customization slot.
     * @param int $id
     * @return bool
     */
    public function deleteCustomizationSlot($id) {
        $query = "DELETE FROM product_customization_slot 
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function createCustomizationOption($slotId, $optionProductId, $priceDelta = 0.00, $isDefault = 0, $displayOrder = 0) {
        $query = "INSERT INTO product_customization_slot_option (product_customization_slot_id, option_product_id, price_delta, is_default, display_order) VALUES (:slotId, :optionProductId, :priceDelta, :isDefault, :displayOrder)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':slotId', $slotId, PDO::PARAM_INT);
        $stmt->bindValue(':optionProductId', $optionProductId, PDO::PARAM_INT);
        $stmt->bindValue(':priceDelta', $priceDelta);
        $stmt->bindValue(':isDefault', $isDefault, PDO::PARAM_INT);
        $stmt->bindValue(':displayOrder', $displayOrder, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function updateCustomizationOption($id, $optionProductId, $priceDelta = 0.00, $isDefault = 0, $displayOrder = 0) {
        $query = "UPDATE product_customization_slot_option SET option_product_id = :optionProductId, price_delta = :priceDelta, is_default = :isDefault, display_order = :displayOrder WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':optionProductId', $optionProductId, PDO::PARAM_INT);
        $stmt->bindValue(':priceDelta', $priceDelta);
        $stmt->bindValue(':isDefault', $isDefault, PDO::PARAM_INT);
        $stmt->bindValue(':displayOrder', $displayOrder, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function deleteCustomizationOption($id) {
        $query = "DELETE FROM product_customization_slot_option WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function getCustomizationOptionById($id) {
        $query = "SELECT o.*, p.name as option_product_name
                  FROM product_customization_slot_option o
                  LEFT JOIN product p ON o.option_product_id = p.id
                  WHERE o.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getCustomizationOptionsBySlot($slotId) {
        $query = "SELECT o.*, p.name as option_product_name
                  FROM product_customization_slot_option o
                  LEFT JOIN product p ON o.option_product_id = p.id
                  WHERE o.product_customization_slot_id = :slotId
                  ORDER BY o.display_order";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':slotId', $slotId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCustomizationOptionByProductSlot($productId, $slotId) {
        $query = "SELECT * FROM product_customization_slot_option 
                WHERE option_product_id = :product_id AND product_customization_slot_id = :slot_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':product_id', $productId, PDO::PARAM_INT);
        $stmt->bindValue(':slot_id', $slotId, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ========== SUPPLIERS ==========
    public function getAllSuppliers() {
        $query = "SELECT s.*, COUNT(p.id) as product_count FROM supplier s
                  LEFT JOIN product p ON s.id = p.supplier_id
                  GROUP BY s.id
                  ORDER BY s.name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getSupplierById($id) {
        $query = "SELECT * FROM supplier WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createSupplier($name, $email, $phone) {
        $query = "INSERT INTO supplier (name, email, phone)
                  VALUES (:name, :email, :phone)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':phone', $phone);

        return $stmt->execute();
    }

    public function updateSupplier($id, $name, $email, $phone) {
        $query = "UPDATE supplier 
                  SET name = :name,
                      email = :email,
                      phone = :phone
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':phone', $phone);

        return $stmt->execute();
    }

    public function deleteSupplier($id) {
        $query = "DELETE FROM supplier WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // ========== INVOICES ==========
    public function getAllInvoices() {
        $query = "SELECT i.*, a.first_name, a.last_name, ist.name as status_name
                  FROM invoice i
                  LEFT JOIN account a ON i.account_id = a.id
                  LEFT JOIN invoice_status ist ON i.status_id = ist.id
                  ORDER BY i.date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getInvoiceById($id) {
        $query = "SELECT i.*, a.first_name, a.last_name, a.email,
                         ist.name as status_name, pm.name as payment_mode_name,
                         ps.name as payment_status_name
                  FROM invoice i
                  LEFT JOIN account a ON i.account_id = a.id
                  LEFT JOIN invoice_status ist ON i.status_id = ist.id
                  LEFT JOIN payment p ON i.payment_id = p.id
                  LEFT JOIN payment_mode pm ON p.mode_id = pm.id
                  LEFT JOIN payment_status ps ON p.status_id = ps.id
                  WHERE i.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateInvoiceStatus($id, $statusId) {
        $query = "UPDATE invoice SET status_id = :statusId WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':statusId', $statusId, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function getInvoiceLines($invoiceId) {
        $query = "SELECT il.*, p.name as product_name FROM invoice_line il
                  LEFT JOIN product p ON il.product_id = p.id
                  WHERE il.invoice_id = :invoiceId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':invoiceId', $invoiceId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ========== CATEGORIES ==========
    public function getAllCategories() {
        $query = "SELECT pc.*, COUNT(ptc.product_id) as product_count FROM product_category pc
                  LEFT JOIN product_to_category ptc ON pc.id = ptc.category_id
                  GROUP BY pc.id
                  ORDER BY pc.name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getProductCategoryIds($productId) {
        $query = "SELECT category_id
                FROM product_to_category
                WHERE product_id = :productId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':productId', $productId, PDO::PARAM_INT);
        $stmt->execute();

        return array_map(
            fn($row) => (int) $row['category_id'],
            $stmt->fetchAll(PDO::FETCH_ASSOC)
        );
    }

    public function createCategory($name) {
        $query = "INSERT INTO product_category (name) VALUES (:name)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':name', $name);

        return $stmt->execute();
    }

    public function updateCategory($id, $name) {
        $query = "UPDATE product_category SET name = :name WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':name', $name);

        return $stmt->execute();
    }

    public function deleteCategory($id) {
        $query = "DELETE FROM product_category WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function categoryExists(string $name): bool {
        $query = "SELECT COUNT(*) FROM product_category WHERE name = :name";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':name', $name);
        $stmt->execute();

        return (int)$stmt->fetchColumn() > 0;
    }

    public function categoryHasDependencies(int $categoryId): bool {
        $query = "
        SELECT
            (SELECT COUNT(*) FROM product_customization_slot WHERE category_id = :id) +
            (SELECT COUNT(*) FROM product_to_category WHERE category_id = :id)
        AS cnt";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $categoryId, PDO::PARAM_INT);
        $stmt->execute();

        return (int)$stmt->fetchColumn() > 0;
    }

    // ========== MENUS ==========
    public function getAllMenus() {
        $query = "SELECT * FROM menu ORDER BY name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getMenuById($id) {
        $query = "SELECT * FROM menu WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createMenu($name, $description = null) {
        $query = "INSERT INTO menu (name, description) VALUES (:name, :description)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':description', $description);

        return $stmt->execute();
    }

    public function updateMenu($id, $name, $description = null) {
        $query = "UPDATE menu SET name = :name, description = :description WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':description', $description);

        return $stmt->execute();
    }

    public function deleteMenu($id) {
        $query = "DELETE FROM menu WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // ========== STOCK ==========
    public function getAllStock() {
        $query = "SELECT s.*, p.name as product_name
                  FROM stock s
                  LEFT JOIN product p ON s.product_id = p.id
                  ORDER BY p.name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStock($id, $quantityAvailable, $quantityReserved, $reorderThreshold) {
        $query = "UPDATE stock SET quantity_available = :qa, quantity_reserved = :qr, reorder_threshold = :rt WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':qa', $quantityAvailable, PDO::PARAM_INT);
        $stmt->bindValue(':qr', $quantityReserved, PDO::PARAM_INT);
        $stmt->bindValue(':rt', $reorderThreshold, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // ========== DASHBOARD STATS ==========
    public function getDashboardStats() {
        $stats = [];

        // Total accounts
        $query = "SELECT COUNT(*) as count FROM account";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_accounts'] = $stmt->fetchColumn();

        // Total products
        $query = "SELECT COUNT(*) as count FROM product";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_products'] = $stmt->fetchColumn();

        // Total invoices
        $query = "SELECT COUNT(*) as count FROM invoice";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_invoices'] = $stmt->fetchColumn();

        // Total revenue
        $query = "SELECT COALESCE(SUM(total), 0) as total FROM invoice";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_revenue'] = $stmt->fetchColumn();

        // Total suppliers
        $query = "SELECT COUNT(*) as count FROM supplier";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_suppliers'] = $stmt->fetchColumn();

        // Low stock products
        $query = "SELECT COUNT(*) as count FROM stock 
                  WHERE quantity_available <= reorder_threshold";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['low_stock_count'] = $stmt->fetchColumn();

        return $stats;
    }

    // ========== ROLES ==========
    public function getAllRoles() {
        $query = "SELECT * FROM role ORDER BY name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
