-- V1_0_3__address_tables.sql 
-- Adds tables for addresses, cities, postal codes and countries

-- ROLLBACK: DROP TABLE IF EXISTS name;
CREATE TABLE country (
    id INT PRIMARY KEY AUTO_INCREMENT,
    iso_code VARCHAR(2) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL UNIQUE
);

CREATE TABLE postal_code (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(16) NOT NULL,
    country_id INT NOT NULL,
    CONSTRAINT fk_country
        FOREIGN KEY (country_id) REFERENCES country(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT uc_postal_code UNIQUE (code, country_id)
);

CREATE TABLE city (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    postal_code_id INT NOT NULL,
    CONSTRAINT fk_postal_code
        FOREIGN KEY (postal_code_id) REFERENCES postal_code(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT uc_city UNIQUE (name, postal_code_id)
);

CREATE TABLE street (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    city_id INT NOT NULL,
    CONSTRAINT fk_city 
        FOREIGN KEY (city_id) REFERENCES city(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT uc_street UNIQUE (name, city_id)
);

CREATE TABLE address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    street_id INT NOT NULL,
    house_number VARCHAR(16) NOT NULL,
    house_number_suffix VARCHAR(16),
    comment VARCHAR(64),
    CONSTRAINT fk_street
        FOREIGN KEY (street_id) REFERENCES street(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ROLLBACK: DROP INDEX IF EXISTS name ON table;
CREATE INDEX idx_postal_code_country ON postal_code(country_id);
CREATE INDEX idx_city_postal_code ON city(postal_code_id);
CREATE INDEX idx_street_city ON street(city_id);
CREATE INDEX idx_address_street ON address(street_id);