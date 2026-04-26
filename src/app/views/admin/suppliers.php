<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div style="margin-bottom: 20px;">
    <a href="/admin" class="btn btn-secondary">Back to Dashboard</a>
    <a href="/admin/suppliers/create" class="btn btn-success">Create Supplier</a>
</div>

<div class="card">
    <h3>Suppliers Management</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Products</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($suppliers)): ?>
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px;">No suppliers found. <a href="/admin/suppliers/create">Create one</a></td>
                </tr>
            <?php else: ?>
                <?php foreach ($suppliers as $supplier): ?>
                    <tr>
                        <td><?= htmlspecialchars($supplier['id']) ?></td>
                        <td><?= htmlspecialchars($supplier['name']) ?></td>
                        <td><?= htmlspecialchars($supplier['email'] ?? '-') ?></td>
                        <td><?= htmlspecialchars($supplier['phone'] ?? '-') ?></td>
                        <td><?= $supplier['product_count'] ?></td>
                        <td>
                            <div class="actions">
                                <a href="/admin/suppliers/edit/<?= $supplier['id'] ?>" class="btn btn-primary" style="padding: 5px 10px; margin: 0;">Edit</a>
                                <form method="POST" action="/admin/suppliers/delete/<?= $supplier['id'] ?>" style="display: inline;" onsubmit="return confirm('Are you sure? This will remove the supplier from products.');">
                                    <button type="submit" class="btn btn-danger" style="padding: 5px 10px; margin: 0;">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>