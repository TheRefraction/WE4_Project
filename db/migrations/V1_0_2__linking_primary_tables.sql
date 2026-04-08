-- V1_0_2__linking_primary_tables.sql 
-- Adds foreign keys as well as "join" tables and constraints 
-- especially when deleting a value 

-- Adding constraints onto account
ALTER TABLE account
ADD COLUMN role_id INT DEFAULT 1; -- By default, a new user is seen as a client

ALTER TABLE account
ADD CONSTRAINT fk_account_role
FOREIGN KEY (role_id) REFERENCES role(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Adding constraints onto invoice
ALTER TABLE invoice
ADD COLUMN account_id INT; -- We keep invoices even if the client deleted their account

ALTER TABLE invoice 
ADD CONSTRAINT fk_invoice_account
FOREIGN KEY (account_id) REFERENCES account(id)
ON DELETE SET NULL 
ON UPDATE CASCADE;

ALTER TABLE invoice 
ADD COLUMN payment_id INT;

ALTER TABLE invoice 
ADD CONSTRAINT fk_invoice_payment
FOREIGN KEY (payment_id) REFERENCES payment(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE invoice 
ADD COLUMN status_id INT NOT NULL;

ALTER TABLE invoice 
ADD CONSTRAINT fk_invoice_status
FOREIGN KEY (status_id) REFERENCES invoice_status(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Adding constraints onto payment
ALTER TABLE payment 
ADD COLUMN mode_id INT NOT NULL;

ALTER TABLE payment 
ADD CONSTRAINT fk_payment_mode
FOREIGN KEY (mode_id) REFERENCES payment_mode(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE payment 
ADD COLUMN status_id INT NOT NULL;

ALTER TABLE payment 
ADD CONSTRAINT fk_payment_status
FOREIGN KEY (status_id) REFERENCES payment_status(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Adding constraints onto invoice_line
ALTER TABLE invoice_line 
ADD COLUMN invoice_id INT NOT NULL;

ALTER TABLE invoice_line
ADD CONSTRAINT fk_invoice_line_invoice
FOREIGN KEY (invoice_id) REFERENCES invoice(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE invoice_line 
ADD COLUMN product_id INT;

ALTER TABLE invoice_line 
ADD CONSTRAINT fk_invoice_line_product
FOREIGN KEY (product_id) REFERENCES product(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Adding constraints onto product 
ALTER TABLE product 
ADD COLUMN supplier_id INT; -- Can be supplied by themselves (NULL)

ALTER TABLE product 
ADD CONSTRAINT fk_product_supplier
FOREIGN KEY (supplier_id) REFERENCES supplier(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Adding "join" table between product and category
CREATE TABLE product_to_category (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES product(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES product_category(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Adding "join" table between menu and product
CREATE TABLE menu_product (
    menu_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (menu_id, product_id),
    FOREIGN KEY (menu_id) REFERENCES menu(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Adding constraints onto stock
ALTER TABLE stock 
ADD COLUMN product_id INT NOT NULL;

ALTER TABLE stock 
ADD CONSTRAINT fk_stock_product
FOREIGN KEY (product_id) REFERENCES product(id)
ON DELETE CASCADE 
ON UPDATE CASCADE;