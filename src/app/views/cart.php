<?php require_once '../controllers/cart.php' ?>
<?php include 'partials/header.php'; ?>
<div>
    <h1>Current order</h1>
    <?php
    foreach ($_SESSION['cart'] as $product_id => $quantity) {
        //TODO: display product name instead of id
        echo "<div>
            <p>" . $product_id . "</p>
            <p>" . $quantity . "</p>
          </div>";
    }
    ?>
</div>
