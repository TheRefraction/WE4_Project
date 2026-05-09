<?php include 'partials/header.php'; ?>

    <main class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <h1 class="text-center mb-4 text-pourpre fw-bold">Sign up</h1>

                <?php if (isset($_SESSION['errors'])): ?>
                    <div class="alert alert-danger">
                        <ul class="mb-0 small fw-bold">
                            <?php foreach ($_SESSION['errors'] as $error): ?>
                                <li><?= htmlspecialchars($error) ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                    <?php unset($_SESSION['errors']); ?>
                <?php endif; ?>

                <form method="POST" action="/sign-up" class="bg-white p-4 border rounded shadow-sm">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="first_name" class="form-label fw-semibold">First name</label>
                            <input type="text" id="first_name" name="first_name" class="form-control" placeholder="John" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="last_name" class="form-label fw-semibold">Last name</label>
                            <input type="text" id="last_name" name="last_name" class="form-control" placeholder="Doe" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="phone" class="form-label fw-semibold">Phone number</label>
                        <input type="tel" id="phone" name="phone" class="form-control" placeholder="06 01 02 03 04">
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label fw-semibold">Email address</label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="you@example.com" required>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <label for="password" class="form-label fw-semibold">Password</label>
                            <input type="password" id="password" name="password" class="form-control" placeholder="Create a password" required>
                        </div>
                        <div class="col-md-6">
                            <label for="confirm_password" class="form-label fw-semibold">Confirm password</label>
                            <input type="password" id="confirm_password" name="confirm_password" class="form-control" placeholder="Repeat your password" required>
                        </div>
                    </div>

                    <div class="d-grid mt-3">
                        <button type="submit" class="btn btn-pourpre fw-bold py-2">Create account</button>
                    </div>
                </form>

                <p class="text-center mt-4">
                    Already have an account? <a href="/sign-in" class="text-pourpre fw-bold text-decoration-none">Sign In</a>
                </p>
            </div>
        </div>
    </main>

<?php include 'partials/footer.php'; ?>