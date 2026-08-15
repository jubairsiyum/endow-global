import { appRouter } from '@/server/root'
import { createTRPCContext } from '@/lib/trpc'
import CoursesListContent from './CoursesListContent'

export const dynamic = 'force-dynamic'

export default async function CoursesPage({ searchParams }: { searchParams?: { page?: string } }) {
  const context = await createTRPCContext({ headers: new Headers() })
  const caller = appRouter.createCaller(context)

  const parsedPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1

  const [initialData, initialSubjects] = await Promise.all([
    caller.course.list({ page, perPage: 12 }),
    caller.course.getSubjects(),
  ])

  return (
    <CoursesListContent
      initialData={initialData}
      initialSubjects={initialSubjects}
    />
  )
}
