-- V2_0_3__adding_admin.sql

INSERT INTO account (first_name, last_name, email, password_hash, role, phone)
VALUES ('Admin', 'Admin', 'admin@test.com', '$2b$10$e.CGNoC2nJ4cyiHfkqwAbez9b166sURtLFccIbEQspQhQrUxEtrme', 'admin', '0011223344'); -- 123456 for password