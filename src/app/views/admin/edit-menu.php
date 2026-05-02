<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="toolbar">
    <a href="/admin/menus" class="btn btn-secondary">Back to Menus</a>
</div>

<article>
    <h3>Edit Menu</h3>
    <form method="POST" action="/admin/menus/update">
        <input type="hidden" name="id" value="<?= htmlspecialchars($menu['id']) ?>">

        <div class="form-group">
            <label for="name">Menu Name</label>
            <input type="text" id="name" name="name" required value="<?= htmlspecialchars($menu['name']) ?>">
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description"><?= htmlspecialchars($menu['description'] ?? '') ?></textarea>
        </div>

        <div class="toolbar">
            <button type="submit" class="btn btn-success">Save</button>
        </div>
    </form>
</article>

<article>
    <h3>Create Menu Slot</h3>
    <form method="POST" action="/admin/menus/<?= $menu['id'] ?>/slot/create">
        <input type="hidden" name="menu_id" value="<?= htmlspecialchars($menu['id']) ?>">

        <div class="form-group">
            <label for="name">Slot Name</label>
            <input type="text" id="name" name="name" required/>
        </div>

        <div class="form-group">
            <label>Min Select</label>
            <input name="min_select" type="number" min="0" value="0" required>
        </div>

        <div class="form-group">
            <label>Max Select</label>
            <input name="max_select" type="number" min="0" value="1" required>
        </div>

        <div class="form-group">
            <label>Display Order</label>
            <input name="display_order" type="number" min="0" value="0" required>
        </div>

        <div class="toolbar">
            <button class="btn btn-success" type="submit">Create</button>
        </div>
    </form>
</article>

<article>
    <h3>Menu Slots</h3>
    <?php if (empty($slots)): ?>
        <p>No menu slots defined.</p>
    <?php else: ?> 
        <?php foreach ($slots as $slot): ?>
            <section class="slot-section">
                <!-- Slot summary and actions -->
                <h4>
                    <?= htmlspecialchars($slot['name'] ?? ('Slot #' . $slot['id'])) ?>
                    <span class="actions admin-actions-inline admin-float-right">
                        <a href="/admin/menus/edit/<?= $menu['id'] ?>/slot/<?= $slot['id'] ?>" class="btn btn-primary">Edit</a>

                        <form method="POST" action="/admin/menus/<?= $menu['id'] ?>/slot/delete/<?= $slot['id'] ?>" onsubmit="return deleteConfirmation(this);">
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </span>
                </h4>

                <p>Min: <?= $slot['min_select'] ?> | Max: <?= $slot['max_select'] ?></p>

                <h5>Products</h5>

                <?php $slotProducts = $slot['products'] ?? []; ?>
                <?php if (empty($slotProducts)): ?>
                    <p>No products for this slot.</p>
                <?php else: ?>
                    <ul>
                        <?php foreach ($slotProducts as $productOption): ?>
                            <li>
                                <?= htmlspecialchars($productOption['product_name'] ?? ('Product #' . $productOption['product_id'])) ?>
                                - Δ <?= number_format($productOption['price_delta'], 2) ?> €
                                <?= $productOption['is_default'] ? '(default)' : '' ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </section>
        <?php endforeach; ?>
    <?php endif; ?>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>
