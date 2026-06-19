-- V2_0_2__adding_uc_to_category_name.sql

CREATE UNIQUE INDEX uc_category_name ON category (LOWER(name));