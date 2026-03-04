import mysql, { type Pool } from 'mysql2/promise';

let pool: Pool | null = null;

function getRequiredEnv(name: 'DB_USER' | 'DB_PASSWORD' | 'DB_NAME'): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getDbPool(): Pool {
  if (pool) {
    return pool;
  }

  const port = Number(process.env.DB_PORT ?? 3306);

  pool = mysql.createPool({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number.isFinite(port) ? port : 3306,
    user: getRequiredEnv('DB_USER'),
    password: getRequiredEnv('DB_PASSWORD'),
    database: getRequiredEnv('DB_NAME'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}
