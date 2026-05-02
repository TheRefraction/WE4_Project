<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<article>
    <h3>Edit Menu</h3>
    <form method="POST" action="/admin/menus/update">
        <input type="hidden" name="id" value="<?= htmlspecialchars($menu['id']) ?>">

        <div class="form-group">
            <label for="name">Menu Name</label>
            <input type="text" id="name" name="name" required value="<?= htmlspecialchars($menu['name']) ?>">
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description"><?= htmlspecialchars($menu['description'] ?? '') ?></textarea>
        </div>

        <div class="toolbar">
            <button type="submit" class="btn btn-success">Save</button>
            <a href="/admin/menus" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>
