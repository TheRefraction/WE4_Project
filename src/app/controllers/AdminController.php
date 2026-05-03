<?php

require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../models/Account.php';

/**
 * Controller for handling admin-specific requests and logic.
 */
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
        if (empty($_SESSION['user_id'])) {
            header('Location: /sign-in');
            exit;
        }

        $userId = (int) $_SESSION['user_id'];
        $role = $this->accountModel->getAccountRole($userId);

        if (empty($role)) {
            header('Location: /sign-in');
            exit;
        }

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

        $role = $this->accountModel->getAccountRole((int) $_SESSION['user_id']);

        if ($role !== 'admin') {
            http_response_code(401);
            echo json_encode(['error' => 'Access denied.']);
            exit;
        }

        echo json_encode(['success' => 'Access granted.']);
        exit;
    }

    /*
     * ===============================
     * ========== DASHBOARD ==========
     * ===============================
     */

    /**
     * Displays the admin dashboard with key stats and quick links.
     * URL: /admin
     */
    public function viewAdmin() {
        // Check admin access first
        $this->checkAdminAccess();
        
        $title = 'Admin Dashboard';
        $stats = $this->adminModel->getDashboardStats();
        
        // Render the dashboard view
        require_once __DIR__ . '/../views/admin/dashboard.php';
    }

    /*
     * ===============================
     * ========== ACCOUNTS ===========
     * ===============================
     */

    /**
     * Displays the account management page with a list of all user accounts.
     * URL: /admin/accounts
     */
    public function viewAccounts() {
        // Check admin access first
        $this->checkAdminAccess();
        
        $title = 'Manage Accounts';
        $accounts = $this->adminModel->getAllAccounts();
        
        // Render the accounts management view
        require_once __DIR__ . '/../views/admin/accounts.php';
    }

    /**
     * Displays the edit account page with a form to update account details.
     * URL: /admin/accounts/edit/:id
     */
    public function viewEditAccount($id) {
        // Check admin access first
        $this->checkAdminAccess();
        
        $title = 'Edit Account';
        $account = $this->adminModel->getAccountById($id);
        $roles = $this->adminModel->getAllRoles();
        
        if (!$account) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }
        
        // Render the edit account view
        require_once __DIR__ . '/../views/admin/edit-account.php';
    }

    /**
     * Updates an existing account's details.
     * URL: /admin/accounts/update
     */
    public function updateAccountAdmin() {
        // Check admin access first
        $this->checkAdminAccess();
        
        // Only allow POST requests for updates
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/accounts');
            exit;
        }

        // Sanitize input
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

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $_SESSION['errors'] = ['Valid email is required.'];
            header('Location: /admin/accounts/edit/' . $id);
            exit;
        }

        // Prevent admin from changing their own role or details from the admin panel
        if ($id === $_SESSION['user_id']) {
            $_SESSION['errors'] = ['You cannot update your own account from the admin panel. Please use the account settings page.'];
            header('Location: /admin/accounts');
            exit;
        }

        // Updates account details and role
        try {
            $result = $this->adminModel->updateAccount($id, $firstName, $lastName, $email, $phone, $roleId);

            if (!$result) {
                $_SESSION['errors'] = ['Error updating account!'];
                header('Location: /admin/accounts/edit/' . $id);
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error updating account: ' . $e->getMessage()];
            header('Location: /admin/accounts/edit/' . $id);
            exit;
        }

        $_SESSION['success'] = 'Account updated successfully!';
        header('Location: /admin/accounts');
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
        try{
            $result = $this->adminModel->deleteAccount($id);

            if (!$result) {
                $_SESSION['errors'] = ['Error deleting account!'];
                header('Location: /admin/accounts');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error deleting account: ' . $e->getMessage()];
            header('Location: /admin/accounts');
            exit;
        }
        
        $_SESSION['success'] = 'Account deleted successfully!';
        header('Location: /admin/accounts');
        exit;
    }

    /*
     * ===============================
     * ========== PRODUCTS ===========
     * ===============================
     */

    /**
     * Displays the product management page with a list of all products.
     * URL: /admin/products
     */
    public function viewProducts() {
        // Check admin access first
        $this->checkAdminAccess();
        
        $title = 'Manage Products';
        $products = $this->adminModel->getAllProductsWithSupplierAndCategories();
        
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

        // Sanitize input
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '') ?: null;
        $price = floatval($_POST['price'] ?? 0);
        $supplierId = !empty($_POST['supplier_id']) ? intval($_POST['supplier_id']) : null;
        $hidden = boolval($_POST['hidden'] ?? false);
        $categoryIds = isset($_POST['category_ids']) ? array_map('intval', $_POST['category_ids']) : [];

        $errors = [];

        // Validate required fields
        if (empty($name) || $price <= 0) {
            $errors[] = 'Product name and valid price are required.';
        }

        if (empty($categoryIds)) {
            $errors[] = 'At least one category must be selected.';
        }

        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            header('Location: /admin/products/create');
            exit;
        }

        // Creates the product and redirects back to products list with success or error message
        try{
            $result = $this->adminModel->createProductWithCategories($name, $description, $price, $supplierId, $hidden, $categoryIds);
    
            if (!$result) {
                $_SESSION['errors'] = ['Error creating product!'];
                header('Location: /admin/products/create');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error creating product: ' . $e->getMessage()];
            header('Location: /admin/products/create');
            exit;
        }

        $_SESSION['success'] = 'Product created successfully!';
        header('Location: /admin/products');
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

        // Sanitize input
        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '') ?: null;
        $price = floatval($_POST['price'] ?? 0);
        $supplierId = !empty($_POST['supplier_id']) ? intval($_POST['supplier_id']) : null;
        $hidden = boolval($_POST['hidden'] ?? false);
        $categoryIds = isset($_POST['category_ids']) ? array_map('intval', $_POST['category_ids']) : [];

        // Validate required fields
        if (empty($id) || empty($name) || $price <= 0) {
            $_SESSION['errors'] = ['Product name and valid price are required.'];
            header('Location: /admin/products/edit/' . $id);
            exit;
        }

        // Updates the product and redirects back to products list with success or error message
        try{
             $result = $this->adminModel->updateProductWithCategories($id, $name, $description, $price, $supplierId, $hidden, $categoryIds);

             if (!$result) {
                $_SESSION['errors'] = ['Error updating product!'];
                header('Location: /admin/products/edit/' . $id);
                exit;
             }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error updating product: ' . $e->getMessage()];
            header('Location: /admin/products/edit/' . $id);
            exit;
        }

        $_SESSION['success'] = 'Product updated successfully!';
        header('Location: /admin/products');
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
        try{
            $result = $this->adminModel->deleteProduct($id);

            if (!$result) {
                $_SESSION['errors'] = ['Error deleting product!'];
                header('Location: /admin/products');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error deleting product: ' . $e->getMessage()];
            header('Location: /admin/products');
            exit;
        }

        $_SESSION['success'] = 'Product deleted successfully!';
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
        $slots = $this->adminModel->getCustomizationSlotsByProductId($id);
        $categories = $this->adminModel->getAllCategories();
        $product = $this->adminModel->getProductById($id);

        // If product not found, show 404 page
        if (!$product) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }

        // Get options for each slot
        $options = [];
        foreach ($slots as $slot) {
            $options[$slot->id] = $this->adminModel->getCustomizationOptionsBySlot($slot->id);
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
        $slots = $this->adminModel->getCustomizationSlotsByProductId($id);

        // find slot by id
        $slot = null;
        foreach ($slots as $s) { 
            if ($s->id === $slot_id) { 
                $slot = $s; 
                break; 
            }
        }

        // If slot not found, show 404 page
        if (!$slot) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }

        $options = $this->adminModel->getCustomizationOptionsBySlot($slot_id);
        $products = $this->adminModel->getAllProducts();

        require_once __DIR__ . '/../views/admin/edit-customization-slot.php';
    }

    /**
     * Displays the page for editing a specific customization option.
     * URL: /admin/products/edit/:id/option/:option_id
     */
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

        $slot = $this->adminModel->getCustomizationSlotById($option->product_customization_slot_id);
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
        try {
             $result = $this->adminModel->createCustomizationSlot($product_id, $category_id, $min_select, $max_select, $display_order);

             if (!$result) {
                $_SESSION['errors'] = ['Error creating slot!'];
                header('Location: /admin/products/edit/' . $product_id . '/customize');
                exit;
             }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error creating slot: ' . $e->getMessage()];
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        $_SESSION['success'] = 'Customization slot created';
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

        // Updates the customization slot and redirects back to customizations list with success or error message
        try{
            $result = $this->adminModel->updateCustomizationSlot($id, $min_select, $max_select, $display_order);

            if (!$result) {
                $_SESSION['errors'] = ['Error updating slot!'];
                header('Location: /admin/products/edit/' . $product_id . '/customize');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error updating slot: ' . $e->getMessage()];
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        $_SESSION['success'] = 'Slot updated';
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
        try {
            $result = $this->adminModel->deleteCustomizationSlot($id);

            if (!$result) {
                $_SESSION['errors'] = ['Error deleting slot!'];
                header('Location: /admin/products/edit/' . $product_id . '/customize');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error deleting slot: ' . $e->getMessage()];
            header('Location: /admin/products/edit/' . $product_id . '/customize');
            exit;
        }

        $_SESSION['success'] = 'Slot deleted';
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

        // Sanitize input
        $slotId = intval($_POST['slot_id'] ?? 0);
        $optionProductId = intval($_POST['option_product_id'] ?? 0);
        $priceDelta = floatval($_POST['price_delta'] ?? 0.0);
        $isDefault = boolval($_POST['is_default'] ?? false);
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
        try {
            $result = $this->adminModel->createCustomizationOption($slotId, $optionProductId, $priceDelta, $isDefault, $displayOrder);

            if (!$result) {
                $_SESSION['errors'] = ['Error creating option!'];
                header('Location: /admin/products/edit/' . $product_id . '/slot/' . $slotId);
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error creating option: ' . $e->getMessage()];
            header('Location: /admin/products/edit/' . $product_id . '/slot/' . $slotId);
            exit;
        }
        
        $_SESSION['success'] = 'Option created';
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

        // Sanitize input
        $slotId = intval($_POST['slot_id'] ?? 0);
        $optionId = intval($_POST['id'] ?? 0);
        $optionProductId = intval($_POST['option_product_id'] ?? 0);
        $priceDelta = floatval($_POST['price_delta'] ?? 0.0);
        $isDefault = boolval($_POST['is_default'] ?? false);
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
            if ($existingSlot && $existingSlot->id != $optionId) {
                $errors[] = 'This product is already used as an option.';
            }
        }

        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            header('Location: /admin/products/edit/' . $product_id . '/slot/' . $slotId);
            exit;
        }

        // Updates the customization option and redirects back with success or error message
        try{            
            $result = $this->adminModel->updateCustomizationOption($optionId, $optionProductId, $priceDelta, $isDefault, $displayOrder);

            if (!$result) {
                $_SESSION['errors'] = ['Error updating option!'];
                header('Location: /admin/products/edit/' . $product_id . '/slot/' . $slotId);
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error updating option: ' . $e->getMessage()];
            header('Location: /admin/products/edit/' . $product_id . '/slot/' . $slotId);
            exit;
        }
        
        $_SESSION['success'] = 'Option updated';
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
        try {
            $result = $this->adminModel->deleteCustomizationOption($id);
            if ($result) {
                $_SESSION['success'] = 'Option deleted';
            } else {
                $_SESSION['errors'] = ['Error deleting option'];
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error deleting option: ' . $e->getMessage()];
        }

        header('Location: /admin/products/edit/' . $product_id . '/customize');
        exit;
    }

    /*
     * ===============================
     * ========= CATEGORIES ==========
     * ===============================
     */

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

        // Sanitize input
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
        try {
            $result = $this->adminModel->createCategory($name);

            if (!$result) {
                $_SESSION['errors'] = ['Error creating category!'];
                header('Location: /admin/categories');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error creating category: ' . $e->getMessage()];
            header('Location: /admin/categories');
            exit;
        }
        
        $_SESSION['success'] = 'Category created successfully!';
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

        // Sanitize input
        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');

        // Validate required fields
        if (empty($id) || empty($name)) {
            $_SESSION['errors'] = ['Category ID and name are required.'];
            header('Location: /admin/categories');
            exit;
        }

        if ($this->adminModel->categoryExists($name, $id)) {
            $_SESSION['errors'] = ['Category already exists.'];
            header('Location: /admin/categories');
            exit;
        }

        // Updates the category and redirects back to categories list with success or error message
        try {
            $result = $this->adminModel->updateCategory($id, $name);
            if ($result) {
                $_SESSION['success'] = 'Category updated successfully!';
            } else {
                $_SESSION['errors'] = ['Error updating category!'];
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error updating category: ' . $e->getMessage()];
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
        
        try{
            $result = $this->adminModel->deleteCategory($id);

             if (!$result) {
                $_SESSION['errors'] = ['Error deleting category!'];
                header('Location: /admin/categories');
                exit;
             }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error deleting category: ' . $e->getMessage()];
            header('Location: /admin/categories');
            exit;
        }

        $_SESSION['success'] = 'Category deleted successfully!';
        header('Location: /admin/categories');
        exit;
    }

    /*
     * ===============================
     * ============ MENUS ============
     * ===============================
     */

    /**
     * Displays the menu management page with a list of all menus.
     * URL: /admin/menus
     */
    public function viewMenus() {
        $this->checkAdminAccess();

        $title = 'Manage Menus';
        $menus = $this->adminModel->getAllMenus();

        require_once __DIR__ . '/../views/admin/menus.php';
    }

    /**
     * Displays the menu creation page.
     * URL: /admin/menus/create
     */
    public function viewCreateMenu() {
        $this->checkAdminAccess();

        $title = 'Create Menu';
        require_once __DIR__ . '/../views/admin/create-menu.php';
    }

    /**
     * Displays the menu edit page.
     * URL: /admin/menus/edit/:id
     */
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

    /**
     * Displays the menu slot product management page.
     * URL: /admin/menus/edit/:menu_id/slot/:slot_id
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
        
        if (!$slot || $slot->menu_id !== $menu_id) {
            http_response_code(404);
            require_once __DIR__ . '/../views/404.php';
            exit;
        }

        $slotProducts = $this->adminModel->getMenuSlotProducts($slot_id);
        $allProducts = $this->adminModel->getAllProducts();

        require_once __DIR__ . '/../views/admin/edit-menu-slot.php';
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

        // Iterate through each row and group products under their respective slots
        foreach ($rawSlots as $row) {
            $slotId = $row->id;

            // If the slot hasn't been added to the result array yet, initialize it
            if (!isset($slots[$slotId])) {
                $slots[$slotId] = [
                    'id'                => $row->id,
                    'menu_id'           => $row->menu_id,
                    'name'              => $row->name,
                    'min_select'        => $row->min_select,
                    'max_select'        => $row->max_select,
                    'display_order'     => $row->display_order,
                    'products'          => []
                ];
            }

            // If the row contains product information, add it to the products array of the corresponding slot
            if (!empty($row->product_name)) {
                $slots[$slotId]['products'][] = [
                    'product_id'        => $row->product_id ?? null,
                    'product_name'      => $row->product_name,
                    'price_delta'       => $row->price_delta ?? 0,
                    'is_default'        => $row->is_default ?? 0
                ];
            }
        }

        return array_values($slots);
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

        try{
            $result = $this->adminModel->createMenu($name, $description);

            if (!$result) {
                $_SESSION['errors'] = ['Menu already exists.'];
                header('Location: /admin/menus/create');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error checking menu existence: ' . $e->getMessage()];
            header('Location: /admin/menus/create');
            exit;
        }
        
        $_SESSION['success'] = 'Menu created';
        header('Location: /admin/menus');
        exit;
    }

    /**
     * Updates an existing menu's details.
     * URL: /admin/menus/update
     */
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

        try {
            $result = $this->adminModel->updateMenu($id, $name, $description);

            if (!$result) {
                $_SESSION['errors'] = ['Menu already exists.'];
                header('Location: /admin/menus');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error checking menu existence: ' . $e->getMessage()];
            header('Location: /admin/menus');
            exit;
        }
        
        $_SESSION['success'] = 'Menu updated';
        header('Location: /admin/menus');
        exit;
    }

    /**
     * Deletes a menu by ID after checking for dependencies.
     * URL: /admin/menus/delete/:id
     */
    public function deleteMenu($id) {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus');
            exit;
        }

        $id = intval($id);

        if ($this->adminModel->menuHasDependencies($id)) {
            $_SESSION['errors'] = ['Couldn\'t delete menu: The menu is used by menu slots. Please remove dependencies first.'];
            header('Location: /admin/menus');
            exit;
        }

        try {
            $result = $this->adminModel->deleteMenu($id);

            if (!$result) {
                $_SESSION['errors'] = ['Error deleting menu!'];
                header('Location: /admin/menus');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error checking menu dependencies: ' . $e->getMessage()];
            header('Location: /admin/menus');
            exit;
        }

        $_SESSION['success'] = 'Menu deleted';
        header('Location: /admin/menus');
        exit;
    }

    /**
     * Creates a new menu slot for the selected menu.
     * URL: /admin/menus/:menu_id/slot/create
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

        try{
            $result = $this->adminModel->createMenuSlot($menu_id, $name, $min_select, $max_select, $display_order);

            if (!$result) {
                $_SESSION['errors'] = ['Error creating menu slot!'];
                header('Location: /admin/menus/edit/' . $menu_id);
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error creating menu slot: ' . $e->getMessage()];
            header('Location: /admin/menus/edit/' . $menu_id);
            exit;
        }
        
        $_SESSION['success'] = 'Menu slot created';
        header('Location: /admin/menus/edit/' . $menu_id);
        exit;
    }

    /**
     * Deletes a menu slot and returns to the menu edit page.
     * URL: /admin/menus/:menu_id/slot/delete/:slot_id
     */
    public function deleteMenuSlot($menu_id, $slot_id) {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus/edit/' . $menu_id);
            exit;
        }

        $menu_id = intval($menu_id);
        $slot_id = intval($slot_id);

        try {
            $result = $this->adminModel->deleteMenuSlot($slot_id);

            if (!$result) {
                $_SESSION['errors'] = ['Error deleting menu slot!'];
                header('Location: /admin/menus/edit/' . $menu_id);
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error checking menu slot dependencies: ' . $e->getMessage()];
            header('Location: /admin/menus/edit/' . $menu_id);
            exit;
        }
        
        $_SESSION['success'] = 'Menu slot deleted';
        header('Location: /admin/menus/edit/' . $menu_id);
        exit;
    }

    /**
     * Adds one or more products to a menu slot.
     * URL: /admin/menus/:menu_id/slot/:slot_id/product/add
     */
    public function addProductToMenuSlot($menu_id, $slot_id) {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
            exit;
        }

        $productId = intval($_POST['product_id'] ?? 0);
        $priceDelta = floatval($_POST['price_delta'] ?? 0);
        $isDefault = intval($_POST['is_default'] ?? 0);
        $displayOrder = intval($_POST['display_order'] ?? 0);

        if (empty($productId)) {
            $_SESSION['errors'] = ['Please select a product'];
            header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
            exit;
        }

        try {
            $result = $this->adminModel->addProductToMenuSlot($slot_id, $productId, $priceDelta, $isDefault, $displayOrder);

            if (!$result) {
                $_SESSION['errors'] = ['Error adding product to slot!'];
                header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error adding product to slot: ' . $e->getMessage()];
            header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
            exit;
        }
        
        $_SESSION['success'] = 'Products added to slot';
        header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
        exit;
    }

    /**
     * Removes a product from a menu slot.
     * URL: /admin/menus/:menu_id/slot/:slot_id/product/remove
     */
    public function removeProductFromMenuSlot($menu_id, $slot_id) {
        $this->checkAdminAccess();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
            exit;
        }

        $menu_id = intval($menu_id);
        $slot_id = intval($slot_id);
        $product_id = intval($_POST['product_id'] ?? 0);

        if (empty($product_id)) {
            $_SESSION['errors'] = ['Invalid product'];
            header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
            exit;
        }

        try {
            $result = $this->adminModel->removeProductFromMenuSlot($slot_id, $product_id);

            if ($result) {
                $_SESSION['success'] = 'Product removed from slot';
            } else {
                $_SESSION['errors'] = ['Error removing product from slot'];
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error removing product from slot: ' . $e->getMessage()];
        }

        header('Location: /admin/menus/edit/' . $menu_id . '/slot/' . $slot_id);
        exit;
    }

    /*
     * ===============================
     * ========= SUPPLIERS ==========
     * ===============================
     */

    /**
     * Displays the supplier management page with a list of all suppliers.
     * URL: /admin/suppliers
     */
    public function viewSuppliers() {
        $this->checkAdminAccess();
        
        $title = 'Manage Suppliers';
        $suppliers = $this->adminModel->getAllSuppliers();
        
        require_once __DIR__ . '/../views/admin/suppliers.php';
    }

    /**
     * Displays the create supplier page with a form to add a new supplier.
     * URL: /admin/suppliers/create
     */
    public function viewCreateSupplier() {
        $this->checkAdminAccess();
        
        $title = 'Create Supplier';
        
        require_once __DIR__ . '/../views/admin/create-supplier.php';
    }

    /**
     * Displays the edit supplier page with a form to update supplier details.
     * URL: /admin/suppliers/edit/:id
     */
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

    /**
     * Creates a new supplier with the provided details.
     * URL: /admin/suppliers/create
     */
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

        if ($this->adminModel->supplierExists($name)) {
            $_SESSION['errors'] = ['Supplier already exists.'];
            header('Location: /admin/suppliers/create');
            exit;
        }

        try{
            $result = $this->adminModel->createSupplier($name, $email, $phone);

            if (!$result) {
                $_SESSION['errors'] = ['Error creating supplier!'];
                header('Location: /admin/suppliers/create');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error creating supplier: ' . $e->getMessage()];
            header('Location: /admin/suppliers/create');
            exit;
        }
        
        $_SESSION['success'] = 'Supplier created successfully!';
        header('Location: /admin/suppliers');
        exit;
    }

    /**
     * Update a supplier
     * URL: /admin/suppliers/update
     */
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

        if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $_SESSION['errors'] = ['Valid email is required.'];
            header('Location: /admin/suppliers/edit/' . $id);
            exit;
        }

        if ($this->adminModel->supplierExists($name, $id)) {
            $_SESSION['errors'] = ['Supplier already exists.'];
            header('Location: /admin/suppliers/edit/' . $id);
            exit;
        }

        try{
            $result = $this->adminModel->updateSupplier($id, $name, $email, $phone);

            if (!$result) {
                $_SESSION['errors'] = ['Error updating supplier!'];
                header('Location: /admin/suppliers/edit/' . $id);
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error updating supplier: ' . $e->getMessage()];
            header('Location: /admin/suppliers/edit/' . $id);
            exit;
        }

        $_SESSION['success'] = 'Supplier updated successfully!';
        header('Location: /admin/suppliers');
        exit;
    }

    /**
     * Delete a supplier
     * URL: /admin/suppliers/delete/:id
     */
    public function deleteSupplier($id) {
        $this->checkAdminAccess();
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /admin/suppliers');
            exit;
        }

        $id = intval($id);
        
        try{
            $result = $this->adminModel->deleteSupplier($id);

            if (!$result) {
                $_SESSION['errors'] = ['Error deleting supplier!'];
                header('Location: /admin/suppliers');
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['errors'] = ['Error checking supplier dependencies: ' . $e->getMessage()];
            header('Location: /admin/suppliers');
            exit;
        }
        
        $_SESSION['success'] = 'Supplier deleted successfully!';
        header('Location: /admin/suppliers');
        exit;
    }
}