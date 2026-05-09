<?php foreach ($products as $product) { ?>
    <?php $imagePath = !empty($product->image) ? $product->image : '/assets/images/test.jpg'; ?>
    <article class="product-item">
        <a href="/product?id=<?= htmlspecialchars($product->id); ?>">
            <img 
                src="<?= htmlspecialchars($imagePath); ?>"
                alt="<?= htmlspecialchars($product->name); ?>"
            />

            <div class="product-info">
                <h2><?= htmlspecialchars($product->name); ?></h2>
                <p><?= htmlspecialchars($product->price); ?>€</p>
            </div>
        </a>
    </article>
<?php } ?>