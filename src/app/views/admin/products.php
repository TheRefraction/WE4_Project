<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div style="margin-bottom: 20px;">
    <a href="/admin" class="btn btn-secondary">Back to Dashboard</a>
    <a href="/admin/products/create" class="btn btn-success">Create Product</a>
</div>

<article>
    <h3>Products Management</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Supplier</th>
                <th>Categories</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($products)): ?>
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px;">No products found. <a href="/admin/products/create">Create one</a></td>
                </tr>
            <?php else: ?>
                <?php foreach ($products as $product): ?>
                    <tr>
                        <td><?= htmlspecialchars($product['id']) ?></td>
                        <td><?= htmlspecialchars($product['name']) ?></td>
                        <td><?= htmlspecialchars(substr($product['description'], 0, 50)) . (strlen($product['description']) > 50 ? '...' : '') ?></td>
                        <td>$<?= number_format($product['price'], 2) ?></td>
                        <td><?= htmlspecialchars($product['supplier_name'] ?? '-') ?></td>
                        <td><?= htmlspecialchars($product['categories'] ?? '-') ?></td>
                        <td>
                            <div class="actions">
                                <a href="/admin/products/edit/<?= $product['id'] ?>" class="btn btn-primary" style="padding: 5px 10px; margin: 0;">Edit</a>
                                <form method="POST" action="/admin/products/delete/<?= $product['id'] ?>" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this product?');">
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