<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="toolbar">
    <a href="/admin" class="btn btn-secondary">Back to Dashboard</a>
</div>

<article>
    <h3>Categories Management</h3>
    
    <div style="margin-bottom: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
        <h4>Create New Category</h4>
        <form method="POST" action="/admin/categories/create" style="display: flex; gap: 10px;">
            <input type="text" name="name" placeholder="Category name" required style="flex: 1;">
            <button type="submit" class="btn btn-success">Create Category</button>
        </form>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Products</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($categories)): ?>
                <tr>
                    <td colspan="4" class="empty-table">No categories found.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($categories as $category): ?>
                    <tr>
                        <td><?= htmlspecialchars($category['id']) ?></td>
                        
                        <td>
                            <form method="POST" action="/admin/categories/update" style="display: flex; gap: 10px;">
                                <input type="hidden" name="id" value="<?= $category['id'] ?>">
                                <input type="text" name="name" value="<?= htmlspecialchars($category['name']) ?>" style="flex: 1;">
                                <button type="submit" class="btn btn-primary">Update</button>
                            </form>
                        </td>

                        <td><?= $category['product_count'] ?></td>

                        <td>
                            <form method="POST" action="/admin/categories/delete/<?= $category['id'] ?>" onsubmit="return deleteConfirmation(this);">
                                <button type="submit" class="btn btn-danger">Delete</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>