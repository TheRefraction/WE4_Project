<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div style="margin-bottom: 20px;">
    <a href="/admin" class="btn btn-secondary">Back to Dashboard</a>
</div>

<article>
    <h3>Invoices Management</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($invoices)): ?>
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px;">No invoices found.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($invoices as $invoice): ?>
                    <tr>
                        <td>#<?= htmlspecialchars($invoice['id']) ?></td>
                        <td><?= htmlspecialchars(($invoice['first_name'] ?? 'Unknown') . ' ' . ($invoice['last_name'] ?? '')) ?></td>
                        <td><?= date('M d, Y', strtotime($invoice['date'])) ?></td>
                        <td>$<?= number_format($invoice['total'], 2) ?></td>
                        <td>
                            <span style="background-color: #3498db; color: white; padding: 5px 10px; border-radius: 3px;">
                                <?= htmlspecialchars($invoice['status_name'] ?? 'Unknown') ?>
                            </span>
                        </td>
                        <td>
                            <a href="/admin/invoices/details/<?= $invoice['id'] ?>" class="btn btn-primary" style="padding: 5px 10px; margin: 0;">View</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>