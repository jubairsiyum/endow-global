'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Building2, CalendarDays, Heart, MapPin, Newspaper, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { trpc } from '@/lib/trpc-client'
import { DashboardError, DashboardLoading } from './DashboardState'
import { panel, viewAllLink, input } from './ui'

function WidgetHeader({ icon: Icon, title, description, href, action = 'View all' }: { icon: typeof BookOpen; title: string; description: string; href: string; action?: string }) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-rose-600 dark:text-rose-300" aria-hidden />
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <Link href={href} className={viewAllLink}>
        {action}<ArrowRight size={14} aria-hidden />
      </Link>
    </header>
  )
}

type CourseTab = 'matches' | 'explore' | 'shortlisted'

interface NormalizedCourse {
  id: string
  slug?: string
  name: string
  subject?: string
  level?: string
  tuitionFee?: number
  currency?: string
  hasScholarship?: boolean
  universityName?: string
  universityCountry?: string
  score?: number
  matchReasons?: string[]
}

const BUDGET_RANGES: { label: string; value: number | null }[] = [
  { label: 'Any budget', value: null },
  { label: 'Under $10,000', value: 10000 },
  { label: 'Under $20,000', value: 20000 },
  { label: 'Under $30,000', value: 30000 },
  { label: 'Under $40,000', value: 40000 },
]

function CourseCard({ course, shortlisted, onToggle }: { course: NormalizedCourse; shortlisted: boolean; onToggle: () => void }) {
  return (
    <div className="group relative rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-rose-200 hover:bg-rose-50/30 dark:border-gray-800 dark:bg-[#1a1d25] dark:hover:border-rose-900/50 dark:hover:bg-rose-500/5">
      <button
        type="button"
        onClick={onToggle}
        aria-label={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
        aria-pressed={shortlisted}
        className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${shortlisted ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-400 hover:text-rose-600 dark:bg-gray-800'}`}
      >
        <Heart size={15} className={shortlisted ? 'fill-current' : ''} />
      </button>
      <Link href={`/courses/${course.slug || ''}`} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">
        <div className="flex items-center justify-between gap-2 pr-9">
          <span className="truncate text-[11px] font-bold uppercase tracking-wider text-gray-400">{course.universityCountry || 'International'}</span>
          {course.score ? <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">{Math.round(course.score)}% fit</span> : null}
        </div>
        <h3 className="mt-3 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-300">{course.name || 'Course'}</h3>
        <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{course.universityName || 'University'}</p>
        {course.matchReasons?.length ? (
          <ul className="mt-3 space-y-1">
            {course.matchReasons.slice(0, 2).map((reason) => (
              <li key={reason} className="flex items-start gap-1.5 text-[11px] leading-4 text-gray-500 dark:text-gray-400"><Sparkles size={11} className="mt-0.5 shrink-0 text-rose-400" /> {reason}</li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{course.tuitionFee ? `${course.currency || 'USD'} ${Number(course.tuitionFee).toLocaleString()}` : 'Fee on request'}</span>
          {course.hasScholarship && <span className="text-[10px] font-bold text-emerald-600">Scholarship</span>}
        </div>
      </Link>
    </div>
  )
}

export function DashboardCourseShelf({ matches = [] }: { matches?: any[] }) {
  const utils = trpc.useUtils()
  const [tab, setTab] = useState<CourseTab>('matches')
  const [page, setPage] = useState(1)

  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('')
  const [country, setCountry] = useState('')
  const [level, setLevel] = useState('')
  const [scholarship, setScholarship] = useState(false)
  const [budget, setBudget] = useState<number | null>(null)

  const filterOptions = trpc.course.getFilterOptions.useQuery()
  const coursesQuery = trpc.course.list.useQuery(
    {
      page,
      perPage: 9,
      query: query || undefined,
      countries: country ? [country] : undefined,
      subjects: subject ? [subject] : undefined,
      levels: level ? [level] : undefined,
      hasScholarship: scholarship || undefined,
      feeMax: budget || undefined,
    },
    { enabled: tab === 'explore' }
  )
  const shortlistQuery = trpc.dashboard.shortlist.list.useQuery(undefined, { enabled: tab === 'shortlisted' })
  const addShortlist = trpc.dashboard.shortlist.add.useMutation()
  const removeShortlist = trpc.dashboard.shortlist.remove.useMutation()

  const normalizedMatches: NormalizedCourse[] = matches.map((match) => ({
    id: match.id,
    score: match.score,
    matchReasons: match.matchReasons,
    slug: match.course?.slug,
    name: match.course?.name,
    subject: match.course?.subject,
    level: match.course?.level,
    tuitionFee: match.course?.tuitionFee,
    currency: match.course?.currency,
    hasScholarship: match.course?.hasScholarship,
    universityName: match.course?.university?.name,
    universityCountry: match.course?.university?.country,
  }))

  const normalizedExplore: NormalizedCourse[] = (coursesQuery.data?.hits ?? []).map((course: any) => ({
    id: course.id,
    slug: course.slug,
    name: course.name,
    subject: course.subject,
    level: course.level,
    tuitionFee: course.tuitionFee,
    currency: course.currency,
    hasScholarship: course.hasScholarship,
    universityName: course.universityName,
    universityCountry: course.universityCountry,
  }))

  const normalizedShortlist: NormalizedCourse[] = (shortlistQuery.data ?? []).map((item: any) => ({
    id: item.courseId,
    slug: item.course?.slug,
    name: item.course?.name,
    subject: item.course?.subject,
    level: item.course?.level,
    tuitionFee: item.course?.tuitionFee,
    currency: item.course?.currency,
    hasScholarship: item.course?.hasScholarship,
    universityName: item.course?.university?.name,
    universityCountry: item.course?.university?.country,
  }))

  const shortlistedIds = useMemo(() => new Set(normalizedShortlist.map((course) => course.id)), [normalizedShortlist])

  async function toggleShortlist(course: NormalizedCourse) {
    if (!course.id) return
    const isShortlisted = shortlistedIds.has(course.id)
    try {
      if (isShortlisted) {
        await removeShortlist.mutateAsync({ courseId: course.id })
        toast.success('Removed from shortlist')
      } else {
        await addShortlist.mutateAsync({ courseId: course.id })
        toast.success('Added to shortlist')
      }
      utils.dashboard.shortlist.list.invalidate()
      utils.dashboard.overview.invalidate()
    } catch (error: any) {
      toast.error(error.message || 'Could not update shortlist')
    }
  }

  const activeCourses = tab === 'matches' ? normalizedMatches : tab === 'explore' ? normalizedExplore : normalizedShortlist
  const showLoading = tab === 'explore' && coursesQuery.isLoading
  const showError = tab === 'explore' && coursesQuery.isError
  const totalPages = coursesQuery.data?.totalPages || 1

  const tabClass = (active: boolean) =>
    `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${active ? 'bg-white text-gray-900 shadow-sm dark:bg-[#12141c] dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`

  return (
    <section className={`${panel} p-5 sm:p-6`}>
      <WidgetHeader icon={BookOpen} title="Courses" description="Matches based on your goals and the full course catalogue to explore." href="/courses" />

      <div className="mt-5 flex gap-1 overflow-x-auto rounded-xl bg-gray-50 p-1 dark:bg-[#1a1d25]" role="tablist" aria-label="Course views">
        <button type="button" role="tab" aria-selected={tab === 'matches'} onClick={() => setTab('matches')} className={tabClass(tab === 'matches')}>Best matches</button>
        <button type="button" role="tab" aria-selected={tab === 'explore'} onClick={() => setTab('explore')} className={tabClass(tab === 'explore')}>Explore courses</button>
        <button type="button" role="tab" aria-selected={tab === 'shortlisted'} onClick={() => setTab('shortlisted')} className={tabClass(tab === 'shortlisted')}>Shortlisted{normalizedShortlist.length ? ` (${normalizedShortlist.length})` : ''}</button>
      </div>

      {tab === 'explore' && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1) }}
              placeholder="Search by course name or subject..."
              aria-label="Search courses"
              className={`${input} pl-10`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([
              ['country', 'Country', (filterOptions.data?.countries ?? []) as string[], country, setCountry, false],
              ['subject', 'Subject', (filterOptions.data?.subjects ?? []) as string[], subject, setSubject, false],
              ['level', 'Level', (filterOptions.data?.levels ?? []) as string[], level, setLevel, true],
            ] as const).map(([key, label, options, value, setter, prettify]) => (
              <label key={key} className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
                <select
                  value={value}
                  onChange={(event) => { (setter as any)(event.target.value); setPage(1) }}
                  aria-label={`Filter by ${label.toLowerCase()}`}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 outline-none transition focus:border-rose-500 dark:border-gray-700 dark:bg-[#12141c] dark:text-gray-200 dark:focus:border-rose-400"
                >
                  <option value="">All {label.toLowerCase()}{label === 'Level' ? 's' : ''}</option>
                  {options.map((option) => <option key={option} value={option}>{prettify ? option.replace(/_/g, ' ') : option}</option>)}
                </select>
              </label>
            ))}
            <label className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Budget</span>
              <select value={budget ?? ''} onChange={(event) => { setBudget(event.target.value ? Number(event.target.value) : null); setPage(1) }} aria-label="Filter by budget" className="h-10 w-full rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 outline-none transition focus:border-rose-500 dark:border-gray-700 dark:bg-[#12141c] dark:text-gray-200 dark:focus:border-rose-400">
                {BUDGET_RANGES.map((range) => <option key={range.label} value={range.value ?? ''}>{range.label}</option>)}
              </select>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" role="switch" aria-checked={scholarship} onClick={() => { setScholarship((value) => !value); setPage(1) }} className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${scholarship ? 'bg-rose-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${scholarship ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Scholarships only</span>
            {coursesQuery.data ? <span className="ml-auto text-xs font-semibold text-gray-500">{coursesQuery.data.total} courses</span> : null}
          </div>
        </div>
      )}

      <div className="mt-5">
        {showLoading ? (
          <DashboardLoading rows={2} />
        ) : showError ? (
          <DashboardError title="Courses unavailable" message="We could not load the course catalogue." onRetry={() => coursesQuery.refetch()} />
        ) : activeCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 px-5 py-9 text-center dark:border-gray-700">
            <Sparkles size={25} className="mx-auto text-gray-300 dark:text-gray-600" />
            <p className="mt-3 text-sm font-bold text-gray-900 dark:text-white">
              {tab === 'matches' ? 'Add your goals for personalised matches' : tab === 'shortlisted' ? 'Your shortlist is empty' : 'No courses found'}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">
              {tab === 'matches' ? 'Tell us your target countries, subjects, and budget to see courses that fit you.' : tab === 'shortlisted' ? 'Tap the heart on any course to save it here for later.' : 'Try adjusting your search or filters.'}
            </p>
            {tab === 'matches' && (
              <Link
                href="/dashboard/settings?tab=study"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
              >
                <SlidersHorizontal size={14} /> Set study preferences
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {activeCourses.map((course) => (
                <CourseCard key={`${tab}-${course.id}`} course={course} shortlisted={shortlistedIds.has(course.id)} onToggle={() => toggleShortlist(course)} />
              ))}
            </div>
            {tab === 'explore' && totalPages > page && (
              <div className="mt-4 flex justify-center">
                <button type="button" onClick={() => setPage((current) => current + 1)} className="inline-flex h-10 items-center rounded-xl border border-gray-200 px-4 text-sm font-bold text-gray-700 transition-colors hover:border-rose-300 hover:text-rose-600 dark:border-gray-700 dark:text-gray-200">
                  Show more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export function DashboardInstitutionShelf({ recommendedUniversities = [] }: { recommendedUniversities?: any[] }) {
  const { data, isLoading, isError, refetch } = trpc.university.featured.useQuery()
  const countries = useMemo(() => Array.from(new Set((data ?? []).map((institution: any) => institution.country).filter(Boolean))), [data])
  const [country, setCountry] = useState('All')
  const institutions = (data ?? []).filter((institution: any) => country === 'All' || institution.country === country)

  if (recommendedUniversities.length > 0) {
    return (
      <section className={`${panel} p-5 sm:p-6`}>
        <WidgetHeader icon={Building2} title="Recommended universities" description="Matched to your study preferences, ranked by fit." href="/universities" />
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {recommendedUniversities.slice(0, 6).map((uni: any) => (
            <Link key={uni.id} href={`/universities/${uni.slug}`} className="group rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-rose-200 hover:bg-rose-50/30 focus-visible:outline-2 focus-visible:outline-rose-600 dark:border-gray-800 dark:bg-[#1a1d25] dark:hover:border-rose-900/50 dark:hover:bg-rose-500/5">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-sm font-bold text-rose-600 dark:bg-[#12141c] dark:text-rose-300">{uni.name?.charAt(0) || 'U'}</div>
                {typeof uni.matchScore === 'number' && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">{uni.matchScore}% fit</span>}
              </div>
              <h3 className="mt-3 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-300">{uni.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"><MapPin size={12} /> {[uni.city, uni.country].filter(Boolean).join(', ')}</p>
              {uni.topCourse?.name && <p className="mt-2 truncate text-xs font-medium text-gray-600 dark:text-gray-300">{uni.topCourse.name}</p>}
              {uni.matchReasons?.[0] && <p className="mt-1 truncate text-[11px] text-gray-400 dark:text-gray-500">{uni.matchReasons[0]}</p>}
            </Link>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className={`${panel} p-5 sm:p-6`}>
      <WidgetHeader icon={Building2} title="Institutions around the world" description="Explore trusted universities and colleges for your next chapter." href="/universities" />
      {isLoading ? <div className="mt-5"><DashboardLoading rows={1} /></div> : isError ? <div className="mt-5"><DashboardError title="Institutions unavailable" message="We could not load the institution catalogue." onRetry={() => refetch()} /></div> : (
        <>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Institution countries">
            {['All', ...countries.slice(0, 5)].map((option) => <button key={option} type="button" role="tab" aria-selected={country === option} onClick={() => setCountry(option)} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${country === option ? 'border-rose-600 bg-rose-600 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300 dark:border-gray-700 dark:bg-[#1a1d25] dark:text-gray-300'}`}>{option}</button>)}
          </div>
          {institutions.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-gray-200 px-5 py-8 text-center text-sm text-gray-500 dark:border-gray-700">No institutions match this country.</div> : <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">{institutions.slice(0, 6).map((institution: any) => <Link key={institution.id} href={`/universities/${institution.slug}`} className="group rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-rose-200 hover:bg-rose-50/30 focus-visible:outline-2 focus-visible:outline-rose-600 dark:border-gray-800 dark:bg-[#1a1d25] dark:hover:border-rose-900/50 dark:hover:bg-rose-500/5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-sm font-bold text-rose-600 dark:bg-[#12141c] dark:text-rose-300">{institution.name?.charAt(0) || 'U'}</div><h3 className="mt-3 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-300">{institution.name}</h3><p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"><MapPin size={12} /> {institution.city}, {institution.country}</p></Link>)}</div>}
        </>
      )}
    </section>
  )
}

export function DashboardResourceShelf() {
  const { data: blogs, isLoading, isError, refetch } = trpc.resource.published.blogs.useQuery()

  return (
    <section className={`${panel} p-5 sm:p-6`}>
      <WidgetHeader icon={Newspaper} title="What's new" description="Useful guides for applications, visas, and student life." href="/blog" action="See all" />
      {isLoading ? <div className="mt-5"><DashboardLoading rows={2} /></div> : isError ? <div className="mt-5"><DashboardError title="Resources unavailable" message="We could not load the latest student guides." onRetry={() => refetch()} /></div> : (blogs ?? []).length === 0 ? <div className="mt-5 rounded-xl border border-dashed border-gray-200 px-5 py-8 text-center text-sm text-gray-500 dark:border-gray-700">New student guides will appear here.</div> : <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{(blogs ?? []).slice(0, 4).map((blog: any) => <Link key={blog.id} href={`/blog/${blog.slug}`} className="group rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-rose-200 hover:bg-rose-50/30 focus-visible:outline-2 focus-visible:outline-rose-600 dark:border-gray-800 dark:bg-[#1a1d25] dark:hover:border-rose-900/50 dark:hover:bg-rose-500/5"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400"><CalendarDays size={12} /> {blog.category || 'Student guide'}</div><h3 className="mt-3 line-clamp-2 text-sm font-bold leading-5 text-gray-900 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-300">{blog.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{blog.description || 'Read the latest guidance from Endow.'}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-rose-600">Read article <ArrowRight size={13} /></span></Link>)}</div>}
    </section>
  )
}
