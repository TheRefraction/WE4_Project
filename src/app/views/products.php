<?php include 'partials/header.php'; ?>

<main>
    <h1>Product list</h1>
    <!--FIXME: fix category table, to organise products by category (those seen on the menu)-->

    <div class="sort-filter">
        <input type="text" id="search" placeholder="Rechercher...">
        <select id="sort">
            <option value="">-- Trier --</option>
            <option value="name_asc">Nom A-Z</option>
            <option value="name_desc">Nom Z-A</option>
        </select>
    </div>

    <div class="products">
        <?php include "partials/product_list.php"; ?>
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
