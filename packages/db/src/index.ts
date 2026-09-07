import { drizzle } from 'drizzle-orm/mysql2'
import type { MySql2Database } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

type DbInstance = MySql2Database<typeof schema>

const globalForDb = globalThis as unknown as {
  db: DbInstance | undefined
}

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) {
    throw new Error(
      '[endow/db] DATABASE_URL is not set. ' +
        'Add it to Vercel: Dashboard → Your Project → Settings → Environment Variables. ' +
        'Locally: set it in .env (root) or apps/web/.env — see README.md:285.',
    )
  }
  return url
}

function createPoolFromUrl(dbUrl: string) {
  // mysql2/promise `uri` works but explicit options are more reliable on Vercel
  // + we can tune pooling for serverless and handle encoded passwords correctly.
  try {
    const parsed = new URL(dbUrl)
    const database = parsed.pathname.replace(/^\//, '') || undefined

    return mysql.createPool({
      host: parsed.hostname,
      port: Number(parsed.port) || 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database,
      // ── Serverless-friendly pooling ──────────────────────────────
      // Vercel functions are short-lived; keep pool tiny to avoid
      // "Too many connections" on Hostinger MySQL.
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_POOL_SIZE) || 5,
      maxIdle: Number(process.env.DB_MAX_IDLE) || 5,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      connectTimeout: 10000,
      // Hostinger MySQL (srv1749.hstgr.io) does NOT use TLS by default.
      // If your DB requires TLS, set DB_SSL=true in Vercel env.
      ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
      // Allow public key retrieval for MySQL 8 (Hostinger)
      // and support passing extra query params like ?sslMode=REQUIRED
      ...(parsed.searchParams.get('sslMode') === 'REQUIRED'
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    })
  } catch {
    // Fallback: let mysql2 parse the uri directly (legacy behaviour)
    return mysql.createPool({ uri: dbUrl } as unknown as mysql.PoolOptions)
  }
}

function createDb(): DbInstance {
  const dbUrl = getDatabaseUrl()
  const pool = createPoolFromUrl(dbUrl)
  return drizzle(pool, { schema, mode: 'default' })
}

function getDb(): DbInstance {
  if (globalForDb.db) return globalForDb.db
  const instance = createDb()
  // Cache in all envs — on Vercel each function instance reuses the pool
  // across warm invocations; in dev it also prevents HMR pool leaks.
  globalForDb.db = instance
  return instance
}

// Lazy proxy — defers createPool/DATABASE_URL check until first query.
// This prevents build-time crashes when DATABASE_URL is not set during
// `next build` prerendering, while still throwing a clear error at runtime
// if the env var is truly missing.
export const db = new Proxy({} as DbInstance, {
  get(_target, prop) {
    const instance = getDb()
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(instance) : value
  },
}) as DbInstance

export { schema }
export * from './schema'
