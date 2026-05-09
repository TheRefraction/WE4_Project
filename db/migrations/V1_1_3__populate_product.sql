-- V1_1_3__populate_product.sql

INSERT INTO product(id, name, description, price, supplier_id, hidden)
VALUES (1, 'Steak', NULL, 0.0, NULL, TRUE),
(2, 'Kébab', NULL, 0.0, NULL, TRUE),
(3, 'Poulet', NULL, 0.0, NULL, TRUE),
(4, 'Tender', NULL, 1.0, NULL, TRUE),
(5, 'Merguez', NULL, 0.0, NULL, TRUE),

(6, 'Salade', NULL, 0.0, NULL, TRUE),
(7, 'Tomate', NULL, 0.0, NULL, TRUE),
(8, 'Oignon', NULL, 0.0, NULL, TRUE),
(9, 'Carotte', NULL, 0.0, NULL, TRUE),
(10, 'Champignon', NULL, 0.0, NULL, TRUE),

(11, 'Pain', NULL, 0.0, 2, TRUE),
(12, 'Galette', NULL, 0.0, 2, TRUE),

(13, 'Blanche', NULL, 0.0, 1, TRUE),
(14, 'Samourai', NULL, 0.0, 1, TRUE),
(15, 'Poivre', NULL, 0.0, 1, TRUE),
(16, 'Algérienne', NULL, 0.0, 1, TRUE),
(17, 'Barbecue', NULL, 0.0, 1, TRUE),

(18, 'Tacos', 'Un tacos simple', 5.0, NULL, FALSE),
(19, 'Double Tacos', 'Un grand tacos à deux viandes', 10.0, NULL, FALSE),
(20, 'Burger', 'Un burger merveilleux (1, 2 ou 3 steaks)', 2.5, NULL, FALSE),
(21, 'Pizza simple', 'Pizza', 6.0, NULL, FALSE),

(22, 'Frites', 'Des frites', 2.0, NULL, FALSE),
(23, 'Patate au four', 'Une patate au four', 3.0, NULL, FALSE),

(24, 'Gelato al Limone', 'Une délicieuse glace au citron', 3.0, NULL, FALSE),
(25, 'Tiramisu', 'Un tiramisu savoureux', 4.0, NULL, FALSE),
(26, 'Baklava', 'Un baklava sucré et croustillant', 3.5, NULL, FALSE),

(27, 'Koufola', 'Un soda exceptionnel (33cL)', 1.5, 1, FALSE),
(28, 'Bière', 'Blonde (50cL)', 2.5, 1, FALSE),
(29, 'Vin', 'Du vin écoplus (25cL)', 10.0, 2, FALSE),
(30, 'Café', 'Il caffé della Mamma (25cL)', 0.5, NULL, FALSE),
(31, 'Thé turc', 'Bon thé turc (25cL)', 1.0, NULL, FALSE);