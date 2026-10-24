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
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'student_inquiry'",
    )
    const columns = new Set(rows.map((row) => row.COLUMN_NAME))

    if (!columns.has('photo_url')) {
      await pool.query(
        'ALTER TABLE `student_inquiry` ADD COLUMN `photo_url` varchar(500) NULL',
      )
      console.log('Added student_inquiry.photo_url')
    } else {
      console.log('student_inquiry.photo_url already exists')
    }

    console.log('Inquiry schema is ready')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exitCode = 1
})

