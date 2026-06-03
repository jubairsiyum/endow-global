import { createTRPCRouter } from '@/lib/trpc'
import { userRouter } from './routers/user'
import { courseRouter } from './routers/course'
import { applicationRouter } from './routers/application'
import { sessionRouter } from './routers/session'
import { messageRouter } from './routers/message'
import { referralRouter } from './routers/referral'
import { notificationRouter } from './routers/notification'
import { counselorRouter } from './routers/counselor'
import { adminRouter } from './routers/admin'
import { aiRouter } from './routers/ai'
import { endowRouter } from './routers/endow'

export const appRouter = createTRPCRouter({
  user: userRouter,
  course: courseRouter,
  application: applicationRouter,
  session: sessionRouter,
  message: messageRouter,
  referral: referralRouter,
  notification: notificationRouter,
  counselor: counselorRouter,
  admin: adminRouter,
  ai: aiRouter,
  endow: endowRouter,
})

export type AppRouter = typeof appRouter
