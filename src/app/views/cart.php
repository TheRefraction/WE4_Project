<?php include 'partials/header.php'; ?>

<h1>Your Cart</h1>
<ul>
    <?php foreach ($cart as $product_id => $item): ?>
        <li>
            <?= $item['name']; ?>
            x <?= $item['quantity']; ?>,
            <?= $item['price']; ?> €
            <?= $item['customization_index']; ?>
            <br>
            <?php if (isset($item['customization_index'])):
                $customization = $customizations[$item['customization_index']]['customization'];
                foreach ($customization as $slot) : ?>
                    <?= $slot['categoryName']; ?>:
                    <ul>
                    <?php foreach ($slot['choices'] as $choice) : ?>
                        <li>
                            <?= $choice['name']; ?>,
                        </li>
                    <?php endforeach; ?>
                    </ul>
                <?php endforeach; ?>
            <?php endif; ?>

            <form method='POST' action='/cart'>
                <input type='hidden' name='product_id' value='<?= $product_id ?>'>
                <input type='hidden' name='product_name' value='<?= $item['name'] ?>'>
                <input type='hidden' name='product_price' value='<?= $item['price'] ?>'>
                <input type="hidden" name="is_from_cart" value='True'>
                <button type='submit' name='action' value='add'>Add one</button>
                <button type='submit' name='action' value='remove'>Remove one</button>
            </form>
        </li>
    <?php endforeach; ?>
</ul>
<p>Total: <?php echo $total; ?> €</p>