<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="stats-grid">
    <div class="stat-card">
        <h3>Total Accounts</h3>
        <div class="value"><?= $stats['total_accounts'] ?></div>
    </div>
    <div class="stat-card">
        <h3>Total Products</h3>
        <div class="value"><?= $stats['total_products'] ?></div>
    </div>
    <div class="stat-card">
        <h3>Total Invoices</h3>
        <div class="value"><?= $stats['total_invoices'] ?></div>
    </div>
    <div class="stat-card">
        <h3>Total Revenue</h3>
        <div class="value">$<?= number_format($stats['total_revenue'], 2) ?></div>
    </div>
    <div class="stat-card">
        <h3>Total Suppliers</h3>
        <div class="value"><?= $stats['total_suppliers'] ?></div>
    </div>
    <div class="stat-card">
        <h3>Low Stock Items</h3>
        <div class="value"><?= $stats['low_stock_count'] ?></div>
    </div>
</div>

<article>
    <h3>Quick Access</h3>
    <p>Use the navigation menu on the left to manage the database.</p>
    <div style="margin-top: 20px;">
        <a href="/admin/accounts" class="btn btn-primary">Manage Accounts</a>
        <a href="/admin/products" class="btn btn-primary">Manage Products</a>
        <a href="/admin/suppliers" class="btn btn-primary">Manage Suppliers</a>
        <!--<a href="/admin/invoices" class="btn btn-primary">View Invoices</a>-->
        <a href="/admin/categories" class="btn btn-primary">Manage Categories</a>
    </div>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>