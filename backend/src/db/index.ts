import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const result = await pool.query(text, params);
  return (result.rows[0] as T) || null;
}

export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

export default pool;
