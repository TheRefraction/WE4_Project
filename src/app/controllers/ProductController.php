<?php

require __DIR__ .'/../models/Product.php';

class ProductController {
    private $productModel;

    public function __construct(PDO $dbConnection) {
        $this->productModel = new Product($dbConnection);
    }

    public function viewProducts() {
        $title = "View Products";
        $products = $this->productModel->getAll();
        require_once __DIR__ . "/../views/products.php";
    }
}
