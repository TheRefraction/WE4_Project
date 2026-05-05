<?php

require __DIR__ .'/../models/Product.php';

class ProductController {
    private $productModel;

    public function __construct(PDO $dbConnection) {
        $this->productModel = new Product($dbConnection);
    }

    public function viewProducts() {
        $title = "View Products";
        $products = $this->productModel->getAllProducts();
        require_once __DIR__ . "/../views/products.php";
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

        require_once __DIR__ . "/../views/product.php";
    }
}
