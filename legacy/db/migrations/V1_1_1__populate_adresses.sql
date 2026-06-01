-- V1_1_1__populate_adresses.sql

INSERT INTO country(iso_code, name)
VALUES ('FR', 'France');

-- France, id=1
INSERT INTO postal_code (code, country_id) VALUES
('90000', 1),  -- Belfort
('90100', 1),  -- Delle
('90110', 1),  -- Rougemont-le-Château
('90120', 1),  -- Morvillars
('90130', 1),  -- Bessoncourt
('90140', 1),  -- Bourogne
('90150', 1),  -- Fontaine
('90160', 1),  -- Denney
('90170', 1),  -- Pérouse
('90200', 1),  -- Giromagny
('90250', 1),  -- Lachapelle-sous-Chaux
('90300', 1),  -- Valdoie
('90330', 1),  -- Chèvremont
('90340', 1),  -- Châtenois-les-Forges
('90350', 1),  -- Évette-Salbert
('90360', 1),  -- Sermamagny
('90370', 1),  -- Vétrigne
('90380', 1),  -- Roppe
('90400', 1),  -- Danjoutin
('90420', 1),  -- Bavilliers
('90440', 1),  -- Auxelles-Bas
('90450', 1),  -- Autrechêne
('90460', 1),  -- Menoncourt
('90470', 1),  -- Boron
('90480', 1),  -- Chavanatte
('90500', 1);  -- Beaucourt

INSERT INTO city (name, postal_code_id) VALUES
('Belfort', (SELECT id FROM postal_code WHERE code = '90000' AND country_id = 1)),
('Delle', (SELECT id FROM postal_code WHERE code = '90100' AND country_id = 1)),
('Giromagny', (SELECT id FROM postal_code WHERE code = '90200' AND country_id = 1)),
('Valdoie', (SELECT id FROM postal_code WHERE code = '90300' AND country_id = 1)),
('Danjoutin', (SELECT id FROM postal_code WHERE code = '90400' AND country_id = 1)),
('Beaucourt', (SELECT id FROM postal_code WHERE code = '90500' AND country_id = 1)),
('Bourogne', (SELECT id FROM postal_code WHERE code = '90140' AND country_id = 1)),
('Châtenois-les-Forges', (SELECT id FROM postal_code WHERE code = '90340' AND country_id = 1)),
('Offemont', (SELECT id FROM postal_code WHERE code = '90300' AND country_id = 1));

INSERT INTO street (name, city_id) VALUES
('Faubourg de France', (SELECT id FROM city WHERE name = 'Belfort')),
('Avenue Jean Jaurès', (SELECT id FROM city WHERE name = 'Belfort')),
('Place d''Armes', (SELECT id FROM city WHERE name = 'Belfort')),
('Boulevard Richelieu', (SELECT id FROM city WHERE name = 'Belfort')),
('Place de l''Arsenal', (SELECT id FROM city WHERE name = 'Belfort')),
('Avenue Wilson', (SELECT id FROM city WHERE name = 'Belfort'));

INSERT INTO address (street_id, house_number, house_number_suffix, comment) VALUES
((SELECT id FROM street WHERE name = 'Faubourg de France' AND city_id = (SELECT id FROM city WHERE name = 'Belfort')), '12', NULL, 'Près de la Porte de Brisach'),
((SELECT id FROM street WHERE name = 'Avenue Jean Jaurès' AND city_id = (SELECT id FROM city WHERE name = 'Belfort')), '8', 'A', 'Résidence Le Lion'),
((SELECT id FROM street WHERE name = 'Place d''Armes' AND city_id = (SELECT id FROM city WHERE name = 'Belfort')), '3', NULL, 'Face à la mairie');