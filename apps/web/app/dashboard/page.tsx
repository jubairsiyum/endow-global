'use client'

import { motion } from 'framer-motion'
import { trpc } from '@/lib/trpc-client'
import { useSession } from '@/lib/auth-client'
import { asStringArray } from '@/lib/utils'

import { OverviewHeader } from '@/components/dashboard/OverviewHeader'
import { ModernStatCards } from '@/components/dashboard/ModernStatCards'
import { AcademicCurvedChart } from '@/components/dashboard/AcademicCurvedChart'
import { DashboardTodoList } from '@/components/dashboard/DashboardTodoList'
import { ApplicationProgressCard } from '@/components/dashboard/ApplicationProgressCard'
import { UpcomingSessionsCard } from '@/components/dashboard/UpcomingSessionsCard'
import { ShortlistedTable } from '@/components/dashboard/ShortlistedTable'
import { DashboardError } from '@/components/dashboard/DashboardState'
import {
  DashboardCourseShelf,
  DashboardInstitutionShelf,
  DashboardResourceShelf,
} from '@/components/dashboard/DashboardDiscovery'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: overviewData, isLoading, isError, refetch } = trpc.dashboard.overview.useQuery()
  const data = overviewData as any

  const stats = data?.stats ?? {}
  const name = data?.user?.name ?? session?.user?.name ?? 'there'

  if (isLoading) {
    return <OverviewSkeleton />
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
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
      className="mx-auto w-full max-w-[1440px] space-y-6 px-4 sm:px-6 lg:px-8"
    >
      {/* 1. Overview Header (Greeting, Avatar, Preferred Intakes, Destination Tags) */}
      <OverviewHeader
        name={name}
        image={data?.user?.image || session?.user?.image}
        email={data?.user?.email || session?.user?.email}
        intakeLabel={
          data?.profile?.preferredIntakeMonth
            ? `${data.profile.preferredIntakeMonth} ${data.profile.preferredIntakeYear ?? ''}`.trim()
            : undefined
        }
        targetCountries={asStringArray(data?.profile?.targetCountries)}
        matchCount={stats.matches ?? 0}
        completionPercent={data?.profile?.completionPercent}
      />

      {/* 2. Top Row: 4 Modern Stat Cards (Theme Styled) */}
      <ModernStatCards stats={stats} />

      {/* 3. Row 1: Academic Eligibility Curved Chart (Left) + Real To-Do Checklist (Right) */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-7 xl:col-span-8">
          <AcademicCurvedChart profile={data?.profile} />
        </div>
        <div className="flex flex-col lg:col-span-5 xl:col-span-4">
          <DashboardTodoList
            documents={data?.documents ?? []}
            docProgress={stats?.docProgress}
          />
        </div>
      </section>

      {/* 4. Row 2: Application Progress (All Applied Courses) + Counselor Sessions */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <ApplicationProgressCard
            applications={data?.applications ?? []}
            stats={stats}
          />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <UpcomingSessionsCard
            sessions={data?.upcomingSessions ?? []}
            counselor={data?.counselor}
          />
        </div>
      </section>

      {/* 5. Shortlisted & Target Programs Table (All DB Data + Functional Actions) */}
      <ShortlistedTable
        shortlisted={data?.shortlisted ?? []}
        matches={data?.matches ?? []}
        applications={data?.applications ?? []}
        counselor={data?.counselor}
      />

      {/* 6. AI Match Recommendations Shelf (First 9 Cards + "See All Matches" Button) */}
      <DashboardCourseShelf matches={data?.matches ?? []} />

      {/* 7. Institutional Recommendations & Resources */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardInstitutionShelf
          recommendedUniversities={data?.recommendedUniversities ?? []}
        />
        <DashboardResourceShelf />
      </section>

      <div className="h-6" aria-hidden />
    </motion.div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="h-[160px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[140px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="h-[360px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60 lg:col-span-7 xl:col-span-8" />
        <div className="h-[360px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60 lg:col-span-5 xl:col-span-4" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="h-[260px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60 lg:col-span-7 xl:col-span-8" />
        <div className="h-[260px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60 lg:col-span-5 xl:col-span-4" />
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
    </div>
  )
}
