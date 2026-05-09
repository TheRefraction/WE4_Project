<?php include 'partials/header.php'; ?>

<h1>Your Cart</h1>
<ul class="cart-list">
    <?php foreach ($cart as $product_id => $item): ?>
        <li class="cart-item">
            <p class="cart-item-name text-pourpre">
                <?= $item['name'] ?>
                <span style="font-weight:400; color:slategray;">x <?= $item['quantity'] ?> — <?= $item['price'] ?> €</span>
            </p>

            <?php if (isset($item['customization_index'])):
                $customization = $customizations[$item['customization_index']]['customization'];
                foreach ($customization as $slot): ?>
                    <div class="slot-label"><?= $slot['categoryName'] ?>(s):</div>
                    <ul class="slot-choices">
                        <?php foreach ($slot['choices'] as $choice): ?>
                            <li><?= $choice['name'] ?></li>
                        <?php endforeach; ?>
                    </ul>
                <?php endforeach; endif; ?>

            <form method="POST" action="/cart" style="display:flex; gap:8px; margin-top:10px;">
                <input type="hidden" name="product_id" value="<?= $product_id ?>">
                <input type="hidden" name="product_name" value="<?= $item['name'] ?>">
                <input type="hidden" name="product_price" value="<?= $item['price'] ?>">
                <input type="hidden" name="is_from_cart" value="True">
                <button type="submit" name="action" value="add" class="btn btn-pourpre">+ Add one</button>
                <button type="submit" name="action" value="remove" class="btn btn-pourpre">− Remove one</button>
            </form>
        </li>
    <?php endforeach; ?>
</ul>
<p class="total">Total: <?= $total ?> €</p>