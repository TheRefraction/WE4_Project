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

('Koufola', NULL, 0.0, 1, FALSE),
('Bière', NULL, 0.0, 1, FALSE),
('Vin', NULL, 0.0, 2, FALSE),
('Café', NULL, 0.0, NULL, FALSE),
('Thé', NULL, 0.0, NULL, FALSE);