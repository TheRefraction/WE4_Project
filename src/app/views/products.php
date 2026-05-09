<?php include 'partials/header.php'; ?>

<main>
    <h1>Commander</h1>

    <div class="sort-filter">
        <input type="text" id="search" placeholder="Rechercher...">
        <select id="sort">
            <option value="">-- Trier --</option>
            <option value="name_asc">Nom A-Z</option>
            <option value="name_desc">Nom Z-A</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
        </select>
    </div>

    <h2>Produits</h2>
    <div class="products">
        <?php include "partials/product-list.php"; ?>
    </div>

    <h2>Menus</h2>
    <div class="menus">
        <div class="menus-grid">
            <?php if (!empty($menus)): ?>
                <?php foreach ($menus as $menu): ?>
                    <div class="menu-card">
                        <h3><?= htmlspecialchars($menu->name) ?></h3>
                        <p><?= htmlspecialchars($menu->description) ?></p>
                        <a href="/menu?id=<?= (int) $menu->id ?>">Voir</a>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No menus available.</p>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php include 'partials/footer.php'; ?>

<script>
    function loadProducts() {
        const search = document.getElementById('search').value;
        const sort = document.getElementById('sort').value;

        fetch('/products/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ search, sort })
        })
        .then(res => res.text())
        .then(html => {
            document.querySelector('.products').innerHTML = html;
        });
    }

    // events
    document.getElementById('search').addEventListener('input', debounce(loadProducts, 300));
    document.getElementById('sort').addEventListener('change', loadProducts);

    // debounce
    function debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }
</script>