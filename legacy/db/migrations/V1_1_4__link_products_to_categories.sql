-- V1_1_4__link_products_to_categories.sql

INSERT INTO product_to_category(product_id, category_id)
VALUES (1, 1), (2, 1), (3, 1), (4, 1), (5, 1), -- Viande
(6, 2), (7, 2), (8, 2), (9, 2), -- Crudité
(11, 3), (12, 3), -- Pain
(13, 4), (14, 4), (15, 4), (16, 4), (17, 4), -- Sauce
(10, 5), -- Autre
(18, 13), (19, 13), -- Tacos
(20, 11), -- Burger
(21, 12), -- Pizza
(22, 10), (23, 10), -- Accompagnement
(24, 14), (25, 14), (26, 14), -- Dessert
(27, 6), -- Boisson
(28, 7), -- Bière
(29, 8), -- Vin
(30, 9), (31, 9); -- Boisson chaude