<?php include 'partials/header.php'; ?>

<main>
    <?php
        echo "<h1>". $product->name . "</h1>";
        echo "<p>Price: " . $product->price . "€</p>";
        echo "<p>Description: " . $product->description . "</p>";
        echo "<p>Category: " . $product->category_name . "</p>";

        if($product->supplier_name 
            && $product->supplier_phone
            && $product->supplier_email) {

        echo "<p>Supplier: " 
            . $product->supplier_name 
            . " - " . $product->supplier_email 
            . " - " . $product->supplier_phone 
            . "</p>";
        }
    ?>
</main>

<?php include 'partials/footer.php'; ?>