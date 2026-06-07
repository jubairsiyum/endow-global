import { relations } from 'drizzle-orm'
import {
  mysqlTable,
  mysqlEnum,
  varchar,
  text,
  int,
  float,
  json,
  boolean,
  uniqueIndex,
  primaryKey,
  timestamp,
  char,
  decimal,
  smallint,
  tinyint,
  date,
  bigint,
  index,
} from 'drizzle-orm/mysql-core'
import { users } from './tables'

export const countries = mysqlTable('countries', {
  code: char('code', { length: 2 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  flagUrl: varchar('flag_url', { length: 255 }),
  continent: varchar('continent', { length: 50 }),
})

export const currencies = mysqlTable('currencies', {
  code: char('code', { length: 3 }).primaryKey(),
  symbol: varchar('symbol', { length: 10 }).notNull(),
  usdRate: decimal('usd_rate', { precision: 12, scale: 6, mode: 'number' }).default(1).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
})

export const catalogUniversities = mysqlTable(
  'universities',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    countryCode: char('country_code', { length: 2 })
      .notNull()
      .references(() => countries.code),
    city: varchar('city', { length: 100 }),
    logoUrl: varchar('logo_url', { length: 512 }),
    bannerUrl: varchar('banner_url', { length: 512 }),
    description: text('description'),
    establishedYear: smallint('established_year', { unsigned: true }),
    type: mysqlEnum('type', ['public', 'private', 'research', 'technical', 'liberal_arts']).default(
      'public'
    ),
    rankingQs: float('ranking_qs', { unsigned: true }),
    rankingThe: float('ranking_the', { unsigned: true }),
    rankingNational: float('ranking_national', { unsigned: true }),
    tuitionMin: decimal('tuition_min', { precision: 12, scale: 2, mode: 'number' }),
    tuitionMax: decimal('tuition_max', { precision: 12, scale: 2, mode: 'number' }),
    currencyCode: char('currency_code', { length: 3 })
      .default('USD')
      .notNull()
      .references(() => currencies.code),
    campusCount: tinyint('campus_count', { unsigned: true }).default(1),
    websiteUrl: varchar('website_url', { length: 512 }),
    accreditation: varchar('accreditation', { length: 512 }),
    isActive: boolean('is_active').default(true).notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    countryIdx: index('idx_catalog_universities_country').on(table.countryCode),
    slugIdx: index('idx_catalog_universities_slug').on(table.slug),
    featuredIdx: index('idx_catalog_universities_featured').on(table.isFeatured, table.isActive),
    slugIDx: uniqueIndex('idx_catalog_universities_slug').on(table.slug),
  })
)

export const departments = mysqlTable(
  'departments',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    universityId: int('university_id', { unsigned: true })
      .notNull()
      .references(() => catalogUniversities.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 20 }),
    description: text('description'),
  },
  (table) => ({
    universityIdx: index('idx_departments_university').on(table.universityId),
  })
)

export const catalogCourses = mysqlTable(
  'courses',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    universityId: int('university_id', { unsigned: true })
      .notNull()
      .references(() => catalogUniversities.id, { onDelete: 'cascade' }),
    departmentId: int('department_id', { unsigned: true }).references(() => departments.id, {
      onDelete: 'set null',
    }),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    level: mysqlEnum('level', [
      'certificate',
      'diploma',
      'associate',
      'bachelor',
      'postgraduate_diploma',
      'master',
      'phd',
      'professional',
    ]).notNull(),
    mode: mysqlEnum('mode', ['on_campus', 'online', 'hybrid', 'distance'])
      .default('on_campus')
      .notNull(),
    durationMonths: smallint('duration_months', { unsigned: true }).notNull(),
    intakeMonths: json('intake_months'),
    tuitionFee: decimal('tuition_fee', { precision: 12, scale: 2, mode: 'number' }).notNull(),
    currencyCode: char('currency_code', { length: 3 })
      .default('USD')
      .notNull()
      .references(() => currencies.code),
    applicationFee: decimal('application_fee', { precision: 10, scale: 2, mode: 'number' }).default(
      0
    ),
    livingCostEst: decimal('living_cost_est', { precision: 12, scale: 2, mode: 'number' }),
    scholarshipAvailable: boolean('scholarship_available').default(false).notNull(),
    scholarshipDetails: text('scholarship_details'),
    totalSeats: smallint('total_seats', { unsigned: true }),
    minGpa: decimal('min_gpa', { precision: 4, scale: 2, mode: 'number' }),
    minGpaScale: decimal('min_gpa_scale', { precision: 4, scale: 2, mode: 'number' }).default(4),
    workExpYears: tinyint('work_exp_years', { unsigned: true }).default(0),
    gmatMin: smallint('gmat_min', { unsigned: true }),
    greMin: smallint('gre_min', { unsigned: true }),
    englishTests: json('english_test'),
    ieltsMin: decimal('ielts_min', { precision: 3, scale: 1, mode: 'number' }),
    toeflMin: smallint('toefl_min', { unsigned: true }),
    pteMin: smallint('pte_min', { unsigned: true }),
    duolingoMin: smallint('duolingo_min', { unsigned: true }),
    englishWaiverCountries: json('english_waiver_countries'),
    description: text('description'),
    curriculumOutline: text('curriculum_outline'),
    careerProspects: text('career_prospects'),
    specializations: json('specializations'),
    externalId: varchar('external_id', { length: 100 }),
    courseCode: varchar('course_code', { length: 50 }),
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: text('meta_description'),
    isActive: boolean('is_active').default(true).notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    viewCount: int('view_count', { unsigned: true }).default(0).notNull(),
    shortlistCount: int('shortlist_count', { unsigned: true }).default(0).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    slugUniversityIdx: uniqueIndex('idx_catalog_courses_slug_university').on(
      table.slug,
      table.universityId
    ),
    universityIdx: index('idx_catalog_courses_university').on(table.universityId),
    departmentIdx: index('idx_catalog_courses_department').on(table.departmentId),
    levelIdx: index('idx_catalog_courses_level').on(table.level),
    modeIdx: index('idx_catalog_courses_mode').on(table.mode),
    tuitionIdx: index('idx_catalog_courses_tuition').on(table.tuitionFee, table.currencyCode),
    activeFeaturedIdx: index('idx_catalog_courses_active_featured').on(
      table.isActive,
      table.isFeatured
    ),
  })
)

export const tags = mysqlTable('tags', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  category: mysqlEnum('category', [
    'subject',
    'career',
    'skill',
    'certification',
    'special',
  ]).default('subject'),
  iconUrl: varchar('icon_url', { length: 255 }),
})

export const courseTags = mysqlTable(
  'course_tags',
  {
    courseId: int('course_id', { unsigned: true })
      .notNull()
      .references(() => catalogCourses.id, { onDelete: 'cascade' }),
    tagId: int('tag_id', { unsigned: true })
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.courseId, table.tagId] }),
  })
)

export const courseIntakes = mysqlTable(
  'course_intakes',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    courseId: int('course_id', { unsigned: true })
      .notNull()
      .references(() => catalogCourses.id, { onDelete: 'cascade' }),
    intakeDate: date('intake_date', { mode: 'date' }).notNull(),
    availableSeats: smallint('available_seats', { unsigned: true }),
    applicationDeadline: date('application_deadline', { mode: 'date' }),
    documentDeadline: date('document_deadline', { mode: 'date' }),
    status: mysqlEnum('status', ['open', 'closed', 'waitlist', 'upcoming'])
      .default('upcoming')
      .notNull(),
  },
  (table) => ({
    courseIdx: index('idx_course_intakes_course').on(table.courseId),
    dateIdx: index('idx_course_intakes_date').on(table.intakeDate),
  })
)

export const courseRequirements = mysqlTable(
  'course_requirements',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    courseId: int('course_id', { unsigned: true })
      .notNull()
      .references(() => catalogCourses.id, { onDelete: 'cascade' }),
    docType: mysqlEnum('doc_type', [
      'transcript',
      'degree_certificate',
      'english_test_score',
      'passport_copy',
      'cv_resume',
      'statement_of_purpose',
      'recommendation_letter',
      'bank_statement',
      'portfolio',
      'work_experience_letter',
      'gmat_gre_score',
      'other',
    ]).notNull(),
    isMandatory: boolean('is_mandatory').default(true).notNull(),
    description: text('description'),
    notes: varchar('notes', { length: 512 }),
    sortOrder: tinyint('sort_order', { unsigned: true }).default(0),
  },
  (table) => ({
    courseIdx: index('idx_course_requirements_course').on(table.courseId),
  })
)

export const courseMedia = mysqlTable(
  'course_media',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    courseId: int('course_id', { unsigned: true })
      .notNull()
      .references(() => catalogCourses.id, { onDelete: 'cascade' }),
    mediaType: mysqlEnum('media_type', ['image', 'video', 'brochure', 'virtual_tour']).notNull(),
    url: varchar('url', { length: 512 }).notNull(),
    title: varchar('title', { length: 255 }),
    isPrimary: boolean('is_primary').default(false).notNull(),
    sortOrder: tinyint('sort_order', { unsigned: true }).default(0),
  },
  (table) => ({
    courseIdx: index('idx_course_media_course').on(table.courseId),
  })
)

export const scholarships = mysqlTable(
  'scholarships',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    universityId: int('university_id', { unsigned: true }).references(
      () => catalogUniversities.id,
      { onDelete: 'cascade' }
    ),
    courseId: int('course_id', { unsigned: true }).references(() => catalogCourses.id, {
      onDelete: 'set null',
    }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    amount: decimal('amount', { precision: 12, scale: 2, mode: 'number' }),
    currencyCode: char('currency_code', { length: 3 })
      .default('USD')
      .notNull()
      .references(() => currencies.code),
    coverageType: mysqlEnum('coverage_type', [
      'full',
      'partial',
      'tuition_only',
      'living_only',
    ]).default('partial'),
    eligibility: text('eligibility'),
    deadline: date('deadline', { mode: 'date' }),
    linkUrl: varchar('link_url', { length: 512 }),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (table) => ({
    universityIdx: index('idx_scholarships_university').on(table.universityId),
    courseIdx: index('idx_scholarships_course').on(table.courseId),
  })
)

export const userShortlists = mysqlTable(
  'user_shortlists',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: int('course_id', { unsigned: true })
      .notNull()
      .references(() => catalogCourses.id, { onDelete: 'cascade' }),
    status: mysqlEnum('status', [
      'saved',
      'interested',
      'applying',
      'applied',
      'offer_received',
      'enrolled',
      'rejected',
      'withdrawn',
    ])
      .default('saved')
      .notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    uniqueUserCourse: uniqueIndex('idx_user_shortlists_user_course').on(
      table.userId,
      table.courseId
    ),
    userIdx: index('idx_user_shortlists_user').on(table.userId),
    courseIdx: index('idx_user_shortlists_course').on(table.courseId),
  })
)

export const userComparisons = mysqlTable(
  'user_comparisons',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: int('course_id', { unsigned: true })
      .notNull()
      .references(() => catalogCourses.id, { onDelete: 'cascade' }),
    addedAt: timestamp('added_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueUserCourse: uniqueIndex('idx_user_comparisons_user_course').on(
      table.userId,
      table.courseId
    ),
    userIdx: index('idx_user_comparisons_user').on(table.userId),
  })
)

export const courseReviews = mysqlTable(
  'course_reviews',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    courseId: int('course_id', { unsigned: true })
      .notNull()
      .references(() => catalogCourses.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rating: tinyint('rating', { unsigned: true }).notNull(),
    title: varchar('title', { length: 255 }),
    body: text('body'),
    pros: text('pros'),
    cons: text('cons'),
    isVerified: boolean('is_verified').default(false).notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    courseIdx: index('idx_course_reviews_course').on(table.courseId),
    userIdx: index('idx_course_reviews_user').on(table.userId),
    publishedIdx: index('idx_course_reviews_published').on(table.isPublished),
  })
)

export const courseViews = mysqlTable(
  'course_views',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    courseId: int('course_id', { unsigned: true })
      .notNull()
      .references(() => catalogCourses.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 255 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    sessionId: varchar('session_id', { length: 128 }),
    viewedAt: timestamp('viewed_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => ({
    courseIdx: index('idx_course_views_course').on(table.courseId),
    userIdx: index('idx_course_views_user').on(table.userId),
    viewedAtIdx: index('idx_course_views_viewed_at').on(table.viewedAt),
  })
)

export const universityRankings = mysqlTable(
  'university_rankings',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    universityId: int('university_id', { unsigned: true })
      .notNull()
      .references(() => catalogUniversities.id, { onDelete: 'cascade' }),
    source: mysqlEnum('source', ['QS', 'THE', 'ARWU', 'US_NEWS', 'national']).notNull(),
    subjectArea: varchar('subject_area', { length: 100 }),
    rankPosition: smallint('rank_position', { unsigned: true }).notNull(),
    rankYear: smallint('rank_year', { unsigned: true }).notNull(),
  },
  (table) => ({
    uniqueRanking: uniqueIndex('idx_university_rankings_unique').on(
      table.universityId,
      table.source,
      table.subjectArea,
      table.rankYear
    ),
  })
)

// ─── Relations ─────────────────────────────────────────────

export const countriesRelations = relations(countries, ({ many }) => ({
  universities: many(catalogUniversities),
}))

export const currenciesRelations = relations(currencies, ({ many }) => ({
  universities: many(catalogUniversities),
  courses: many(catalogCourses),
  scholarships: many(scholarships),
}))

export const catalogUniversitiesRelations = relations(catalogUniversities, ({ one, many }) => ({
  country: one(countries, {
    fields: [catalogUniversities.countryCode],
    references: [countries.code],
  }),
  currency: one(currencies, {
    fields: [catalogUniversities.currencyCode],
    references: [currencies.code],
  }),
  departments: many(departments),
  courses: many(catalogCourses),
  scholarships: many(scholarships),
  rankings: many(universityRankings),
}))

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  university: one(catalogUniversities, {
    fields: [departments.universityId],
    references: [catalogUniversities.id],
  }),
  courses: many(catalogCourses),
}))

export const catalogCoursesRelations = relations(catalogCourses, ({ one, many }) => ({
  university: one(catalogUniversities, {
    fields: [catalogCourses.universityId],
    references: [catalogUniversities.id],
  }),
  department: one(departments, {
    fields: [catalogCourses.departmentId],
    references: [departments.id],
  }),
  currency: one(currencies, {
    fields: [catalogCourses.currencyCode],
    references: [currencies.code],
  }),
  courseTags: many(courseTags),
  intakes: many(courseIntakes),
  requirements: many(courseRequirements),
  media: many(courseMedia),
  scholarships: many(scholarships),
  shortlists: many(userShortlists),
  comparisons: many(userComparisons),
  reviews: many(courseReviews),
  views: many(courseViews),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  courseTags: many(courseTags),
}))

export const courseTagsRelations = relations(courseTags, ({ one }) => ({
  course: one(catalogCourses, { fields: [courseTags.courseId], references: [catalogCourses.id] }),
  tag: one(tags, { fields: [courseTags.tagId], references: [tags.id] }),
}))

export const courseIntakesRelations = relations(courseIntakes, ({ one }) => ({
  course: one(catalogCourses, {
    fields: [courseIntakes.courseId],
    references: [catalogCourses.id],
  }),
}))

export const courseRequirementsRelations = relations(courseRequirements, ({ one }) => ({
  course: one(catalogCourses, {
    fields: [courseRequirements.courseId],
    references: [catalogCourses.id],
  }),
}))

export const courseMediaRelations = relations(courseMedia, ({ one }) => ({
  course: one(catalogCourses, { fields: [courseMedia.courseId], references: [catalogCourses.id] }),
}))

export const scholarshipsRelations = relations(scholarships, ({ one }) => ({
  university: one(catalogUniversities, {
    fields: [scholarships.universityId],
    references: [catalogUniversities.id],
  }),
  course: one(catalogCourses, { fields: [scholarships.courseId], references: [catalogCourses.id] }),
  currency: one(currencies, { fields: [scholarships.currencyCode], references: [currencies.code] }),
}))

export const userShortlistsRelations = relations(userShortlists, ({ one }) => ({
  user: one(users, { fields: [userShortlists.userId], references: [users.id] }),
  course: one(catalogCourses, {
    fields: [userShortlists.courseId],
    references: [catalogCourses.id],
  }),
}))

export const userComparisonsRelations = relations(userComparisons, ({ one }) => ({
  user: one(users, { fields: [userComparisons.userId], references: [users.id] }),
  course: one(catalogCourses, {
    fields: [userComparisons.courseId],
    references: [catalogCourses.id],
  }),
}))

export const courseReviewsRelations = relations(courseReviews, ({ one }) => ({
  course: one(catalogCourses, {
    fields: [courseReviews.courseId],
    references: [catalogCourses.id],
  }),
  user: one(users, { fields: [courseReviews.userId], references: [users.id] }),
}))

export const courseViewsRelations = relations(courseViews, ({ one }) => ({
  course: one(catalogCourses, { fields: [courseViews.courseId], references: [catalogCourses.id] }),
  user: one(users, { fields: [courseViews.userId], references: [users.id] }),
}))

export const universityRankingsRelations = relations(universityRankings, ({ one }) => ({
  university: one(catalogUniversities, {
    fields: [universityRankings.universityId],
    references: [catalogUniversities.id],
  }),
}))
