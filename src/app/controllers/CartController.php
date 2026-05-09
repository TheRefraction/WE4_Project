<?php

require_once __DIR__ .'/../models/Cart.php';

class CartController{

    private $cartModel;

    public function __construct(){
        $this->cartModel = new Cart();
    }

    public function cartAction(){
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /cart');
            exit;
        }
        $id = $_POST['product_id'];
        $name = $_POST['product_name'];
        $price = $_POST['product_price'];
        $is_from_cart = $_POST['is_from_cart'];
        if ($_POST['action'] === 'add') {
            $this->addToCart($id, $name, $price);
        } else if ($_POST['action'] === 'remove') {
            $this->removeFromCart($id);
        }
        if($is_from_cart === 'True'){
            header('Location: /cart');
            exit;
        } else {
            header('Location: /product?id=' . urlencode($id));
        }
    }

    public function viewCart(){
        if (!isset($_SESSION['customizations'])) {
            $_SESSION['customizations'] = [];
        }

        $cart = $this->cartModel->getCart();
        $total = $this->cartModel->computeTotal();
        $customizations = $_SESSION['customizations'];

        require_once __DIR__ . "/../views/cart.php";
    }

    public function saveCustomization() {
        ob_start();
        $data = json_decode(file_get_contents('php://input'), true);
        ob_clean();
        if (!$data || !isset($data['product_id']) || !isset($data['customization'])) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Invalid data']);
            exit;
        }

        $productId = $data['product_id'];
        $customization = $data['customization'];
        $_SESSION['customizations'][] = [
            'product_id' => $productId,
            'customization' => $customization
        ];
        $customizationIndex = count($_SESSION['customizations']) - 1;
        $_SESSION['cart'][$productId]['customization_index'] = $customizationIndex;

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
        exit;
    }

    public function addToCart($product_id, $quantity, $price) {
        $this->cartModel->addProduct($product_id, $quantity, $price);
    }

    public function removeFromCart($product_id) {
        $this->cartModel->removeProduct($product_id);
    }

}

