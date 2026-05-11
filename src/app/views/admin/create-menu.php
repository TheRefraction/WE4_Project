<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<article>
    <h3>Create Menu</h3>
    <form method="POST" action="/admin/menus/create">
        <div class="form-group">
            <label for="name">Menu Name *</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description"></textarea>
        </div>

        <div class="admin-form-footer">
            <button type="submit" class="btn btn-success">Create</button>
            <a href="/admin/menus" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>
