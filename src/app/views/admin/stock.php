<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="admin-toolbar">
    <a href="/admin" class="btn btn-secondary">Back to Dashboard</a>
</div>

<article>
    <h3>Stock Management</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Available</th>
                <th>Reserved</th>
                <th>Reorder Threshold</th>
                <th>Last Update</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($stocks)): ?>
                <tr>
                    <td colspan="7" class="admin-empty-state">No stock records found.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($stocks as $stockEntry): ?>
                    <tr>
                        <td><?= htmlspecialchars($stockEntry['id']) ?></td>
                        <td><?= htmlspecialchars($stockEntry['product_name'] ?? '-') ?></td>
                        <td><?= htmlspecialchars($stockEntry['quantity_available']) ?></td>
                        <td><?= htmlspecialchars($stockEntry['quantity_reserved']) ?></td>
                        <td><?= htmlspecialchars($stockEntry['reorder_threshold']) ?></td>
                        <td><?= htmlspecialchars($stockEntry['last_update']) ?></td>
                        <td>
                            <form method="POST" action="/admin/stock/update" class="admin-inline-fields">
                                <input type="hidden" name="id" value="<?= $stockEntry['id'] ?>">
                                <input name="quantity_available" type="number" value="<?= $stockEntry['quantity_available'] ?>" class="admin-small-input"> 
                                <input name="quantity_reserved" type="number" value="<?= $stockEntry['quantity_reserved'] ?>" class="admin-small-input"> 
                                <input name="reorder_threshold" type="number" value="<?= $stockEntry['reorder_threshold'] ?>" class="admin-small-input"> 
                                <button class="btn btn-primary" type="submit">Save</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>
