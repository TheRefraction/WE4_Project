-- R__automatic_account_deletion.sql
-- Accounts inactive for 2+ years are deleted daily.
-- Scheduling is handled at application level.

ALTER TABLE account ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_account_last_login
ON account (last_login)
WHERE last_login IS NOT NULL;