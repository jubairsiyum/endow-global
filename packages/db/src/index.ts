import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import type { MySql2Database } from 'drizzle-orm/mysql2'
import * as schema from './schema'

type DrizzleDb = MySql2Database<typeof schema>

const globalForDb = globalThis as unknown as {
  db: DrizzleDb | undefined
}

function createDb(): DrizzleDb {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  const pool = mysql.createPool(databaseUrl)

  return drizzle(pool, { schema, mode: 'default' }) as DrizzleDb
}

export const db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV !== 'production') globalForDb.db = db

export { schema }
export * from './schema'
