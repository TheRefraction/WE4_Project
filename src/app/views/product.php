<?php include 'partials/header.php'; ?>

<main>
    <div class="product-page">
        <h1><?= htmlspecialchars($product->name) ?></h1>

        <div class="product-info">
            <span class="label">Prix</span>       <span><?= htmlspecialchars($product->price) ?> €</span>
            <span class="label">Description</span><span><?= htmlspecialchars($product->description) ?></span>
            <span class="label">Catégorie(s)</span><span>
            <?php if (!empty($product->category_name)): ?>
                <?= htmlspecialchars(is_array($product->category_name) ? implode(', ', $product->category_name) : $product->category_name) ?>
            <?php else: ?>
                Aucune catégorie trouvée
            <?php endif; ?>
        </span>
            <?php if ($product->supplier_name && $product->supplier_phone && $product->supplier_email): ?>
                <span class="label">Fournisseur</span>
                <span>
                <?= htmlspecialchars($product->supplier_name) ?>
                — <?= htmlspecialchars($product->supplier_email) ?>
                — <?= htmlspecialchars($product->supplier_phone) ?>
            </span>
            <?php endif; ?>
        </div>

        <?php if ($inCartQuantity > 0): ?>
            <p class="in-cart-notice">Already in your cart (<?= (int)$inCartQuantity ?> total)</p>
        <?php endif; ?>

        <form method="POST" action="/cart">
            <input type="hidden" name="product_id" value="<?= (int)$product->id ?>">
            <input type="hidden" name="product_name" value="<?= htmlspecialchars($product->name, ENT_QUOTES) ?>">
            <input type="hidden" name="product_price" value="<?= htmlspecialchars($product->price, ENT_QUOTES) ?>">
            <input type="hidden" name="is_from_cart" value="False">

            <?php if ($userId): ?>
                <?php if (!empty($slots)): ?>
                    <h3>Personnalisez votre produit</h3>
                    <?php foreach ($slots as $slot): ?>
                        <fieldset class="slot">
                            <legend>
                                <?= htmlspecialchars($slot->category_name) ?>
                                (<?= (int)$slot->min_select ?> à <?= (int)$slot->max_select ?>)
                            </legend>
                            <?php for ($row = 0; $row < (int)$slot->max_select; $row++): ?>
                                <select name="customization[<?= (int)$slot->id ?>][]" <?= $row < (int)$slot->min_select ? 'required' : '' ?>>
                                    <option value="">-- Select an option --</option>
                                    <?php foreach ($slot->options as $option): ?>
                                        <option value="<?= (int)$option->option_product_id ?>" <?= $row === 0 && !empty($option->is_default) ? 'selected' : '' ?>>
                                            <?= htmlspecialchars($option->option_product_name) ?>
                                            <?= ((float)$option->price_delta !== 0.0) ? ' (' . htmlspecialchars((string)$option->price_delta) . ' €)' : ' (free)' ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            <?php endfor; ?>
                        </fieldset>
                    <?php endforeach; ?>
                <?php endif; ?>
                <button type="submit" name="action" value="add" class="btn btn-pourpre">Add to Cart</button>
            <?php else: ?>
                <p>Please sign in to add this product to your cart.</p>
            <?php endif; ?>
        </form>
    </div>
</main>

<?php include 'partials/footer.php'; ?>
