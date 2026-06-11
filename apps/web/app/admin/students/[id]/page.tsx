'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: student, isLoading, refetch } = trpc.admin.students.getById.useQuery({ id })
  const { data: counselors } = trpc.admin.counselors.list.useQuery()

  const assignMutation = trpc.admin.students.assignCounselor.useMutation({
    onSuccess: () => refetch(),
  })

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="flex items-center gap-4">
          <div className="h-10 w-20 animate-pulse rounded-xl bg-gray-200 dark:bg-[#222530]" />
          <div className="space-y-2">
            <div className="h-9 w-48 animate-pulse rounded-xl bg-gray-200 dark:bg-[#222530]" />
            <div className="h-4 w-56 animate-pulse rounded-lg bg-gray-100 dark:bg-[#222530]" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
              <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-100 dark:bg-[#222530]" />
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
              <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-lg border p-4 dark:border-gray-700">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                    <div className="mt-2 h-3 w-32 animate-pulse rounded bg-gray-100 dark:bg-[#222530]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
              <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-[#222530]" />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
              <div className="mb-4 h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                    <div className="h-3 w-28 animate-pulse rounded bg-gray-100 dark:bg-[#222530]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!student) {
    return <div className="py-20 text-center">Student not found</div>
  }

  const s = student as any
  const profile = s.studentProfile

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#1a1d25]"
        >
          Back
        </button>
        <PageHeader title={student.name || 'Student Details'} description={student.email} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* PROFILE SECTION */}
        <div className="col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Academic Profile
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Highest Education</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile?.highestEducation || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GPA</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile?.gpa || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IELTS Score</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile?.ieltsScore || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">TOEFL Score</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile?.toeflScore || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Countries</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {Array.isArray(profile?.targetCountries)
                    ? profile.targetCountries.join(', ')
                    : 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* APPLICATIONS */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Applications
            </h2>
            {profile?.applications && profile.applications.length > 0 ? (
              <div className="space-y-4">
                {profile.applications.map((app: any) => (
                  <div key={app.id} className="rounded-lg border p-4 dark:border-gray-700">
                    <p className="font-semibold">{app.course?.name}</p>
                    <p className="text-sm text-gray-500">{app.course?.university?.name}</p>
                    <p className="mt-2 text-sm">
                      Status: <span className="font-medium">{app.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No applications yet.</p>
            )}
          </div>
        </div>

        {/* COUNSELOR ASSIGNMENT & SESSIONS */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Counselor Assignment
            </h2>
            <div className="space-y-4">
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm dark:border-gray-700 dark:bg-[#222530]"
                value={profile?.assignedCounselorId || ''}
                onChange={(e) =>
                  assignMutation.mutate({ studentId: id, counselorId: e.target.value || null })
                }
                disabled={assignMutation.isPending}
              >
                <option value="">Unassigned</option>
                {counselors?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {assignMutation.isPending && <p className="text-xs text-primary">Assigning...</p>}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Sessions</h2>
            {profile?.bookingSessions && profile.bookingSessions.length > 0 ? (
              <div className="space-y-3">
                {profile.bookingSessions.map((session: any) => (
                  <div key={session.id} className="text-sm">
                    <p className="font-medium">{new Date(session.scheduledAt).toLocaleString()}</p>
                    <p className="text-gray-500">Status: {session.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No sessions scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
