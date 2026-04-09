<?php
    $userId = null;
    if (isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];
    }
?>

<nav class="navbar">
    <div class="container">
        <ul class="pages-list">
            <li><a href="/">Home</a></li>
            <?php if ($userId) { ?>
                <li><a href="#">Order</a></li>
                <li><a href="/account">My account</a></li>
                <li><a href="/basket">Cart</a></li>
                <li><a href="/sign-out">Sign out</a></li>
            <?php } else { ?>
                <li><a href="/sign-in">Sign in</a></li>
                <li><a href="/sign-up">Sign up</a></li>
            <?php } ?>
        </ul>
    </div>
</nav>