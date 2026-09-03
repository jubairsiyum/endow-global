import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDb> | undefined
}

function createDb() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error(
      '[endow/db] DATABASE_URL is not set. ' +
        'Add it to your Vercel project environment variables at: ' +
        'https://vercel.com/dashboard → Your Project → Settings → Environment Variables',
    )
  }
  const pool = mysql.createPool({ uri: dbUrl })
  return drizzle(pool, { schema, mode: 'default' })
}

export const db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV !== 'production') globalForDb.db = db

export { schema }
export * from './schema'
