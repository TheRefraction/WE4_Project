<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<article>
    <h3>Edit Product</h3>
    <form method="POST" action="/admin/products/update">
        <input type="hidden" name="id" value="<?= $product['id'] ?>">

        <div class="form-group">
            <label for="name">Product Name *</label>
            <input type="text" id="name" name="name" value="<?= htmlspecialchars($product['name']) ?>" required>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description"><?= htmlspecialchars($product['description'] ?? '') ?></textarea>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="price">Price *</label>
                <input type="number" id="price" name="price" step="0.01" min="0" value="<?= $product['price'] ?>" required>
            </div>

            <div class="form-group">
                <label for="supplier_id">Supplier</label>
                <select id="supplier_id" name="supplier_id">
                    <option value="">-- Select a supplier --</option>
                    <?php foreach ($suppliers as $supplier): ?>
                        <option value="<?= $supplier['id'] ?>" <?= $supplier['id'] == $product['supplier_id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($supplier['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="category_ids">Categories *</label>
                <select id="category_ids" name="category_ids[]" multiple size="6" required>
                    <?php foreach ($categories as $category): ?>
                        <option value="<?= $category['id'] ?>" <?= in_array($category['id'], $selectedCategoryIds) ? 'selected' : '' ?>>
                            <?= htmlspecialchars($category['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label>Misc.</label>
                <div class="form-options">
                    <div class="form-option">
                        <input type="checkbox" id="hidden" name="hidden" value="1" <?= $product['hidden'] ? 'checked' : '' ?>>
                        <label for="hidden">Hidden</label>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-top: 20px;">
            <button type="submit" class="btn btn-success">Update</button>
            <a href="/admin/products" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>