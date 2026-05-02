<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="toolbar">
    <a href="/admin/accounts" class="btn btn-secondary">Back to Accounts</a>
</div>

<article>
    <h3>Edit Account</h3>
    <form method="POST" action="/admin/accounts/update">
        <input type="hidden" name="id" value="<?= $account['id'] ?>">
        
        <div class="form-row">
            <div class="form-group">
                <label for="first_name">First Name</label>
                <input type="text" id="first_name" name="first_name" value="<?= htmlspecialchars($account['first_name']) ?>" required>
            </div>
            <div class="form-group">
                <label for="last_name">Last Name</label>
                <input type="text" id="last_name" name="last_name" value="<?= htmlspecialchars($account['last_name']) ?>" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="<?= htmlspecialchars($account['email']) ?>" required>
            </div>
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone" value="<?= htmlspecialchars($account['phone'] ?? '') ?>">
            </div>
        </div>

        <div class="form-group">
            <label for="role_id">Role</label>
            <select id="role_id" name="role_id" required>
                <?php foreach ($roles as $role): ?>
                    <option value="<?= $role['id'] ?>" <?= $role['id'] == $account['role_id'] ? 'selected' : '' ?>>
                        <?= htmlspecialchars($role['name']) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="toolbar">
            <button type="submit" class="btn btn-success">Update Account</button>
            <a href="/admin/accounts" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>