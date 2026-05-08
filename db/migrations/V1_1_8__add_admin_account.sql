-- V1_1_8__add_admin_account.sql

INSERT INTO account(first_name, last_name, email, password, role_id)
VALUES ('Admin', 'User', 'admin@test.com', '$2y$10$7nsPO8hIztyWLXwn5S/Q2.y07k2.pXcsjmYrlWngSyNLjwBIZu2X.', 3); -- Password is "123456"