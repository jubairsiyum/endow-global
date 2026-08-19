'use client'

import Link from 'next/link'
import { Heart, MapPin, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { trpc } from '@/lib/trpc-client'
import { formatCurrency } from '@/lib/utils'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'
import { StudentPageHeader, studentPanel } from '@/components/dashboard/StudentPageHeader'
import { btnPrimary, viewAllLink } from '@/components/dashboard/ui'

interface ShortlistedCourse {
  id: string
  courseId: string
  course?: {
    slug?: string | null
    name?: string | null
    tuitionFee?: number | null
    currency?: string | null
    hasScholarship?: boolean | null
    university?: {
      name?: string | null
      country?: string | null
    } | null
  } | null
}

export default function ShortlistedPage() {
  const utils = trpc.useUtils()
  const { data, isLoading, isError, refetch } = trpc.dashboard.shortlist.list.useQuery()
  const removeShortlist = trpc.dashboard.shortlist.remove.useMutation()
  const shortlisted = (data ?? []) as ShortlistedCourse[]

  async function removeCourse(courseId: string) {
    try {
      await removeShortlist.mutateAsync({ courseId })
      await utils.dashboard.shortlist.list.invalidate()
      await utils.dashboard.overview.invalidate()
      toast.success('Removed from shortlist')
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Could not update shortlist')
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <StudentPageHeader
        eyebrow="Your choices"
        title="Shortlisted courses"
        description="Keep your strongest options together while you compare where to apply."
        action={<Link href="/courses" className={btnPrimary}>Explore courses</Link>}
      />

      {isLoading ? (
        <DashboardLoading rows={2} />
      ) : isError ? (
        <DashboardError onRetry={() => refetch()} />
      ) : shortlisted.length === 0 ? (
        <section className={`${studentPanel} px-5 py-16 text-center`}>
          <Heart size={36} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">Your shortlist is empty</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">Save courses while you explore and they will appear here for easy comparison.</p>
          <Link href="/courses" className={`${btnPrimary} mt-5`}>Find courses</Link>
        </section>
      ) : (
        <section className={`${studentPanel} p-4 sm:p-5`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{shortlisted.length} saved {shortlisted.length === 1 ? 'course' : 'courses'}</p>
            <Link href="/courses" className={viewAllLink}>Add more</Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {shortlisted.map((item) => {
              const course = item.course
              return (
                <article key={item.id} className="group flex min-h-[176px] flex-col rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      <MapPin size={12} className="shrink-0 text-rose-600 dark:text-rose-300" />
                      <span className="truncate">{course?.university?.country || 'International'}</span>
                    </div>
                    <button type="button" onClick={() => removeCourse(item.courseId)} aria-label={`Remove ${course?.name || 'course'} from shortlist`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-rose-600 dark:hover:bg-rose-500/10">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <Link href={`/courses/${course?.slug || ''}`} className="mt-2 flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-rose-600">
                    <h2 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-300">{course?.name || 'Course'}</h2>
                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{course?.university?.name || 'University'}</p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{course?.tuitionFee ? formatCurrency(course.tuitionFee, course.currency || 'USD') : 'Fee on request'}</span>
                      {course?.hasScholarship && <span className="text-[10px] font-bold text-emerald-600">Scholarship</span>}
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}