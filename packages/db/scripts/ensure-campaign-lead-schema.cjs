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

const TABLE = 'campaign_lead'

async function hasTable(pool) {
  const [rows] = await pool.query(
    "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'campaign_lead'",
  )
  return rows.length > 0
}

async function ensureColumns(pool) {
  const [rows] = await pool.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'campaign_lead'",
  )
  const columns = new Set(rows.map((row) => row.COLUMN_NAME))

  const additions = [
    ['name', 'ALTER TABLE `campaign_lead` ADD COLUMN `name` VARCHAR(255) NULL'],
    ['email', 'ALTER TABLE `campaign_lead` ADD COLUMN `email` VARCHAR(255) NULL'],
    ['phone', 'ALTER TABLE `campaign_lead` ADD COLUMN `phone` VARCHAR(50) NULL'],
    ['interested_program', 'ALTER TABLE `campaign_lead` ADD COLUMN `interested_program` VARCHAR(255) NULL'],
    ['interested_country', 'ALTER TABLE `campaign_lead` ADD COLUMN `interested_country` VARCHAR(255) NULL'],
    ['intake_year', 'ALTER TABLE `campaign_lead` ADD COLUMN `intake_year` VARCHAR(50) NULL'],
    ['reason', 'ALTER TABLE `campaign_lead` ADD COLUMN `reason` TEXT NULL'],
    ['completed_step', 'ALTER TABLE `campaign_lead` ADD COLUMN `completed_step` INT NOT NULL DEFAULT 1'],
    ['status', "ALTER TABLE `campaign_lead` ADD COLUMN `status` ENUM('PARTIAL', 'COMPLETED', 'CONTACTED', 'CONVERTED', 'ARCHIVED') NOT NULL DEFAULT 'PARTIAL'"],
    ['utm_source', 'ALTER TABLE `campaign_lead` ADD COLUMN `utm_source` VARCHAR(100) NULL'],
    ['utm_medium', 'ALTER TABLE `campaign_lead` ADD COLUMN `utm_medium` VARCHAR(100) NULL'],
    ['utm_campaign', 'ALTER TABLE `campaign_lead` ADD COLUMN `utm_campaign` VARCHAR(100) NULL'],
    ['ip_address', 'ALTER TABLE `campaign_lead` ADD COLUMN `ip_address` VARCHAR(50) NULL'],
    ['user_agent', 'ALTER TABLE `campaign_lead` ADD COLUMN `user_agent` VARCHAR(500) NULL'],
    ['created_at', 'ALTER TABLE `campaign_lead` ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'],
    ['updated_at', 'ALTER TABLE `campaign_lead` ADD COLUMN `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'],
  ]

  for (const [column, statement] of additions) {
    if (!columns.has(column)) {
      await pool.query(statement)
      console.log(`Added campaign_lead.${column}`)
    }
  }
}

async function ensureIndexes(pool) {
  const [rows] = await pool.query('SHOW INDEX FROM `campaign_lead`')
  const indexes = new Set(rows.map((row) => row.Key_name))

  if (!indexes.has('idx_campaign_lead_status')) {
    await pool.query('CREATE INDEX `idx_campaign_lead_status` ON `campaign_lead` (`status`)')
    console.log('Created index idx_campaign_lead_status')
  }
  if (!indexes.has('idx_campaign_lead_created_at')) {
    await pool.query('CREATE INDEX `idx_campaign_lead_created_at` ON `campaign_lead` (`created_at`)')
    console.log('Created index idx_campaign_lead_created_at')
  }
  if (!indexes.has('idx_campaign_lead_email')) {
    await pool.query('CREATE INDEX `idx_campaign_lead_email` ON `campaign_lead` (`email`)')
    console.log('Created index idx_campaign_lead_email')
  }
  if (!indexes.has('idx_campaign_lead_phone')) {
    await pool.query('CREATE INDEX `idx_campaign_lead_phone` ON `campaign_lead` (`phone`)')
    console.log('Created index idx_campaign_lead_phone')
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
          \`name\` varchar(255) DEFAULT NULL,
          \`email\` varchar(255) DEFAULT NULL,
          \`phone\` varchar(50) DEFAULT NULL,
          \`interested_program\` varchar(255) DEFAULT NULL,
          \`interested_country\` varchar(255) DEFAULT NULL,
          \`intake_year\` varchar(50) DEFAULT NULL,
          \`reason\` text DEFAULT NULL,
          \`completed_step\` int NOT NULL DEFAULT 1,
          \`status\` enum('PARTIAL', 'COMPLETED', 'CONTACTED', 'CONVERTED', 'ARCHIVED') NOT NULL DEFAULT 'PARTIAL',
          \`utm_source\` varchar(100) DEFAULT NULL,
          \`utm_medium\` varchar(100) DEFAULT NULL,
          \`utm_campaign\` varchar(100) DEFAULT NULL,
          \`ip_address\` varchar(50) DEFAULT NULL,
          \`user_agent\` varchar(500) DEFAULT NULL,
          \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT \`campaign_lead_id\` PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
      console.log('Created campaign_lead table')
    } else {
      await ensureColumns(pool)
    }

    await ensureIndexes(pool)
    console.log('Campaign lead schema is ready')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exitCode = 1
})

