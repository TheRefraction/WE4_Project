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

    /**
     * Checks if the current user is logged in and has admin privileges.
     * If not logged in, redirects to sign-in page.
     * If logged in but not an admin, shows 403 error page.
     */
    private function checkAdminAccess() {
        if (!isset($_SESSION['user_id'])) {
            header('Location: /sign-in');
            exit;
        }

        $user = $this->accountModel->getAccountByEmail($_SESSION['user_email']);
        $role = $this->accountModel->getAccountRole($user['id']);

        if ($role !== 'admin') {
            http_response_code(403);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }
    }

    /**
     * API endpoint to check admin access (used for frontend access control)
     * URL: /admin/access
     */
    public function getAdminAccess() {
        header('Content-Type: application/json');

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Access denied.']);
            exit;
        }

        $role = $this->accountModel->getAccountRole($_SESSION['user_id']);
        if ($role !== 'admin') {
            http_response_code(401);
            echo json_encode(['error' => 'Access denied.']);
            exit;
        }

        echo json_encode(['success' => 'Access granted.']);
        exit;
    }

    /**
     * Groups the denormalized menu-slot rows returned by the model into
     * a render-friendly structure with nested product lists.
     *
     * @param array<int, array<string, mixed>> $rawSlots
     * @return array<int, array<string, mixed>>
     */
    private function groupMenuSlotsWithProducts(array $rawSlots) {
        $slots = [];

        foreach ($rawSlots as $row) {
            $slotId = $row['id'];

            if (!isset($slots[$slotId])) {
                $slots[$slotId] = [
                    'id' => $row['id'],
                    'menu_id' => $row['menu_id'],
                    'name' => $row['name'],
                    'min_select' => $row['min_select'],
                    'max_select' => $row['max_select'],
                    'display_order' => $row['display_order'],
                    'products' => []
                ];
            }

            if (!empty($row['product_name'])) {
                $slots[$slotId]['products'][] = [
                    'product_id' => $row['product_id'] ?? null,
                    'product_name' => $row['product_name'],
                    'price_delta' => $row['price_delta'] ?? 0,
                    'is_default' => $row['is_default'] ?? 0
                ];
            }
        }

        return array_values($slots);
    }

    // ========== DASHBOARD ==========

    /**
     * Displays the admin dashboard with key stats and quick links.
     * URL: /admin
     */
    public function viewAdmin() {
        $this->checkAdminAccess();
        
        $title = 'Admin Dashboard';
        $stats = $this->adminModel->getDashboardStats();
        
        require_once __DIR__ . '/../views/admin/dashboard.php';
    }

    // ========== ACCOUNTS ==========

    /**
     * Displays the account management page with a list of all user accounts.
     * URL: /admin/accounts
     */
    public function viewAccounts() {
        $this->checkAdminAccess();
        
        $title = 'Manage Accounts';
        $accounts = $this->adminModel->getAllAccounts();
        
        require_once __DIR__ . '/../views/admin/accounts.php';
    }

    /**
     * Displays the edit account page with a form to update account details.
     * URL: /admin/accounts/edit/:id
     */
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

    /**
     * Updates an existing account's details.
     * URL: /admin/accounts/update
     */
    public function updateAccountAdmin() {
        $this->checkAdminAccess();
        
        // Only allow POST requests for updates
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/accounts');
            exit;
        }

        // Sanitize and validate input
        $id = intval($_POST['id'] ?? 0);
        $firstName = trim($_POST['first_name'] ?? '');
        $lastName = trim($_POST['last_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = !empty($_POST['phone']) ? trim($_POST['phone']) : null;
        $roleId = intval($_POST['role_id'] ?? 1);

        // Validate required fields
        if (empty($id) || empty($firstName) || empty($lastName) || empty($email)) {
            $_SESSION['errors'] = ['All required fields must be filled.'];
            header('Location: /admin/accounts/edit/' . $id);
            exit;
        }

        // Prevent admin from changing their own role or details from the admin panel
        if ($id === $_SESSION['user_id']) {
            $_SESSION['errors'] = ['You cannot update your own account from the admin panel. Please use the account settings page.'];
            header('Location: /admin/accounts/edit/' . $id);
            exit;
        }

        // Updates account details and role
        if ($this->adminModel->updateAccount($id, $firstName, $lastName, $email, $phone, $roleId)) {
            $_SESSION['success'] = 'Account updated successfully!';
            header('Location: /admin/accounts');
            exit;
        }

        // If update fails, set error message and redirect back to edit page
        $_SESSION['errors'] = ['Error updating account!'];
        header('Location: /admin/accounts/edit/' . $id);
        exit;
    }

    /**
     * Deletes an account by ID.
     * URL: /admin/accounts/delete/:id
     */
    public function deleteAccount($id) {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Only allow POST requests for deletions
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/accounts');
            exit;
        }

        $id = intval($id);

        // Prevent admin from deleting their own account from the admin panel
        if ($id === $_SESSION['user_id']) {
            $_SESSION['errors'] = ['You cannot delete your own account from the admin panel. Please use the account settings page to deactivate your account if needed.'];
            header('Location: /admin/accounts');
            exit;
        }
        
        // Deletes the account and redirects back to accounts list with success or error message
        if ($this->adminModel->deleteAccount($id)) {
            $_SESSION['success'] = 'Account deleted successfully!';
        } else {
            $_SESSION['errors'] = ['Error deleting account!'];
        }
        
        header('Location: /admin/accounts');
        exit;
    }

    // ========== PRODUCTS ==========

    /**
     * Displays the product management page with a list of all products.
     * URL: /admin/products
     */
    public function viewProducts() {
        // Check admin access first
        $this->checkAdminAccess();
        
        $title = 'Manage Products';
        $products = $this->adminModel->getAllProducts();
        
        require_once __DIR__ . '/../views/admin/products.php';
    }

    /**
     * Displays the create product page with a form to add a new product.
     * URL: /admin/products/create
     */
    public function viewCreateProduct() {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Get suppliers and categories for dropdowns
        $title = 'Create Product';
        $suppliers = $this->adminModel->getAllSuppliers();
        $categories = $this->adminModel->getAllCategories();
        
        require_once __DIR__ . '/../views/admin/create-product.php';
    }

    /**
     * Displays the edit product page with a form to update product details.
     * URL: /admin/products/edit/:id
     */
    public function viewEditProduct($id) {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Get product details, suppliers, categories, and selected category IDs for the product
        $title = 'Edit Product';
        $product = $this->adminModel->getProductById($id);
        $suppliers = $this->adminModel->getAllSuppliers();
        $categories = $this->adminModel->getAllCategories();
        $selectedCategoryIds = $this->adminModel->getProductCategoryIds($id);
        
        // If product not found, show 404 page
        if (!$product) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }
        
        require_once __DIR__ . '/../views/admin/edit-product.php';
    }

    /**
     * Creates a new product with the provided details.
     * URL: /admin/products/create
     */
    public function createProduct() {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Only allow POST requests for creation
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products/create');
            exit;
        }

        // Sanitize and validate input
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $supplierId = !empty($_POST['supplier_id']) ? intval($_POST['supplier_id']) : null;
        $hidden = intval($_POST['hidden'] ?? 0);
        $category_ids = isset($_POST['category_ids']) ? array_map('intval', $_POST['category_ids']) : [];

        // Validate required fields
        if (empty($name) || $price <= 0) {
            $_SESSION['errors'] = ['Product name and valid price are required.'];
            header('Location: /admin/products/create');
            exit;
        }

        // Creates the product and redirects back to products list with success or error message
        if ($this->adminModel->createProduct($name, $description, $price, $supplierId, $hidden, $category_ids)) {
            $_SESSION['success'] = 'Product created successfully!';
            header('Location: /admin/products');
            exit;
        }

        // If creation fails, set error message and redirect back to create page
        $_SESSION['errors'] = ['Error creating product!'];
        header('Location: /admin/products/create');
        exit;
    }

    /**
     * Updates an existing product's details.
     * URL: /admin/products/update
     */
    public function updateProduct() {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Only allow POST requests for updates
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products');
            exit;
        }

        // Sanitize and validate input
        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $supplierId = !empty($_POST['supplier_id']) ? intval($_POST['supplier_id']) : null;
        $hidden = intval($_POST['hidden'] ?? 0);
        $category_ids = isset($_POST['category_ids']) ? array_map('intval', $_POST['category_ids']) : [];

        // Validate required fields
        if (empty($id) || empty($name) || $price <= 0) {
            $_SESSION['errors'] = ['Product name and valid price are required.'];
            header('Location: /admin/products/edit/' . $id);
            exit;
        }

        // Updates the product and redirects back to products list with success or error message
        if ($this->adminModel->updateProduct($id, $name, $description, $price, $supplierId, $hidden, $category_ids)) {
            $_SESSION['success'] = 'Product updated successfully!';
            header('Location: /admin/products');
            exit;
        }

        // If update fails, set error message and redirect back to edit page
        $_SESSION['errors'] = ['Error updating product!'];
        header('Location: /admin/products/edit/' . $id);
        exit;
    }

    /**
     * Deletes a product.
     * URL: /admin/products/delete/:id
     */
    public function deleteProduct($id) {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Only allow POST requests for deletions
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products');
            exit;
        }

        $id = intval($id);
        
        // Deletes the product and redirects back to products list with success or error message
        if ($this->adminModel->deleteProduct($id)) {
            $_SESSION['success'] = 'Product deleted successfully!';
        } else {
            $_SESSION['errors'] = ['Error deleting product!'];
        }
        
        // Redirect back to products list after deletion attempt
        header('Location: /admin/products');
        exit;
    }

    // ========== PRODUCT CUSTOMIZATIONS ==========
    
    /**
     * Displays the product customization management page with a list of all customization slots.
     * URL: /admin/products/edit/:id/customize
     */
    public function viewEditProductCustomization($id) {
        // Check admin access first
        $this->checkAdminAccess();
        
        $title = 'Customize Product';
        $slots = $this->adminModel->getCustomizationSlots($id);
        $categories = $this->adminModel->getAllCategories();
        $product = $this->adminModel->getProductById($id);

        $options = [];
        foreach ($slots as $slot) {
            $s_id = $slot['id'];
            $options[$s_id] = $this->adminModel->getCustomizationOptionsBySlot($s_id);
        }
        
        require_once __DIR__ . '/../views/admin/edit-product-customize.php';
    }

    /**
     * Displays the page for editing a specific customization slot.
     * URL: /admin/products/edit/:id/slot/:slot_id
     */
    public function viewEditCustomizationSlot($id, $slot_id) {
        // Check admin access first
        $this->checkAdminAccess();

        $title = 'Edit Customization Slot';
        $slots = $this->adminModel->getCustomizationSlots($id);

        // find slot by id
        $slot = null;
        foreach ($slots as $s) { 
            if ($s['id'] == $slot_id) { 
                $slot = $s; 
                break; 
            }
        }

        if (!$slot) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }

        $options = $this->adminModel->getCustomizationOptionsBySlot($slot_id);
        $products = $this->adminModel->getAllProducts();

        require_once __DIR__ . '/../views/admin/edit-customization-slot.php';
    }

    public function viewEditCustomizationOption($id, $option_id) {
        // Check admin access first
        $this->checkAdminAccess();

        $title = 'Edit Customization Option';
        $option = $this->adminModel->getCustomizationOptionById($option_id);

        if (!$option) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }

        $slot = $this->adminModel->getCustomizationSlotById($option['product_customization_slot_id']);
        $products = $this->adminModel->getAllProducts();

        require_once __DIR__ . '/../views/admin/edit-customization-option.php';
    }

    /**
     * Creates a new customization slot.
     * URL: /admin/products/:product_id/slot/create
     */
    public function createCustomizationSlot($product_id) {
        // Check admin access first
        $this->checkAdminAccess();

        // Only allow POST requests for creation
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        // Sanitize and validate input.
        $product_id = intval($product_id ?? 0);
        $category_id = intval($_POST['category_id'] ?? 0);
        $min_select = intval($_POST['min_select'] ?? 0);
        $max_select = intval($_POST['max_select'] ?? 1);
        $display_order = intval($_POST['display_order'] ?? 0);

        $errors = [];

        // Validate required fields
        if (empty($product_id) || empty($category_id)) {
            $errors[] = 'Product and category required';
        }

        if ($min_select < 0 || $max_select < 0 || $max_select < $min_select) {
            $errors[] = 'Invalid min/max select values';
        }

        if ($display_order < 0) {
            $errors[] = 'Display order must be non-negative';
        }

        // Check if slot already exists
        if (empty($errors)) {
            $existingSlot = $this->adminModel->getCustomizationSlotByProductCategory($product_id, $category_id);
            if ($existingSlot) {
                $errors[] = 'A customization slot for this product and category already exists. Please edit it instead.';
            }
        }

        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        // Creates the customization slot and redirects back to customizations list with success or error message
        if ($this->adminModel->createCustomizationSlot($product_id, $category_id, $min_select, $max_select, $display_order)) {
            $_SESSION['success'] = 'Customization slot created';
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        $_SESSION['errors'] = ['Error creating slot'];
        header('Location: /admin/products/edit/' . $product_id . '/customize');
        exit;
    }

    /**
     * Updates a customization slot.
     * URL: /admin/products/:product_id/slot/update
     */
    public function updateCustomizationSlot($product_id) {
        // Check admin access first
        $this->checkAdminAccess();

        // Only allow POST requests for updates
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        // Sanitize and validate input
        $id = intval($_POST['id'] ?? 0);
        $min_select = intval($_POST['min_select'] ?? 0);
        $max_select = intval($_POST['max_select'] ?? 1);
        $display_order = intval($_POST['display_order'] ?? 0);

        // Validate input
        $errors = [];
        if (empty($id)) {
            $_SESSION['errors'] = ['Invalid slot'];
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        // Validate min/max select values
        if ($min_select < 0 || $max_select < 0 || $max_select < $min_select) {
            $errors[] = 'Invalid min/max select values';
        }

        if ($display_order < 0) {
            $errors[] = 'Display order must be non-negative';
        }

        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        if ($this->adminModel->updateCustomizationSlot($id, $min_select, $max_select, $display_order)) {
            $_SESSION['success'] = 'Slot updated';
        } else {
            $_SESSION['errors'] = ['Error updating slot'];
        }

        header('Location: /admin/products/edit/' . $product_id . '/customize');
        exit;
    }

    /**
     * Deletes a customization slot.
     * URL: /admin/products/:product_id/slot/delete/:id
     */
    public function deleteCustomizationSlot($product_id, $id) {
        // Check admin access first
        $this->checkAdminAccess();

        // Only allow POST requests for deletions
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        // Sanitize input
        $product_id = intval($product_id ?? 0);
        $id = intval($id ?? 0);

        if (empty($product_id) || empty($id)) {
            $_SESSION['errors'] = ['Invalid product or slot ID'];
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        // Deletes the customization slot and redirects back to customizations list with success or error message
        if ($this->adminModel->deleteCustomizationSlot($id)) {
            $_SESSION['success'] = 'Slot deleted';
        } else {
            $_SESSION['errors'] = ['Error deleting slot'];
        }

        header('Location: /admin/products/edit/' . $product_id . '/customize');
        exit;
    }

    /**
     * Creates a new customization option.
     * URL: /admin/products/:product_id/option/create
     */
    public function createCustomizationOption($product_id) {
        // Check admin access first
        $this->checkAdminAccess();

        // Only allow POST requests for creation
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        // Sanitize and validate input
        $slotId = intval($_POST['slot_id'] ?? 0);
        $optionProductId = intval($_POST['option_product_id'] ?? 0);
        $priceDelta = floatval($_POST['price_delta'] ?? 0.0);
        $isDefault = intval($_POST['is_default'] ?? 0);
        $displayOrder = intval($_POST['display_order'] ?? 0);

        $errors = [];

        // Validate input
        if (empty($slotId) || empty($optionProductId)) {
            $_SESSION['errors'] = ['Invalid option data'];
            header('Location: /admin/products/edit/' . $product_id . '/slot/' . $slotId);
            exit;
        }

        // Validate display order
        if ($displayOrder < 0) {
            $errors[] = 'Display order must be non-negative';
            exit;
        }

        // Check if slot already exists
        if (empty($errors)) {
            $existingSlot = $this->adminModel->getCustomizationOptionByProductSlot($optionProductId, $slotId);
            if ($existingSlot) {
                $errors[] = 'This product is already used as an option.';
            }
        }

        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            header('Location: /admin/products/edit/' . $product_id . '/slot/' . $slotId);
            exit;
        }

        // Creates the customization option and redirects back to customizations list with success or error message
        if ($this->adminModel->createCustomizationOption($slotId, $optionProductId, $priceDelta, $isDefault, $displayOrder)) {
            $_SESSION['success'] = 'Option created';
        } else {
            $_SESSION['errors'] = ['Error creating option'];
        }

        header('Location: /admin/products/edit/' . $product_id . '/slot/' . $slotId);
        exit;
    }

    /**
     * Updates a customization option.
     * URL: /admin/products/:product_id/option/update
     */
    public function updateCustomizationOption($product_id) {
        // Check admin access first
        $this->checkAdminAccess();

        // Only allow POST requests for updates
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        // Sanitize and validate input
        $slotId = intval($_POST['slot_id'] ?? 0);
        $optionId = intval($_POST['id'] ?? 0);
        $optionProductId = intval($_POST['option_product_id'] ?? 0);
        $priceDelta = floatval($_POST['price_delta'] ?? 0.0);
        $isDefault = intval($_POST['is_default'] ?? 0);
        $displayOrder = intval($_POST['display_order'] ?? 0);

        $errors = [];

        // Validate input
        if (empty($optionId) || empty($optionProductId) || empty($slotId)) {
            $_SESSION['errors'] = ['Invalid option data'];
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        // Validate display order
        if ($displayOrder < 0) {
            $errors[] = 'Display order must be non-negative';
        }

         // Check if slot already exists
        if (empty($errors)) {
            $existingSlot = $this->adminModel->getCustomizationOptionByProductSlot($optionProductId, $slotId);
            if ($existingSlot && $existingSlot['id'] != $optionId) {
                $errors[] = 'This product is already used as an option.';
            }
        }

        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            header('Location: /admin/products/edit/' . $product_id . '/slot/' . $slotId);
            exit;
        }

        // Updates the customization option and redirects back with success or error message
        if ($this->adminModel->updateCustomizationOption($optionId, $optionProductId, $priceDelta, $isDefault, $displayOrder)) {
            $_SESSION['success'] = 'Option updated';
        } else {
            $_SESSION['errors'] = ['Error updating option'];
        }

        header('Location: /admin/products/edit/' . $product_id . '/slot/' . $slotId);
        exit;
    }

    /**
     * Deletes a customization option.
     * URL: /admin/products/:product_id/option/delete/:id
     */
    public function deleteCustomizationOption($product_id, $id) {
        // Check admin access first
        $this->checkAdminAccess();

        // Only allow POST requests for deletions
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        // Sanitize input
        $product_id = intval($product_id ?? 0);
        $id = intval($id ?? 0);

        // Deletes the customization option and redirects back to customizations list with success or error message
        if ($this->adminModel->deleteCustomizationOption($id)) {
            $_SESSION['success'] = 'Option deleted';
        } else {
            $_SESSION['errors'] = ['Error deleting option'];
        }

        header('Location: /admin/products/edit/' . $product_id . '/customize');
        exit;
    }

    // ========== CATEGORIES ==========

    /**
     * Displays all product categories.
     * URL: /admin/categories
     */
    public function viewCategories() {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Get all categories and display them in the categories management view
        $title = 'Manage Categories';
        $categories = $this->adminModel->getAllCategories();
        
        require_once __DIR__ . '/../views/admin/categories.php';
    }

    /**
     * Displays the create category page with a form to add a new category.
     * URL: /admin/categories/create
     */
    public function createCategory() {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Only allow POST requests for creation
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/categories');
            exit;
        }

        // Sanitize and validate input
        $name = trim($_POST['name'] ?? '');

        // Validate required fields
        if (empty($name)) {
            $_SESSION['errors'] = ['Category name is required.'];
            header('Location: /admin/categories');
            exit;
        }

        if ($this->adminModel->categoryExists($name)) {
            $_SESSION['errors'] = ['Category already exists.'];
            header('Location: /admin/categories');
            exit;
        }

        // Creates the category and redirects back to categories list with success or error message
        if ($this->adminModel->createCategory($name)) {
            $_SESSION['success'] = 'Category created successfully!';
        } else {
            $_SESSION['errors'] = ['Error creating category!'];
        }

        // Redirect back to categories list after creation attempt
        header('Location: /admin/categories');
        exit;
    }

    /**
     * Updates an existing category's name.
     * URL: /admin/categories/update
     */
    public function updateCategory() {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Only allow POST requests for updates
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/categories');
            exit;
        }

        // Sanitize and validate input
        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');

        // Validate required fields
        if (empty($id) || empty($name)) {
            $_SESSION['errors'] = ['Category ID and name are required.'];
            header('Location: /admin/categories');
            exit;
        }

        if ($this->adminModel->categoryExists($name)) {
            $_SESSION['errors'] = ['Category already exists.'];
            header('Location: /admin/categories');
            exit;
        }

        // Updates the category and redirects back to categories list with success or error message
        if ($this->adminModel->updateCategory($id, $name)) {
            $_SESSION['success'] = 'Category updated successfully!';
        } else {
            $_SESSION['errors'] = ['Error updating category!'];
        }

        header('Location: /admin/categories');
        exit;
    }

    /**
     * Deletes a category by ID.
     * URL: /admin/categories/delete/:id
     */
    public function deleteCategory($id) {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Only allow POST requests for deletions
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/categories');
            exit;
        }

        // Deletes the category and redirects back to categories list with success or error message
        $id = intval($id);

        if ($this->adminModel->categoryHasDependencies($id)) {
            $_SESSION['errors'] = ['Couldn\'t delete category: The category is used by customization slots or products. Please remove dependencies or change their category first.'];
            header('Location: /admin/categories');
            exit;
        }
        
        if ($this->adminModel->deleteCategory($id)) {
            $_SESSION['success'] = 'Category deleted successfully!';
        } else {
            $_SESSION['errors'] = ['Error deleting category!'];
        }
        
        header('Location: /admin/categories');
        exit;
    }

    // ========== MENUS ==========
    public function viewMenus() {
        $this->checkAdminAccess();

        $title = 'Manage Menus';
        $menus = $this->adminModel->getAllMenus();

        require_once __DIR__ . '/../views/admin/menus.php';
    }

    public function viewCreateMenu() {
        $this->checkAdminAccess();

        $title = 'Create Menu';
        require_once __DIR__ . '/../views/admin/create-menu.php';
    }

    /**
     * Creates a new menu with the provided details.
     * URL: /admin/menus/create
     */
    public function createMenu() {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus/create');
            exit;
        }

        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '') ?: null;

        if (empty($name)) {
            $_SESSION['errors'] = ['Menu name required'];
            header('Location: /admin/menus/create');
            exit;
        }

        if ($this->adminModel->createMenu($name, $description)) {
            $_SESSION['success'] = 'Menu created';
            header('Location: /admin/menus');
            exit;
        }

        $_SESSION['errors'] = ['Error creating menu'];
        header('Location: /admin/menus/create');
        exit;
    }

    public function viewEditMenu($id) {
        $this->checkAdminAccess();

        $title = 'Edit Menu';
        $menu = $this->adminModel->getMenuById($id);
        
        if (!$menu) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }

        $rawSlots = $this->adminModel->getMenuSlotsWithProducts($id);
        $slots = $this->groupMenuSlotsWithProducts($rawSlots);

        require_once __DIR__ . '/../views/admin/edit-menu.php';
    }

    public function updateMenu() {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus');
            exit;
        }

        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '') ?: null;

        if (empty($id) || empty($name)) {
            $_SESSION['errors'] = ['Invalid data'];
            header('Location: /admin/menus');
            exit;
        }

        if ($this->adminModel->updateMenu($id, $name, $description)) {
            $_SESSION['success'] = 'Menu updated';
        } else {
            $_SESSION['errors'] = ['Error updating menu'];
        }

        header('Location: /admin/menus');
        exit;
    }

    public function deleteMenu($id) {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus');
            exit;
        }

        $id = intval($id);

        if ($this->adminModel->deleteMenu($id)) {
            $_SESSION['success'] = 'Menu deleted';
        } else {
            $_SESSION['errors'] = ['Error deleting menu'];
        }

        header('Location: /admin/menus');
        exit;
    }

    /**
     * Creates a new menu slot for the selected menu.
     */
    public function createMenuSlot($menu_id) {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus/edit/' . $menu_id);
            exit;
        }

        $name = trim($_POST['name'] ?? '');
        $min_select = intval($_POST['min_select'] ?? 0);
        $max_select = intval($_POST['max_select'] ?? 1);
        $display_order = intval($_POST['display_order'] ?? 0);

        $errors = [];

        if (empty($name)) {
            $_SESSION['errors'] = ['Slot name required'];
            header('Location: /admin/menus/edit/' . $menu_id);
            exit;
        }

        if ($min_select < 0 || $max_select < 0 || $max_select < $min_select) {
            $errors[] = 'Invalid min/max select values';
        }

        if ($display_order < 0) {
            $errors[] = 'Display order must be non-negative';
        }

        if (empty($errors)) {
            $existingSlot = $this->adminModel->getMenuSlotByName($menu_id, $name);
            if ($existingSlot) {
                $errors[] = 'A menu slot with this name already exists in this menu. Please choose a different name or edit the existing one.';
            }
        }

        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            header('Location: /admin/menus/edit/' . $menu_id);
            exit;
        }

        if ($this->adminModel->createMenuSlot($menu_id, $name, $min_select, $max_select, $display_order)) {
            $_SESSION['success'] = 'Menu slot created';
            header('Location: /admin/menus/edit/' . $menu_id);
            exit;
        }

        $_SESSION['errors'] = ['Error creating slot'];
        header('Location: /admin/menus/edit/' . $menu_id);
        exit;
    }

    /**
     * Deletes a menu slot and returns to the menu edit page.
     */
    public function deleteMenuSlot($menu_id, $slot_id) {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus/edit/' . $menu_id);
            exit;
        }

        $slot_id = intval($slot_id);

        if ($this->adminModel->deleteMenuSlot($slot_id)) {
            $_SESSION['success'] = 'Menu slot deleted';
        } else {
            $_SESSION['errors'] = ['Error deleting menu slot'];
        }

        header('Location: /admin/menus/edit/' . $menu_id);
        exit;
    }

    /**
     * Displays the menu slot product management page.
     */
    public function viewEditMenuSlot($menu_id, $slot_id) {
        $this->checkAdminAccess();

        $title = 'Edit Menu Slot Products';
        $menu = $this->adminModel->getMenuById($menu_id);
        
        if (!$menu) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }

        $slot = $this->adminModel->getMenuSlotById($slot_id);
        
        if (!$slot || $slot['menu_id'] != $menu_id) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }

        $slotProducts = $this->adminModel->getMenuSlotProducts($slot_id);
        $allProducts = $this->adminModel->getAllProducts();

        require_once __DIR__ . '/../views/admin/edit-menu-slot.php';
    }

    /**
     * Adds one or more products to a menu slot.
     */
    public function addProductToMenuSlot($menu_id, $slot_id) {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
            exit;
        }

        $slot_id = intval($slot_id);
        $products = $_POST['products'] ?? [];
        $price_delta = floatval($_POST['price_delta'] ?? 0);
        $is_default = intval($_POST['is_default'] ?? 0);
        $display_order = intval($_POST['display_order'] ?? 0);

        if (empty($products) || !is_array($products)) {
            $_SESSION['errors'] = ['Please select at least one product'];
            header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
            exit;
        }

        $success = true;
        foreach ($products as $product_id) {
            $product_id = intval($product_id);
            if (!$this->adminModel->addProductToMenuSlot($slot_id, $product_id, $price_delta, $is_default, $display_order)) {
                $success = false;
                break;
            }
        }

        if ($success) {
            $_SESSION['success'] = 'Products added to slot';
        } else {
            $_SESSION['errors'] = ['Error adding products to slot'];
        }

        header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
        exit;
    }

    /**
     * Removes a product from a menu slot.
     */
    public function removeProductFromMenuSlot($menu_id, $slot_id) {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
            exit;
        }

        $slot_id = intval($slot_id);
        $product_id = intval($_POST['product_id'] ?? 0);

        if (empty($product_id)) {
            $_SESSION['errors'] = ['Invalid product'];
            header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
            exit;
        }

        if ($this->adminModel->removeProductFromMenuSlot($slot_id, $product_id)) {
            $_SESSION['success'] = 'Product removed from slot';
        } else {
            $_SESSION['errors'] = ['Error removing product from slot'];
        }

        header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
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
}