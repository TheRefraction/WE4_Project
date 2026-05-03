<?php include 'partials/header.php'; ?>

    <main class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <h1 class="text-center mb-4 text-pourpre fw-bold">Sign in</h1>

                <?php if (isset($_SESSION['errors'])): ?>
                    <div class="alert alert-danger shadow-sm">
                        <?php foreach ($_SESSION['errors'] as $error): ?>
                            <p class="mb-0 small fw-bold"><?= htmlspecialchars($error) ?></p>
                        <?php endforeach; ?>
                    </div>
                    <?php unset($_SESSION['errors']); ?>
                <?php endif; ?>

                <?php if (isset($_SESSION['success'])): ?>
                    <div>
                        <p><?= htmlspecialchars($_SESSION['success']) ?></p>
                    </div>
                    <?php unset($_SESSION['success']); ?>
                <?php endif; ?>

                <form method="POST" action="/sign-in" class="bg-white p-4 border rounded shadow-sm">
                    <div class="mb-3">
                        <label for="email" class="form-label fw-semibold">Email address</label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="you@example.com" required>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label fw-semibold">Password</label>
                        <input type="password" id="password" name="password" class="form-control" placeholder="Enter your password" required>
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-pourpre fw-bold py-2">Sign in</button>
                    </div>
                </form>

                <p class="text-center mt-4">
                    Don't have an account? <a href="/sign-up" class="text-pourpre fw-bold text-decoration-none">Sign Up</a>
                </p>
            </div>
        </div>
    </main>

<?php include 'partials/footer.php'; ?>