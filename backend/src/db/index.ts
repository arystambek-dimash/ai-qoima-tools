import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database pool with optimized settings
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  // Connection pool configuration
  max: parseInt(process.env.DB_POOL_MAX || '20'),
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Timeout after 5s if can't connect
  // Statement timeout to prevent long-running queries
  statement_timeout: 30000, // 30 seconds max query time
});

// Track pool statistics
let poolStats = {
  totalConnections: 0,
  idleConnections: 0,
  waitingClients: 0,
};

// Update pool stats periodically
setInterval(() => {
  poolStats = {
    totalConnections: pool.totalCount,
    idleConnections: pool.idleCount,
    waitingClients: pool.waitingCount,
  };
}, 10000);

export function getPoolStats() {
  return poolStats;
}

pool.on('error', (err) => {
  console.error('[Database] Unexpected error on idle client:', err.message);
  // Don't exit - let the application handle reconnection
});

pool.on('connect', () => {
  console.log('[Database] New client connected to pool');
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
