"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgPool = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
exports.pgPool = new pg_1.Pool({
    host: env_1.env.PG_HOST,
    port: env_1.env.PG_PORT,
    database: env_1.env.PG_DB,
    user: env_1.env.PG_USER,
    password: env_1.env.PG_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
/*export const connectPostgres = async (): Promise<void> => {
  const client = await pgPool.connect();
  console.log('Connected to PostgreSQL');
  client.release();
};

export default pgPool;*/
exports.pgPool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring PostgreSQL client:', err.stack);
    }
    else {
        console.log('Connected to PostgreSQL');
        release();
    }
});
exports.pgPool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
});
