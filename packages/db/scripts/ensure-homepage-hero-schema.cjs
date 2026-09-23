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

const TABLE = 'homepage_hero_image'

async function hasTable(pool) {
  const [rows] = await pool.query(
    "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'homepage_hero_image'",
  )
  return rows.length > 0
}

async function ensureColumns(pool) {
  const [rows] = await pool.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'homepage_hero_image'",
  )
  const columns = new Set(rows.map((row) => row.COLUMN_NAME))

  const additions = [
    ['image_url', "ALTER TABLE `homepage_hero_image` ADD COLUMN `image_url` VARCHAR(500) NOT NULL DEFAULT ''"],
    ['alt_text', "ALTER TABLE `homepage_hero_image` ADD COLUMN `alt_text` VARCHAR(255) NOT NULL DEFAULT 'Homepage hero image'"],
    ['sort_order', "ALTER TABLE `homepage_hero_image` ADD COLUMN `sort_order` INT NOT NULL DEFAULT 0"],
    ['is_active', "ALTER TABLE `homepage_hero_image` ADD COLUMN `is_active` TINYINT(1) NOT NULL DEFAULT 1"],
    ['created_at', 'ALTER TABLE `homepage_hero_image` ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'],
    ['updated_at', 'ALTER TABLE `homepage_hero_image` ADD COLUMN `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'],
  ]

  for (const [column, statement] of additions) {
    if (!columns.has(column)) {
      await pool.query(statement)
      console.log(`Added homepage_hero_image.${column}`)
    }
  }
}

async function ensureIndexes(pool) {
  const [rows] = await pool.query('SHOW INDEX FROM `homepage_hero_image`')
  const indexes = new Set(rows.map((row) => row.Key_name))

  if (!indexes.has('idx_homepage_hero_image_active_order')) {
    await pool.query('CREATE INDEX `idx_homepage_hero_image_active_order` ON `homepage_hero_image` (`is_active`, `sort_order`)')
  }
  if (!indexes.has('idx_homepage_hero_image_created_at')) {
    await pool.query('CREATE INDEX `idx_homepage_hero_image_created_at` ON `homepage_hero_image` (`created_at`)')
  }
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

  const pool = await mysql.createPool(databaseOptions(process.env.DATABASE_URL))
  try {
    if (!(await hasTable(pool))) {
      await pool.query(`
        CREATE TABLE \`${TABLE}\` (
          \`id\` varchar(25) NOT NULL,
          \`image_url\` varchar(500) NOT NULL,
          \`alt_text\` varchar(255) NOT NULL DEFAULT 'Homepage hero image',
          \`sort_order\` int NOT NULL DEFAULT 0,
          \`is_active\` boolean NOT NULL DEFAULT true,
          \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT \`homepage_hero_image_id\` PRIMARY KEY (\`id\`)
        )
      `)
      console.log('Created homepage_hero_image')
    } else {
      await ensureColumns(pool)
    }

    await ensureIndexes(pool)
    console.log('Homepage hero image schema is ready')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exitCode = 1
})
