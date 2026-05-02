<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div style="margin-bottom: 20px;">
    <a href="/admin" class="btn btn-secondary">Back to Dashboard</a>
    <a href="/admin/menus/create" class="btn btn-success">Create Menu</a>
</div>

<article>
    <h3>Menus Management</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($menus)): ?>
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">No menus found.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($menus as $menu): ?>
                    <tr>
                        <td><?= htmlspecialchars($menu['id']) ?></td>
                        <td><?= htmlspecialchars($menu['name']) ?></td>
                        <td><?= htmlspecialchars($menu['description'] ?? '-') ?></td>
                        <td>
                            <div class="actions">
                                <a href="/admin/menus/edit/<?= $menu['id'] ?>" class="btn btn-primary" style="padding: 5px 10px; margin: 0;">Edit</a>
                                <form method="POST" action="/admin/menus/delete/<?= $menu['id'] ?>" style="display: inline;" onsubmit="return confirm('Are you sure?');">
                                    <button type="submit" class="btn btn-danger" style="padding: 5px 10px; margin: 0;">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>
