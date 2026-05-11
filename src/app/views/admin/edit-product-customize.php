<?php require_once __DIR__ . '/../partials/admin-header.php'; ?>

<div class="toolbar">
    <a href="/admin/products" class="btn btn-secondary">Back to Products</a>
</div>

<article>
    <h3>Customization Slots</h3>
    <form method="POST" action="/admin/products/<?= $product->id ?>/slot/create">
        <div class="form-row">
            <div class="form-group">
                <label>Product</label>
                <span><?= htmlspecialchars($product->name ?? '-') ?></span>
            </div>

            <div class="form-group">
                <label>Category *</label>
                <select name="category_id" required>
                    <?php foreach ($categories as $c): ?>
                        <option value="<?= $c->id ?>"><?= htmlspecialchars($c->name) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label>Min Select *</label>
            <input name="min_select" type="number" min="0" value="0" required/>
        </div>

        <div class="form-group">
            <label>Max Select *</label>
            <input name="max_select" type="number" min="0" value="1" required/>
        </div>

        <div class="form-group">
            <label>Display Order *</label>
            <input name="display_order" type="number" min="0" value="0" required/>
        </div>

        <div class="form-group">
            <button class="btn btn-success" type="submit">Create</button>
        </div>
    </form>
</article>

<article>
    <h3>Product Customizations</h3>
    <?php if (empty($slots)): ?>
        <p>No customization slots defined.</p>
    <?php else: ?> 
        <?php foreach ($slots as $slot): ?>
            <section class="slot-section">
                <h4>
                    <?= htmlspecialchars($slot->name ?? ('Slot #' . $slot->id)) ?>
                    - <?= htmlspecialchars($slot->product_name ?? '-') ?>

                    <span class="actions admin-actions-inline admin-float-right">
                        <a href="/admin/products/edit/<?= $product->id ?>/slot/<?= $slot->id ?>" class="btn btn-primary">Edit</a>

                        <form method="POST" action="/admin/products/<?= $product->id ?>/slot/delete/<?= $slot->id ?>" onsubmit="return deleteConfirmation(this);">
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </span>
                </h4>

                <p>Category: <span class="tag"><?= htmlspecialchars($slot->category_name ?? '-') ?></span>
                | Min: <?= $slot->min_select ?>
                | Max: <?= $slot->max_select ?></p>
                
                <h5>Options</h5>

                <?php $slotOptions = $options[$slot->id] ?? []; ?>
                <?php if (empty($slotOptions)): ?>
                    <p>No options for this slot.</p>
                <?php else: ?>
                    <ul>
                        <?php foreach ($slotOptions as $option): ?>
                            <li><?= htmlspecialchars($option->option_product_name ?? ('Option #' . $option->id)) ?>
                            - Δ <?= number_format($option->price_delta, 2) ?> €
                            <?= $option->is_default ? '(default)' : '' ?></li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </section>
        <?php endforeach; ?>
    <?php endif; ?>
</article>

<?php require_once __DIR__ . '/../partials/admin-footer.php'; ?>