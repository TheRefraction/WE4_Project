<?php

require __DIR__ .'/../models/Product.php';
require __DIR__ .'/../models/ProductCustomization.php';

class ProductController {

    private $dbConnection;
    private $productModel;

    public function __construct(PDO $dbConnection) {
        $this->dbConnection = $dbConnection;
        $this->productModel = new Product($dbConnection);
    }

    public function viewProducts() {
        $title = "View Products";
        $products = $this->productModel->getAllProducts(false);
        require_once __DIR__ . "/../views/products.php";
    }

    public function filterProducts() {
        $data = json_decode(file_get_contents("php://input"), true);

        $search = $data['search'] ?? '';
        $sort = $data['sort'] ?? '';

        $products = $this->productModel->getProductsFiltered($search, $sort);

        require __DIR__ . "/../views/partials/product-list.php";
    }

    public function viewSingleProduct() {
        if($_SERVER['REQUEST_METHOD'] !== 'GET') {
            header('Location: /products');
            exit;
        }

        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if(!$id) {
            header('Location: /products');
            exit;
        }

        $product = $this->productModel->getProductById($id);

        if(!$product) {
            header('Location: /products');
            exit;
        }

        $title = $product->name;

        $customizationModel = new ProductCustomization($this->dbConnection);
        $slots = $customizationModel->getCustomizationSlotsByProductId($product->id);
        foreach($slots as $slot) {
            $slot->options = $customizationModel->getCustomizationOptionsBySlot($slot->id);
        }


        require_once __DIR__ . "/../views/product.php";
    }
}
