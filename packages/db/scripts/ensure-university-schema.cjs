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
      "SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'university'",
    )
    const columns = new Map(rows.map((row) => [row.COLUMN_NAME, row]))

    if (!columns.has('korea_ranking')) {
      await pool.query('ALTER TABLE `university` ADD COLUMN `korea_ranking` INT NULL')
      console.log('Added university.korea_ranking')
    }

    if (!columns.has('international_students')) {
      await pool.query('ALTER TABLE `university` ADD COLUMN `international_students` INT NULL')
      console.log('Added university.international_students')
    }

    if (!columns.has('international_percent')) {
      await pool.query('ALTER TABLE `university` ADD COLUMN `international_percent` FLOAT NULL')
      console.log('Added legacy university.international_percent')
    }

    const ranking = columns.get('ranking')
    if (!ranking) {
      await pool.query('ALTER TABLE `university` ADD COLUMN `ranking` VARCHAR(50) NULL')
      console.log('Added university.ranking as VARCHAR(50)')
    } else if (ranking.DATA_TYPE !== 'varchar' || Number(ranking.CHARACTER_MAXIMUM_LENGTH) !== 50) {
      await pool.query('ALTER TABLE `university` MODIFY COLUMN `ranking` VARCHAR(50) NULL')
      console.log('Converted university.ranking to VARCHAR(50)')
    }

    console.log('University schema is ready')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exitCode = 1
})
