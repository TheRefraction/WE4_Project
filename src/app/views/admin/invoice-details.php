<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="admin-toolbar">
    <a href="/admin/invoices" class="btn btn-secondary">Back to Invoices</a>
</div>

<article>
    <h3>Invoice #<?= $invoice['id'] ?></h3>

    <div class="admin-summary-grid">
        <div>
            <p><strong>Customer:</strong> <?= htmlspecialchars($invoice['first_name'] . ' ' . $invoice['last_name']) ?></p>
            <p><strong>Email:</strong> <?= htmlspecialchars($invoice['email']) ?></p>
            <p><strong>Date:</strong> <?= date('M d, Y H:i', strtotime($invoice['date'])) ?></p>
        </div>
        <div>
            <p><strong>Status:</strong> <span class="admin-status-badge"><?= htmlspecialchars($invoice['status_name']) ?></span></p>
            <p><strong>Payment Mode:</strong> <?= htmlspecialchars($invoice['payment_mode_name'] ?? '-') ?></p>
            <p><strong>Payment Status:</strong> <?= htmlspecialchars($invoice['payment_status_name'] ?? '-') ?></p>
        </div>
    </div>

    <h4>Invoice Items</h4>
    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($invoiceLines)): ?>
                <tr>
                    <td colspan="4" class="admin-empty-state">No items in this invoice.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($invoiceLines as $line): ?>
                    <tr>
                        <td><?= htmlspecialchars($line['product_name'] ?? 'Unknown') ?></td>
                        <td>$<?= number_format($line['unit_price'], 2) ?></td>
                        <td><?= $line['quantity'] ?></td>
                        <td>$<?= number_format($line['unit_price'] * $line['quantity'], 2) ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>

    <div class="admin-summary-box">
        <div class="admin-actions admin-space-between admin-summary-total">
            <span>Total Amount:</span>
            <span>$<?= number_format($invoice['total'], 2) ?></span>
        </div>
    </div>

    <div class="admin-form-footer">
        <h4>Update Status</h4>
        <form method="POST" action="/admin/invoices/update-status" class="admin-toolbar-inline">
            <input type="hidden" name="id" value="<?= $invoice['id'] ?>">
            <select name="status_id" required>
                <option value="1">Draft</option>
                <option value="2">Pending</option>
                <option value="3">Paid</option>
                <option value="4">Cancelled</option>
            </select>
            <button type="submit" class="btn btn-success">Update Status</button>
        </form>
    </div>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>