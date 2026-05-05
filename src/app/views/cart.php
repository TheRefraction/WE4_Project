<?php include 'partials/header.php'; ?>

<h1>Your Cart</h1>
<ul>
    <?php foreach ($cart as $item): ?>
        <li>
            <?= $item['name']; ?>
            x <?= $item['quantity']; ?>,
            <?= $item['price']; ?> €
            <form method='POST' action='/cart'>
                <input type='hidden' name='product_id' value='<?= $cart[$item] ?>'>
                <input type='hidden' name='product_name' value='<?= $item->name ?>'>
                <input type='hidden' name='product_price' value='<?= $item->price ?>'>
                <input type="hidden" name="is_from_cart" value='True'>
                <button type='submit' name='action' value='add'>+</button>
                <button type='submit' name='action' value='remove'>-</button>
                <!-- Handle appearance of the button above with Js: make
                it greyed out or hidden when the add button is clicked ? -->
            </form>
        </li>
    <?php endforeach; ?>
</ul>
<p>Total: <?php echo $total; ?> €</p>