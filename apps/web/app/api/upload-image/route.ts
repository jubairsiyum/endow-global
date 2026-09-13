import { NextRequest, NextResponse } from 'next/server'
import { uploadBuffer, getCDNUrl } from '@/lib/s3'

const ALLOWED_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const key = `public/uploads/${filename}`

    const contentType = ALLOWED_TYPES[ext] || file.type || 'application/octet-stream'
    await uploadBuffer(key, buffer, contentType)

    const url = getCDNUrl(key)
    return NextResponse.json({ url, name: file.name })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 })
  }
}
