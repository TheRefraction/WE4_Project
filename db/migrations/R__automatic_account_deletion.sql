-- R__automatic_account_deletion
-- delete once a day all the account that haven't connected since 2 years.

CREATE EVENT daily_account_cleanup
ON SCHEDULE EVERY 1 DAY
       STARTS '2026-05-05 17:40:00'
DO
        BEGIN
        DELETE FROM account
        WHERE last_login < NOW() - INTERVAL 2 YEAR;
        END

