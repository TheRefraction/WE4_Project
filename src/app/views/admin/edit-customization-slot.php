<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="toolbar">
    <a href="/admin/products/edit/<?= $slot['product_id'] ?>/customize" class="btn btn-secondary">Back to product edition</a>
</div>

<article>
    <h3>Edit Customization Slot</h3>
    <form method="POST" action="/admin/products/<?= $slot['product_id'] ?>/slot/update">
        <input type="hidden" name="id" value="<?= htmlspecialchars($slot['id']) ?>">

        <div class="form-row">
            <div class="form-group">
                <label>Product</label>
                <span><?= htmlspecialchars($slot['product_name'] ?? '-') ?></span>
            </div>

            <div class="form-group">
                <label>Category</label>
                <span><?= htmlspecialchars($slot['category_name'] ?? '-') ?></span>
            </div>
        </div>

        <div class="form-group">
            <label>Min Select</label>
            <input name="min_select" type="number" min="0" value="<?= htmlspecialchars($slot['min_select'] ?? 0) ?>" required>
        </div>

        <div class="form-group">
            <label>Max Select</label>
            <input name="max_select" type="number" min="0" value="<?= htmlspecialchars($slot['max_select'] ?? 1) ?>" required>
        </div>

        <div class="form-group">
            <label>Display Order</label>
            <input name="display_order" type="number" min="0" value="<?= htmlspecialchars($slot['display_order'] ?? 0) ?>" required>
        </div>

        <div class="toolbar">
            <button class="btn btn-success" type="submit">Update</button>
        </div>
    </form>
</article>

<article>
    <h3>Add an option</h3>
    <form method="POST" action="/admin/products/<?= $slot['product_id'] ?>/option/create">
        <input type="hidden" name="slot_id" value="<?= $slot['id'] ?>">

        <div class="form-row">
            <div class="form-group">
                <label>Product Option</label>
                <select name="option_product_id" required>
                    <?php foreach ($products as $productOption): ?>
                        <?php if ($productOption['id'] == $slot['product_id']) continue; ?>
                        <option value="<?= $productOption['id'] ?>"><?= htmlspecialchars($productOption['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label>Misc.</label>
                <div class="form-options">
                    <div class="form-option">
                        <label>Price Delta</label>
                        <input name="price_delta" type="number" step="0.01" value="0.00" required>
                    </div>

                    <div class="form-option">
                        <label>Is Default</label>
                        <input type="checkbox" name="is_default" value="1">
                    </div>

                    <div class="form-option">
                        <label>Display Order</label>
                        <input name="display_order" type="number" value="0" min="0" required>
                    </div>
                </div>
            </div>
        </div>

        <div class="toolbar">
            <button type="submit" class="btn btn-success">Create</button>
        </div>
    </form>
</article>

<article>
    <h3>Current options</h3>
    <?php if (empty($options)): ?>
        <p>No options yet.</p>
    <?php else: ?>
        <ul>
            <?php foreach ($options as $option): ?>
                <li>
                    <?= htmlspecialchars($option['option_product_name'] ?? ('Option #' . $option['id'])) ?>
                    - Δ <?= number_format($option['price_delta'], 2) ?> €
                    <?= $option['is_default'] ? '(default)' : '' ?>

                    <span class="actions admin-actions-inline admin-float-right">
                        <a href="/admin/products/edit/<?= $slot['product_id'] ?>/option/<?= $option['id'] ?>" class="btn btn-primary">Edit</a>

                        <form method="POST" action="/admin/products/<?= $slot['product_id'] ?>/option/delete/<?= $option['id'] ?>" onsubmit="return deleteConfirmation(this);">
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </span>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>