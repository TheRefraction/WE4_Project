<?php

require __DIR__ .'/../models/product.php';
require __DIR__ .'/../../config/database.php';

$query = getConnection()->prepare("SELECT * FROM products");
$query->execute();
$products = $query->fetchAll(PDO::FETCH_CLASS, Product::class);