// Shared configuration for the student document checklist.
// The documents a student must submit depend on the programme they are
// applying for, which we infer from their active applied courses or inquiries.

export type ApplicantLevel = 'UNDERGRADUATE' | 'POSTGRADUATE'

export interface DocumentRequirement {
  category: string
  label: string
}

export const DOCUMENT_REQUIREMENTS: Record<ApplicantLevel, DocumentRequirement[]> = {
  UNDERGRADUATE: [
    { category: 'Identity', label: 'Passport' },
    { category: 'Academic Certificates', label: 'HSC / High School Certificate' },
    { category: 'Academic Certificates', label: 'SSC / Secondary Certificate' },
    { category: 'Language Proficiency', label: 'Language Test Certificate (IELTS/TOEFL/TOPIK)' },
  ],
  POSTGRADUATE: [
    { category: 'Identity', label: 'Passport' },
    { category: 'Academic Certificates', label: 'Bachelor Degree Certificate & Transcript' },
    { category: 'Academic Certificates', label: 'HSC / High School Certificate' },
    { category: 'Academic Certificates', label: 'SSC / Secondary Certificate' },
    { category: 'Language Proficiency', label: 'Language Test Certificate (IELTS/TOEFL/TOPIK)' },
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
  if (
    l.includes('bachelor') ||
    l.includes('bsc') ||
    l.includes('bba') ||
    l.includes('undergraduate degree')
  ) {
    return 'Bachelor Degree Certificate & Transcript'
  }
  if (
    l.includes('hsc') ||
    l.includes('12th') ||
    l.includes('high school') ||
    l.includes('a-level') ||
    l.includes('a level')
  ) {
    return 'HSC / High School Certificate'
  }
  if (
    l.includes('ssc') ||
    l.includes('10th') ||
    l.includes('secondary') ||
    l.includes('o-level') ||
    l.includes('o level')
  ) {
    return 'SSC / Secondary Certificate'
  }
  if (
    l.includes('ielts') ||
    l.includes('toefl') ||
    l.includes('topik') ||
    l.includes('language') ||
    l.includes('duolingo') ||
    l.includes('pte') ||
    l.includes('english')
  ) {
    return 'Language Test Certificate (IELTS/TOEFL/TOPIK)'
  }
  return label
}

// Stable key used to match a requirement against a stored document row.
export function requirementKey(category: string, label: string): string {
  return `${category}\u0000${normalizeDocLabel(label)}`
}
