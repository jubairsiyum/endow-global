'use client'

import { motion } from 'framer-motion'
import { CalendarClock, FileCheck2, FileText, Heart } from 'lucide-react'

import { trpc } from '@/lib/trpc-client'
import { useSession } from '@/lib/auth-client'
import { asStringArray } from '@/lib/utils'

import { OverviewHeader } from '@/components/dashboard/OverviewHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { ApplicationsPanel } from '@/components/dashboard/ApplicationsPanel'
import { TasksPanel } from '@/components/dashboard/TasksPanel'
import { SessionsPanel } from '@/components/dashboard/SessionsPanel'
import { DashboardError } from '@/components/dashboard/DashboardState'
import { DashboardCourseShelf, DashboardInstitutionShelf, DashboardResourceShelf } from '@/components/dashboard/DashboardDiscovery'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: overviewData, isLoading, isError, refetch } = trpc.dashboard.overview.useQuery()
  const data = overviewData as any

  const stats = data?.stats ?? {}
  const name = data?.user?.name ?? session?.user?.name ?? 'there'

  const nextDeadlineLabel = data?.deadlines?.[0]?.label

  if (isLoading) {
    return <OverviewSkeleton />
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-[1200px]">
        <DashboardError onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
      }}
      className="mx-auto max-w-[1200px] space-y-6"
    >
      <OverviewHeader
        name={name}
        intakeLabel={
          data?.profile?.preferredIntakeMonth
            ? `${data.profile.preferredIntakeMonth} ${data.profile.preferredIntakeYear ?? ''}`.trim()
            : undefined
        }
        targetCountries={asStringArray(data?.profile?.targetCountries)}
        matchCount={stats.matches ?? 0}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Applications"
          value={stats.applications ?? 0}
          icon={<FileText size={18} aria-hidden />}
          tone="default"
          caption={stats.applications ? 'On your journey' : 'Start your first one'}
          index={0}
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted ?? 0}
          icon={<Heart size={18} aria-hidden />}
          tone="info"
          caption="Courses you saved"
          index={1}
        />
        <StatCard
          title="Documents"
          value={stats.documentsUploaded ?? 0}
          suffix={` / ${stats.documentsTotal ?? 0}`}
          icon={<FileCheck2 size={18} aria-hidden />}
          tone="success"
          caption={stats.documentsTotal ? 'Uploaded & verified' : 'Nothing yet'}
          index={2}
        />
        <StatCard
          title="Next deadline"
          value={stats.daysUntilNextDeadline ?? 0}
          suffix=" days"
          icon={<CalendarClock size={18} aria-hidden />}
          tone={
            stats.daysUntilNextDeadline == null
              ? 'default'
              : stats.daysUntilNextDeadline <= 7
                ? 'danger'
                : stats.daysUntilNextDeadline <= 14
                  ? 'warning'
                  : 'info'
          }
          caption={nextDeadlineLabel ?? 'No deadlines'}
          index={3}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <ApplicationsPanel applications={data?.applications ?? []} index={2} />
        </div>
        <div className="space-y-5 lg:col-span-2">
          <TasksPanel
            documents={data?.documents ?? []}
            deadlines={data?.deadlines ?? []}
            index={2}
          />
          <SessionsPanel sessions={data?.upcomingSessions ?? []} index={3} />
        </div>
      </section>

      <DashboardCourseShelf matches={data?.matches ?? []} />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardInstitutionShelf />
        <DashboardResourceShelf />
      </section>

      <div className="h-2" aria-hidden />
    </motion.div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="h-[180px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[110px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <div className="h-[320px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
        </div>
        <div className="space-y-5 lg:col-span-2">
          <div className="h-[320px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
        </div>
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="h-56 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
        <div className="h-56 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
      </div>
    </div>
  )
}
