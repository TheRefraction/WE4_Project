-- V1_0_1__enum_values_insertion.sql 
-- Populates the DB with simple values for tables payment_mode,
-- payment_status, role and invoice_status

-- ROLLBACK: DELETE FROM table_name WHERE attrib IN (list_of_values);
INSERT INTO payment_mode (name)
VALUES 
    ('unknown'),
    ('credit_card'),
	('bank_note'),
	('cash'),
	('meal_voucher'),
	('paypal')
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO payment_status (name) 
VALUES 
    ('pending'),
    ('paid'),
    ('failed'),
	('refunded')
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO role (name)
VALUES 
    ('client'),
    ('supplier'),
	('admin')
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO invoice_status (name)
VALUES 
    ('draft'),
    ('pending'),
    ('paid'),
	('cancelled')
ON DUPLICATE KEY UPDATE name = name;