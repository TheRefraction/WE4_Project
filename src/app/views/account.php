<?php include 'partials/header.php'; ?>

<main class="container py-5">
    <h1 class="text-pourpre" >My account</h1>

    <div id="loading">Loading account information...</div>
    
    <!-- Sensitive information are not displayed until server is sure user is authenticated -->
    <?php if (isset($_SESSION['errors'])): ?>
        <div class="alert alert-danger shadow-sm">
            <?php foreach ($_SESSION['errors'] as $error): ?>
                <p class="mb-0 small fw-bold"><?= htmlspecialchars($error) ?></p>
            <?php endforeach; ?>
        </div>
        <?php unset($_SESSION['errors']); ?>
    <?php endif; ?>

    <?php if (isset($_SESSION['success'])): ?>
        <div class="alert alert-success shadow-sm">
            <p><?= htmlspecialchars($_SESSION['success']) ?></p>
        </div>
        <?php unset($_SESSION['success']); ?>
    <?php endif; ?>
    <div id="account-content" style="display: none;" class="card shadow-sm p-4 mb-4">
        <div class="account-details row">
            <div class="col-md-4">
                <label class="fw-bold">First name</label>
                <p id="user-first-name" class="border-bottom pb-1"></p>
            </div>
            <div class="col-md-4">
                <label class="fw-bold">Last name</label>
                <p id="user-last-name" class="border-bottom pb-1"></p>
            </div>
            <div class="col-md-4">
                <label class="fw-bold">Email</label>
                <p id="user-email" class="border-bottom pb-1"></p>
            </div>
        </div>
    </div>

    <h2 class="text-pourpre border-bottom pb-2 mb-3">Update account</h2>
    <form action="/update-account" method="POST" class="card p-4 shadow-sm">
        <div class="account-details row g-3">
            <div class="col-md-4">
                <label class="form-label">First name</label>
                <input type="text" name="first_name" class="form-control"/>
            </div>
            <div class="col-md-4">
                <label class="form-label">Last name</label>
                <input type="text" name="last_name" class="form-control"/>
            </div>
            <div class="col-md-4">
                <label class="form-label">Phone</label>
                <input type="text" name="phone" class="form-control"/>
            </div>
        </div>
        <div class="account-details row g-3">
            <div class="col-md-4">
                <label class="form-label">New password</label>
                <input type="password" name="new_password" class="form-control"/>
            </div>
            <div class="col-md-4">
                <label class="form-label">Confirm new password</label>
                <input type="password" name="confirm_new_password" class="form-control"/>
            </div>
            <div class="col-md-4">
                <label class="form-label">Actual password</label>
                <input type="password" name="actual_password" class="form-control"/>
            </div>
            <div class="col-12 mt-4">
                <button type="submit" class="btn btn-pourpre text-white px-4">Update</button>
            </div>
        </div>
    </form>
</main>

<!-- This may be deprecated -->
<script>
    fetch('/account-data')
        .then(response => {
            // Session has been lost
            if (response.status === 401) {
                window.location.href = '/sign-in';
                return;
            }

            return response.json();
        })
        .then(data => {
            if (data && !data.error) {
                document.getElementById('user-first-name').textContent = data.first_name;
                document.getElementById('user-last-name').textContent = data.last_name;
                document.getElementById('user-email').textContent = data.email;

                document.getElementById('loading').style.display = 'none';
                document.getElementById('account-content').style.display = 'block';
            }
        })
        .catch(err => {
            // Redirect if network issue
            window.location.href = '/sign-in';
        });
</script>

<?php include 'partials/footer.php'; ?>
