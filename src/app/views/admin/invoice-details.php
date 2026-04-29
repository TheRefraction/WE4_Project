<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div style="margin-bottom: 20px;">
    <a href="/admin/invoices" class="btn btn-secondary">Back to Invoices</a>
</div>

<article>
    <h3>Invoice #<?= $invoice['id'] ?></h3>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div>
            <p><strong>Customer:</strong> <?= htmlspecialchars($invoice['first_name'] . ' ' . $invoice['last_name']) ?></p>
            <p><strong>Email:</strong> <?= htmlspecialchars($invoice['email']) ?></p>
            <p><strong>Date:</strong> <?= date('M d, Y H:i', strtotime($invoice['date'])) ?></p>
        </div>
        <div>
            <p><strong>Status:</strong> <span style="background-color: #3498db; color: white; padding: 5px 10px; border-radius: 3px;"><?= htmlspecialchars($invoice['status_name']) ?></span></p>
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
                    <td colspan="4" style="text-align: center; padding: 20px;">No items in this invoice.</td>
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

    <div style="margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
            <span>Total Amount:</span>
            <span>$<?= number_format($invoice['total'], 2) ?></span>
        </div>
    </div>

    <div style="margin-top: 20px;">
        <h4>Update Status</h4>
        <form method="POST" action="/admin/invoices/update-status" style="display: flex; gap: 10px;">
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