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
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
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

/** Loose subject match — handles "Computer Science" vs "Computer Science & IT". */
function subjectMatches(target: string, courseSubject: string): boolean {
  const t = norm(target)
  const s = norm(courseSubject)
  if (!t || !s) return false
  if (t === s) return true
  return s.includes(t) || t.includes(s)
}

export function hasMatchSignals(profile: MatchProfile): boolean {
  return Boolean(
    asArray(profile.targetCountries).length > 0 ||
    asArray(profile.targetSubjects).length > 0 ||
    profile.highestEducation ||
    profile.budgetMin ||
    profile.budgetMax ||
    profile.gpa ||
    profile.ieltsScore ||
    profile.toeflScore ||
    profile.preferredIntakeYear
  )
}

export function scoreCourse(profile: MatchProfile, course: MatchCourse): { score: number; reasons: string[] } {
  const reasons: string[] = []
  let score = 0

  const targetCountries = asArray(profile.targetCountries).map(norm)
  const targetSubjects = asArray(profile.targetSubjects)
  const country = norm(course.universityCountry)
  const subject = course.subject ?? ''
  const fee = course.tuitionFee || 0

  // 1. Location — strongest signal
  if (targetCountries.length > 0 && targetCountries.includes(country)) {
    score += 30
    reasons.push(`In your target country: ${course.universityCountry}`)
  }

  // 2. Field of study
  if (targetSubjects.length > 0 && targetSubjects.some((target) => subjectMatches(target, subject))) {
    score += 20
    reasons.push(`Matches your field of interest: ${subject}`)
  }

  // 3. Right degree level for your current education
  const levels = LEVEL_MAP[profile.highestEducation || '']
  if (levels && levels.includes(course.level)) {
    score += 20
    reasons.push(`Right level for you: ${titleCase(course.level)}`)
  }

  // 4. Budget (treat tuition as per-term, compare against annual budget as a range)
  if (fee > 0) {
    if (profile.budgetMin && profile.budgetMax) {
      const annual = fee * 2
      if (annual >= profile.budgetMin && annual <= profile.budgetMax) {
        score += 15
        reasons.push('Within your budget range')
      } else if (annual <= profile.budgetMax * 1.3) {
        score += 7
        reasons.push('Close to your budget')
      }
    } else if (profile.budgetMax) {
      const annual = fee * 2
      if (annual <= profile.budgetMax) {
        score += 15
        reasons.push('Within your budget')
      } else if (annual <= profile.budgetMax * 1.3) {
        score += 7
        reasons.push('Close to your budget')
      }
    }
  }

  // 5. Scholarship availability
  if (course.hasScholarship) {
    score += 8
    reasons.push('Scholarship available')
  }

  // 6. English proficiency fit
  const englishReady =
    course.englishTestWaiver ||
    (profile.ieltsScore != null && profile.ieltsScore >= 6.5) ||
    (profile.toeflScore != null && profile.toeflScore >= 90)
  if (englishReady) {
    score += 5
    reasons.push('You meet the English requirement')
  }

  // 7. Intake timing — course starts near your preferred intake year
  if (profile.preferredIntakeYear && course.startDate) {
    const startYear = new Date(course.startDate).getFullYear()
    if (Number.isFinite(startYear)) {
      const diff = Math.abs(startYear - profile.preferredIntakeYear)
      if (diff <= 1) {
        score += 5
        reasons.push(`Starts ${startYear}, close to your ${profile.preferredIntakeYear} intake`)
      }
    }
  }

  if (course.expressOffer) {
    score += 2
    reasons.push('Express offer available')
  }

  return { score: Math.min(100, score), reasons: reasons.slice(0, 4) }
}

export function scoreUniversity(
  profile: MatchProfile,
  university: { country: string; ranking: number | null },
  matchedCourses: { score: number }[]
): { score: number; reasons: string[] } {
  const reasons: string[] = []
  let score = 0

  const targetCountries = asArray(profile.targetCountries).map(norm)
  const country = norm(university.country)

  if (targetCountries.length > 0 && targetCountries.includes(country)) {
    score += 30
    reasons.push(`In your target country: ${university.country}`)
  }

  if (matchedCourses.length > 0) {
    const best = Math.max(...matchedCourses.map((c) => c.score))
    score += Math.min(30, best)
    reasons.push(`${matchedCourses.length} matching course${matchedCourses.length > 1 ? 's' : ''}`)
  }

  if (university.ranking != null && university.ranking > 0) {
    if (university.ranking <= 100) {
      score += 15
      reasons.push(`Top 100 university (#${university.ranking})`)
    } else if (university.ranking <= 300) {
      score += 10
      reasons.push(`Ranked #${university.ranking} globally`)
    } else {
      score += 5
      reasons.push(`Ranked #${university.ranking} globally`)
    }
  }

  return { score: Math.min(100, score), reasons: reasons.slice(0, 4) }
}

/** Broad subject options shown in the Study Preferences form. */
export const SUBJECT_OPTIONS = [
  'Business',
  'Computer Science & IT',
  'Engineering',
  'Medicine & Health',
  'Nursing',
  'Natural Sciences',
  'Humanities & Social Sciences',
  'Arts & Design',
  'Media & Communication',
  'Economics',
  'Hospitality & Tourism',
  'Aviation',
  'Korean Studies',
  'Languages',
  'International Studies',
  'Sports Science',
  'Agriculture',
]
