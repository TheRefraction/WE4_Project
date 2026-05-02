<?php include 'partials/header.php'; ?>

<main>
    <h1>Sign up</h1>

    <!-- Print errors if any have been made during the POST sign up process -->
    <?php if (isset($_SESSION['errors'])): ?>
        <div>
            <?php foreach ($_SESSION['errors'] as $error): ?>
                <p><?= htmlspecialchars($error) ?></p>
            <?php endforeach; ?>
        </div>

        <?php unset($_SESSION['errors']); ?>
    <?php endif; ?>

    <form method="POST" action="/sign-up">
        <div>
            <label for="first_name">First name</label>
            <input type="text" id="first_name" name="first_name" placeholder="John" required/>
        </div>

        <div>
            <label for="last_name">Last name</label>
            <input type="text" id="last_name" name="last_name" placeholder="Doe" required/>
        </div>

        <div>
            <!-- TODO: Add country prefix ? auto spacing ? -->
            <label for="phone">Phone number</label>
            <input type="number" id="phone" name="phone">
        </div>

        <div>
            <label for="email">Email address</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" required/>
        </div>

        <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Create a password" required>
        </div>

        <div>
            <label for="confirm_password">Confirm password</label>
            <input type="password" id="confirm_password" name="confirm_password" placeholder="Repeat your password" required/>
        </div>

        <button type="submit">Create account</button>
    </form>

    <p>Already have an account? <a href="/sign-in">Sign In</a></p>
</main>

<?php include 'partials/footer.php'; ?>