-- V1_1_7__populate_menu.sql

INSERT INTO menu(id, name, description)
VALUES (1, 'Menu Tacos', 'Un menu avec un tacos, une boisson et un dessert');

INSERT INTO menu_slot(id, menu_id, name, min_select, max_select, display_order)
VALUES (1, 1, 'Tacos', 1, 1, 0),
(2, 1, 'Boisson', 1, 1, 1),
(3, 1, 'Dessert', 1, 1, 2);

INSERT INTO menu_slot_product(menu_slot_id, product_id, price_delta, is_default, display_order)
VALUES (1, 18, 0.0, TRUE, 0), -- Tacos
(1, 19, 5.0, FALSE, 1), -- Double Tacos
(1, 20, -1.0, FALSE, 2), -- Burger
(1, 21, 1.0, FALSE, 3), -- Pizza simple
(2, 27, 0.0, TRUE, 0), -- Koufola
(2, 28, 1.0, FALSE, 1), -- Bière
(2, 29, 8.5, FALSE, 2), -- Vin
(2, 30, -0.5, FALSE, 3), -- Café
(2, 31, -1.0, FALSE, 4), -- Thé turc
(3, 24, 0.0, TRUE, 0), -- Gelato al Limone
(3, 25, 1.0, FALSE, 1), -- Tiramisu
(3, 26, 0.5, FALSE, 2); -- Baklava