-- V2_0_0__migrating_tables.sql
-- This migration script is designed to migrate existing tables to a new schema structure/Postgres.

CREATE TYPE role_enum AS ENUM (
    'unknown',
    'client',
    'supplier',
    'admin'
);
 
CREATE TYPE payment_mode_enum AS ENUM (
    'unknown',
    'credit_card',
    'bank_note',
    'cash',
    'meal_voucher',
    'paypal'
);
 
CREATE TYPE payment_status_enum AS ENUM (
    'unknown',
    'pending',
    'paid',
    'failed',
    'refunded'
);
 
CREATE TYPE invoice_status_enum AS ENUM (
    'unknown',
    'draft',
    'pending',
    'paid',
    'cancelled'
);

CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    loyalty_points INTEGER DEFAULT 0,
    role role_enum NOT NULL DEFAULT 'client',

    CONSTRAINT chk_loyalty_points CHECK (loyalty_points >= 0)
);

CREATE UNIQUE INDEX uc_email ON account (LOWER(email));

CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY,
    payment_date TIMESTAMP NOT NULL,
    mode payment_mode_enum NOT NULL,
    status payment_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    billing_address JSONB NOT NULL,
    status invoice_status_enum NOT NULL DEFAULT 'draft',
    payment_id INT DEFAULT NULL, -- NULL means payment not yet established
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_account 
    FOREIGN KEY (account_id) REFERENCES account(id)
    ON UPDATE CASCADE 
    ON DELETE RESTRICT,

    CONSTRAINT fk_payment 
    FOREIGN KEY (payment_id) REFERENCES payment(id)
    ON UPDATE CASCADE 
    ON DELETE RESTRICT,

    CONSTRAINT chk_invoice_amount CHECK (amount >= 0)
);

CREATE TABLE IF NOT EXISTS supplier (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_category_name ON category(name);

CREATE TABLE IF NOT EXISTS product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    supplier_id INT DEFAULT NULL, -- NULL means in-house product
    hidden BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_supplier
    FOREIGN KEY (supplier_id) REFERENCES supplier(id)
    ON UPDATE CASCADE 
    ON DELETE SET NULL,

    CONSTRAINT chk_product_price CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_product_name ON product(name);

CREATE TABLE IF NOT EXISTS product_category (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    
    CONSTRAINT fk_product 
    FOREIGN KEY (product_id) REFERENCES product(id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE,

    CONSTRAINT fk_category 
    FOREIGN KEY (category_id) REFERENCES category(id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS stock (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    quantity_available INT NOT NULL DEFAULT 0,
    quantity_reserved INT NOT NULL DEFAULT 0,
    reorder_threshold INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_product 
    FOREIGN KEY (product_id) REFERENCES product(id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE,

    CONSTRAINT chk_stock_quantities CHECK (quantity_available >= 0 AND quantity_reserved >= 0 AND reorder_threshold >= 0),

    CONSTRAINT uc_stock_product UNIQUE (product_id)
);

CREATE TABLE IF NOT EXISTS menu (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    hidden BOOLEAN DEFAULT FALSE,

    CONSTRAINT chk_menu_price CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_menu_name ON menu(name);

CREATE TABLE IF NOT EXISTS menu_slot (
    id SERIAL PRIMARY KEY,
    menu_id INT NOT NULL,
    name VARCHAR(128) NOT NULL,
    min_select INT NOT NULL DEFAULT 1,
    max_select INT NOT NULL DEFAULT 1,
    display_order INT NOT NULL DEFAULT 0, 

    CONSTRAINT fk_menu_slot_menu
    FOREIGN KEY (menu_id) REFERENCES menu(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT chk_select_range CHECK (min_select >= 0 AND max_select >= min_select),
    CONSTRAINT chk_display_order CHECK (display_order >= 0),
    CONSTRAINT uc_menu_display_order UNIQUE (menu_id, display_order)
);

CREATE TABLE IF NOT EXISTS menu_slot_product (
    menu_slot_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (menu_slot_id, product_id),
    price_delta DECIMAL(10, 2) NOT NULL DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_menu_slot_product_menu_slot
    FOREIGN KEY (menu_slot_id) REFERENCES menu_slot(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT fk_menu_slot_product_product
    FOREIGN KEY (product_id) REFERENCES product(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT chk_menu_slot_product_display_order CHECK (display_order >= 0),
    CONSTRAINT uc_menu_slot_product_display_order UNIQUE (menu_slot_id, display_order)
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_menu_slot_product_default
ON menu_slot_product (menu_slot_id)
WHERE is_default = TRUE;

CREATE TABLE IF NOT EXISTS customization_slot (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    min_select INT NOT NULL DEFAULT 0,
    max_select INT NOT NULL DEFAULT 1,
    display_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_customization_slot_product
    FOREIGN KEY (product_id) REFERENCES product(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT fk_customization_slot_category
    FOREIGN KEY (category_id) REFERENCES category(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT chk_customization_slot_select_range CHECK (min_select >= 0 AND max_select >= min_select),
    CONSTRAINT chk_customization_slot_display_order CHECK (display_order >= 0),
    CONSTRAINT uc_customization_slot_display_order UNIQUE (product_id, display_order)
);

CREATE TABLE IF NOT EXISTS customization_slot_option (
    customization_slot_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (customization_slot_id, product_id),
    price_delta DECIMAL(10, 2) NOT NULL DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_customization_slot_option_customization_slot
    FOREIGN KEY (customization_slot_id) REFERENCES customization_slot(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT fk_customization_slot_option_product
    FOREIGN KEY (product_id) REFERENCES product(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT chk_customization_slot_option_display_order CHECK (display_order >= 0),
    CONSTRAINT uc_customization_slot_option_display_order UNIQUE (customization_slot_id, display_order)
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_customization_slot_option_default
ON customization_slot_option (customization_slot_id)
WHERE is_default = TRUE;