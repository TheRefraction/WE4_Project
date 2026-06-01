import { Pool } from 'pg';

const pool = new Pool({
  host:     process.env.POSTGRES_HOST     || 'localhost',
  port:     Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB,
  user:     process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const connectPostgres = async (): Promise<void> => {
  const client = await pool.connect();
  console.log('Connected to PostgreSQL');
  client.release();
};

export default pool;