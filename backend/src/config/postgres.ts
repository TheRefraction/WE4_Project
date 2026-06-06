import { Pool } from 'pg';
import { env } from './env';

export const pgPool = new Pool({
  host:     env.PG_HOST,
  port:     env.PG_PORT,
  database: env.PG_DB,
  user:     env.PG_USER,
  password: env.PG_PASSWORD,
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

pgPool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring PostgreSQL client:', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
    release();
  }
});

pgPool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});