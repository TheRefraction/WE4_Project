<?php
$userId = null;
if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
}
?>

<nav class="navbar navbar-expand-lg navbar-dark bg-pourpre shadow-sm">
    <div class="container">
        <a class="navbar-brand fw-bold" href="/">EFES KEBAB</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/products">Products list</a>
                </li>

                <?php if ($userId) { ?>
                    <li class="nav-item"><a class="nav-link" href="#">Order</a></li>
                    <li class="nav-item"><a class="nav-link" href="/account">My account</a></li>
                    <li class="nav-item"><a class="nav-link" href="/cart">Cart</a></li>
                    <li class="nav-item"><a class="nav-link" href="/sign-out">Sign out</a></li>
                <?php } else { ?>
                    <li class="nav-item"><a class="nav-link" href="/sign-in">Sign in</a></li>
                    <li class="nav-item"><a class="nav-link" href="/sign-up">Sign up</a></li>
                <?php } ?>
            </ul>
        </div>
    </div>
</nav>
