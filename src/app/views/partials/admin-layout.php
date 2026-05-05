<body>
    <main id="admin-container">
        <aside>
            <h1>Efes Industries</h1>
            <nav>
                <ul>
                    <li><a href="/admin">Dashboard</a></li>
                    <li><a href="/admin/accounts">Accounts</a></li>

                    <li><a onclick="toggleSubmenu('products-submenu')" class="submenu-trigger">Products</a></li>
                    <ul id="products-submenu" class="submenu">
                        <li><a href="/admin/products">Products</a></li>
                        <li><a href="/admin/categories">Categories</a></li>
                        <li><a href="/admin/menus">Menus</a></li>
                    </ul>
                    
                    <li><a href="/admin/suppliers">Suppliers</a></li>
                    
                    <!--<li><a href="/admin/invoices">Invoices</a></li>
                    <li><a href="/admin/stock">Stock</a></li>
                    <li><a href="">Addresses</a></li>-->
                </ul>
            </nav>
        </aside>

        <div class="main-content">
            <header>
                <h2><?= isset($title) ? htmlspecialchars($title) : 'Admin Panel' ?></h2>
                <div class="user-menu">
                    <span><?= htmlspecialchars($_SESSION['user_first_name'] . ' ' . $_SESSION['user_last_name']) ?></span>
                    <a href="/admin/account">My Account</a>
                    <a href="/sign-out">Sign Out</a></li>
                </div>
            </header>

            <div class="content">
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