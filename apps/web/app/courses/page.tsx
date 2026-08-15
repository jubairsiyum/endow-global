import { appRouter } from '@/server/root'
import { createTRPCContext } from '@/lib/trpc'
import CoursesListContent from './CoursesListContent'
import { parseFilters } from './filter-utils'

export const dynamic = 'force-dynamic'

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const context = await createTRPCContext({ headers: new Headers() })
  const caller = appRouter.createCaller(context)

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v))
    else if (value !== undefined) params.set(key, value)
  }

  const parsedPage = parseInt(params.get('page') ?? '', 10)
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1

  const filters = parseFilters(params)

  const initialData = await caller.course.list({
    page,
    perPage: 12,
    countries: filters.countries.length ? filters.countries : undefined,
    cities: filters.cities.length ? filters.cities : undefined,
    institutionIds: filters.institutionIds.length ? filters.institutionIds : undefined,
    levels: filters.levels.length ? filters.levels : undefined,
    subjects: filters.subjects.length ? filters.subjects : undefined,
    expressOffer: filters.expressOffer || undefined,
    englishWaiver: filters.englishWaiver || undefined,
    durations: filters.durations.length ? filters.durations : undefined,
    startYears: filters.startYears.length ? filters.startYears : undefined,
    feeMin: filters.feeMin ?? undefined,
    feeMax: filters.feeMax ?? undefined,
  })

  return <CoursesListContent initialData={initialData} initialFilters={filters} />
}
