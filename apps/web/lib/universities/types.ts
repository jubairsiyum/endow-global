export interface UniversityFilters {
  country?: string
  minTuition?: number
  maxTuition?: number
  minScholarship?: number
  minVisaSuccess?: number
  intakeMonth?: string
  language?: string
  degreeLevel?: string
  searchQuery?: string
}

export interface UserProfile {
  gpa: number
  ielts: number
  budget: number
  preferredCountry: string
  studyLevel: 'bachelor' | 'master' | 'phd'
}

export interface AIMatchResult {
  universityId: string
  universityName: string
  matchPercentage: number
  scholarshipChance: number
  visaSuccessProbability: number
  reasons: string[]
}

export interface ComparisonItem {
  universityId: string
  universityName: string
  tuition: number
  ranking: number
  scholarship: number
  location: string
  dormitory: number
  visaSuccess: number
  workOpportunities: string[]
}
