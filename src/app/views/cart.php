<?php include 'partials/header.php'; ?>

<h1>Your Cart</h1>
<h2>Total: <?= htmlspecialchars((string) $total) ?> €</h2>

<?php $products = $cart['products'] ?? []; ?>

<?php if (empty($products)) { ?>
    <p>Your cart is empty.</p>
<?php } else { ?>
    <ul>
        <?php foreach ($products as $lineKey => $item): ?>
            <li>
                <strong><?= htmlspecialchars($item['name'] ?? '') ?></strong>
                x <?= (int) ($item['quantity'] ?? 0) ?>,
                <?= htmlspecialchars((string) ($item['price'] ?? 0)) ?> €
                <br>

                <?php if (!empty($item['options']) && is_array($item['options'])): ?>
                    <?php foreach ($item['options'] as $slot): ?>
                        <div>
                            <?= htmlspecialchars($slot['categoryName'] ?? '') ?>:
                            <ul>
                                <?php foreach ($slot['choices'] ?? [] as $choice): ?>
                                    <li>
                                        <?= htmlspecialchars($choice['name'] ?? '') ?>
                                        <?php if (isset($choice['priceDelta']) && (float) $choice['priceDelta'] !== 0.0): ?>
                                            (<?= htmlspecialchars((string) $choice['priceDelta']) ?> €)
                                        <?php endif; ?>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

                <form method="POST" action="/cart">
                    <input type="hidden" name="product_id" value="<?= (int) ($item['product_id'] ?? 0) ?>">
                    <input type="hidden" name="product_name" value="<?= htmlspecialchars($item['name'] ?? '', ENT_QUOTES) ?>">
                    <input type="hidden" name="product_price" value="<?= htmlspecialchars((string) ($item['price'] ?? 0), ENT_QUOTES) ?>">
                    <input type="hidden" name="customization" value="<?= htmlspecialchars(json_encode($item['options'] ?? []), ENT_QUOTES) ?>">
                    <input type="hidden" name="line_key" value="<?= htmlspecialchars((string) ($item['line_key'] ?? $lineKey), ENT_QUOTES) ?>">
                    <input type="hidden" name="is_from_cart" value="True">

                    <button type="submit" name="action" value="add">Add one</button>
                    <button type="submit" name="action" value="remove">Remove one</button>
                </form>
            </li>
        <?php endforeach; ?>
    </ul>
<?php } ?>

<?php include 'partials/footer.php'; ?>
