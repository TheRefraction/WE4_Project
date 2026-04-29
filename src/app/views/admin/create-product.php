<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<article>
    <h3>Create Product</h3>
    <form method="POST" action="/admin/products/create">
        <div class="form-group">
            <label for="name">Product Name *</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description"></textarea>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="price">Price *</label>
                <input type="number" id="price" name="price" step="0.01" min="0" required>
            </div>

            <div class="form-group">
                <label for="supplier_id">Supplier</label>
                <select id="supplier_id" name="supplier_id">
                    <option value="">-- Select a supplier --</option>
                    <?php foreach ($suppliers as $supplier): ?>
                        <option value="<?= $supplier['id'] ?>"><?= htmlspecialchars($supplier['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="category_ids">Categories *</label>
                <select id="category_ids" name="category_ids[]" multiple size="6" required>
                    <?php foreach ($categories as $category): ?>
                        <option value="<?= $category['id'] ?>"><?= htmlspecialchars($category['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label>Misc.</label>
                <div class="form-options">
                    <div class="form-option">
                        <input type="checkbox" id="hidden" name="hidden" value="0">
                        <label for="hidden">Hidden</label>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-top: 20px;">
            <button type="submit" class="btn btn-success">Create Product</button>
            <a href="/admin/products" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>