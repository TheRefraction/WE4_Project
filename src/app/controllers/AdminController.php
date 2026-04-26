<?php

require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../models/Account.php';

class AdminController {
    private $adminModel;
    private $accountModel;

    public function __construct(PDO $dbConnection) {
        $this->adminModel = new Admin($dbConnection);
        $this->accountModel = new Account($dbConnection);
    }

    // Check if user is admin
    private function checkAdminAccess() {
        if (!isset($_SESSION['user_id'])) {
            header('Location: /sign-in');
            exit;
        }

        $user = $this->accountModel->findByEmail($_SESSION['user_email']);
        $role = $this->accountModel->getRole($user['id']);

        if ($role !== 'admin') {
            http_response_code(403);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }
    }

    public function getAdminAccess() {
        header('Content-Type: application/json');

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Access denied.']);
            exit;
        }

        $role = $this->accountModel->getRole($_SESSION['user_id']);
        if ($role !== 'admin') {
            http_response_code(401);
            echo json_encode(['error' => 'Access denied.']);
            exit;
        }

        echo json_encode(['success' => 'Access granted.']);
        exit;
    }

    // ========== DASHBOARD ==========
    public function viewAdmin() {
        $this->checkAdminAccess();
        
        $title = 'Admin Dashboard';
        $stats = $this->adminModel->getDashboardStats();
        
        require_once __DIR__ . '/../views/admin/dashboard.php';
    }

    // ========== ACCOUNTS ==========
    public function viewAccounts() {
        $this->checkAdminAccess();
        
        $title = 'Manage Accounts';
        $accounts = $this->adminModel->getAllAccounts();
        
        require_once __DIR__ . '/../views/admin/accounts.php';
    }

    public function viewEditAccount($id) {
        $this->checkAdminAccess();
        
        $title = 'Edit Account';
        $account = $this->adminModel->getAccountById($id);
        $roles = $this->adminModel->getAllRoles();
        
        if (!$account) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }
        
        require_once __DIR__ . '/../views/admin/edit-account.php';
    }

    public function updateAccountAdmin() {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/accounts');
            exit;
        }

        $id = intval($_POST['id'] ?? 0);
        $firstName = trim($_POST['first_name'] ?? '');
        $lastName = trim($_POST['last_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = !empty($_POST['phone']) ? trim($_POST['phone']) : null;
        $roleId = intval($_POST['role_id'] ?? 1);

        if (empty($id) || empty($firstName) || empty($lastName) || empty($email)) {
            $_SESSION['errors'] = ['All required fields must be filled.'];
            header('Location: /admin/accounts/edit/' . $id);
            exit;
        }

        if ($this->adminModel->updateAccount($id, $firstName, $lastName, $email, $phone, $roleId)) {
            $_SESSION['success'] = 'Account updated successfully!';
            header('Location: /admin/accounts');
            exit;
        }

        $_SESSION['errors'] = ['Error updating account!'];
        header('Location: /admin/accounts/edit/' . $id);
        exit;
    }

    public function deleteAccount($id) {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/accounts');
            exit;
        }

        $id = intval($id);
        
        if ($this->adminModel->deleteAccount($id)) {
            $_SESSION['success'] = 'Account deleted successfully!';
        } else {
            $_SESSION['errors'] = ['Error deleting account!'];
        }
        
        header('Location: /admin/accounts');
        exit;
    }

    // ========== PRODUCTS ==========
    public function viewProducts() {
        $this->checkAdminAccess();
        
        $title = 'Manage Products';
        $products = $this->adminModel->getAllProducts();
        
        require_once __DIR__ . '/../views/admin/products.php';
    }

    public function viewCreateProduct() {
        $this->checkAdminAccess();
        
        $title = 'Create Product';
        $suppliers = $this->adminModel->getAllSuppliers();
        
        require_once __DIR__ . '/../views/admin/create-product.php';
    }

    public function viewEditProduct($id) {
        $this->checkAdminAccess();
        
        $title = 'Edit Product';
        $product = $this->adminModel->getProductById($id);
        $suppliers = $this->adminModel->getAllSuppliers();
        
        if (!$product) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }
        
        require_once __DIR__ . '/../views/admin/edit-product.php';
    }

    public function createProduct() {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products/create');
            exit;
        }

        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $supplierId = !empty($_POST['supplier_id']) ? intval($_POST['supplier_id']) : null;

        if (empty($name) || $price <= 0) {
            $_SESSION['errors'] = ['Product name and valid price are required.'];
            header('Location: /admin/products/create');
            exit;
        }

        if ($this->adminModel->createProduct($name, $description, $price, $supplierId)) {
            $_SESSION['success'] = 'Product created successfully!';
            header('Location: /admin/products');
            exit;
        }

        $_SESSION['errors'] = ['Error creating product!'];
        header('Location: /admin/products/create');
        exit;
    }

    public function updateProduct() {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products');
            exit;
        }

        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $supplierId = !empty($_POST['supplier_id']) ? intval($_POST['supplier_id']) : null;

        if (empty($id) || empty($name) || $price <= 0) {
            $_SESSION['errors'] = ['Product name and valid price are required.'];
            header('Location: /admin/products/edit/' . $id);
            exit;
        }

        if ($this->adminModel->updateProduct($id, $name, $description, $price, $supplierId)) {
            $_SESSION['success'] = 'Product updated successfully!';
            header('Location: /admin/products');
            exit;
        }

        $_SESSION['errors'] = ['Error updating product!'];
        header('Location: /admin/products/edit/' . $id);
        exit;
    }

    public function deleteProduct($id) {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products');
            exit;
        }

        $id = intval($id);
        
        if ($this->adminModel->deleteProduct($id)) {
            $_SESSION['success'] = 'Product deleted successfully!';
        } else {
            $_SESSION['errors'] = ['Error deleting product!'];
        }
        
        header('Location: /admin/products');
        exit;
    }

    // ========== SUPPLIERS ==========
    public function viewSuppliers() {
        $this->checkAdminAccess();
        
        $title = 'Manage Suppliers';
        $suppliers = $this->adminModel->getAllSuppliers();
        
        require_once __DIR__ . '/../views/admin/suppliers.php';
    }

    public function viewCreateSupplier() {
        $this->checkAdminAccess();
        
        $title = 'Create Supplier';
        
        require_once __DIR__ . '/../views/admin/create-supplier.php';
    }

    public function viewEditSupplier($id) {
        $this->checkAdminAccess();
        
        $title = 'Edit Supplier';
        $supplier = $this->adminModel->getSupplierById($id);
        
        if (!$supplier) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }
        
        require_once __DIR__ . '/../views/admin/edit-supplier.php';
    }

    public function createSupplier() {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/suppliers/create');
            exit;
        }

        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = !empty($_POST['phone']) ? trim($_POST['phone']) : null;

        if (empty($name)) {
            $_SESSION['errors'] = ['Supplier name is required.'];
            header('Location: /admin/suppliers/create');
            exit;
        }

        if ($this->adminModel->createSupplier($name, $email, $phone)) {
            $_SESSION['success'] = 'Supplier created successfully!';
            header('Location: /admin/suppliers');
            exit;
        }

        $_SESSION['errors'] = ['Error creating supplier!'];
        header('Location: /admin/suppliers/create');
        exit;
    }

    public function updateSupplier() {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/suppliers');
            exit;
        }

        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = !empty($_POST['phone']) ? trim($_POST['phone']) : null;

        if (empty($id) || empty($name)) {
            $_SESSION['errors'] = ['Supplier name is required.'];
            header('Location: /admin/suppliers/edit/' . $id);
            exit;
        }

        if ($this->adminModel->updateSupplier($id, $name, $email, $phone)) {
            $_SESSION['success'] = 'Supplier updated successfully!';
            header('Location: /admin/suppliers');
            exit;
        }

        $_SESSION['errors'] = ['Error updating supplier!'];
        header('Location: /admin/suppliers/edit/' . $id);
        exit;
    }

    public function deleteSupplier($id) {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/suppliers');
            exit;
        }

        $id = intval($id);
        
        if ($this->adminModel->deleteSupplier($id)) {
            $_SESSION['success'] = 'Supplier deleted successfully!';
        } else {
            $_SESSION['errors'] = ['Error deleting supplier!'];
        }
        
        header('Location: /admin/suppliers');
        exit;
    }

    // ========== INVOICES ==========
    public function viewInvoices() {
        $this->checkAdminAccess();
        
        $title = 'Manage Invoices';
        $invoices = $this->adminModel->getAllInvoices();
        
        require_once __DIR__ . '/../views/admin/invoices.php';
    }

    public function viewInvoiceDetails($id) {
        $this->checkAdminAccess();
        
        $title = 'Invoice Details';
        $invoice = $this->adminModel->getInvoiceById($id);
        $invoiceLines = $this->adminModel->getInvoiceLines($id);
        
        if (!$invoice) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }
        
        require_once __DIR__ . '/../views/admin/invoice-details.php';
    }

    public function updateInvoiceStatus() {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/invoices');
            exit;
        }

        $id = intval($_POST['id'] ?? 0);
        $statusId = intval($_POST['status_id'] ?? 0);

        if (empty($id) || empty($statusId)) {
            $_SESSION['errors'] = ['Invalid invoice or status.'];
            header('Location: /admin/invoices');
            exit;
        }

        if ($this->adminModel->updateInvoiceStatus($id, $statusId)) {
            $_SESSION['success'] = 'Invoice status updated successfully!';
            header('Location: /admin/invoices/details/' . $id);
            exit;
        }

        $_SESSION['errors'] = ['Error updating invoice status!'];
        header('Location: /admin/invoices/details/' . $id);
        exit;
    }

    // ========== CATEGORIES ==========
    public function viewCategories() {
        $this->checkAdminAccess();
        
        $title = 'Manage Categories';
        $categories = $this->adminModel->getAllCategories();
        
        require_once __DIR__ . '/../views/admin/categories.php';
    }

    public function createCategory() {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/categories');
            exit;
        }

        $name = trim($_POST['name'] ?? '');

        if (empty($name)) {
            $_SESSION['errors'] = ['Category name is required.'];
            header('Location: /admin/categories');
            exit;
        }

        if ($this->adminModel->createCategory($name)) {
            $_SESSION['success'] = 'Category created successfully!';
        } else {
            $_SESSION['errors'] = ['Error creating category!'];
        }

        header('Location: /admin/categories');
        exit;
    }

    public function updateCategory() {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/categories');
            exit;
        }

        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');

        if (empty($id) || empty($name)) {
            $_SESSION['errors'] = ['Category ID and name are required.'];
            header('Location: /admin/categories');
            exit;
        }

        if ($this->adminModel->updateCategory($id, $name)) {
            $_SESSION['success'] = 'Category updated successfully!';
        } else {
            $_SESSION['errors'] = ['Error updating category!'];
        }

        header('Location: /admin/categories');
        exit;
    }

    public function deleteCategory($id) {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/categories');
            exit;
        }

        $id = intval($id);
        
        if ($this->adminModel->deleteCategory($id)) {
            $_SESSION['success'] = 'Category deleted successfully!';
        } else {
            $_SESSION['errors'] = ['Error deleting category!'];
        }
        
        header('Location: /admin/categories');
        exit;
    }
}