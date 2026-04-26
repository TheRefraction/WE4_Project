            </main>
        </div>
    </div>

    <script>
        fetch('/admin-data')
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
                    //document.getElementById('admin-container').style.display = 'block';
                }
            })
            .catch(err => {
                // Redirect if network issue
                window.location.href = '/sign-in';
            });
    </script>
</body>
</html>