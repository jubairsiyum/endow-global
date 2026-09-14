import { NextResponse } from 'next/server'
import { readLocalFile } from '@/lib/local-storage'

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export async function GET(_request: Request, { params }: { params: { path: string[] } }) {
  const key = params.path.join('/')
  if (!key.startsWith('public/')) {
    return new NextResponse('Not found', { status: 404 })
  }

  try {
    const data = await readLocalFile(key)
    const ext = key.split('.').pop()?.toLowerCase() ?? ''
    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type': MIME_TYPES[ext] ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
