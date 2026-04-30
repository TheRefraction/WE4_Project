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
        else {
            $product = $_POST['product'];
            if ($_POST['action'] === 'add') {
                $this->addToCart($product->id, $product->name, $product->price);
            } else if ($_POST['action'] === 'remove') {
                $this->removeFromCart($product->id);
            }
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

