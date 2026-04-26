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

    public function createProduct($name, $description, $price, $supplierId) {
        $query = "INSERT INTO product (name, description, price, supplier_id)
                  VALUES (:name, :description, :price, :supplierId)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':price', $price);
        $stmt->bindValue(':supplierId', $supplierId, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function updateProduct($id, $name, $description, $price, $supplierId) {
        $query = "UPDATE product 
                  SET name = :name,
                      description = :description,
                      price = :price,
                      supplier_id = :supplierId
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':price', $price);
        $stmt->bindValue(':supplierId', $supplierId, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function deleteProduct($id) {
        $query = "DELETE FROM product WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
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
