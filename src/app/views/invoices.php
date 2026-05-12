<?php include 'partials/header.php'; ?>

<main class="container py-5">
    <h1 class="text-pourpre mb-4">Mes Factures</h1>

    <table class="table table-bordered">
        <thead>
        <tr>
            <th>N° Facture</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Total</th>
        </tr>
        </thead>
        <tbody>

        <?php foreach ($invoices as $invoice): ?>
            <tr>
                <td>
                    <?= $invoice->id ?>
                </td>
                <td>
                    <? echo date('d/m/Y', strtotime($invoice->date)) ?>
                </td>
                <td>
                    <?php echo htmlspecialchars(ucfirst($invoice->status_name)); ?>
                </td>
                <td>
                    <?php echo $invoice->total ?>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</main>

<script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js"></script>
<script>
(function () {
    function formatCurrency(value) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(Number(value || 0));
    }

    async function fetchInvoiceData(invoiceId) {
        const response = await fetch('/invoices/' + invoiceId + '/data', {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            let message = 'Erreur lors du chargement de la facture';
            try {
                const data = await response.json();
                if (data && data.error) message = data.error;
            } catch (e) {}
            throw new Error(message);
        }

        return response.json();
    }

    function buildDescription(line) {
        const parts = [];

        if (line.product_name) {
            parts.push('Produit: ' + line.product_name);
        }

        if (line.menu_name) {
            parts.push('Menu: ' + line.menu_name);
        }

        if (Array.isArray(line.menu_items) && line.menu_items.length > 0) {
            parts.push('Articles du menu:');
            line.menu_items.forEach(function (item) {
                const delta = Number(item.unit_price_delta || 0);
                const deltaText = delta !== 0 ? ' (delta ' + formatCurrency(delta) + ')' : '';
                parts.push('- ' + (item.product_name || 'Article') + ' x' + item.quantity + deltaText);
            });
        }

        return parts.join('\n');
    }

    function buildOptions(line) {
        if (!Array.isArray(line.options) || line.options.length === 0) {
            return '-';
        }

        return line.options.map(function (opt) {
            return (opt.option_name || 'Option') +
                ' x' + opt.quantity +
                ' (' + formatCurrency(opt.unit_price_delta) + ')';
        }).join('\n');
    }

    function buildLineTotal(line) {
        const qty = Number(line.quantity || 0);
        const unit = Number(line.unit_price || 0);
        let optionsTotal = 0;

        if (Array.isArray(line.options)) {
            line.options.forEach(function (opt) {
                optionsTotal += Number(opt.unit_price_delta || 0) * Number(opt.quantity || 0);
            });
        }

        return (unit + optionsTotal) * qty;
    }

    async function generateInvoicePdf(invoiceId) {
        const invoice = await fetchInvoiceData(invoiceId);

        const jsPDF = window.jspdf && window.jspdf.jsPDF;
        if (!jsPDF) {
            throw new Error('jsPDF non chargé');
        }

        const doc = new jsPDF({ unit: 'mm', format: 'a4' });

        doc.setFontSize(16);
        doc.text('Facture #' + invoice.id, 14, 16);

        doc.setFontSize(11);
        doc.text('Date : ' + new Date(invoice.date).toLocaleDateString('fr-FR'), 14, 24);
        doc.text('Statut : ' + (invoice.status_name || '-'), 14, 30);
        doc.text('Paiement : ' + (invoice.payment_mode_name || '-'), 14, 36);

        const rows = (invoice.lines || []).map(function (line) {
            return [
                buildDescription(line),
                String(line.quantity || 0),
                formatCurrency(line.unit_price || 0),
                buildOptions(line),
                formatCurrency(buildLineTotal(line))
            ];
        });

        doc.autoTable({
            startY: 42,
            head: [['Désignation', 'Qté', 'PU', 'Options', 'Total ligne']],
            body: rows,
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: [33, 37, 41] },
            columnStyles: {
                0: { cellWidth: 68 },
                1: { cellWidth: 14, halign: 'right' },
                2: { cellWidth: 24, halign: 'right' },
                3: { cellWidth: 48 },
                4: { cellWidth: 24, halign: 'right' }
            }
        });

        const y = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text('Total facture : ' + formatCurrency(invoice.total || 0), 14, y);

        doc.save('facture-' + invoice.id + '.pdf');
    }

    function init() {
        const buttons = document.querySelectorAll('.js-download-invoice');

        buttons.forEach(function (button) {
            button.addEventListener('click', async function () {
                const originalText = button.textContent;
                button.disabled = true;
                button.textContent = 'Génération...';

                try {
                    const invoiceId = button.getAttribute('data-invoice-id');
                    await generateInvoicePdf(invoiceId);
                } catch (err) {
                    alert(err.message || 'Impossible de générer le PDF');
                } finally {
                    button.disabled = false;
                    button.textContent = originalText;
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
</script>

<?php include 'partials/footer.php'; ?>