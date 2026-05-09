<?php

require __DIR__ .'/../models/Menu.php';
require __DIR__ .'/../models/Product.php';
require __DIR__ .'/../models/ProductCustomization.php';
require __DIR__ .'/../models/Cart.php';

class ProductController {

    //private $menuModel;
    private $productModel;
    private $customizationModel;
    private $cartModel;

    public function __construct(PDO $dbConnection) {
        //$this->menuModel = new Menu($dbConnection);
        $this->productModel = new Product($dbConnection);
        $this->customizationModel = new ProductCustomization($dbConnection);
        $this->cartModel = new Cart();
    }

    public function viewProducts() {
        $title = "View Products";
        $products = $this->productModel->getAllProducts(false);
        //$menus = $this->menuModel->getAllMenus();

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

        $id = $_GET['id'] ?? null;

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

        $slots = $this->customizationModel->getCustomizationSlotsByProductId($id);
        foreach($slots as $slot) {
            $slot->options = $this->customizationModel->getCustomizationOptionsBySlot($slot->id);
        }

        $inCartQuantity = $this->cartModel->getProductQuantityById($product->id);

        require_once __DIR__ . "/../views/product.php";
    }
}
