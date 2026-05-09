<?php

class Cart
{
    public function __construct() {
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
    }

    public function addProduct($product_id, $name, $price) {
        if (!isset($_SESSION['cart'])) {
            header('Location: /cart');
            exit;
        }
        if (isset($_SESSION['cart'][$product_id])) {
            $_SESSION['cart'][$product_id]['quantity']++;
        } else {
            $_SESSION['cart'][$product_id] = [
                'name' => $name,
                'quantity' => 1,
                'price' => $price,
                'customization_index' => NULL
            ];
        }

    }

    public function removeProduct($product_id) {
        if (!isset($_SESSION['cart'])) {
            header('Location: /cart');
            exit;
        }
        if (isset($_SESSION['cart'][$product_id])) {
            if($_SESSION['cart'][$product_id]['quantity'] - 1 === 0) {
                unset($_SESSION['cart'][$product_id]);
                $keys = array_keys(array_filter($_SESSION['customizations'], function($entry) use ($product_id) {
                    return $entry['product_id'] === $product_id;
                }));
                if (!empty($keys)) {
                    $lastKey = end($keys);
                    unset($_SESSION['customizations'][$lastKey]);
                }
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
            if(isset($product['customization_index'])) {
                foreach ($_SESSION['customizations'][$product['customization_index']]['customization'] as $slot) {
                    foreach ($slot['choices'] as $choice) {
                        $total += $choice['priceDelta'] * $product['quantity'];
                    }
                }
            }
        }
        return $total;
    }

}