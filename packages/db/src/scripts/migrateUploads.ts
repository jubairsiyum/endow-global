import { db, schema } from '../..'
import { eq, like } from 'drizzle-orm'
import * as fs from 'node:fs'
import * as fsp from 'node:fs/promises'
import path from 'node:path'

/**
 * One-off migration: move student documents out of the publicly served
 * `public/uploads` directory into the private uploads directory and rewrite
 * their stored URL to the authenticated `/api/files/<ref>` endpoint.
 *
 * Run from packages/db: pnpm tsx src/scripts/migrateUploads.ts
 */

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..')
const APP_WEB = path.join(REPO_ROOT, 'apps', 'web')
const PRIVATE_DIR = path.join(APP_WEB, 'uploads')
const LEGACY_DIR = path.join(APP_WEB, 'public', 'uploads')

async function moveFile(from: string, to: string): Promise<void> {
  try {
    await fsp.rename(from, to)
  } catch (err: any) {
    if (err && err.code === 'EXDEV') {
      await fsp.copyFile(from, to)
      await fsp.unlink(from)
    } else {
      throw err
    }
  }
}

async function main() {
  await fsp.mkdir(PRIVATE_DIR, { recursive: true })

  const rows = await db
    .select({
      id: schema.studentDocuments.id,
      label: schema.studentDocuments.label,
      fileUrl: schema.studentDocuments.fileUrl,
    })
    .from(schema.studentDocuments)
    .where(like(schema.studentDocuments.fileUrl, '/uploads/%'))

  console.log(`Found ${rows.length} legacy document row(s) referencing /uploads/...`)

  let moved = 0
  let skipped = 0
  let missing = 0

  for (const row of rows) {
    const filename = (row.fileUrl ?? '').split('/').pop()
    if (!filename) {
      skipped++
      console.log(`SKIP (no filename): ${row.id}`)
      continue
    }

    const from = path.join(LEGACY_DIR, filename)
    const to = path.join(PRIVATE_DIR, filename)

    if (!fs.existsSync(from)) {
      missing++
      console.log(`SKIP (file missing): ${row.id} (${filename})`)
      continue
    }

    try {
      await moveFile(from, to)
    } catch (err: any) {
      console.log(`ERROR moving ${filename}: ${err.message}`)
      skipped++
      continue
    }

    await db
      .update(schema.studentDocuments)
      .set({ fileUrl: `/api/files/${filename}` })
      .where(eq(schema.studentDocuments.id, row.id))

    moved++
    console.log(`MOVED: ${row.id} (${row.label}) -> /api/files/${filename}`)
  }

  console.log(`\nDone. moved=${moved}, skipped=${skipped}, missing=${missing}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})