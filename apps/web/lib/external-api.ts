import { timingSafeEqual } from 'node:crypto'

function getProvidedApiKey(request: Request): string | null {
  const authorization = request.headers.get('authorization')
  if (authorization?.toLowerCase().startsWith('bearer ')) {
    return authorization.slice(7).trim()
  }
  return request.headers.get('x-endow-api-key')?.trim() || null
}

export function isExternalApiAuthorized(request: Request): boolean {
  const expected = process.env.ENDOW_EXTERNAL_API_KEY
  const provided = getProvidedApiKey(request)
  if (!expected || !provided) return false

  const expectedBuffer = Buffer.from(expected)
  const providedBuffer = Buffer.from(provided)
  return expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer)
}
