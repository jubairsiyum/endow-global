import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { auth } from '@/lib/auth'
import { db, schema } from '@/lib/db'
import { eq as _eq } from 'drizzle-orm'

const eq = _eq as any

// File types accepted for upload (by extension) and their MIME type.
const ALLOWED_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const VALID_FILENAME = /^[a-zA-Z0-9._-]+$/

// Private documents (student uploads) live outside the public dir and are only
// served through the authenticated /api/files/<ref> route. Public resources
// (brochures etc.) keep living in public/uploads and remain accessible.
const PRIVATE_UPLOAD_DIR = path.join(process.cwd(), 'uploads')
const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const scope = formData.get('scope') === 'private' ? 'private' : 'public'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size === 0) return NextResponse.json({ error: 'Empty file' }, { status: 400 })
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 413 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_TYPES[ext]) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    if (scope === 'private') {
      // Only a student (someone with a student profile) may upload a private
      // document; those files are bound to their account at access time.
      const hasProfile = await db
        .select({ id: schema.studentProfiles.id })
        .from(schema.studentProfiles)
        .where(eq(schema.studentProfiles.userId, session.user.id))
        .limit(1)
        .then((r) => r[0] ?? null)

      if (!hasProfile) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const token = globalThis.crypto.randomUUID()
      const filename = `${token}.${ext}`
      if (!VALID_FILENAME.test(filename)) {
        return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
      }

      await mkdir(PRIVATE_UPLOAD_DIR, { recursive: true })
      await writeFile(path.join(PRIVATE_UPLOAD_DIR, filename), buffer)

      return NextResponse.json({
        url: `/api/files/${filename}`,
        name: file.name,
        size: file.size,
        type: ALLOWED_TYPES[ext],
      })
    }

    // Public upload (resources / brochures)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    await mkdir(PUBLIC_UPLOAD_DIR, { recursive: true })
    await writeFile(path.join(PUBLIC_UPLOAD_DIR, filename), buffer)

    return NextResponse.json({
      url: `/uploads/${filename}`,
      name: file.name,
      size: file.size,
      type: file.type || ALLOWED_TYPES[ext],
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 })
  }
}