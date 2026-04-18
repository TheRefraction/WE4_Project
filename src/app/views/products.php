<?php include 'partials/header.php'; ?>

<div>
    <h1>Product list</h1>
    <!--FIXME: fix category table, to organise products by category (those seen on the menu)-->
    <?php

    foreach ($products as $product) {
        echo "<div>
            <p><a href='/product?id=" . $product->id . "'>" . $product->name . "</a> - " . $product->price . "€</p>
          </div>";
    }
    ?>
</div>
<?php include 'partials/footer.php'; ?>
