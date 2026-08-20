// Shared configuration for the student document checklist.
// The documents a student must submit depend on the programme they are
// applying for, which we infer from the highest education saved on their
// profile (same logic used by course matching).

export type ApplicantLevel = 'UNDERGRADUATE' | 'POSTGRADUATE'

export interface DocumentRequirement {
  category: string
  label: string
}

export const DOCUMENT_REQUIREMENTS: Record<ApplicantLevel, DocumentRequirement[]> = {
  UNDERGRADUATE: [
    { category: 'Identity', label: 'Passport' },
    { category: 'Academic Certificates', label: 'SSC Certificate' },
    { category: 'Academic Certificates', label: 'HSC Certificate' },
  ],
  POSTGRADUATE: [
    { category: 'Identity', label: 'Passport' },
    { category: 'Academic Certificates', label: 'Undergraduate Semester Marksheets' },
    { category: 'Academic Certificates', label: 'Undergraduate Certificate' },
  ],
}

export const APPLICANT_LEVEL_LABEL: Record<ApplicantLevel, string> = {
  UNDERGRADUATE: 'Undergraduate',
  POSTGRADUATE: 'Postgraduate',
}

// HIGH_SCHOOL students are still applying for undergraduate degrees; anyone
// with a bachelor's or higher is treated as a postgraduate applicant.
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

// Stable key used to match a requirement against a stored document row.
export function requirementKey(category: string, label: string): string {
  return `${category}\u0000${label}`
}