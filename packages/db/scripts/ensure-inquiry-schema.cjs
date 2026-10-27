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
    const [inqRows] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'student_inquiry'",
    )
    const inqColumns = new Set(inqRows.map((row) => row.COLUMN_NAME))

    if (!inqColumns.has('photo_url')) {
      await pool.query(
        'ALTER TABLE `student_inquiry` ADD COLUMN `photo_url` varchar(500) NULL',
      )
      console.log('Added student_inquiry.photo_url')
    } else {
      console.log('student_inquiry.photo_url already exists')
    }

    const [profRows] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'student_profile'",
    )
    const profColumns = new Set(profRows.map((row) => row.COLUMN_NAME))

    if (!profColumns.has('interested_program')) {
      await pool.query(
        'ALTER TABLE `student_profile` ADD COLUMN `interested_program` varchar(100) NULL',
      )
      console.log('Added student_profile.interested_program')
    } else {
      console.log('student_profile.interested_program already exists')
    }

    console.log('Inquiry & Student Profile schema is ready')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exitCode = 1
})
