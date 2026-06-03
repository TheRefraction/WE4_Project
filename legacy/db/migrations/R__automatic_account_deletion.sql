-- R__automatic_account_deletion
-- delete once a day all the account that haven't connected since 2 years.
DROP EVENT IF EXISTS daily_account_cleanup;

CREATE EVENT daily_account_cleanup -- CREATE IF EXISTS
ON SCHEDULE
    EVERY 1 MINUTE
DO
    DELETE FROM account
    WHERE last_login < NOW() - INTERVAL 2 YEAR;