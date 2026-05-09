<?php include 'partials/header.php'; ?>

<main>
        <h1><?= $product->name ?></h1>;
        <p>Price: <?= $product->price ?> €</p>;
        <p>Description: <?= $product->description ?></p>;
        <p>Category: <?= $product->category_name ?></p>;

        <?php
        if($product->supplier_name && $product->supplier_phone && $product->supplier_email) {

            ?>
            <p>Supplier: <?= $product->supplier_name ?>
             - <?= $product->supplier_email ?>
             - <?= $product->supplier_phone ?>
            </p>;
            <?php
        }?>

        <form method='POST' action='/cart'>
            <input type='hidden' name='product_id' value='<?= $product->id ?>'>
            <input type='hidden' name='product_name' value='<?= $product->name ?>'>
            <input type='hidden' name='product_price' value='<?= $product->price ?>'>
            <input type="hidden" name="is_from_cart" value='False'>
            <button type='submit' name='action' value='add'>Add to Cart</button>
            <button type='submit' name='action' value='remove' id='remove-btn'>Remove from Cart</button>
            <button type='button' id='customize-btn' onclick='openPopup()'>Customize</button>
        </form>

        <div id='popup-overlay' style='display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;'>
            <div id='popup' style='background:white; width:500px; max-height:80vh; overflow-y:auto; margin:80px auto; padding:24px; border-radius:8px;'>
                <h2>Customize your product</h2>
                <div id='slots-container'></div>

                <div style='margin-top:20px; display:flex; justify-content:flex-end; gap:10px;'>
                    <button type='button' id='ok-btn' onclick='confirmCustomization()' disabled style='opacity:0.5; cursor:not-allowed;'>OK</button>
                    <button type='button' onclick='closePopup()'>Cancel</button>
                </div>
            </div>
        </div>

    <script>
        const slots = <?= json_encode($slots) ?>;

        // Tracks selections per slot: { slotId: [{ optionProductId, priceDelta }, ...] }
        const selections = {};

        function openPopup() {
            document.getElementById('popup-overlay').style.display = 'block';
            const container = document.getElementById('slots-container');
            container.innerHTML = '';

            slots.forEach(slot => {
                selections[slot.id] = [];

                const slotDiv = document.createElement('div');
                slotDiv.style.cssText = 'border:1px solid #ccc; border-radius:6px; padding:16px; margin-bottom:16px;';

                const title = document.createElement('h3');
                title.textContent = slot.category_name + ' (select ' + slot.min_select + '–' + slot.max_select + ')';
                slotDiv.appendChild(title);

                const selectionsDiv = document.createElement('div');
                selectionsDiv.id = 'selections-' + slot.id;
                slotDiv.appendChild(selectionsDiv);

                // Add first selection row by default
                addSelectionRow(slot, selectionsDiv);

                // Add button (only if max_select > 1)
                if (slot.max_select > 1) {
                    const addBtn = document.createElement('button');
                    addBtn.type = 'button';
                    addBtn.textContent = '+ Add option';
                    addBtn.id = 'add-btn-' + slot.id;
                    addBtn.style.marginTop = '8px';
                    addBtn.onclick = () => {
                        const currentCount = selectionsDiv.querySelectorAll('select').length;
                        if (currentCount < slot.max_select) {
                            addSelectionRow(slot, selectionsDiv);
                        }
                        if (currentCount + 1 >= slot.max_select) {
                            addBtn.disabled = true;
                            addBtn.style.opacity = '0.8';
                        }
                    };
                    slotDiv.appendChild(addBtn);
                }

                container.appendChild(slotDiv);
            });

            updateOkButton();
        }

        function addSelectionRow(slot, container) {
            const rowIndex = container.querySelectorAll('select').length; // 0 = first (free)

            const row = document.createElement('div');
            row.style.cssText = 'display:flex; align-items:center; gap:8px; margin-top:8px;';

            const select = document.createElement('select');
            select.dataset.slotId = slot.id;
            select.dataset.rowIndex = rowIndex;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Select an option --';
            select.appendChild(defaultOption);

            slot.options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.option_product_id;
                o.dataset.priceDelta = opt.price_delta;
                o.dataset.isDefault = opt.is_default;

                const isFree = rowIndex === 0; // First selection is always free
                const priceLabel = (!isFree && opt.price_delta > 0)
                    ? ' (+' + opt.price_delta + ' €)'
                    : ' (free)';
                o.textContent = opt.option_product_name + priceLabel;

                // Pre-select default option if one exists
                if (opt.is_default) select.value = opt.option_product_id;

                select.appendChild(o);
            });

            select.addEventListener('change', updateOkButton);

            const priceTag = document.createElement('span');
            priceTag.id = 'price-tag-' + slot.id + '-' + rowIndex;
            priceTag.style.color = 'gray';
            priceTag.textContent = '';

            select.addEventListener('change', () => {
                // Recompute price labels for all rows in this slot
                const allRows = container.querySelectorAll('select');
                let freeUsed = false;
                allRows.forEach((s) => {
                    const rowIdx = parseInt(s.dataset.rowIndex);
                    const priceTag = document.getElementById('price-tag-' + slot.id + '-' + rowIdx);
                    if (s.value !== '' && !freeUsed) {
                        freeUsed = true;
                        priceTag.textContent = '(free)';
                    } else if (s.value !== '') {
                        const delta = parseFloat(s.options[s.selectedIndex].dataset.priceDelta || 0);
                        priceTag.textContent = delta > 0 ? '+' + delta + ' €' : 'free';
                    } else {
                        priceTag.textContent = '';
                    }
                });
                updateOkButton();
            });

            row.appendChild(select);
            row.appendChild(priceTag);
            container.appendChild(row);
        }

        function updateOkButton() {
            // OK is clickable only if every slot has at least min_select selections made
            const allValid = slots.every(slot => {
                const container = document.getElementById('selections-' + slot.id);
                if (!container) return false;
                const selects = container.querySelectorAll('select');
                const filledCount = Array.from(selects).filter(s => s.value !== '').length;
                return filledCount >= slot.min_select;
            });

            const okBtn = document.getElementById('ok-btn');
            okBtn.disabled = !allValid;
            okBtn.style.opacity = allValid ? '1' : '0.5';
            okBtn.style.cursor = allValid ? 'pointer' : 'not-allowed';
        }

        function closePopup() {
            document.getElementById('popup-overlay').style.display = 'none';
        }

        function confirmCustomization() {
            const result = slots.map(slot => {
                const container = document.getElementById('selections-' + slot.id);
                const selects = container.querySelectorAll('select');
                let freeUsed = false;
                return {
                    slotId: slot.id,
                    categoryName: slot.category_name,
                    choices: Array.from(selects)
                        .filter(s => s.value !== '')
                        .map((s) => {
                            const isFree = !freeUsed;
                            freeUsed = true;
                            const delta = isFree ? 0 : parseFloat(s.options[s.selectedIndex].dataset.priceDelta || 0);
                            return {
                                optionProductId: s.value,
                                name: s.options[s.selectedIndex].text,
                                priceDelta: delta,
                                isFree: isFree
                            };
                        })
                };
            });

            fetch('/cart/customize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: <?= $product->id ?>,
                    customization: result
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        closePopup();
                        window.location.href = '/products';
                    } else {
                        alert('Error saving customization: ' + (data.message || 'unknown error'));
                    }
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                    alert('Fetch operation failed. Possible network issue.');
                });
        }

    </script>


    <script>
        const inCart = <?= isset($_SESSION['cart'][$product->id]) ? 'true' : 'false' ?>;
        const removeBtn = document.getElementById('remove-btn');
        const customizeBtn = document.getElementById('customize-btn');
        if (!inCart) {
            removeBtn.disabled = true;
            removeBtn.style.opacity = '0.8';
            removeBtn.style.cursor = 'not-allowed';

            customizeBtn.disabled = true;
            customizeBtn.style.opacity = '0.0';
            customizeBtn.style.cursor = 'not-allowed';
        }
    </script>
</main>

<?php include 'partials/footer.php'; ?>
