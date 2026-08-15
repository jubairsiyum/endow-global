export type CourseFilters = {
  countries: string[]
  cities: string[]
  institutionIds: string[]
  levels: string[]
  subjects: string[]
  expressOffer: boolean
  englishWaiver: boolean
  durations: string[]
  startYears: number[]
  feeMin: number | null
  feeMax: number | null
}

export const EMPTY_FILTERS: CourseFilters = {
  countries: [],
  cities: [],
  institutionIds: [],
  levels: [],
  subjects: [],
  expressOffer: false,
  englishWaiver: false,
  durations: [],
  startYears: [],
  feeMin: null,
  feeMax: null,
}

export const FEE_MAX_LIMIT = 214000

export function countActiveFilters(filters: CourseFilters): number {
  let n = 0
  n += filters.countries.length
  n += filters.cities.length
  n += filters.institutionIds.length
  n += filters.levels.length
  n += filters.subjects.length
  if (filters.expressOffer) n++
  if (filters.englishWaiver) n++
  n += filters.durations.length
  n += filters.startYears.length
  if (filters.feeMin !== null) n++
  if (filters.feeMax !== null) n++
  return n
}

function csv(value: string | null): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

function int(value: string | null): number | null {
  if (!value) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function parseFilters(params: URLSearchParams): CourseFilters {
  return {
    countries: csv(params.get('country')),
    cities: csv(params.get('city')),
    institutionIds: csv(params.get('inst')),
    levels: csv(params.get('level')),
    subjects: csv(params.get('subject')),
    expressOffer: params.get('express') === '1',
    englishWaiver: params.get('waiver') === '1',
    durations: csv(params.get('duration')),
    startYears: csv(params.get('year'))
      .map(Number)
      .filter((n) => Number.isFinite(n)),
    feeMin: int(params.get('feeMin')),
    feeMax: int(params.get('feeMax')),
  }
}

export function serializeFilters(filters: CourseFilters): URLSearchParams {
  const p = new URLSearchParams()
  if (filters.countries.length) p.set('country', filters.countries.join(','))
  if (filters.cities.length) p.set('city', filters.cities.join(','))
  if (filters.institutionIds.length) p.set('inst', filters.institutionIds.join(','))
  if (filters.levels.length) p.set('level', filters.levels.join(','))
  if (filters.subjects.length) p.set('subject', filters.subjects.join(','))
  if (filters.expressOffer) p.set('express', '1')
  if (filters.englishWaiver) p.set('waiver', '1')
  if (filters.durations.length) p.set('duration', filters.durations.join(','))
  if (filters.startYears.length) p.set('year', filters.startYears.join(','))
  if (filters.feeMin !== null) p.set('feeMin', String(filters.feeMin))
  if (filters.feeMax !== null) p.set('feeMax', String(filters.feeMax))
  return p
}
