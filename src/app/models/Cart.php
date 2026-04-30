<?php

class Cart
{
    public function __construct() {
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
    }

    public function addProduct($product_id, $name, $price) {
        if (isset($_SESSION['cart'][$product_id])) {
            $_SESSION['cart'][$product_id]['quantity']++;
        } else {
            $_SESSION['cart'][$product_id] = [
                'name' => $name,
                'quantity' => 1,
                'price' => $price
            ];
        }
    }

    public function removeProduct($product_id) {
        if (isset($_SESSION['cart'][$product_id])) {
            if($_SESSION['cart'][$product_id]['quantity'] - 1 === 0) {
                unset($_SESSION['cart'][$product_id]);
            } else {
                $_SESSION['cart'][$product_id]['quantity'] --;
            }
        }
    }

    public function getCart() {
        return $_SESSION['cart'];
    }

    public function computeTotal() {
        $total = 0;
        foreach ($_SESSION['cart'] as $product) {
            $total += $product['quantity'] * $product['price'];
        }
        return $total;
    }

}