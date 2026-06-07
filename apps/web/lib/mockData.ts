// TODO: replace with real API call (tRPC / better-auth session + drizzle queries)

export type ApplicationStatus = 'Draft' | 'In Review' | 'Submitted' | 'Approved' | 'Rejected'

export type DocumentStatus = 'uploaded' | 'pending' | 'rejected'

export interface MockStudent {
  id: string
  name: string
  initials: string
  email: string
  university: string
  program: string
  intake: string
  visaType: string
  applicationStatus: ApplicationStatus
  progress: number
  documentsUploaded: number
  documentsTotal: number
  daysUntilDeadline: number
  unreadMessages: number
}

export const mockStudent: MockStudent = {
  id: 'stu_001',
  name: 'Aisha Rahman',
  initials: 'AR',
  email: 'aisha.rahman@example.com',
  university: 'University of Edinburgh',
  program: 'MSc Computer Science',
  intake: 'September 2026',
  visaType: 'UK Student Visa (Tier 4)',
  applicationStatus: 'In Review',
  progress: 65,
  documentsUploaded: 7,
  documentsTotal: 12,
  daysUntilDeadline: 23,
  unreadMessages: 3,
}

export interface TimelineStep {
  id: 'personal' | 'documents' | 'review' | 'submit' | 'decision'
  label: string
  description: string
  /** index of the currently active step (0-based). Steps before it are completed, after it are pending. */
  currentIndex: number
}

export const mockTimeline: TimelineStep[] = [
  {
    id: 'personal',
    label: 'Personal Info',
    description: 'Profile & academic history',
    currentIndex: 1,
  },
  {
    id: 'documents',
    label: 'Documents',
    description: 'Transcripts, SOP, references',
    currentIndex: 1,
  },
  { id: 'review', label: 'Review', description: 'Counselor verification', currentIndex: 1 },
  { id: 'submit', label: 'Submission', description: 'University portal', currentIndex: 1 },
  { id: 'decision', label: 'Decision', description: 'Offer & visa outcome', currentIndex: 1 },
]

export interface MockDocument {
  id: string
  label: string
  status: DocumentStatus
  updatedAt: string | null
  rejectionReason?: string
}

export const mockDocuments: MockDocument[] = [
  { id: 'd1', label: 'Passport scan', status: 'uploaded', updatedAt: '2 days ago' },
  { id: 'd2', label: 'Academic transcripts', status: 'uploaded', updatedAt: '5 days ago' },
  { id: 'd3', label: 'Statement of purpose', status: 'pending', updatedAt: null },
  { id: 'd4', label: 'Two reference letters', status: 'pending', updatedAt: null },
  { id: 'd5', label: 'English test (IELTS)', status: 'uploaded', updatedAt: '1 week ago' },
  {
    id: 'd6',
    label: 'Financial evidence',
    status: 'rejected',
    updatedAt: '3 days ago',
    rejectionReason: 'Bank statement older than 30 days',
  },
  { id: 'd7', label: 'CV / Resume', status: 'uploaded', updatedAt: '2 weeks ago' },
  { id: 'd8', label: 'Portfolio / Writing sample', status: 'pending', updatedAt: null },
]

export interface MockDeadline {
  id: string
  label: string
  dueIn: number // days from now
}

export const mockDeadlines: MockDeadline[] = [
  { id: 'dl1', label: 'Re-upload financial evidence', dueIn: 3 },
  { id: 'dl2', label: 'Submit SOP final draft', dueIn: 7 },
  { id: 'dl3', label: 'University application open', dueIn: 14 },
  { id: 'dl4', label: 'Visa interview prep session', dueIn: 21 },
  { id: 'dl5', label: 'CAS / I-20 receive window', dueIn: 35 },
]

export interface QuickActionItem {
  id: 'upload' | 'message' | 'consult' | 'checklist'
  label: string
  description: string
  href: string
}

export const mockQuickActions: QuickActionItem[] = [
  {
    id: 'upload',
    label: 'Upload Document',
    description: 'Add a new file',
    href: '/dashboard/documents',
  },
  {
    id: 'message',
    label: 'Message Agent',
    description: 'Reach your counselor',
    href: '/dashboard/messages',
  },
  {
    id: 'consult',
    label: 'Book Consultation',
    description: 'Schedule a 1:1 session',
    href: '/dashboard/appointments',
  },
  {
    id: 'checklist',
    label: 'Download Checklist',
    description: 'Visa document list',
    href: '/dashboard/documents',
  },
]
