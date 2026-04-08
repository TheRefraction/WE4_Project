<?php include 'partials/header.php'; ?>
<div>
    <h1>Sign in</h1>
    <form action="../controllers/sign-in.php" method="post">
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
</div>
<?php include 'partials/footer.php'; ?>
