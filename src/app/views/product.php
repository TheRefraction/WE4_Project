<?php include 'partials/header.php'; ?>

<main>
    <h1><?= htmlspecialchars($product->name) ?></h1>
    <p>Prix: <?= htmlspecialchars($product->price) ?> €</p>
    <p>Description: <?= htmlspecialchars($product->description) ?></p>
    <p>Catégorie(s):
        <?php if (!empty($product->category_name)) { ?>
            <?php if (is_array($product->category_name)) { ?>
                <?= htmlspecialchars(implode(', ', $product->category_name)) ?>
            <?php } else { ?>
                <?= htmlspecialchars($product->category_name) ?>
            <?php } ?>
        <?php } else { ?>
            Aucune catégorie trouvée
        <?php } ?>
    </p>

    <?php if ($product->supplier_name && $product->supplier_phone && $product->supplier_email) { ?>
        <p>Fournisseur: <?= htmlspecialchars($product->supplier_name) ?>
            - <?= htmlspecialchars($product->supplier_email) ?>
            - <?= htmlspecialchars($product->supplier_phone) ?>
        </p>
    <?php } ?>

    <?php if ($inCartQuantity > 0) { ?>
        <p style="color: green; font-weight: bold;">
            This product is already in your cart. (<?= (int) $inCartQuantity ?> total in cart)
        </p>
    <?php } ?>

    <form method="POST" action="/cart">
        <input type="hidden" name="product_id" value="<?= (int) $product->id ?>">
        <input type="hidden" name="product_name" value="<?= htmlspecialchars($product->name, ENT_QUOTES) ?>">
        <input type="hidden" name="product_price" value="<?= htmlspecialchars($product->price, ENT_QUOTES) ?>">
        <input type="hidden" name="is_from_cart" value="False">

        <?php if ($userId) { ?>
            <?php if (!empty($slots)) { ?>
                <h3>Personnalisez votre produit</h3>

                <?php foreach ($slots as $slot): ?>
                    <fieldset style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
                        <legend>
                            <?= htmlspecialchars($slot->category_name) ?>
                            (<?= (int) $slot->min_select ?> à <?= (int) $slot->max_select ?>)
                        </legend>

                        <?php for ($row = 0; $row < (int) $slot->max_select; $row++): ?>
                            <div style="margin-bottom: 0.75rem;">
                                <select name="customization[<?= (int) $slot->id ?>][]" <?= $row < (int) $slot->min_select ? 'required' : '' ?>>
                                    <option value="">-- Select an option --</option>
                                    <?php foreach ($slot->options as $option): ?>
                                        <option value="<?= (int) $option->option_product_id ?>" <?= $row === $option->display_order && !empty($option->is_default) ? 'selected' : '' ?>>
                                            <?= htmlspecialchars($option->option_product_name) ?>
                                            <?= ((float) $option->price_delta !== 0.0) ? ' (' . htmlspecialchars((string) $option->price_delta) . ' €)' : ' (free)' ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        <?php endfor; ?>
                    </fieldset>
                <?php endforeach; ?>
            <?php } ?>

            <button type="submit" name="action" value="add">Add to Cart</button>
            <button type="submit" name="action" value="remove" id="remove-btn">Remove from Cart</button>
        <?php } else { ?>
            <p style="color: red; font-weight: bold;">Please sign in to add this product to your cart.</p>
        <?php } ?>
    </form>
</main>

<?php include 'partials/footer.php'; ?>
