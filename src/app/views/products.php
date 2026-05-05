<?php include 'partials/header.php'; ?>

<main>
    <h1>Product list</h1>
    <!--FIXME: fix category table, to organise products by category (those seen on the menu)-->

    <div>
        <?php foreach ($products as $product) { ?>
            <?php $imagePath = !empty($product->image) ? $product->image : '/assets/images/test.jpg'; ?>
            <article>
                <a href="/product?id=<?php echo htmlspecialchars($product->id); ?>">
                    <img 
                        src="<?php echo htmlspecialchars($imagePath); ?>"
                        alt="<?php echo htmlspecialchars($product->name); ?>"
                    >

                    <div>
                        <h2><?php echo htmlspecialchars($product->name); ?></h2>
                        <p><?php echo htmlspecialchars($product->price); ?>€</p>
                    </div>
                </a>
            </article>
        <?php } ?>
    </div>
</main>

<?php include 'partials/footer.php'; ?>