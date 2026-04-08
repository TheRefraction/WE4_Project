<?php
require __DIR__ . '/../../models/account.php';

if (!isset($_SESSION['account'])) {
    $account = null;
} else {
    $account = $_SESSION['account'];
}
?>

<nav class="navbar">
    <div class="container">
        <ul class="pages-list">
            <li><a href="/">Home</a></li>
            <?php if ($account) { ?>
                <li><a href="#">Commander</a></li>
                <li><a href="/account">Mon compte</a></li>
                <li><a href="/basket">Mon panier</a></li>
            <?php } else { ?>
                <li><a href="/sign-in">Sign-in</a></li>
                <li><a href="/sign-up">Sign-up</a></li>
            <?php } ?>
        </ul>
    </div>
</nav>