<?php include 'partials/header.php'; ?>

<main>
    <h1>My account</h1>

    <div id="loading">Loading account information...</div>
    
    <!-- Sensitive information are not displayed until server is sure user is authenticated -->
    <div id="account-content" style="display: none;">
        <div class="account-details">
            <div>
                <label>First name</label>
                <p id="user-first-name"></p>
            </div>
            <div>
                <label>Last name</label>
                <p id="user-last-name"></p>
            </div>
            <div>
                <label>Email</label>
                <p id="user-email"></p>
            </div>
        </div>
    </div>
    <h2>Update account</h2>
    <form action="/update-account" method="POST">
        <div class="account-details">
            <div>
                <label>First name</label>
                <input type="text" name="first_name">
            </div>
            <div>
                <label>Last name</label>
                <input type="text" name="last_name">
            </div>
            <div>
                <label>Phone</label>
                <input type="text" name="phone">
            </div>
            <button type="submit">Update</button>
        </div>
    </form>
</main>

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
                document.getElementById('user-first-name').textContent = data.first_name;
                document.getElementById('user-last-name').textContent = data.last_name;
                document.getElementById('user-email').textContent = data.email;

                document.getElementById('loading').style.display = 'none';
                document.getElementById('account-content').style.display = 'block';
            }
        })
        .catch(err => {
            // Redirect if network issue
            window.location.href = '/sign-in';
        });
</script>

<?php include 'partials/footer.php'; ?>
