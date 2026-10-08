'use client'

import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface CounselorItem {
  id?: string
  name?: string | null
  counselorProfile?: {
    id?: string
  } | null
}

interface ApplicationItem {
  id: string
  status?: string | null
  course?: {
    name?: string | null
    university?: {
      name?: string | null
    } | null
  } | null
}

interface BookingSessionItem {
  id: string
  scheduledAt?: string | Date | null
  status?: string | null
}

interface StudentProfileData {
  highestEducation?: string | null
  gpa?: number | null
  ieltsScore?: number | null
  toeflScore?: number | null
  targetCountries?: string[] | null
  assignedCounselorId?: string | null
  applications?: ApplicationItem[] | null
  bookingSessions?: BookingSessionItem[] | null
}

interface StudentData {
  id: string
  name?: string | null
  email?: string | null
  studentProfile?: StudentProfileData | null
}

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: student, isLoading, refetch } = trpc.admin.students.getById.useQuery({ id })
  const { data: counselorsData } = trpc.admin.counselors.list.useQuery()

  const assignMutation = trpc.admin.students.assignCounselor.useMutation({
    onSuccess: async () => {
      await refetch()
      toast.success('Counselor assignment updated')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => toast.error(error.message || 'Could not update counselor assignment'),
  })

  const studentObj = student as StudentData | undefined
  const counselors = (counselorsData as CounselorItem[]) || []

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="flex items-center gap-4">
          <div className="h-10 w-20 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-9 w-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-56 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800/60" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-100 p-4 dark:border-white/[0.06]"
                  >
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="mt-2 h-3 w-32 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="mb-4 h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-3 w-28 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!studentObj) {
    return (
      <div className="py-20 text-center text-sm text-gray-500 dark:text-gray-400">
        Student not found
      </div>
    )
  }

  const profile = studentObj.studentProfile

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
        >
          Back
        </button>
        <PageHeader
          title={studentObj.name || 'Student Details'}
          description={studentObj.email || ''}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* PROFILE SECTION */}
        <div className="col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Academic Profile
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Highest Education</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile?.highestEducation || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">GPA</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile?.gpa ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">IELTS Score</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile?.ieltsScore ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">TOEFL Score</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile?.toeflScore ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Target Countries</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {Array.isArray(profile?.targetCountries) && profile.targetCountries.length > 0
                    ? profile.targetCountries.join(', ')
                    : 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* APPLICATIONS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Applications
            </h2>
            {profile?.applications && profile.applications.length > 0 ? (
              <div className="space-y-4">
                {profile.applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-gray-100 p-4 dark:border-white/[0.06] dark:bg-[#09090b]/40"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {app.course?.name || 'Unnamed Course'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {app.course?.university?.name || 'Unknown University'}
                    </p>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      Status: <span className="font-medium">{app.status || 'N/A'}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No applications yet.</p>
            )}
          </div>
        </div>

        {/* COUNSELOR ASSIGNMENT & SESSIONS */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Counselor Assignment
            </h2>
            <div className="space-y-4">
              <select
                aria-label="Assign counselor"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                value={profile?.assignedCounselorId || ''}
                onChange={(e) =>
                  assignMutation.mutate({ studentId: id, counselorId: e.target.value || null })
                }
                disabled={assignMutation.isPending}
              >
                <option value="">Unassigned</option>
                {counselors
                  .filter((c) => c.counselorProfile?.id)
                  .map((c) => (
                    <option key={c.counselorProfile!.id} value={c.counselorProfile!.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              {assignMutation.isPending && (
                <p className="text-xs font-medium text-[#c41e3a]">Assigning...</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Sessions</h2>
            {profile?.bookingSessions && profile.bookingSessions.length > 0 ? (
              <div className="space-y-3">
                {profile.bookingSessions.map((session) => (
                  <div key={session.id} className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.scheduledAt ? new Date(session.scheduledAt).toLocaleString() : 'N/A'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">Status: {session.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No sessions scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
