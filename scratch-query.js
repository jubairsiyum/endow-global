const mysql = require('./apps/web/node_modules/mysql2/promise')
const dotenv = require('./apps/web/node_modules/dotenv')
dotenv.config({ path: 'apps/web/.env' })

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL)
  const [rows] = await conn.execute(
    'SELECT id, university_id, name, start_date, application_deadline, is_active FROM courses WHERE is_active = 1'
  )
  console.log('Total active courses:', rows.length)
  for (const r of rows) {
    const s = r.start_date ? new Date(r.start_date).toISOString().slice(0, 10) : 'null'
    const d = r.application_deadline ? new Date(r.application_deadline).toISOString().slice(0, 10) : 'null'
    console.log(`${r.name} | start: ${s} | dl: ${d} | uni: ${r.university_id}`)
  }
  await conn.end()
}
main().catch(console.error)
