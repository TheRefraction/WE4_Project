-- V1_1_3__populate_product.sql

INSERT INTO product(name, description, price, supplier_id, hidden)
VALUES ('Steak', NULL, 0.0, NULL, TRUE),
('Kébab', NULL, 0.0, NULL, TRUE),
('Poulet', NULL, 0.0, NULL, TRUE),
('Tender', NULL, 0.0, NULL, TRUE),
('Merguez', NULL, 0.0, NULL, TRUE),

('Salade', NULL, 0.0, NULL, TRUE),
('Tomate', NULL, 0.0, NULL, TRUE),
('Oignon', NULL, 0.0, NULL, TRUE),
('Carotte', NULL, 0.0, NULL, TRUE),
('Champignon', NULL, 0.0, NULL, TRUE),
('Maïs', NULL, 0.0, NULL, TRUE),

('Pain', NULL, 0.0, 2, TRUE),
('Galette', NULL, 0.0, 2, TRUE),

('Blanche', NULL, 0.0, 1, TRUE),
('Samourai', NULL, 0.0, 1, TRUE),
('Poivre', NULL, 0.0, 1, TRUE),
('Algérienne', NULL, 0.0, 1, TRUE),
('Barbecue', NULL, 0.0, 1, TRUE),

('Tacos', 'Un tacos simple', 5.0, NULL, FALSE),
('Tacos 2 viandes', 'Un tacos à deux viandes', 6.0, NULL, FALSE),
('Double Tacos', 'Un grand tacos à deux viandes', 10.0, NULL, FALSE),
('Burger', 'Un burger merveilleux (1, 2 ou 3 steaks)', 2.5, NULL, FALSE),
('Döner', 'Döner', 5.0, NULL, FALSE),
('Frites', 'Des frites', 2.0, NULL, FALSE),
('Pizza simple', 'Pizza', 6.0, NULL, FALSE),

(''),

('Koufola', 'Un soda exceptionnel', 0.0, 1, FALSE),
('Bière', 'Blonde 50cL', 0.0, 1, FALSE),
('Vin', 'Du vin écoplus', 0.0, 2, FALSE),
('Café', 'Il caffé della Mamma', 0.0, NULL, FALSE),
('Thé', 'Bon thé turc', 0.0, NULL, FALSE);