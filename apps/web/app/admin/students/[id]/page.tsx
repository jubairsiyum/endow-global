'use client'

import StatusBadge from '@/components/ui/StatusBadge'
import { trpc } from '@/lib/trpc-client'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  UserX,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

function fmtDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function cleanPhoneForWhatsApp(phone: string | null | undefined): string {
  if (!phone) return ''
  return phone.replace(/[^0-9]/g, '')
}

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const utils = trpc.useUtils()

  const { data: student, isLoading, refetch } = trpc.admin.students.getById.useQuery({ id })
  const { data: counselorsData } = trpc.admin.counselors.list.useQuery()

  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null)

  const assignMutation = trpc.admin.students.assignCounselor.useMutation({
    onSuccess: async () => {
      await refetch()
      utils.admin.applications.invalidate()
      utils.admin.students.invalidate()
      toast.success('Counselor assignment updated and synchronized')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => toast.error(error.message || 'Could not update counselor assignment'),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studentObj = student as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const counselors = (counselorsData as any[]) || []

  if (isLoading) {
    return (
      <div className="w-full space-y-6 pb-12" aria-busy="true">
        <div className="flex items-center gap-4">
          <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800/60" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 space-y-6">
            <div className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]" />
            <div className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]" />
          </div>
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]" />
            <div className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]" />
          </div>
        </div>
      </div>
    )
  }

  if (!studentObj) {
    return (
      <div className="w-full py-20 text-center">
        <UserX size={48} className="mx-auto text-gray-400 mb-3" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Student not found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          The requested student account could not be found or has been removed.
        </p>
        <button
          onClick={() => router.push('/admin/students')}
          className="mt-4 rounded-xl bg-[#c41e3a] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#a81932]"
        >
          Back to Students
        </button>
      </div>
    )
  }

  const profile = studentObj.studentProfile
  const applications = studentObj.applications || []
  const inquiries = studentObj.inquiries || []
  const sessions = studentObj.bookingSessions || []

  const assignedCounselor = profile?.assignedCounselor
  const currentCounselorId = profile?.assignedCounselorId || ''

  const initials =
    studentObj.name
      ?.split(' ')
      .map((s: string) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST'

  const waNumber = cleanPhoneForWhatsApp(profile?.phone)

  return (
    <div className="w-full space-y-6 pb-12">
      {/* ─── 1. TOP HEADER & NAVIGATION ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/students')}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
          >
            <ArrowLeft size={14} />
            <span>Students</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {studentObj.name || 'Student Profile'}
              </h1>
              {studentObj.emailVerified ? (
                <span
                  title="Verified Account"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                >
                  <ShieldCheck size={12} /> Verified
                </span>
              ) : (
                <span
                  title="Unverified Email"
                  className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                >
                  <ShieldAlert size={12} /> Unverified
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {studentObj.email} &bull; Joined {fmtDate(studentObj.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {studentObj.email && (
            <a
              href={`mailto:${studentObj.email}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-200 dark:hover:bg-white/[0.06]"
            >
              <Mail size={13} className="text-[#c41e3a]" />
              Email Student
            </a>
          )}
          <button
            onClick={() => {
              if (studentObj.email) {
                navigator.clipboard.writeText(studentObj.email)
                toast.success('Email copied to clipboard')
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-200 dark:hover:bg-white/[0.06]"
          >
            <Copy size={13} />
            Copy Email
          </button>
          <Link
            href={`/admin/applications?search=${encodeURIComponent(studentObj.email || '')}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#c41e3a] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#a81932]"
          >
            <BookOpen size={13} />
            Applications Tab
          </Link>
        </div>
      </div>

      {/* ─── 2. KEY STATS OVERVIEW ─── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#18181b]">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Applications</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {applications.length}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">
            {applications.filter((a: any) => a.status === 'ACCEPTED').length} accepted
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#18181b]">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Lead Inquiries</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {inquiries.length}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">Apply-now records</p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#18181b]">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Target Intake</p>
          <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">
            {profile?.preferredIntakeYear
              ? `${profile.preferredIntakeMonth || ''} ${profile.preferredIntakeYear}`.trim()
              : 'Flexible'}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">
            {profile?.interestedProgram || 'Program open'}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#18181b]">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Assigned Advisor</p>
          <p className="mt-1 text-base font-bold truncate text-gray-900 dark:text-white">
            {assignedCounselor?.user?.name || 'Unassigned'}
          </p>
          <p className="mt-0.5 text-[11px] truncate text-gray-400">
            {assignedCounselor?.user?.email || 'Needs counselor'}
          </p>
        </div>
      </div>

      {/* ─── 3. MAIN CONTENT GRID ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: Academic Details & Applications & Inquiries */}
        <div className="col-span-2 space-y-6">
          {/* Academic & Study Profile */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#c41e3a]" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Academic & Study Profile
                </h2>
              </div>
              {profile?.highestEducation && (
                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                  {profile.highestEducation}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Highest Education</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                  {profile?.highestEducation === 'BACHELORS'
                    ? "Bachelor's Degree"
                    : profile?.highestEducation === 'MASTERS'
                      ? "Master's Degree"
                      : profile?.highestEducation || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Interested Program</p>
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                  {profile?.interestedProgram || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Max Budget</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                  {profile?.budgetMax
                    ? `$${Number(profile.budgetMax).toLocaleString()} / year`
                    : 'No limit specified'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Overall GPA</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                  {profile?.gpa ?? 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">English Test Score</p>
                <div className="mt-0.5">
                  {profile?.ieltsScore ? (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      IELTS: {profile.ieltsScore}
                    </span>
                  ) : profile?.toeflScore ? (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      TOEFL: {profile.toeflScore}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Not recorded</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Target Countries</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {Array.isArray(profile?.targetCountries) && profile.targetCountries.length > 0 ? (
                    profile.targetCountries.map((c: string) => (
                      <span
                        key={c}
                        className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-white/[0.08] dark:text-gray-300"
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Any destination</span>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Credentials Breakdown */}
            <div className="mt-6 border-t border-gray-100 pt-4 dark:border-white/[0.06]">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Academic Qualifications Breakdown
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(profile?.highestEducation === 'MASTERS' || profile?.highestEducation === 'PHD') &&
                  profile?.mastersYear && (
                    <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50 dark:border-white/[0.06] dark:bg-[#12141c]">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Master&apos;s Degree
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                        Class of {profile.mastersYear} &bull; CGPA: {profile.mastersResult || '—'}
                      </p>
                    </div>
                  )}

                {profile?.bachelorsYear && (
                  <div className="rounded-xl border border-rose-100 p-3 bg-rose-50/30 dark:border-rose-900/30 dark:bg-[#12141c]">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        Bachelor&apos;s Degree
                      </p>
                      {profile?.highestEducation === 'BACHELORS' && (
                        <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                          Highest
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                      Class of {profile.bachelorsYear} &bull; CGPA: {profile.bachelorsResult || '—'}
                    </p>
                  </div>
                )}

                {profile?.hscYear && (
                  <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50 dark:border-white/[0.06] dark:bg-[#12141c]">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Higher Secondary (HSC / 12th)
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                      Class of {profile.hscYear} &bull; GPA: {profile.hscResult || '—'}
                    </p>
                  </div>
                )}

                {profile?.sscYear && (
                  <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50 dark:border-white/[0.06] dark:bg-[#12141c]">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Secondary (SSC / 10th)
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                      Class of {profile.sscYear} &bull; GPA: {profile.sscResult || '—'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Applications Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#c41e3a]" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Applications ({applications.length})
                </h2>
              </div>
              <Link
                href={`/admin/applications?search=${encodeURIComponent(studentObj.email || '')}`}
                className="text-xs font-semibold text-[#c41e3a] hover:underline flex items-center gap-1 dark:text-red-400"
              >
                <span>View all in applications tab</span>
                <ExternalLink size={12} />
              </Link>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app: any) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:border-gray-200 hover:bg-gray-50/50 dark:border-white/[0.06] dark:bg-[#09090b]/40 dark:hover:border-white/[0.1] dark:hover:bg-white/[0.02]"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="truncate text-sm font-semibold text-gray-900 hover:text-[#c41e3a] transition-colors dark:text-white dark:hover:text-red-400"
                        >
                          {app.course?.name || 'Course Application'}
                        </Link>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {app.course?.university?.name || 'University'}
                        {app.course?.university?.country ? ` &bull; ${app.course.university.country}` : ''}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Submitted: {fmtDate(app.submittedAt || app.updatedAt)} &bull; Step{' '}
                        {app.currentStep || 1} of {app.totalSteps || 4}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={app.status || 'SUBMITTED'} />
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/[0.08] dark:text-gray-200 dark:hover:bg-white/[0.06]"
                      >
                        Details &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-white/[0.08]">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No course applications submitted yet.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  When the student applies for any course, their submissions will be tracked here.
                </p>
              </div>
            )}
          </div>

          {/* Inquiries & Lead History */}
          {inquiries.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Apply-Now Inquiries ({inquiries.length})
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {inquiries.map((inq: any) => (
                  <div
                    key={inq.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-gray-100 p-3.5 dark:border-white/[0.06] dark:bg-[#09090b]/30"
                  >
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {inq.courseName || inq.targetUniversity || 'General Admission Inquiry'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Targeting {inq.targetCountry || 'Abroad'} &bull; Level: {inq.applyingTo || 'Any'}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Submitted: {fmtDate(inq.submittedAt)}
                      </p>
                    </div>

                    <Link
                      href={`/admin/applications/inquiries/${inq.id}`}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/[0.08] dark:text-gray-200 dark:hover:bg-white/[0.06] self-start sm:self-auto"
                    >
                      View Inquiry &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Counselor Assignment, Contact Info & Sessions */}
        <div className="space-y-6">
          {/* Counselor Assignment Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#c41e3a]" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Counselor Assignment
                </h2>
              </div>
              {assignedCounselor?.user?.name && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Assigned
                </span>
              )}
            </div>

            {/* Current Counselor Display */}
            {assignedCounselor?.user?.name ? (
              <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Currently Assigned Advisor:
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                    {assignedCounselor.user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {assignedCounselor.user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {assignedCounselor.user.email || 'Counselor Email'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  No Counselor Assigned
                </p>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                  Assign an advisor below so they can review this student&apos;s applications and documents.
                </p>
              </div>
            )}

            {/* Selector Control */}
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Assign / Reassign Advisor:
                </label>
                <select
                  aria-label="Assign counselor"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none transition-colors focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                  value={currentCounselorId}
                  onChange={(e) => {
                    const newCounselorId = e.target.value || null
                    assignMutation.mutate({ studentId: id, counselorId: newCounselorId })
                  }}
                  disabled={assignMutation.isPending}
                >
                  <option value="">-- Unassigned --</option>
                  {counselors
                    .filter((c) => c.counselorProfile?.id)
                    .map((c) => (
                      <option key={c.counselorProfile!.id} value={c.counselorProfile!.id}>
                        {c.name || c.email} ({c.role || 'Counselor'})
                      </option>
                    ))}
                </select>
              </div>

              {currentCounselorId && (
                <button
                  type="button"
                  onClick={() => assignMutation.mutate({ studentId: id, counselorId: null })}
                  disabled={assignMutation.isPending}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                >
                  Remove Counselor Assignment
                </button>
              )}

              {assignMutation.isPending && (
                <p className="text-xs font-medium text-[#c41e3a] animate-pulse">
                  Updating counselor assignment & synchronizing applications...
                </p>
              )}

              <p className="text-[11px] text-gray-400">
                Assigned advisors automatically receive notifications and view this student across their dashboard and applications.
              </p>
            </div>
          </div>

          {/* Contact & Personal Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-[#c41e3a]" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Contact & Personal Info
              </h2>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                    {profile?.phone || 'Not provided'}
                  </p>
                  {waNumber && (
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline mt-1 dark:text-emerald-400"
                    >
                      <MessageCircle size={12} />
                      Open WhatsApp Chat
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-0.5 truncate">
                    {studentObj.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-gray-500 dark:text-gray-400">Country of Residence / Nationality</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                    {[profile?.countryOfResidence, profile?.nationality].filter(Boolean).join(' / ') ||
                      'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-gray-500 dark:text-gray-400">Account Created</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                    {fmtDate(studentObj.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Sessions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#c41e3a]" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Consultation Sessions ({sessions.length})
                </h2>
              </div>
            </div>

            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session: any) => (
                  <div
                    key={session.id}
                    className="rounded-xl border border-gray-100 p-3 bg-gray-50/50 text-xs dark:border-white/[0.06] dark:bg-[#09090b]/30"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {session.scheduledAt ? new Date(session.scheduledAt).toLocaleString() : 'N/A'}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-gray-500 dark:text-gray-400">
                      <span>Advisor: {session.counselorName || 'Assigned counselor'}</span>
                      <span className="font-medium">{session.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No 1-on-1 consultation sessions booked yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
