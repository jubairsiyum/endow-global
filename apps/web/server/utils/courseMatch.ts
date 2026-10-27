export interface MatchProfile {
  highestEducation?: string | null
  interestedProgram?: string | null
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

/**
 * Normalizes user-friendly interested program inputs to database CourseLevel enums.
 * E.g., "Masters" -> ['POSTGRADUATE'], "Bachelors" -> ['UNDERGRADUATE'], "Doctorate" -> ['PHD'].
 */
export function normalizeInterestedProgramToLevels(program?: string | null): string[] | null {
  if (!program) return null
  const p = program.trim().toLowerCase()
  if (
    p === 'masters' ||
    p === 'master' ||
    p === 'postgraduate' ||
    p === "master's" ||
    p === "master's degree" ||
    p.includes('master') ||
    p.includes('postgrad')
  ) {
    return ['POSTGRADUATE']
  }
  if (
    p === 'bachelors' ||
    p === 'bachelor' ||
    p === 'undergraduate' ||
    p === "bachelor's" ||
    p === "bachelor's degree" ||
    p.includes('bachelor') ||
    p.includes('undergrad')
  ) {
    return ['UNDERGRADUATE']
  }
  if (p === 'doctorate' || p === 'phd' || p === 'ph.d' || p.includes('phd') || p.includes('doctor')) {
    return ['PHD']
  }
  if (p === 'diploma' || p === 'certificate' || p.includes('diploma') || p.includes('cert')) {
    return ['DIPLOMA', 'CERTIFICATE']
  }
  if (p === 'foundation' || p.includes('foundation')) {
    return ['FOUNDATION']
  }
  return null
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
    profile.interestedProgram ||
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

  // 1. Program Level / Interested Program Fit (First-class constraint)
  const targetLevels = normalizeInterestedProgramToLevels(profile.interestedProgram)
  if (targetLevels && targetLevels.length > 0) {
    // If student explicitly specified an interested program (e.g. Masters),
    // they ONLY want courses matching that level! Non-matching levels are rejected.
    if (!targetLevels.includes(course.level)) {
      return { score: 0, reasons: [] }
    }
    score += 35
    reasons.push(`Target program: ${titleCase(course.level)}`)
  } else {
    // Fall back to level appropriate for highest completed education
    const levels = LEVEL_MAP[profile.highestEducation || '']
    if (levels && levels.includes(course.level)) {
      score += 20
      reasons.push(`Right level for you: ${titleCase(course.level)}`)
    }
  }

  // 2. Budget constraint & fit
  if (fee > 0 && profile.budgetMax) {
    if (fee <= profile.budgetMax) {
      score += 25
      reasons.push(`Within your budget ($${fee.toLocaleString()})`)
    } else if (fee <= profile.budgetMax * 1.15) {
      score += 8
      reasons.push('Close to your budget')
    } else {
      // Over budget: reject course from best match
      return { score: 0, reasons: [] }
    }
  } else if (fee > 0 && profile.budgetMin && profile.budgetMax) {
    if (fee >= profile.budgetMin && fee <= profile.budgetMax) {
      score += 25
      reasons.push('Within your budget range')
    }
  }

  // 3. Location — strong signal
  if (targetCountries.length > 0 && targetCountries.includes(country)) {
    score += 25
    reasons.push(`In your target country: ${course.universityCountry}`)
  }

  // 4. Field of study
  if (targetSubjects.length > 0 && targetSubjects.some((target) => subjectMatches(target, subject))) {
    score += 20
    reasons.push(`Matches your field of interest: ${subject}`)
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
  university: { country: string; ranking: string | null },
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

  const rankingStart = university.ranking
    ? Number.parseInt(String(university.ranking).replace(/,/g, '').match(/\d+/)?.[0] ?? '', 10)
    : NaN

  if (Number.isFinite(rankingStart) && rankingStart > 0) {
    if (rankingStart <= 100) {
      score += 15
      reasons.push(`Top 100 university (QS ${university.ranking})`)
    } else if (rankingStart <= 300) {
      score += 10
      reasons.push(`Ranked QS ${university.ranking} globally`)
    } else {
      score += 5
      reasons.push(`Ranked QS ${university.ranking} globally`)
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
