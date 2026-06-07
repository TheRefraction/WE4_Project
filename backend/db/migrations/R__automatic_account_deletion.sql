-- R__automatic_account_deletion.sql
-- Delete once a day all accounts that haven't connected in 2 years.

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ROLLBACK: SELECT cron.unschedule('daily_account_cleanup');
SELECT cron.schedule(
    'daily_account_cleanup',          -- job name
    '0 0 * * *',                      -- every day at midnight
    $$
        DELETE FROM account
        WHERE last_login < NOW() - INTERVAL '2 years';
    $$
);
