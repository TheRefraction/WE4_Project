<?php include 'partials/header.php'; ?>

    <main class="container py-5">
        <h1 class="text-pourpre mb-4">Mes Factures</h1>

        <table class="table table-bordered">
            <thead>
            <tr>
                <th>N°</th>
                <th>Date</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>

            <! -- TODO : implement model to display all invoices -- >
            <?php //foreach (): ?>
                <tr>
                    <td><! -- id invoice -- ></td>
                    <td><! -- date invoice -- ></td>
                    <td><! -- price total invoice -- ></td>
                </tr>
            <?php //endforeach; ?>
            </tbody>
        </table>
    </main>

<?php include 'partials/footer.php'; ?>