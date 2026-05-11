<?php foreach ($products as $product) { ?>
    <?php
    $name = $product->name;

    $clearName = str_replace(['é', 'è'], ['e', 'e'], $name);

    $clearName = strtolower($clearName);

    $clearName = preg_replace('/[^a-z0-9]+/', '-', $clearName);

    $clearName = trim($clearName, '-');

    $imagePath = "/assets/images/" . $clearName . ".png";
    ?>


    <article class="product-item">
        <a href="/product?id=<?= htmlspecialchars($product->id); ?>">
            <img 
                src="<?= htmlspecialchars($imagePath); ?>"
                alt="<?= htmlspecialchars($product->name); ?>"
                onerror="this.onerror=null; this.src='/assets/images/test.jpg';"
            />

            <div class="product-info">
                <h2><?= htmlspecialchars($product->name); ?></h2>
                <p><?= htmlspecialchars($product->price); ?>€</p>
            </div>
        </a>
    </article>
<?php } ?>