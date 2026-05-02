<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="toolbar">
    <a href="/admin/menus/edit/<?= htmlspecialchars($menu['id']) ?>" class="btn btn-secondary">Back to Menu</a>
</div>

<article>
    <h3>Edit Menu Slot Products</h3>
    <div class="form-row">
        <div class="form-group">
            <label>Menu</label>
            <span><?= htmlspecialchars($menu['name']) ?></span>
        </div>

        <div class="form-group">
            <label>Slot Name</label>
            <span><?= htmlspecialchars($slot['name'] ?? '-') ?></span>
        </div>
    </div>

    <p>Min Select: <?= $slot['min_select'] ?> | Max Select: <?= $slot['max_select'] ?></p>
</article>

<article>
    <h3>Products in Slot</h3>
    <?php if (empty($slotProducts)): ?>
        <p>No products assigned to this slot.</p>
    <?php else: ?> 
        <table class="data-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price Delta (€)</th>
                    <th>Default</th>
                    <th>Display Order</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($slotProducts as $prod): ?>
                    <tr>
                        <td><?= htmlspecialchars($prod['product_name'] ?? ('Product #' . $prod['product_id'])) ?></td>
                        <td><?= number_format($prod['price_delta'], 2) ?></td>
                        <td><?= $prod['is_default'] ? '✓ Yes' : 'No' ?></td>
                        <td><?= $prod['display_order'] ?></td>
                        <td>
                            <form method="POST" action="/admin/menus/<?= $menu['id'] ?>/slot/<?= $slot['id'] ?>/product/remove" onsubmit="return deleteConfirmation(this);" class="admin-inline-form">
                                <input type="hidden" name="product_id" value="<?= $prod['product_id'] ?>">
                                <button type="submit" class="btn btn-danger">Remove</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</article>

<article>
    <h3>Add Products to Slot</h3>
    <form method="POST" action="/admin/menus/<?= $menu['id'] ?>/slot/<?= $slot['id'] ?>/product/add">
        <div class="form-group">
            <label for="products">Select Products to Add</label>
            <select id="products" name="products[]" multiple required size="10" class="admin-multiselect">
                <?php
                $assignedProductIds = array_map(fn($slotProduct) => $slotProduct['product_id'], $slotProducts);
                foreach ($allProducts as $product):
                    if (in_array($product['id'], $assignedProductIds)) {
                        continue;
                    }
                ?>
                    <option value="<?= $product['id'] ?>">
                        <?= htmlspecialchars($product['name']) ?> (€<?= number_format($product['price'], 2) ?>)
                    </option>
                <?php endforeach; ?>
            </select>
            <small class="admin-hint">Hold Ctrl (Cmd on Mac) to select multiple products</small>
        </div>

        <div class="form-group">
            <label for="price_delta">Price Delta (€)</label>
            <input type="number" id="price_delta" name="price_delta" step="0.01" value="0.00">
            <small>Additional price to add to the product when selected in this slot</small>
        </div>

        <div class="form-group">
            <label>
                <input type="checkbox" id="is_default" name="is_default" value="1">
                Set as Default Product(s)
            </label>
            <small>Check this if these products should be selected by default</small>
        </div>

        <div class="form-group">
            <label for="display_order">Display Order</label>
            <input type="number" id="display_order" name="display_order" value="0" min="0">
            <small>Lower numbers appear first. All selected products will use this order.</small>
        </div>

        <div class="toolbar">
            <button type="submit" class="btn btn-success">Add Products</button>
        </div>
    </form>
</article>

<style>
.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
}

.data-table th,
.data-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.data-table th {
    background-color: #f5f5f5;
    font-weight: bold;
}

.data-table tbody tr:hover {
    background-color: #f9f9f9;
}
</style>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>
