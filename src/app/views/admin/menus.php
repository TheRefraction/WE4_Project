<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="admin-toolbar">
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
                    <td colspan="5" class="admin-empty-state">No menus found.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($menus as $menu): ?>
                    <tr>
                        <td><?= htmlspecialchars($menu->id) ?></td>
                        <td><?= htmlspecialchars($menu->name) ?></td>
                        <td><?php 
                                $desc = $menu->description ?? '-';
                                $truncated = strlen($desc) > 50 ? substr($desc, 0, 50) . '...' : $desc;
                            ?>
                            <?= htmlspecialchars($truncated) ?>
                        </td>
                        <td>
                            <div class="admin-actions-inline">
                                <a href="/admin/menus/edit/<?= $menu->id ?>" class="btn btn-primary">Edit</a>
                                <form method="POST" action="/admin/menus/delete/<?= $menu->id ?>" onsubmit="return confirm('Are you sure?');">
                                    <button type="submit" class="btn btn-danger">Delete</button>
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
