-- V1_0_8__invoice_line_customization_snapshot.sql
-- Stores chosen options/menu items on invoice lines (historized snapshot)

-- ROLLBACK:
-- DROP TABLE IF EXISTS invoice_line_menu_item;
-- ALTER TABLE invoice_line DROP FOREIGN KEY fk_invoice_line_menu;
-- ALTER TABLE invoice_line DROP COLUMN menu_id;

ALTER TABLE invoice_line
ADD COLUMN menu_id INT DEFAULT NULL;

ALTER TABLE invoice_line
ADD CONSTRAINT fk_invoice_line_menu
FOREIGN KEY (menu_id) REFERENCES menu(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE TABLE invoice_line_menu_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_line_id INT NOT NULL,
    product_id INT DEFAULT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    unit_price_delta DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (invoice_line_id) REFERENCES invoice_line(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE INDEX idx_invoice_line_menu ON invoice_line(menu_id);
CREATE INDEX idx_invoice_line_menu_item_line ON invoice_line_menu_item(invoice_line_id);