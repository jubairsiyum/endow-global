// Shared configuration for the student document checklist.
// The documents a student must submit depend on the programme they are
// applying for, their academic background, and the standardized / language
// tests they have taken.

export type ApplicantLevel = 'UNDERGRADUATE' | 'POSTGRADUATE'

export interface DocumentRequirement {
  category: string
  label: string
  description?: string
  required?: boolean
}

export const DOCUMENT_REQUIREMENTS: Record<ApplicantLevel, DocumentRequirement[]> = {
  UNDERGRADUATE: [
    { category: 'Identity', label: 'Passport', description: 'Valid international passport' },
    { category: 'Academic Certificates', label: 'HSC / High School Certificate', description: 'Higher secondary / 12th certificate & transcript' },
    { category: 'Academic Certificates', label: 'SSC / Secondary Certificate', description: 'Secondary school certificate & transcript' },
  ],
  POSTGRADUATE: [
    { category: 'Identity', label: 'Passport', description: 'Valid international passport' },
    { category: 'Academic Certificates', label: 'Bachelor Degree Certificate & Transcript', description: 'Official degree certificate and transcript' },
    { category: 'Academic Certificates', label: 'HSC / High School Certificate', description: 'Higher secondary / 12th certificate & transcript' },
    { category: 'Academic Certificates', label: 'SSC / Secondary Certificate', description: 'Secondary school certificate & transcript' },
  ],
}

export const APPLICANT_LEVEL_LABEL: Record<ApplicantLevel, string> = {
  UNDERGRADUATE: 'Undergraduate',
  POSTGRADUATE: 'Postgraduate',
}

// Maps user education level to applicant level if active course / inquiry not found
export function applicantLevelFromEducation(education?: string | null): ApplicantLevel {
  switch (education) {
    case 'BACHELORS':
    case 'MASTERS':
    case 'PHD':
      return 'POSTGRADUATE'
    default:
      return 'UNDERGRADUATE'
  }
}

// Normalizes document labels across various user forms, admin inputs, and uploaders
export function normalizeDocLabel(label: string): string {
  const l = (label || '').toLowerCase().trim()
  if (l.includes('passport')) return 'Passport'

  // Master's degree
  if (
    l.includes('master') ||
    l.includes('msc') ||
    l.includes('mba') ||
    l.includes('postgraduate degree')
  ) {
    return 'Master Degree Certificate & Transcript'
  }

  // Bachelor's degree
  if (
    l.includes('bachelor') ||
    l.includes('bsc') ||
    l.includes('bba') ||
    l.includes('undergraduate degree')
  ) {
    return 'Bachelor Degree Certificate & Transcript'
  }

  // HSC / 12th
  if (
    l.includes('hsc') ||
    l.includes('12th') ||
    l.includes('high school') ||
    l.includes('a-level') ||
    l.includes('a level')
  ) {
    return 'HSC / High School Certificate'
  }

  // SSC / 10th
  if (
    l.includes('ssc') ||
    l.includes('10th') ||
    l.includes('secondary') ||
    l.includes('o-level') ||
    l.includes('o level')
  ) {
    return 'SSC / Secondary Certificate'
  }

  // Specific Language & Standardized Tests (Keep each test distinct!)
  if (l.includes('ielts')) return 'IELTS Certificate'
  if (l.includes('toefl')) return 'TOEFL Certificate'
  if (l.includes('topik')) return 'TOPIK Certificate (Korean Proficiency)'
  if (l.includes('sat')) return 'SAT Score Report'
  if (l.includes('gre')) return 'GRE Score Report'
  if (l.includes('duolingo')) return 'Duolingo English Test Certificate'
  if (l.includes('pte')) return 'PTE Academic Certificate'

  // Legacy fallback if an older record exists without specific test distinction
  if (l.includes('language test certificate (ielts/toefl/topik)')) {
    return 'Language Test Certificate (IELTS/TOEFL/TOPIK)'
  }
  if (l.includes('language') || l.includes('english')) {
    return 'Language Test Certificate'
  }

  return label
}

// Stable key used to match a requirement against a stored document row.
export function requirementKey(category: string, label: string): string {
  return `${category}\u0000${normalizeDocLabel(label)}`
}

export interface StudentProfileData {
  highestEducation?: string | null
  ieltsScore?: number | string | null
  toeflScore?: number | string | null
  satScore?: number | string | null
  greScore?: number | string | null
}

export interface StudentInquiryData {
  applyingTo?: string | null
  englishTest?: string | null
  ieltsScore?: string | null
  toeflScore?: string | null
  satScore?: string | null
  topikLevel?: string | null
  sscYear?: string | null
  sscResult?: string | null
  hscYear?: string | null
  hscResult?: string | null
  bachelorsYear?: string | null
  bachelorsResult?: string | null
  mastersYear?: string | null
  mastersResult?: string | null
}

// Computes dynamic checklist requirements tailored to what the student filled:
// - Always Passport
// - Academic certificates (SSC, HSC, Bachelor's if postgrad/filled, Master's if postgrad/filled)
// - Language/Test certificates strictly for tests the student filled (IELTS, TOEFL, TOPIK, SAT, GRE, etc.)
export function getRequiredDocuments(
  level: ApplicantLevel,
  profile?: StudentProfileData | null,
  inquiry?: StudentInquiryData | null
): DocumentRequirement[] {
  const reqs: DocumentRequirement[] = []

  // 1. Identity
  reqs.push({
    category: 'Identity',
    label: 'Passport',
    description: 'Valid international passport biodata page',
    required: true,
  })

  // 2. Academic Certificates
  const hasMasters = Boolean(
    inquiry?.mastersResult?.trim() ||
    inquiry?.mastersYear?.trim() ||
    profile?.highestEducation === 'MASTERS' ||
    profile?.highestEducation === 'PHD'
  )

  const hasBachelors = Boolean(
    level === 'POSTGRADUATE' ||
    inquiry?.bachelorsResult?.trim() ||
    inquiry?.bachelorsYear?.trim() ||
    profile?.highestEducation === 'BACHELORS' ||
    hasMasters
  )

  if (hasMasters) {
    reqs.push({
      category: 'Academic Certificates',
      label: 'Master Degree Certificate & Transcript',
      description: 'Official postgraduate degree certificate and academic transcript',
      required: true,
    })
  }

  if (hasBachelors) {
    reqs.push({
      category: 'Academic Certificates',
      label: 'Bachelor Degree Certificate & Transcript',
      description: 'Official undergraduate degree certificate and grade transcript',
      required: true,
    })
  }

  reqs.push({
    category: 'Academic Certificates',
    label: 'HSC / High School Certificate',
    description: 'Higher secondary / 12th / A-Level certificate and mark sheet',
    required: true,
  })

  reqs.push({
    category: 'Academic Certificates',
    label: 'SSC / Secondary Certificate',
    description: 'Secondary school / 10th / O-Level certificate and mark sheet',
    required: true,
  })

  // 3. Language & Standardized Tests (tailored strictly to what student filled)
  const isFilled = (val: string | number | null | undefined): boolean => {
    if (val == null) return false
    const s = String(val).trim()
    return s !== '' && s !== '0' && s !== '0.0' && !s.toLowerCase().includes('none')
  }

  const hasIelts = Boolean(
    isFilled(profile?.ieltsScore) ||
    isFilled(inquiry?.ieltsScore) ||
    inquiry?.englishTest?.toUpperCase() === 'IELTS'
  )

  const hasToefl = Boolean(
    isFilled(profile?.toeflScore) ||
    isFilled(inquiry?.toeflScore) ||
    inquiry?.englishTest?.toUpperCase() === 'TOEFL'
  )

  const hasTopik = Boolean(
    (isFilled(inquiry?.topikLevel) && !inquiry?.topikLevel?.toLowerCase().includes('none')) ||
    inquiry?.englishTest?.toUpperCase() === 'TOPIK'
  )

  const hasSat = Boolean(
    isFilled(profile?.satScore) ||
    isFilled(inquiry?.satScore) ||
    inquiry?.englishTest?.toUpperCase() === 'SAT'
  )

  const hasGre = Boolean(isFilled(profile?.greScore))

  const hasDuolingo = Boolean(inquiry?.englishTest?.toUpperCase() === 'DUOLINGO')
  const hasPte = Boolean(inquiry?.englishTest?.toUpperCase() === 'PTE')

  if (hasIelts) {
    reqs.push({
      category: 'Language Proficiency',
      label: 'IELTS Certificate',
      description: 'Official IELTS TRF / test report form',
      required: true,
    })
  }

  if (hasToefl) {
    reqs.push({
      category: 'Language Proficiency',
      label: 'TOEFL Certificate',
      description: 'Official TOEFL iBT score report',
      required: true,
    })
  }

  if (hasTopik) {
    reqs.push({
      category: 'Language Proficiency',
      label: 'TOPIK Certificate (Korean Proficiency)',
      description: 'National Institute for International Education score report',
      required: true,
    })
  }

  if (hasSat) {
    reqs.push({
      category: 'Language Proficiency',
      label: 'SAT Score Report',
      description: 'College Board official score report',
      required: true,
    })
  }

  if (hasGre) {
    reqs.push({
      category: 'Language Proficiency',
      label: 'GRE Score Report',
      description: 'ETS official score report',
      required: true,
    })
  }

  if (hasDuolingo) {
    reqs.push({
      category: 'Language Proficiency',
      label: 'Duolingo English Test Certificate',
      description: 'Certified test result from Duolingo English Test',
      required: true,
    })
  }

  if (hasPte) {
    reqs.push({
      category: 'Language Proficiency',
      label: 'PTE Academic Certificate',
      description: 'Pearson official test score report',
      required: true,
    })
  }

  return reqs
}
