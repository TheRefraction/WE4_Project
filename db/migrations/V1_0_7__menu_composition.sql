-- V1_0_7__menu_composition.sql
-- Adds menu composition tables (slots and allowed products per slot)

-- ROLLBACK:
-- DROP TABLE IF EXISTS menu_slot_product;
-- DROP TABLE IF EXISTS menu_slot;

CREATE TABLE menu_slot (
    id INT PRIMARY KEY AUTO_INCREMENT,
    menu_id INT NOT NULL,
    name VARCHAR(128) NOT NULL,
    min_select INT NOT NULL DEFAULT 0,
    max_select INT NOT NULL DEFAULT 1,
    display_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_menu_slot_menu
        FOREIGN KEY (menu_id) REFERENCES menu(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uc_menu_slot UNIQUE (menu_id, name)
);

CREATE TABLE menu_slot_product (
    menu_slot_id INT NOT NULL,
    product_id INT NOT NULL,
    price_delta DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (menu_slot_id, product_id),
    FOREIGN KEY (menu_slot_id) REFERENCES menu_slot(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_menu_slot_menu ON menu_slot(menu_id);
CREATE INDEX idx_menu_slot_product_product ON menu_slot_product(product_id);