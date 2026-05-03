-- V1_0_5__updating_account_table.sql 
-- Updating account table with loyalty points and last login date

-- ROLLBACK: ALTER TABLE account DROP COLUMN name;
ALTER TABLE account
ADD COLUMN loyalty_points INT NOT NULL DEFAULT 0;

ALTER TABLE account
ADD COLUMN last_login DATETIME DEFAULT CURRENT_TIMESTAMP;