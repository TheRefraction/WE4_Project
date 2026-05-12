<?php include 'partials/header.php'; ?>
<h1>Simulation de paiement</h1>
<h2>Total: <?= htmlspecialchars((string) $total) ?> €</h2>

<form id="payment-form">
    <!-- Nom Complet -->
    <label for="full-name">Nom Complet</label>
    <input type="text" id="full-name" name="customer_name"/>
    
    <!-- Email -->
    <label for="email">Email</label>
    <input type="email" id="email" name="email"/>
    
    <!-- Adresse -->
    <label for="house-number">Numero de maison</label>
    <input type="text" id="house-number" name="house-number"/>
    
    <label for="house-suffix">Suffixe (bis/ter)</label>
    <input type="text" id="house-suffix" name="house-suffix"/>

    <label for="street">Rue</label>
    <input type="text" id="street" name="street"/>

    <label for="street">Ville</label>
    <input type="text" id="city" name="city"/>

    <label for="street">Code Postal</label>
    <input type="text" id="postal-code" name="code-postal"/>

    
    <input style="display: none;" type="text" id="country" name="country" value="France"/>
    <hr>

    <!-- Numéro de carte -->
    <label for="card-number">Numéro de carte</label>
    <input type="text" id="card-number" name="card-number"/>
    
    <!-- CVC -->
    <label for="cvc-number">CVC</label>
    <input type="text" id="cvc-number" name="cvc-number"/>
    
    <!-- Date d'expiration -->
    <label for="expiration-date">Date d'expiration</label>
    <input type="date" id="expiration-date" name="expiration-date"/>

    <!-- Boutons -->
    <button type="submit" onclick="this.form.dataset.status=2" name="pay-success">Simuler succès</button>
    <button type="submit" onclick="this.form.dataset.status=3" name="pay-failure">Simuler échec</button>
</form>
<h3 id="checkout-info"></h3>

<script>

fetch('/account-data')
    .then(response => {
    // Session has been lost
    if (response.status === 401) {
        window.location.href = '/sign-in';
        return;
    }

    return response.json();
})
.then(data => {
if (data && !data.error) {
    document.getElementById("full-name").placeholder = 
        data.first_name +
        " " +
        data.last_name;

    document.getElementById("email").placeholder = data.email
}
})

document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    const checkoutInfo = document.getElementById("checkout-info");

    data.simulate_status = this.dataset.status;
    fetch('/checkout/saveOrder', {
    method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            checkoutInfo.innerText = result.message;
        });
});

</script>
