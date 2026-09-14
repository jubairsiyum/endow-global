import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getLocalFileUrl, writeLocalFile } from '@/lib/local-storage'

const ALLOWED_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

const MAX_SIZE = 4 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size === 0) return NextResponse.json({ error: 'Empty file' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Image too large (max 4 MB)' }, { status: 413 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    if (!ALLOWED_TYPES[ext]) return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 })
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const key = `public/images/${filename}`

    await writeLocalFile(key, buffer)

    const url = getLocalFileUrl(key)
    return NextResponse.json({ url, name: file.name })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 })
  }
}
