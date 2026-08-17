export interface MatchProfile {
  highestEducation?: string | null
  targetCountries?: string[]
  targetSubjects?: string[]
  budgetMin?: number | null
  budgetMax?: number | null
  gpa?: number | null
  ieltsScore?: number | null
  toeflScore?: number | null
  preferredIntakeMonth?: string | null
  preferredIntakeYear?: number | null
}

export interface MatchCourse {
  subject: string
  level: string
  tuitionFee: number
  hasScholarship: boolean
  englishTestWaiver: boolean
  expressOffer: boolean
  startDate: Date | string | null
  universityCountry: string
}

const LEVEL_MAP: Record<string, string[]> = {
  HIGH_SCHOOL: ['UNDERGRADUATE', 'FOUNDATION', 'DIPLOMA', 'CERTIFICATE'],
  BACHELORS: ['POSTGRADUATE', 'DIPLOMA', 'CERTIFICATE'],
  MASTERS: ['POSTGRADUATE', 'PHD'],
  PHD: ['PHD'],
}

function norm(value: string): string {
  return value.trim().toLowerCase()
}

function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function hasMatchSignals(profile: MatchProfile): boolean {
  return Boolean(
    asArray(profile.targetCountries).length > 0 ||
    asArray(profile.targetSubjects).length > 0 ||
    profile.highestEducation ||
    profile.budgetMax ||
    profile.gpa ||
    profile.ieltsScore ||
    profile.toeflScore
  )
}

export function scoreCourse(profile: MatchProfile, course: MatchCourse): { score: number; reasons: string[] } {
  const reasons: string[] = []
  let score = 0

  const targetCountries = asArray(profile.targetCountries).map(norm)
  const targetSubjects = asArray(profile.targetSubjects).map(norm)
  const country = norm(course.universityCountry)
  const subject = norm(course.subject)
  const fee = course.tuitionFee || 0

  if (targetCountries.length > 0 && targetCountries.includes(country)) {
    score += 30
    reasons.push(`In your target country: ${course.universityCountry}`)
  }

  if (targetSubjects.length > 0 && targetSubjects.includes(subject)) {
    score += 20
    reasons.push(`Matches your field of interest: ${course.subject}`)
  }

  const levels = LEVEL_MAP[profile.highestEducation || '']
  if (levels && levels.includes(course.level)) {
    score += 20
    reasons.push(`Right level for you: ${titleCase(course.level)}`)
  }

  if (profile.budgetMax && fee > 0) {
    if (fee <= profile.budgetMax) {
      score += 15
      reasons.push('Within your budget range')
    } else if (fee <= profile.budgetMax * 1.3) {
      score += 7
      reasons.push('Close to your budget')
    }
  }

  if (course.hasScholarship) {
    score += 8
    reasons.push('Scholarship available')
  }

  const englishReady =
    course.englishTestWaiver ||
    (profile.ieltsScore != null && profile.ieltsScore >= 6.5) ||
    (profile.toeflScore != null && profile.toeflScore >= 90)
  if (englishReady) {
    score += 5
    reasons.push('You meet the English requirement')
  }

  if (course.expressOffer) {
    score += 2
    reasons.push('Express offer available')
  }

  return { score: Math.min(100, score), reasons: reasons.slice(0, 4) }
}
