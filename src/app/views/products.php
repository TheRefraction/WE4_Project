<?php require_once '../controllers/products.php' ?>
<?php include 'partials/header.php'; ?>
<?php if (!isset($_SESSION['user'])): ?>
    <div role="alert">
        You have to be signed-in to view this page.
    </div>
    <?php include 'partials/footer.php'; ?>
    <?php exit; ?>
<?php endif; ?>

<div>
    <h1>Product list</h1>
    <!--FIXME: fix category table, to organise products by category (those seen on the menu)-->
    <?php
    foreach ($products as $product) {
        echo "<div>
            <p>" . $product->name . "</p>
            <p>" . $product->price . "</p>
            <form method='POST' action='index.php'>
                <input type='hidden' name='product_id' value='" . $product->id . "'>
                <button type='submit' name='action' value='add'>Add to Cart</button>
                <button type='submit' name='action' value='remove'>Remove one</button>
            </form>
          </div>";
    }
    ?>
</div>
<?php include 'partials/footer.php'; ?>