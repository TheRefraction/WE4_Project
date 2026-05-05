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
        }
    }

    public function viewCart(){
        $cart = $this->cartModel->getCart();
        $total = $this->cartModel->computeTotal();
        require_once __DIR__ . "/../views/cart.php";
    }

    public function addToCart($product_id, $quantity, $price) {
        $this->cartModel->addProduct($product_id, $quantity, $price);
    }

    public function removeFromCart($product_id) {
        $this->cartModel->removeProduct($product_id);
    }

}

