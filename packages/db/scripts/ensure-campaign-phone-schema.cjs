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
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
  const pool = await mysql.createPool(databaseOptions(process.env.DATABASE_URL))
  try {
    const [rows] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'campaign_lead'",
    )
    const columns = new Set(rows.map((row) => row.COLUMN_NAME))

    if (!columns.has('normalized_phone')) {
      await pool.query('ALTER TABLE `campaign_lead` ADD COLUMN `normalized_phone` VARCHAR(50) NULL')
      console.log('Added campaign_lead.normalized_phone column')
    } else {
      console.log('campaign_lead.normalized_phone column already exists')
    }

    const [idxRows] = await pool.query('SHOW INDEX FROM `campaign_lead`')
    const indexes = new Set(idxRows.map((row) => row.Key_name))

    if (!indexes.has('idx_campaign_lead_normalized_phone')) {
      await pool.query('CREATE INDEX `idx_campaign_lead_normalized_phone` ON `campaign_lead` (`normalized_phone`)')
      console.log('Created index idx_campaign_lead_normalized_phone')
    }

    // Backfill any existing rows where normalized_phone is NULL
    const [leadsToBackfill] = await pool.query('SELECT id, phone FROM `campaign_lead` WHERE phone IS NOT NULL AND (normalized_phone IS NULL OR normalized_phone = "")')
    for (const row of leadsToBackfill) {
      let digits = (row.phone || '').replace(/\D/g, '')
      if (digits.startsWith('880')) digits = digits.slice(2)
      else if (digits.startsWith('88') && digits.length === 12 && digits.charAt(2) === '1') digits = '0' + digits.slice(2)
      if (digits.length === 10 && digits.startsWith('1')) digits = '0' + digits
      if (digits) {
        await pool.query('UPDATE `campaign_lead` SET `normalized_phone` = ? WHERE `id` = ?', [digits, row.id])
      }
    }

    console.log('Campaign lead phone schema ready')
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

