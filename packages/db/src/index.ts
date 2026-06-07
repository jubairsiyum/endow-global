import '../../../env-loader.cjs'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDb> | undefined
}

function createDb() {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
  })
  return drizzle(pool, { schema, mode: 'default' })
}

export const db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV !== 'production') globalForDb.db = db

export { schema }
export * from './schema'
