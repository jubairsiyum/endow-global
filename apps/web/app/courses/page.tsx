import { appRouter } from '@/server/root'
import { createTRPCContext } from '@/lib/trpc'
import CoursesListContent from './CoursesListContent'

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  const context = await createTRPCContext({ headers: new Headers() })
  const caller = appRouter.createCaller(context)

  const [initialData, initialSubjects] = await Promise.all([
    caller.course.list({ page: 1, perPage: 12 }),
    caller.course.getSubjects(),
  ])

  return (
    <CoursesListContent
      initialData={initialData}
      initialSubjects={initialSubjects}
    />
  )
}
