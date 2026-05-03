<?php include 'partials/header.php'; ?>

<main>
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
</main>

<?php include 'partials/footer.php'; ?>