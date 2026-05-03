// ─── User & Auth ────────────────────────────────────────────────────────────
export enum UserRole {
  STUDENT = 'STUDENT',
  COUNSELOR = 'COUNSELOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

// ─── Student Profile ─────────────────────────────────────────────────────────
export interface StudentProfile {
  id: string
  userId: string
  targetCountries: string[]
  targetSubjects: string[]
  budgetMin: number | null
  budgetMax: number | null
  gpa: number | null
  ieltsScore: number | null
  toeflScore: number | null
  satScore: number | null
  greScore: number | null
  completionPercent: number
  preferredIntakeMonth: string | null
  preferredIntakeYear: number | null
  nationality: string | null
  highestEducation: EducationLevel
  workExperienceYears: number
  assignedCounselorId: string | null
  referralCode: string
  referralBalance: number
}

export enum EducationLevel {
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  BACHELORS = 'BACHELORS',
  MASTERS = 'MASTERS',
  PHD = 'PHD',
}

// ─── Counselor Profile ───────────────────────────────────────────────────────
export interface CounselorProfile {
  id: string
  userId: string
  bio: string | null
  expertiseCountries: string[]
  expertiseSubjects: string[]
  languages: string[]
  calUsername: string | null
  sessionRate: number
  totalStudents: number
  rating: number | null
  isAvailable: boolean
}

// ─── University & Course ─────────────────────────────────────────────────────
export interface University {
  id: string
  name: string
  slug: string
  country: string
  city: string
  logo: string | null
  coverImage: string | null
  description: string
  ranking: number | null
  website: string | null
  established: number | null
  totalStudents: number | null
  internationalPercent: number | null
  isActive: boolean
}

export interface Course {
  id: string
  universityId: string
  university?: University
  name: string
  slug: string
  subject: string
  level: CourseLevel
  duration: number
  durationUnit: 'MONTHS' | 'YEARS'
  tuitionFee: number
  currency: string
  applicationDeadline: Date | null
  startDate: Date | null
  language: string
  requirements: string[]
  hasScholarship: boolean
  scholarshipDetails: string | null
  description: string
  isActive: boolean
  vectorId: string | null
}

export enum CourseLevel {
  UNDERGRADUATE = 'UNDERGRADUATE',
  POSTGRADUATE = 'POSTGRADUATE',
  PHD = 'PHD',
  DIPLOMA = 'DIPLOMA',
  CERTIFICATE = 'CERTIFICATE',
  FOUNDATION = 'FOUNDATION',
}

// ─── Application ─────────────────────────────────────────────────────────────
export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  DOCUMENTS_REQUIRED = 'DOCUMENTS_REQUIRED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WAITLISTED = 'WAITLISTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface Application {
  id: string
  studentId: string
  courseId: string
  course?: Course
  counselorId: string | null
  status: ApplicationStatus
  currentStep: number
  totalSteps: number
  personalStatement: string | null
  documentsUrls: string[]
  submittedAt: Date | null
  counselorNotes: string | null
  createdAt: Date
  updatedAt: Date
}

// ─── Session ─────────────────────────────────────────────────────────────────
export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface Session {
  id: string
  studentId: string
  counselorId: string
  calBookingId: string | null
  scheduledAt: Date
  duration: number
  status: SessionStatus
  meetingUrl: string | null
  notes: string | null
  studentRating: number | null
  amountPaid: number
  stripePaymentId: string | null
}

// ─── Messaging ───────────────────────────────────────────────────────────────
export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  attachmentUrl: string | null
  attachmentType: string | null
  isRead: boolean
  createdAt: Date
}

export interface Conversation {
  id: string
  studentId: string
  counselorId: string
  lastMessageAt: Date
  lastMessage: string | null
}

// ─── Referral ────────────────────────────────────────────────────────────────
export interface Referral {
  id: string
  referrerId: string
  referredId: string
  status: 'PENDING' | 'COMPLETED' | 'REWARDED'
  creditAmount: number
  createdAt: Date
}

// ─── Notification ────────────────────────────────────────────────────────────
export enum NotificationType {
  SESSION_REMINDER = 'SESSION_REMINDER',
  APPLICATION_UPDATE = 'APPLICATION_UPDATE',
  NEW_MESSAGE = 'NEW_MESSAGE',
  MATCH_READY = 'MATCH_READY',
  REFERRAL_EARNED = 'REFERRAL_EARNED',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  data: Record<string, string> | null
  isRead: boolean
  createdAt: Date
}

// ─── AI Match ────────────────────────────────────────────────────────────────
export interface MatchResult {
  courseId: string
  course: Course
  score: number
  matchReasons: string[]
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ─── Search ──────────────────────────────────────────────────────────────────
export interface CourseSearchFilters {
  query?: string
  country?: string[]
  subject?: string[]
  level?: CourseLevel[]
  minFee?: number
  maxFee?: number
  hasScholarship?: boolean
  language?: string[]
  page?: number
  perPage?: number
}

export interface SearchResult<T> {
  hits: T[]
  total: number
  page: number
  totalPages: number
}

// ─── Notification Payload (FCM) ───────────────────────────────────────────────
export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: Record<string, string>
  imageUrl?: string
}
