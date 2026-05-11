<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="toolbar">
    <a href="/admin" class="btn btn-secondary">Back to Dashboard</a>
</div>

<article>
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
                <th>Last Login</th>
                <th>Actions</th>
            </tr>
        </thead>

        <tbody>
            <?php if (empty($accounts)): ?>
                <tr>
                    <td colspan="8" class="empty-table">If you see this, I messed up somehow @o@</td>
                </tr>
            <?php else: ?>
                <?php foreach ($accounts as $account): ?>
                    <tr>
                        <td><?= htmlspecialchars($account->id) ?></td>
                        <td><?= htmlspecialchars($account->first_name . ' ' . $account->last_name) ?></td>
                        <td><?= htmlspecialchars($account->email) ?></td>
                        <td><?= htmlspecialchars($account->phone ?? '-') ?></td>
                        <td><span class="tag"><?= htmlspecialchars($account->role_name ?? 'Unknown') ?></span></td>
                        <td><?= date('M d, Y', strtotime($account->date_creation)) ?></td>
                        <td><?= date('M d, Y', strtotime($account->last_login)) ?></td>
                        <td>
                            <?php if ($account->id === $_SESSION['user_id']): ?>
                                <span style="color: #e74c3c; font-weight: bold;">(You)</span>
                            <?php else: ?>
                                <div class="actions">
                                    <a href="/admin/accounts/edit/<?= $account->id ?>" class="btn btn-primary">Edit</a>

                                    <form method="POST" action="/admin/accounts/delete/<?= $account->id ?>" onsubmit="return deleteConfirmation(this);">
                                        <button type="submit" class="btn btn-danger">Delete</button>
                                    </form>
                                </div>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>