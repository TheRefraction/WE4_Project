<?php include 'partials/header.php'; ?>

<div>
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
        echo "
            <form method='POST' action='/cart'>
            <input type='hidden' name='product' value='" . $product . "'>
            <button type='submit' name='action' value='add'>Add to Cart</button>
            <button type='submit' name='action' value='remove'>Remove from Cart</button>
            <!-- Handle appearance of the button above with Js: make
            it greyed out or hidden when the add button is clicked ? -->
            </form>"
    ?>
</div>
<?php include 'partials/footer.php'; ?>
