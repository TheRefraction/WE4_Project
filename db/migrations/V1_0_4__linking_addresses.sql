-- V1_0_4__linking_addresses.sql 
-- Link addresses to invoices and suppliers

ALTER TABLE invoice 
ADD COLUMN billing_address_id INT;

ALTER TABLE invoice
ADD CONSTRAINT fk_invoice_billing_address
FOREIGN KEY (billing_address_id) REFERENCES address(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE supplier 
ADD COLUMN supplier_address_id INT;

ALTER TABLE supplier
ADD CONSTRAINT fk_supplier_supplier_address
FOREIGN KEY (supplier_address_id) REFERENCES address(id)
ON DELETE SET NULL
ON UPDATE CASCADE;