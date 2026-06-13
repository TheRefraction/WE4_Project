#!/bin/sh
set -eu

# The Postgres official image already creates the database named by POSTGRES_DB
# on first initialization. This script only creates the application role and
# grants it the rights needed to use that database.

: "${POSTGRES_DB:?missing POSTGRES_DB}"
: "${POSTGRES_USER:?missing POSTGRES_USER}"
: "${POSTGRES_APP_USER:?missing POSTGRES_APP_USER}"
: "${POSTGRES_APP_PASSWORD:?missing POSTGRES_APP_PASSWORD}"

sql_escape_literal() {
  printf "%s" "$1" | sed "s/'/''/g"
}

sql_escape_ident() {
  printf "%s" "$1" | sed 's/"/""/g'
}

APP_USER_LIT=$(sql_escape_literal "$POSTGRES_APP_USER")
APP_USER_IDENT=$(sql_escape_ident "$POSTGRES_APP_USER")
APP_PASSWORD_LIT=$(sql_escape_literal "$POSTGRES_APP_PASSWORD")
DB_NAME_IDENT=$(sql_escape_ident "$POSTGRES_DB")

# Check whether the application role already exists.
role_exists=$(psql -tAc "SELECT 1 FROM pg_roles WHERE rolname = '$APP_USER_LIT'" \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" | tr -d '[:space:]')

if [ -z "$role_exists" ]; then
  psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -v ON_ERROR_STOP=1 <<EOF
CREATE ROLE "$APP_USER_IDENT" LOGIN PASSWORD '$APP_PASSWORD_LIT';
EOF
fi

# Grant access on the existing database created by initdb.
psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -v ON_ERROR_STOP=1 <<EOF
GRANT CONNECT ON DATABASE "$DB_NAME_IDENT" TO "$APP_USER_IDENT";
GRANT USAGE, CREATE ON SCHEMA public TO "$APP_USER_IDENT";
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "$APP_USER_IDENT";
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO "$APP_USER_IDENT";
EOF