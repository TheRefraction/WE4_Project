                </div>
            </div>
        </main>

    <script>
        fetch('/admin/access')
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
                    document.getElementById('admin-container').style.display = 'flex';
                }
            })
            .catch(err => {
                // Redirect if network issue
                window.location.href = '/sign-in';
            });

        function toggleSubmenu(id) {
            const submenu = document.getElementById(id);
            const trigger = document.querySelector(`.submenu-trigger[onclick="toggleSubmenu('${id}')"]`);

            if (!submenu) return;

            submenu.classList.toggle('active');
            if (trigger) {
                trigger.classList.toggle('active');
            }

            // Save the state to localStorage
            const isActive = submenu.classList.contains('active');
            localStorage.setItem(id, isActive);
        }

        function restoreSubmenuStates(id) {
            const submenu = document.getElementById(id);
            const trigger = document.querySelector(`.submenu-trigger[onclick="toggleSubmenu('${id}')"]`);

            if (submenu) {
                const isActive = localStorage.getItem(id) === 'true';
                if (isActive) {
                    submenu.classList.add('active');
                    if (trigger) {
                        trigger.classList.add('active');
                    }
                }
            }
        }

        // Call this on page load
        document.addEventListener('DOMContentLoaded', () => {
            restoreSubmenuStates('products-submenu');
        });
    </script>
</body>
</html>