<?php include 'partials/header.php'; ?>

<main>
    <h1>Sign in</h1>

    <?php if (isset($_SESSION['errors'])): ?>
        <div>
            <?php foreach ($_SESSION['errors'] as $error): ?>
                <p><?= htmlspecialchars($error) ?></p>
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

    <form method="POST" action="/sign-in">
        <div>
            <label for="email">Email address</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" required>
        </div>

        <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required>
        </div>

        <button type="submit">Sign in</button>
    </form>

    <p>Don't have an account? <a href="/sign-up">Sign Up</a></p>
</main>

<?php include 'partials/footer.php'; ?>
