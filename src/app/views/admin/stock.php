<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div style="margin-bottom: 20px;">
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
                    <td colspan="7" style="text-align: center; padding: 20px;">No stock records found.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($stocks as $s): ?>
                    <tr>
                        <td><?= htmlspecialchars($s['id']) ?></td>
                        <td><?= htmlspecialchars($s['product_name'] ?? '-') ?></td>
                        <td><?= htmlspecialchars($s['quantity_available']) ?></td>
                        <td><?= htmlspecialchars($s['quantity_reserved']) ?></td>
                        <td><?= htmlspecialchars($s['reorder_threshold']) ?></td>
                        <td><?= htmlspecialchars($s['last_update']) ?></td>
                        <td>
                            <form method="POST" action="/admin/stock/update" style="display:inline-block">
                                <input type="hidden" name="id" value="<?= $s['id'] ?>">
                                <input name="quantity_available" type="number" value="<?= $s['quantity_available'] ?>" style="width:80px"> 
                                <input name="quantity_reserved" type="number" value="<?= $s['quantity_reserved'] ?>" style="width:80px"> 
                                <input name="reorder_threshold" type="number" value="<?= $s['reorder_threshold'] ?>" style="width:80px"> 
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
