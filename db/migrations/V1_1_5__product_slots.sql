-- V1_1_5__product_slots.sql

INSERT INTO product_customization_slot(id, product_id, category_id, min_select, max_select, display_order)
VALUES (
    1,
    18, -- Tacos
    1, -- Viande
    1, 2, 0
), (
    2,
    18, -- Tacos
    2, -- Crudité
    0, 5, 1
), (
    3,
    18, -- Tacos
    4, -- Sauce
    0, 2, 2
), (
    4,
    19, -- Double Tacos
    1,  -- Viande
    2, 3, 0
), (
    5,
    19, -- Double Tacos
    2, -- Crudité
    0, 5, 1
), (
    6,
    19, -- Double Tacos
    4, -- Sauce
    0, 2, 2
), (
    7,
    20, -- Burger
    1, -- Viande supplementaire
    0, 2, 0
), (
    8,
    21, -- Pizza
    2, -- Crudité
    0, 1, 0
), (
    9,
    22, -- Frites
    4, -- Sauce
    0, 1, 0
);