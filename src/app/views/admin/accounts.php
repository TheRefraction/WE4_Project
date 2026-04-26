<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div style="margin-bottom: 20px;">
    <a href="/admin" class="btn btn-secondary">Back to Dashboard</a>
</div>

<div class="card">
    <h3>Accounts Management</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($accounts)): ?>
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px;">No accounts found.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($accounts as $account): ?>
                    <tr>
                        <td><?= htmlspecialchars($account['id']) ?></td>
                        <td><?= htmlspecialchars($account['first_name'] . ' ' . $account['last_name']) ?></td>
                        <td><?= htmlspecialchars($account['email']) ?></td>
                        <td><?= htmlspecialchars($account['phone'] ?? '-') ?></td>
                        <td><span style="background-color: #3498db; color: white; padding: 5px 10px; border-radius: 3px;"><?= htmlspecialchars($account['role_name'] ?? 'Unknown') ?></span></td>
                        <td><?= date('M d, Y', strtotime($account['date_creation'])) ?></td>
                        <td>
                            <div class="actions">
                                <a href="/admin/accounts/edit/<?= $account['id'] ?>" class="btn btn-primary" style="padding: 5px 10px; margin: 0;">Edit</a>
                                <form method="POST" action="/admin/accounts/delete/<?= $account['id'] ?>" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this account?');">
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