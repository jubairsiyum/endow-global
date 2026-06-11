import {
  mysqlTable,
  mysqlEnum,
  varchar,
  text,
  datetime,
  int,
  float,
  json,
  boolean,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/mysql-core'

function genId() {
  return globalThis.crypto.randomUUID()
}

// ─── Auth (Better Auth compatible) ──

export const users = mysqlTable(
  'user',
  {
    id: varchar('id', { length: 255 }).primaryKey().$defaultFn(genId),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: varchar('image', { length: 255 }),
    role: mysqlEnum('role', ['STUDENT', 'COUNSELOR', 'ADMIN']).default('STUDENT').notNull(),
    fcmToken: varchar('fcm_token', { length: 255 }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('email_idx').on(table.email),
  })
)

export const accounts = mysqlTable(
  'account',
  {
    id: varchar('id', { length: 255 }).primaryKey().$defaultFn(genId),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerId: varchar('provider_id', { length: 255 }).notNull(),
    accountId: varchar('account_id', { length: 255 }).notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { mode: 'date' }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { mode: 'date' }),
    scope: varchar('scope', { length: 255 }),
    password: varchar('password', { length: 255 }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    providerAccountIdIdx: uniqueIndex('provider_account_idx').on(table.providerId, table.accountId),
  })
)

export const sessions = mysqlTable('session', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(genId),
  token: varchar('token', { length: 255 }).notNull().unique(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  ipAddress: varchar('ip_address', { length: 255 }),
  userAgent: varchar('user_agent', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})

export const verificationTokens = mysqlTable('verification', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(genId),
  identifier: varchar('identifier', { length: 255 }).notNull().unique(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})

// ─── User & Profile ────────────────────────────────────────

export const studentProfiles = mysqlTable('student_profile', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  userId: varchar('user_id', { length: 25 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }),
  nationality: varchar('nationality', { length: 100 }),
  countryOfResidence: varchar('country_of_residence', { length: 100 }),
  targetCountries: json('target_countries').default('[]').notNull(),
  targetSubjects: json('target_subjects').default('[]').notNull(),
  budgetMin: int('budget_min'),
  budgetMax: int('budget_max'),
  gpa: float('gpa'),
  ieltsScore: float('ielts_score'),
  toeflScore: int('toefl_score'),
  satScore: int('sat_score'),
  greScore: int('gre_score'),
  completionPercent: int('completion_percent').default(0).notNull(),
  preferredIntakeMonth: varchar('preferred_intake_month', { length: 50 }),
  preferredIntakeYear: int('preferred_intake_year'),
  highestEducation: mysqlEnum('highest_education', ['HIGH_SCHOOL', 'BACHELORS', 'MASTERS', 'PHD'])
    .default('HIGH_SCHOOL')
    .notNull(),
  workExperienceYears: int('work_experience_years').default(0).notNull(),
  assignedCounselorId: varchar('assigned_counselor_id', { length: 25 }),
  referralCode: varchar('referral_code', { length: 25 })
    .notNull()
    .unique()
    .$defaultFn(() => globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 12)),
  referralBalance: int('referral_balance').default(0).notNull(),
  profileEmbedding: json('profile_embedding').default('[]').notNull(),
  matchesUpdatedAt: datetime('matches_updated_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})

export const counselorProfiles = mysqlTable('counselor_profile', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  userId: varchar('user_id', { length: 25 }).notNull().unique(),
  bio: text('bio'),
  expertiseCountries: json('expertise_countries').default('[]').notNull(),
  expertiseSubjects: json('expertise_subjects').default('[]').notNull(),
  languages: json('languages').default('["English"]').notNull(),
  calUsername: varchar('cal_username', { length: 255 }),
  sessionRate: int('session_rate').default(0).notNull(),
  totalStudents: int('total_students').default(0).notNull(),
  rating: float('rating'),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})

// ─── University & Course ───────────────────────────────────

export const universities = mysqlTable('university', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  country: varchar('country', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  logo: varchar('logo', { length: 255 }),
  coverImage: varchar('cover_image', { length: 255 }),
  description: text('description').notNull(),
  ranking: int('ranking'),
  website: varchar('website', { length: 255 }),
  established: int('established'),
  totalStudents: int('total_students'),
  internationalPercent: float('international_percent'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})

export const courses = mysqlTable('course', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  universityId: varchar('university_id', { length: 25 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  subject: varchar('subject', { length: 255 }).notNull(),
  level: mysqlEnum('level', [
    'UNDERGRADUATE',
    'POSTGRADUATE',
    'PHD',
    'DIPLOMA',
    'CERTIFICATE',
    'FOUNDATION',
  ]).notNull(),
  duration: int('duration').notNull(),
  durationUnit: varchar('duration_unit', { length: 10 }).default('YEARS').notNull(),
  tuitionFee: int('tuition_fee').notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  applicationDeadline: datetime('application_deadline', { mode: 'date' }),
  startDate: datetime('start_date', { mode: 'date' }),
  language: varchar('language', { length: 50 }).default('English').notNull(),
  requirements: json('requirements').default('[]').notNull(),
  hasScholarship: boolean('has_scholarship').default(false).notNull(),
  scholarshipDetails: text('scholarship_details'),
  description: text('description').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  vectorId: varchar('vector_id', { length: 255 }),
  typesenseId: varchar('typesense_id', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})

// ─── Application ──────────────────────────────────────────

export const applications = mysqlTable('application', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  studentId: varchar('student_id', { length: 25 }).notNull(),
  courseId: varchar('course_id', { length: 25 }).notNull(),
  counselorId: varchar('counselor_id', { length: 25 }),
  status: mysqlEnum('status', [
    'DRAFT',
    'IN_PROGRESS',
    'SUBMITTED',
    'UNDER_REVIEW',
    'DOCUMENTS_REQUIRED',
    'ACCEPTED',
    'REJECTED',
    'WAITLISTED',
    'WITHDRAWN',
  ])
    .default('DRAFT')
    .notNull(),
  currentStep: int('current_step').default(1).notNull(),
  totalSteps: int('total_steps').default(5).notNull(),
  personalInfo: json('personal_info'),
  academicHistory: json('academic_history'),
  personalStatement: text('personal_statement'),
  documentsUrls: json('documents_urls').default('[]').notNull(),
  submittedAt: datetime('submitted_at', { mode: 'date' }),
  counselorNotes: text('counselor_notes'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})

export const shortlistedCourses = mysqlTable(
  'shortlisted_course',
  {
    id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
    studentId: varchar('student_id', { length: 25 }).notNull(),
    courseId: varchar('course_id', { length: 25 }).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueStudentCourse: uniqueIndex('unique_student_course').on(table.studentId, table.courseId),
  })
)

// ─── AI Match Results ──────────────────────────────────────

export const matchResults = mysqlTable(
  'match_result',
  {
    id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
    studentId: varchar('student_id', { length: 25 }).notNull(),
    courseId: varchar('course_id', { length: 25 }).notNull(),
    score: float('score').notNull(),
    matchReasons: json('match_reasons').default('[]').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueStudentCourse: uniqueIndex('unique_match_student_course').on(
      table.studentId,
      table.courseId
    ),
  })
)

// ─── Booking Session ───────────────────────────────────────

export const bookingSessions = mysqlTable('booking_session', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  studentId: varchar('student_id', { length: 25 }).notNull(),
  counselorId: varchar('counselor_id', { length: 25 }).notNull(),
  calBookingId: varchar('cal_booking_id', { length: 255 }),
  scheduledAt: datetime('scheduled_at', { mode: 'date' }).notNull(),
  duration: int('duration').default(60).notNull(),
  status: mysqlEnum('status', ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
    .default('SCHEDULED')
    .notNull(),
  meetingUrl: varchar('meeting_url', { length: 255 }),
  notes: text('notes'),
  studentRating: int('student_rating'),
  amountPaid: int('amount_paid').default(0).notNull(),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }),
  reminderSent: boolean('reminder_sent').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})

// ─── Messaging ─────────────────────────────────────────────

export const conversations = mysqlTable(
  'conversation',
  {
    id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
    studentId: varchar('student_id', { length: 25 }).notNull(),
    counselorId: varchar('counselor_id', { length: 25 }).notNull(),
    lastMessageAt: timestamp('last_message_at', { mode: 'date' }).defaultNow().notNull(),
    lastMessage: text('last_message'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueStudentCounselor: uniqueIndex('unique_student_counselor').on(
      table.studentId,
      table.counselorId
    ),
  })
)

export const messages = mysqlTable('message', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  conversationId: varchar('conversation_id', { length: 25 }).notNull(),
  senderId: varchar('sender_id', { length: 25 }).notNull(),
  content: text('content').notNull(),
  attachmentUrl: varchar('attachment_url', { length: 255 }),
  attachmentType: varchar('attachment_type', { length: 50 }),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})

// ─── Notifications ─────────────────────────────────────────

export const notifications = mysqlTable('notification', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  userId: varchar('user_id', { length: 25 }).notNull(),
  type: mysqlEnum('type', [
    'SESSION_REMINDER',
    'APPLICATION_UPDATE',
    'NEW_MESSAGE',
    'MATCH_READY',
    'REFERRAL_EARNED',
    'SYSTEM',
  ]).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  data: json('data'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})

// ─── Referral ──────────────────────────────────────────────

export const referrals = mysqlTable('referral', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  referrerId: varchar('referrer_id', { length: 25 }).notNull(),
  referredId: varchar('referred_id', { length: 25 }).notNull().unique(),
  status: varchar('status', { length: 20 }).default('PENDING').notNull(),
  creditAmount: int('credit_amount').default(500).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  completedAt: datetime('completed_at', { mode: 'date' }),
})

// ─── Newsletter ────────────────────────────────────────────

export const newsletterSubscribers = mysqlTable('newsletter_subscriber', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  subscribedAt: timestamp('subscribed_at', { mode: 'date' }).defaultNow().notNull(),
  tags: json('tags').default('[]').notNull(),
})

// ─── AI Chat History ───────────────────────────────────────

export const chatHistory = mysqlTable('chat_history', {
  id: varchar('id', { length: 25 }).primaryKey().$defaultFn(genId),
  userId: varchar('user_id', { length: 25 }),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  messages: json('messages').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})
