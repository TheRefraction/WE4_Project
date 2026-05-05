<?php include 'partials/header.php'; ?>

<main>
        <h1><?= $product->name ?></h1>;
        <p>Price: <?= $product->price ?> €</p>;
        <p>Description: <?= $product->description ?></p>;
        <p>Category: <?= $product->category_name ?></p>;

        <?php
        if($product->supplier_name && $product->supplier_phone && $product->supplier_email) {

            ?>
            <p>Supplier: <?= $product->supplier_name ?>
             - <?= $product->supplier_email ?>
             - <?= $product->supplier_phone ?>
            </p>;
            <?php
        }?>

        <form method='POST' action='/cart'>
            <input type='hidden' name='product_id' value='<?= $product->id ?>'>
            <input type='hidden' name='product_name' value='<?= $product->name ?>'>
            <input type='hidden' name='product_price' value='<?= $product->price ?>'>
            <input type="hidden" name="is_from_cart" value='False'>
            <button type='submit' name='action' value='add'>Add to Cart</button>
            <button type='submit' name='action' value='remove'>Remove from Cart</button>
            <!-- Handle appearance of the button above with Js: make
            it greyed out or hidden when the add button is clicked ? -->
        </form>
</main>

<?php include 'partials/footer.php'; ?>
