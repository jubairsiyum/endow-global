import { relations } from 'drizzle-orm'
import {
  accounts,
  sessions,
  users,
  studentProfiles,
  counselorProfiles,
  universities,
  courses,
  applications,
  shortlistedCourses,
  matchResults,
  bookingSessions,
  conversations,
  messages,
  notifications,
  referrals,
  newsletterSubscribers,
  chatHistory,
} from './tables'

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  counselorProfile: one(counselorProfiles, {
    fields: [users.id],
    references: [counselorProfiles.userId],
  }),
  sentMessages: many(messages, { relationName: 'sentMessages' }),
  notifications: many(notifications),
  referralsMade: many(referrals, { relationName: 'referralsMade' }),
  referralReceived: one(referrals, {
    fields: [users.id],
    references: [referrals.referredId],
    relationName: 'referralReceived',
  }),
}))

export const studentProfilesRelations = relations(studentProfiles, ({ one, many }) => ({
  user: one(users, { fields: [studentProfiles.userId], references: [users.id] }),
  assignedCounselor: one(counselorProfiles, {
    fields: [studentProfiles.assignedCounselorId],
    references: [counselorProfiles.id],
  }),
  applications: many(applications),
  shortlistedCourses: many(shortlistedCourses),
  bookingSessions: many(bookingSessions),
  conversations: many(conversations, { relationName: 'studentConversations' }),
  matchResults: many(matchResults),
}))

export const counselorProfilesRelations = relations(counselorProfiles, ({ one, many }) => ({
  user: one(users, { fields: [counselorProfiles.userId], references: [users.id] }),
  assignedStudents: many(studentProfiles),
  applications: many(applications),
  bookingSessions: many(bookingSessions),
  conversations: many(conversations, { relationName: 'counselorConversations' }),
}))

export const universitiesRelations = relations(universities, ({ many }) => ({
  courses: many(courses),
}))

export const coursesRelations = relations(courses, ({ one, many }) => ({
  university: one(universities, { fields: [courses.universityId], references: [universities.id] }),
  applications: many(applications),
  shortlistedCourses: many(shortlistedCourses),
  matchResults: many(matchResults),
}))

export const applicationsRelations = relations(applications, ({ one }) => ({
  student: one(studentProfiles, {
    fields: [applications.studentId],
    references: [studentProfiles.id],
  }),
  course: one(courses, { fields: [applications.courseId], references: [courses.id] }),
  counselor: one(counselorProfiles, {
    fields: [applications.counselorId],
    references: [counselorProfiles.id],
  }),
}))

export const shortlistedCoursesRelations = relations(shortlistedCourses, ({ one }) => ({
  student: one(studentProfiles, {
    fields: [shortlistedCourses.studentId],
    references: [studentProfiles.id],
  }),
  course: one(courses, { fields: [shortlistedCourses.courseId], references: [courses.id] }),
}))

export const matchResultsRelations = relations(matchResults, ({ one }) => ({
  student: one(studentProfiles, {
    fields: [matchResults.studentId],
    references: [studentProfiles.id],
  }),
  course: one(courses, { fields: [matchResults.courseId], references: [courses.id] }),
}))

export const bookingSessionsRelations = relations(bookingSessions, ({ one }) => ({
  student: one(studentProfiles, {
    fields: [bookingSessions.studentId],
    references: [studentProfiles.id],
  }),
  counselor: one(counselorProfiles, {
    fields: [bookingSessions.counselorId],
    references: [counselorProfiles.id],
  }),
}))

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  student: one(studentProfiles, {
    fields: [conversations.studentId],
    references: [studentProfiles.id],
    relationName: 'studentConversations',
  }),
  counselor: one(counselorProfiles, {
    fields: [conversations.counselorId],
    references: [counselorProfiles.id],
    relationName: 'counselorConversations',
  }),
  messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sentMessages',
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}))

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: 'referralsMade',
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
    relationName: 'referralReceived',
  }),
}))
