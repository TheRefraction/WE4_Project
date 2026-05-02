<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<article>
    <h3>Edit Customization Option</h3>
    
    <div class="form-row">
        <div class="form-group">
            <label>Product</label>
            <span><?= htmlspecialchars($slot->product_name ?? '-') ?></span>
        </div>

        <div class="form-group">
            <label>Slot</label>
            <span><?= htmlspecialchars($slot->category_name ?? 'Customization Slot') ?></span>
        </div>

        <div class="form-group">
            <label>Current Option</label>
            <span><?= htmlspecialchars($option->option_product_name ?? '-') ?></span>
        </div>
    </div>

    <form method="POST" action="/admin/products/<?= $slot->product_id ?>/option/update">
        <input type="hidden" name="id" value="<?= htmlspecialchars($option->id) ?>">
        <input type="hidden" name="slot_id" value="<?= htmlspecialchars($slot->id) ?>">

        <div class="form-row">
            <div class="form-group">
                <label>Product Option *</label>
                <select name="option_product_id" required>
                    <option value="">-- Select a product --</option>
                    <?php foreach ($products as $p): ?>
                        <?php if ($p->id == $slot->product_id) continue; // Prevent selecting the same product as an option ?>
                        <option value="<?= $p->id ?>" <?= $p->id == $option->option_product_id ? 'selected' : '' ?>>
                            <?= htmlspecialchars($p->name) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label>Price Delta *</label>
                <input name="price_delta" type="number" step="0.01" value="<?= htmlspecialchars($option->price_delta ?? 0.00) ?>" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Display Order *</label>
                <input name="display_order" type="number" value="<?= htmlspecialchars($option->display_order ?? 0) ?>" min="0" required>
            </div>

            <div class="form-group">
                <label>Is Default</label>
                <input type="checkbox" name="is_default" value="1" <?= $option->is_default ? 'checked' : '' ?>>
            </div>
        </div>

        <div class="toolbar">
            <button type="submit" class="btn btn-success">Update</button>
            <a href="/admin/products/edit/<?= $slot->product_id ?>/slot/<?= $slot->id ?>" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>