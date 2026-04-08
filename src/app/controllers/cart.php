<?php

require_once __DIR__ .'/../models/product.php';
require __DIR__ .'/../../config/database.php';

$product_id = $_POST['product_id'];
if ($_POST['action'] === 'add') {
    $cart->addProduct($product_id);
} elseif ($_POST['action'] === 'remove') {
    $cart->removeProduct($product_id);
}
