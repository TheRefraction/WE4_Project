-- V1_0_6__updating_product_supplier_fk.sql 
-- Add default value to product supplier_id foreign key, to allow products to be supplied by themselves (NULL)

-- ROLLBACK: ALTER TABLE product MODIFY COLUMN supplier_id INT;
ALTER TABLE product
MODIFY COLUMN supplier_id INT DEFAULT NULL;