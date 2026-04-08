<?php include 'partials/header.php'; ?>

<?php $account = $_SESSION['account']; ?>
<div>
    <h1>Mon compte</h1>
    <div class="account-details">
        <div>
            <label>Prénom</label>
            <p><?= $account->first_name ?></p>
        </div>
        <div>
            <label>Nom</label>
            <p><?= $account->last_name ?></p>
        </div>
        <div>
            <label>Adresse mail</label>
            <p><?= $account->email ?></p>
        </div>
        <div>
            <label>Téléphone</label>
            <p><?= $account->phone ?></p>
        </div>
        <div>
            <label>Date de création</label>
            <p><?= $account->date_creation ?></p>
        </div>
    </div>
</div>

<?php include 'partials/footer.php'; ?>
