<?php include 'partials/header.php'; ?>

<h1>Your Cart</h1>
<ul>
    <?php foreach ($cart as $item): ?>
        <li>
            <?php echo $item['name']; ?>
            x <?php echo $item['quantity']; ?>,
            <?php echo $item['price']; ?> €
        </li>
    <?php endforeach; ?>
</ul>
<p>Total: <?php echo $total; ?> €</p>