-- V1_0_11__unique_con_slot.sql

-- ROLLBACK:
-- ALTER TABLE product_customization_slot_option DROP INDEX uc_product_customization_slot_option;
ALTER TABLE product_customization_slot_option
ADD CONSTRAINT uc_product_customization_slot_option 
UNIQUE (product_customization_slot_id, option_product_id);