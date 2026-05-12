<?php include 'partials/header.php'; ?>

<h1>Your Cart</h1>
<h2 class="total">Total: <?= htmlspecialchars((string) $total) ?> €</h2>

<?php $products = $cart['products'] ?? []; ?>
<?php $menus = $cart['menus'] ?? []; ?>

<?php if (empty($products) && empty($menus)) { ?>
    <p>Your cart is empty.</p>
<?php } else { ?>
    <ul class="cart-list">
        <?php foreach ($products as $lineKey => $item): ?>
            <li class="cart-item">
                <span class="cart-item-name"><?= htmlspecialchars($item['name'] ?? '') ?></span>
                <span class="cart-item-info">x <?= (int)($item['quantity'] ?? 0) ?> — <?= htmlspecialchars((string)($item['price'] ?? 0)) ?> €</span>

                <?php if (!empty($item['options']) && is_array($item['options'])): ?>
                    <?php foreach ($item['options'] as $slot): ?>
                        <div class="slot-label"><?= htmlspecialchars($slot['categoryName'] ?? '') ?>:</div>
                        <ul class="slot-choices">
                            <?php foreach ($slot['choices'] ?? [] as $choice): ?>
                                <li>
                                    <?= htmlspecialchars($choice['name'] ?? '') ?>
                                    <?php if (isset($choice['priceDelta']) && (float)$choice['priceDelta'] !== 0.0): ?>
                                        (+<?= htmlspecialchars((string)$choice['priceDelta']) ?> €)
                                    <?php endif; ?>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endforeach; ?>
                <?php endif; ?>

                <form method="POST" action="/cart" class="cart-form">
                    <input type="hidden" name="product_id" value="<?= (int)($item['product_id'] ?? 0) ?>">
                    <input type="hidden" name="product_name" value="<?= htmlspecialchars($item['name'] ?? '', ENT_QUOTES) ?>">
                    <input type="hidden" name="product_price" value="<?= htmlspecialchars((string)($item['price'] ?? 0), ENT_QUOTES) ?>">
                    <input type="hidden" name="customization" value="<?= htmlspecialchars(json_encode($item['options'] ?? []), ENT_QUOTES) ?>">
                    <input type="hidden" name="line_key" value="<?= htmlspecialchars((string)($item['line_key'] ?? $lineKey), ENT_QUOTES) ?>">
                    <input type="hidden" name="is_from_cart" value="True">
                    <button type="submit" name="action" value="add" class="btn btn-pourpre">+ Add one</button>
                    <button type="submit" name="action" value="remove" class="btn btn-pourpre">− Remove one</button>
                </form>
            </li>
        <?php endforeach; ?>
    </ul>

    <a href="/checkout">Checkout</a>
    <!-- TODO: Display Menus -->
<?php } ?>

<?php include 'partials/footer.php'; ?>
