const path = require('path')

require(path.resolve(__dirname, '../../../env-loader.cjs'))

const mysql = require('mysql2/promise')

function databaseOptions(databaseUrl) {
  const parsed = new URL(databaseUrl)
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
    ...(parsed.searchParams.get('sslMode') === 'REQUIRED'
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const pool = await mysql.createPool(databaseOptions(process.env.DATABASE_URL))

  try {
    const [rows] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'course'",
    )
    const columns = new Set(rows.map((row) => row.COLUMN_NAME))

    if (!columns.has('application_fee_currency')) {
      await pool.query(
        "ALTER TABLE `course` ADD COLUMN `application_fee_currency` varchar(3) NOT NULL DEFAULT 'USD'",
      )
      console.log('Added course.application_fee_currency')
    } else {
      console.log('course.application_fee_currency already exists')
    }

    console.log('Course schema is ready')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exitCode = 1
})