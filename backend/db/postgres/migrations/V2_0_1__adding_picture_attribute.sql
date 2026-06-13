-- V2_0_1__adding_picture_attribute.sql
-- This migration script adds a new 'picture' attribute to the 
-- product and menu tables to store the URL of the associated image.

-- ROLLBACK: ALTER TABLE product
-- DROP COLUMN picture_url;
ALTER TABLE product
ADD COLUMN picture_url TEXT;

ALTER TABLE menu 
ADD COLUMN picture_url TEXT;