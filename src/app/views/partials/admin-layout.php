<body>
    <div class="admin-container" id="admin-container" >
        <div class="sidebar">
            <h1>Efes Industries</h1>
            <nav>
                <ul>
                    <li><a href="/admin">Dashboard</a></li>
                    <li><a href="/admin/accounts">Accounts</a></li>
                    <li><a href="/admin/products">Products</a></li>
                    <li><a href="/admin/suppliers">Suppliers</a></li>
                    <li><a href="/admin/categories">Categories</a></li>
                    <li><a href="/admin/invoices">Invoices</a></li>
                </ul>
            </nav>
        </div>

        <div class="main-content">
            <div class="top-bar">
                <h2><?= isset($title) ? htmlspecialchars($title) : 'Admin Panel' ?></h2>
                <div class="user-menu">
                    <span><?= htmlspecialchars($_SESSION['user_first_name'] . ' ' . $_SESSION['user_last_name']) ?></span>
                    <a href="/sign-out">Sign Out</a></li>
                </div>
            </div>

            <main class="content">
                <?php if (isset($_SESSION['success'])): ?>
                    <div class="alerts">
                        <div class="alert alert-success">
                            <span><?= htmlspecialchars($_SESSION['success']) ?></span>
                            <span class="alert-close" onclick="this.parentElement.style.display='none';">x</span>
                        </div>
                    </div>

                    <?php unset($_SESSION['success']); ?>
                <?php endif; ?>

                <?php if (isset($_SESSION['errors']) && !empty($_SESSION['errors'])): ?>
                    <div class="alerts">
                        <?php foreach ($_SESSION['errors'] as $error): ?>
                            <div class="alert alert-error">
                                <span><?= htmlspecialchars($error) ?></span>
                                <span class="alert-close" onclick="this.parentElement.style.display='none';">x</span>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <?php unset($_SESSION['errors']); ?>
                <?php endif; ?>