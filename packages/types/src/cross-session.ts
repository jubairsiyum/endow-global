export interface EndowStudent {
  id: string
  email: string
  fullName: string
  targetCountries: string[]
  targetSubjects: string[]
  [key: string]: unknown // Session 2 can extend this
}

export interface CounselorMatch {
  counselorId: string
  matchScore: number
  matchedCountries: string[]
  matchedSubjects: string[]
}

export interface ApplicationAccessContext {
  canView: boolean
  canEdit: boolean
  canSubmit: boolean
}
