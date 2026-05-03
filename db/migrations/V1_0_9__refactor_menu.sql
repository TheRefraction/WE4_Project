-- V1_0_9__refactor_menu.sql
-- Drops legacy menu_product table now replaced by slot-based composition

-- ROLLBACK:
-- CREATE TABLE menu_product (
-- menu_id INT NOT NULL,
-- product_id INT NOT NULL,
-- PRIMARY KEY (menu_id, product_id),
-- FOREIGN KEY (menu_id) REFERENCES menu(id)
-- ON DELETE CASCADE
-- ON UPDATE CASCADE,
-- FOREIGN KEY (product_id) REFERENCES product(id)
-- ON DELETE CASCADE
-- ON UPDATE CASCADE
-- );

DROP TABLE IF EXISTS menu_product;

ALTER TABLE menu 
DROP COLUMN price_rate;

ALTER TABLE product
ADD COLUMN hidden TINYINT(1) NOT NULL DEFAULT 0;