<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div style="margin-bottom: 20px;">
    <a href="/admin/suppliers" class="btn btn-secondary">Back to Suppliers</a>
</div>

<div class="card">
    <h3>Create Supplier</h3>
    <form method="POST" action="/admin/suppliers/create">
        <div class="form-group">
            <label for="name">Supplier Name *</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email">
            </div>
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone">
            </div>
        </div>

        <div style="margin-top: 20px;">
            <button type="submit" class="btn btn-success">Create Supplier</button>
            <a href="/admin/suppliers" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>