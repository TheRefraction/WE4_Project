-- V1_0_10__product_customization.sql
-- Adds product customization slots/options (e.g. sauce, meat)
-- and snapshot storage for selected product customizations on invoice lines.

-- ROLLBACK:
-- DROP TABLE IF EXISTS invoice_line_product_option;
-- DROP TABLE IF EXISTS product_customization_slot_option;
-- DROP TABLE IF EXISTS product_customization_slot;

CREATE TABLE product_customization_slot (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    min_select INT NOT NULL DEFAULT 0,
    max_select INT NOT NULL DEFAULT 1,
    display_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_product_customization_slot_product
        FOREIGN KEY (product_id) REFERENCES product(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_product_customization_slot_category
        FOREIGN KEY (category_id) REFERENCES product_category(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT uc_product_customization_slot UNIQUE (product_id, category_id)
);

CREATE TABLE product_customization_slot_option (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_customization_slot_id INT NOT NULL,
    option_product_id INT NOT NULL,
    price_delta DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_product_customization_slot_option_slot
        FOREIGN KEY (product_customization_slot_id) REFERENCES product_customization_slot(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_product_customization_slot_option_product
        FOREIGN KEY (option_product_id) REFERENCES product(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE invoice_line_product_option (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_line_id INT NOT NULL,
    product_option_id INT DEFAULT NULL,
    unit_price_delta DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_invoice_line_product_option_line
        FOREIGN KEY (invoice_line_id) REFERENCES invoice_line(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_invoice_line_product_option_product
        FOREIGN KEY (product_option_id) REFERENCES product_customization_slot_option(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);