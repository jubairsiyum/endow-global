// Basic country normalization utility.
// NOTE: This is intentionally lightweight. For production use, replace with an authoritative ISO country library.

const COMMON_MAP: Record<string, string> = {
  'united states': 'US',
  'united states of america': 'US',
  'usa': 'US',
  'us': 'US',
  'united kingdom': 'GB',
  'uk': 'GB',
  'great britain': 'GB',
  'south korea': 'KR',
  'korea': 'KR',
  'china': 'CN',
  'india': 'IN',
}

export function normalizeCountry(input: string | null | undefined): string | null {
  if (!input) return null
  const s = input.trim().toLowerCase()
  if (!s) return null
  if (COMMON_MAP[s]) return COMMON_MAP[s]
  // If input already looks like an ISO alpha-2 code
  if (/^[A-Za-z]{2}$/.test(s)) return s.toUpperCase()
  // Fallback: capitalize words and return as-is (best-effort)
  return s.split(/\s+/).map((p) => p[0].toUpperCase() + p.slice(1)).join(' ')
}

export function normalizeCountryList(list: any): string[] {
  if (!Array.isArray(list)) return []
  return list.map((c) => normalizeCountry(String(c))).filter(Boolean) as string[]
}
