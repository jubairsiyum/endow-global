import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'
import { auth } from '@/lib/auth'
import { db, schema } from '@/lib/db'
import { or as _or, eq as _eq } from 'drizzle-orm'

const or = _or as any
const eq = _eq as any

const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

// Token filenames are generated server-side (uuid + extension), so anything
// else (paths, slashes, traversal attempts) is rejected before touching disk.
const VALID_REF = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/
const CAREER_ROLES = ['ADMIN', 'SUPER_ADMIN', 'COUNSELOR']

const PRIVATE_UPLOAD_DIR = path.join(process.cwd(), 'uploads')
const LEGACY_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

interface Params {
  ref: string
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const ref = params.ref
    if (!ref || ref.length > 200 || !VALID_REF.test(ref)) {
      return new NextResponse('Not found', { status: 404 })
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const role = (session.user as any).role as string
    const isCareer = CAREER_ROLES.includes(role)

    // Locate the document row that owns this file. We accept both the current
    // private reference and the legacy public reference so migrated rows keep
    // working while the DB is being updated.
    const [doc] = await db
      .select({
        id: schema.studentDocuments.id,
        studentId: schema.studentDocuments.studentId,
        label: schema.studentDocuments.label,
        fileUrl: schema.studentDocuments.fileUrl,
      })
      .from(schema.studentDocuments)
      .where(
        or(
          eq(schema.studentDocuments.fileUrl, `/api/files/${ref}`),
          eq(schema.studentDocuments.fileUrl, `/uploads/${ref}`)
        )
      )
      .limit(1)

    if (!doc) {
      return new NextResponse('Not found', { status: 404 })
    }

    // Admins, super admins and counselors may open any document. A student may
    // only open their own documents.
    if (!isCareer) {
      const profile = await db
        .select({ id: schema.studentProfiles.id })
        .from(schema.studentProfiles)
        .where(eq(schema.studentProfiles.userId, session.user.id))
        .limit(1)
        .then((r) => r[0] ?? null)

      if (!profile || profile.id !== doc.studentId) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    // Resolve the physical file: current private dir first, then legacy public
    // dir for rows that have not been migrated yet.
    const candidates = [
      path.join(PRIVATE_UPLOAD_DIR, ref),
      path.join(LEGACY_UPLOAD_DIR, ref),
    ]

    let filePath: string | null = null
    for (const candidate of candidates) {
      try {
        const info = await stat(candidate)
        if (info.isFile()) {
          filePath = candidate
          break
        }
      } catch {
        // keep searching
      }
    }

    if (!filePath) {
      return new NextResponse('Not found', { status: 404 })
    }

    const data = await readFile(filePath)
    const ext = ref.split('.').pop()?.toLowerCase() ?? ''
    const type = MIME_TYPES[ext] ?? 'application/octet-stream'

    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        'Content-Type': type,
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}