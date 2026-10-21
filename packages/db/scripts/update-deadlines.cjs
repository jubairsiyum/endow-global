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
  const pool = await mysql.createPool(databaseOptions(process.env.DATABASE_URL))

  console.log('--- Updating Course Deadlines per University ---')

  // 1. Kyung Hee University (Seoul)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%Spring Admission%' THEN '2026-11-20 23:59:59'
        WHEN name LIKE '%Winter Session%' THEN '2026-11-05 23:59:59'
        WHEN name LIKE '%Summer Session%' THEN '2027-04-10 23:59:59'
        WHEN name LIKE '%MBA%' THEN '2026-12-05 23:59:59'
        WHEN name LIKE '%Computer Science%' THEN '2027-06-15 23:59:59'
        ELSE application_deadline
      END,
      start_date = CASE
        WHEN name LIKE '%Spring Admission%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Winter Session%' THEN '2026-12-01 09:00:00'
        WHEN name LIKE '%Summer Session%' THEN '2027-06-01 09:00:00'
        WHEN name LIKE '%MBA%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Computer Science%' THEN '2027-09-01 09:00:00'
        ELSE start_date
      END
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Kyung Hee%')
  `)

  // 2. Sejong University (Seoul)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%Spring Admission%' THEN '2026-12-04 23:59:59'
        WHEN name LIKE '%Summer Session%' THEN '2027-04-25 23:59:59'
        WHEN name LIKE '%MBA%' THEN '2026-12-18 23:59:59'
        WHEN name LIKE '%Computer Science%' THEN '2027-06-30 23:59:59'
        ELSE application_deadline
      END,
      start_date = CASE
        WHEN name LIKE '%Spring Admission%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Summer Session%' THEN '2027-06-01 09:00:00'
        WHEN name LIKE '%MBA%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Computer Science%' THEN '2027-09-01 09:00:00'
        ELSE start_date
      END
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Sejong%')
  `)

  // 3. Dong-Eui University (Busan)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%Spring Admission%' THEN '2027-01-15 23:59:59'
        WHEN name LIKE '%Summer Session%' THEN '2027-05-15 23:59:59'
        WHEN name LIKE '%MBA%' THEN '2027-01-25 23:59:59'
        WHEN name LIKE '%Computer Science%' THEN '2027-07-10 23:59:59'
        ELSE application_deadline
      END,
      start_date = CASE
        WHEN name LIKE '%Spring Admission%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Summer Session%' THEN '2027-06-01 09:00:00'
        WHEN name LIKE '%MBA%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Computer Science%' THEN '2027-09-01 09:00:00'
        ELSE start_date
      END
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Dong-Eui%')
  `)

  // 4. Sun Moon University (Asan)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%Spring Admission%' THEN '2026-12-24 23:59:59'
        WHEN name LIKE '%Summer Session%' THEN '2027-04-30 23:59:59'
        WHEN name LIKE '%MBA%' THEN '2027-01-10 23:59:59'
        WHEN name LIKE '%Computer Science%' THEN '2027-06-20 23:59:59'
        ELSE application_deadline
      END,
      start_date = CASE
        WHEN name LIKE '%Spring Admission%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Summer Session%' THEN '2027-06-01 09:00:00'
        WHEN name LIKE '%MBA%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Computer Science%' THEN '2027-09-01 09:00:00'
        ELSE start_date
      END
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Sun Moon%')
  `)

  // 5. Sahmyook University (Seoul)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%Spring Admission%' THEN '2026-12-10 23:59:59'
        WHEN name LIKE '%Winter Session%' THEN '2026-11-12 23:59:59'
        WHEN name LIKE '%MBA%' THEN '2027-01-05 23:59:59'
        WHEN name LIKE '%Computer Science%' THEN '2027-07-01 23:59:59'
        ELSE application_deadline
      END,
      start_date = CASE
        WHEN name LIKE '%Spring Admission%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Winter Session%' THEN '2026-12-05 09:00:00'
        WHEN name LIKE '%MBA%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Computer Science%' THEN '2027-09-01 09:00:00'
        ELSE start_date
      END
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Sahmyook%')
  `)

  // 6. Chungwoon University (Hongseong/Incheon)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%Spring Admission%' THEN '2027-01-12 23:59:59'
        WHEN name LIKE '%MBA%' THEN '2027-01-28 23:59:59'
        WHEN name LIKE '%Computer Science%' THEN '2027-07-15 23:59:59'
        ELSE application_deadline
      END,
      start_date = CASE
        WHEN name LIKE '%Spring Admission%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%MBA%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Computer Science%' THEN '2027-09-01 09:00:00'
        ELSE start_date
      END
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Chungwoon%')
  `)

  // 7. Yeungjin University (Daegu)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%Spring Admission%' THEN '2027-01-08 23:59:59'
        WHEN name LIKE '%MBA%' THEN '2027-01-20 23:59:59'
        WHEN name LIKE '%Computer Science%' THEN '2027-07-05 23:59:59'
        ELSE application_deadline
      END,
      start_date = CASE
        WHEN name LIKE '%Spring Admission%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%MBA%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Computer Science%' THEN '2027-09-01 09:00:00'
        ELSE start_date
      END
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Yeungjin%')
  `)

  // 8. Daejin University (Pocheon)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%Spring Admission%' THEN '2026-12-28 23:59:59'
        WHEN name LIKE '%Winter Session%' THEN '2026-11-18 23:59:59'
        WHEN name LIKE '%MBA%' THEN '2027-01-18 23:59:59'
        WHEN name LIKE '%Computer Science%' THEN '2027-06-28 23:59:59'
        ELSE application_deadline
      END,
      start_date = CASE
        WHEN name LIKE '%Spring Admission%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Winter Session%' THEN '2026-12-05 09:00:00'
        WHEN name LIKE '%MBA%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Computer Science%' THEN '2027-09-01 09:00:00'
        ELSE start_date
      END
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Daejin%')
  `)

  // 9. Hanseo University (Seosan)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%Spring Admission%' THEN '2027-01-22 23:59:59'
        WHEN name LIKE '%Winter Session%' THEN '2026-11-25 23:59:59'
        WHEN name LIKE '%MBA%' THEN '2027-02-05 23:59:59'
        WHEN name LIKE '%Computer Science%' THEN '2027-07-20 23:59:59'
        ELSE application_deadline
      END,
      start_date = CASE
        WHEN name LIKE '%Spring Admission%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Winter Session%' THEN '2026-12-10 09:00:00'
        WHEN name LIKE '%MBA%' THEN '2027-03-02 09:00:00'
        WHEN name LIKE '%Computer Science%' THEN '2027-09-01 09:00:00'
        ELSE start_date
      END
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Hanseo%')
  `)

  // 10. Manchester (UK)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%Computer Science%' THEN '2027-07-31 23:59:59'
        WHEN name LIKE '%MBA%' THEN '2027-05-15 23:59:59'
        ELSE '2027-06-30 23:59:59'
      END,
      start_date = '2027-09-20 09:00:00'
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Manchester%')
  `)

  // 11. Melbourne (Australia)
  await pool.query(`
    UPDATE course SET 
      application_deadline = CASE 
        WHEN name LIKE '%MBA%' THEN '2026-11-30 23:59:59'
        WHEN name LIKE '%Computer Science%' THEN '2027-04-30 23:59:59'
        ELSE '2026-11-30 23:59:59'
      END,
      start_date = CASE
        WHEN name LIKE '%MBA%' THEN '2027-02-22 09:00:00'
        ELSE '2027-07-19 09:00:00'
      END
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Melbourne%')
  `)

  // 12. Toronto (Canada)
  await pool.query(`
    UPDATE course SET 
      application_deadline = '2027-01-15 23:59:59',
      start_date = '2027-09-07 09:00:00'
    WHERE university_id IN (SELECT id FROM university WHERE name LIKE '%Toronto%')
  `)

  console.log('Deadlines updated successfully.')

  // Update existing resources with current/recent timestamps and view counts
  const now = new Date()
  const h2Ago = new Date(now.getTime() - 2 * 3600 * 1000)
  const d1Ago = new Date(now.getTime() - 26 * 3600 * 1000)
  const d2Ago = new Date(now.getTime() - 52 * 3600 * 1000)
  const d4Ago = new Date(now.getTime() - 96 * 3600 * 1000)
  const w1Ago = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
  const w2Ago = new Date(now.getTime() - 14 * 24 * 3600 * 1000)

  const [posts] = await pool.query('SELECT id, slug FROM resource WHERE type = "BLOG" ORDER BY id')
  const dates = [h2Ago, d1Ago, d2Ago, d4Ago, w1Ago, w2Ago]
  const views = [4560, 3840, 4210, 2890, 5120, 3420]

  for (let i = 0; i < posts.length; i++) {
    const postDate = dates[i % dates.length]
    const postViews = views[i % views.length]
    await pool.query(
      'UPDATE resource SET published_at = ?, created_at = ?, view_count = ? WHERE id = ?',
      [postDate, postDate, postViews, posts[i].id]
    )
  }

  console.log('Resources updated with current dates and dynamic views.')
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

