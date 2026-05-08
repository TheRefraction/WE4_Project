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

<?php include 'partials/footer.php'; ?>