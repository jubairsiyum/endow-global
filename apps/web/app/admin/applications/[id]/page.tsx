'use client'

import StatusBadge from '@/components/ui/StatusBadge'
import { confirmToast } from '@/components/ui/confirmToast'
import { trpc } from '@/lib/trpc-client'
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  ShieldCheck,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function cleanPhoneForWhatsApp(phone: string | null | undefined): string {
  if (!phone) return ''
  return phone.replace(/[^0-9]/g, '')
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: rawApp, isLoading, refetch } = trpc.admin.applications.getById.useQuery({ id })
  const { data: counselorsData } = trpc.admin.counselors.list.useQuery()
  const counselors = (counselorsData as any[]) || []

  const assignMutation = trpc.admin.applications.assignCounselor.useMutation({
    onSuccess: () => {
      toast.success('Counselor assignment updated')
      refetch()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to update counselor'),
  })

  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  const statusMutation = trpc.admin.applications.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Status updated successfully')
      refetch()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to update status'),
  })

  const notesMutation = trpc.admin.applications.addNotes.useMutation({
    onSuccess: () => {
      toast.success('Notes saved')
      setIsEditingNotes(false)
      refetch()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to save notes'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12" aria-busy="true">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="flex-1 space-y-2">
            <div className="h-8 w-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="h-44 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const app = rawApp as any

  if (!app) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <FileText size={40} className="mx-auto text-gray-300 dark:text-gray-600" />
        <h2 className="mt-4 text-base font-bold text-gray-900 dark:text-white">Application Not Found</h2>
        <p className="mt-1 text-xs text-gray-400">This application may have been removed or does not exist.</p>
        <button
          onClick={() => router.push('/admin/applications')}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#c41e3a] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90"
        >
          <ArrowLeft size={13} />
          Back to Applications
        </button>
      </div>
    )
  }

  const pInfo = app.personalInfo || {}
  const aHistory = app.academicHistory || {}

  const studentName =
    app.student?.user?.name ||
    (pInfo.givenName || pInfo.surname ? `${pInfo.givenName || ''} ${pInfo.surname || ''}`.trim() : null) ||
    'Student'
  const studentEmail = app.student?.user?.email || pInfo.email || '—'
  const studentPhone = pInfo.phone || app.student?.profile?.phone || '—'
  const studentWhatsApp = pInfo.whatsapp || app.student?.profile?.whatsapp || null
  const studentImage = app.student?.user?.image || pInfo.photoUrl || null
  const waClean = cleanPhoneForWhatsApp(studentWhatsApp || studentPhone)
  const initials = studentName.split(/\s+/).map((s: string) => s[0]).join('').slice(0, 2).toUpperCase() || 'ST'

  const handleStatusChange = (newStatus: string) => {
    confirmToast({
      title: 'Change Application Status',
      description: `Are you sure you want to change the status to ${newStatus.replace(/_/g, ' ')}?`,
      confirmLabel: 'Change Status',
      onConfirm: () => statusMutation.mutate({ id, status: newStatus as any }),
    })
  }

  const handleSaveNotes = () => {
    notesMutation.mutate({ id, notes })
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/applications')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Course Application
              </h1>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-500 dark:bg-white/[0.06] dark:text-gray-400">
                #{app.id}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Submitted on {formatDate(app.submittedAt || app.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
          >
            <Printer size={13} className="text-gray-500" />
            <span>Print Application</span>
          </button>
          {studentEmail !== '—' && (
            <a
              href={`mailto:${studentEmail}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
            >
              <Mail size={13} className="text-gray-500" />
              Email Student
            </a>
          )}
          {waClean && (
            <a
              href={`https://wa.me/${waClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Printable Official Header */}
      <div className="hidden print:block mb-6 border-b-2 border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-black">ENDOW GLOBAL</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">| Student Admissions</span>
            </div>
            <h1 className="mt-1 text-lg font-bold text-black">Official Course Application Dossier</h1>
            <p className="text-xs text-gray-600">Application ID: #{app.id}</p>
          </div>
          <div className="text-right text-xs text-gray-600">
            <p><span className="font-semibold text-black">Status:</span> {app.status || 'SUBMITTED'}</p>
            <p><span className="font-semibold text-black">Submitted:</span> {formatDate(app.submittedAt || app.createdAt)}</p>
            <p><span className="font-semibold text-black">Printed:</span> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] print:border-gray-300 print:bg-white print:text-black print:shadow-none print:break-inside-avoid">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {studentImage ? (
              <img
                src={studentImage}
                alt=""
                className="h-16 w-16 shrink-0 rounded-2xl border border-gray-100 object-cover shadow-sm dark:border-white/[0.08]"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c41e3a]/15 to-[#e8a33d]/15 text-lg font-bold text-[#c41e3a] dark:text-red-400">
                {initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {studentName}
                </h2>
                <StatusBadge status={app.status || 'SUBMITTED'} />
              </div>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {studentEmail} • {studentPhone}
              </p>
              {(pInfo.city || pInfo.country || app.student?.profile?.country) && (
                <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                  <MapPin size={11} className="text-[#c41e3a]" />
                  <span>
                    {[pInfo.city, pInfo.country || app.student?.profile?.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-2.5 dark:border-white/[0.06] dark:bg-[#09090b]">
              <span className="text-[10px] uppercase font-semibold text-gray-400">Target University</span>
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                {app.course?.university?.name || aHistory.targetUniversity || 'University'}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-2.5 dark:border-white/[0.06] dark:bg-[#09090b]">
              <span className="text-[10px] uppercase font-semibold text-gray-400">Target Course</span>
              <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {app.course?.name || aHistory.courseName || 'Selected Course'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 print:block print:w-full print:space-y-6">
        {/* LEFT COLUMN: APPLICATION & STUDENT DETAILS (2 cols) */}
        <div className="col-span-2 space-y-6 print:w-full print:space-y-6">
          {/* Personal & Contact Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] print:break-inside-avoid print:border-gray-300 print:bg-white print:text-black print:shadow-none">
            <div className="mb-4 flex items-center gap-2 text-[#c41e3a]">
              <User size={16} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Personal & Contact Details
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs text-gray-400">Given Name</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {pInfo.givenName || studentName.split(' ')[0] || '—'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Surname</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {pInfo.surname || studentName.split(' ').slice(1).join(' ') || '—'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Email Address</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{studentEmail}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Phone Number</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{studentPhone}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">WhatsApp Number</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {studentWhatsApp || pInfo.phone || '—'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Date of Birth</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{pInfo.dob || '—'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Gender</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{pInfo.gender || '—'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Nationality</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {pInfo.nationality || app.student?.profile?.nationality || '—'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Father's Name</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{pInfo.fatherName || '—'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Mother's Name</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{pInfo.motherName || '—'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Hometown</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{pInfo.hometown || '—'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Country of Residence</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {pInfo.country || app.student?.profile?.country || '—'}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-gray-400">Address</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {[
                    pInfo.addressLine1,
                    pInfo.addressLine2,
                    pInfo.city,
                    pInfo.state,
                    pInfo.zipCode,
                    pInfo.country,
                  ]
                    .filter(Boolean)
                    .join(', ') || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Academic Background & Qualifications */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] print:break-inside-avoid print:border-gray-300 print:bg-white print:text-black print:shadow-none">
            <div className="mb-4 flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <GraduationCap size={16} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Academic Background & Qualifications
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs text-gray-400">Applying Degree Level</span>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {aHistory.applyingTo || app.course?.level || app.student?.profile?.highestEducation || '—'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">English Language Test</span>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {aHistory.englishTest || app.student?.profile?.englishTest || 'None'}
                  {(() => {
                    const test = aHistory.englishTest || app.student?.profile?.englishTest
                    if (!test || test === 'None') return ''
                    const score =
                      aHistory.ieltsScore ||
                      app.student?.profile?.ieltsScore ||
                      aHistory.toeflScore ||
                      app.student?.profile?.toeflScore ||
                      aHistory.satScore ||
                      app.student?.profile?.satScore ||
                      aHistory.topikLevel ||
                      app.student?.profile?.topikLevel
                    return score ? ` (${score})` : ''
                  })()}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">SSC / O-Level</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {aHistory.sscResult ? `Result: ${aHistory.sscResult}` : '—'}
                  {aHistory.sscYear ? ` (${aHistory.sscYear})` : ''}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">HSC / A-Level</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {aHistory.hscResult ? `Result: ${aHistory.hscResult}` : '—'}
                  {aHistory.hscYear ? ` (${aHistory.hscYear})` : ''}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Bachelor's Degree</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {aHistory.bachelorsResult ? `CGPA: ${aHistory.bachelorsResult}` : '—'}
                  {aHistory.bachelorsYear ? ` (${aHistory.bachelorsYear})` : ''}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Master's Degree</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {aHistory.mastersResult ? `CGPA: ${aHistory.mastersResult}` : '—'}
                  {aHistory.mastersYear ? ` (${aHistory.mastersYear})` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Statement of Purpose / Reason to Choose */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] print:break-inside-avoid print:border-gray-300 print:bg-white print:text-black print:shadow-none">
            <div className="mb-3 flex items-center gap-2 text-blue-500">
              <FileText size={16} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Personal Statement & Motivation
              </h3>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-xs leading-relaxed text-gray-700 dark:bg-[#09090b]/80 dark:text-gray-300">
              {app.personalStatement || pInfo.reasonToChoose || 'No personal statement provided.'}
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] print:break-inside-avoid print:border-gray-300 print:bg-white print:text-black print:shadow-none">
            <div className="mb-3 flex items-center gap-2 text-emerald-600">
              <FileCheck2 size={16} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Application Documents
              </h3>
            </div>
            {Array.isArray(app.documentsUrls) && app.documentsUrls.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {app.documentsUrls.map((docUrl: string, idx: number) => {
                  const fileName = docUrl.split('/').pop() || `Document ${idx + 1}`
                  return (
                    <a
                      key={idx}
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-xs font-semibold text-gray-800 transition-colors hover:border-[#c41e3a] hover:bg-white dark:border-white/[0.06] dark:bg-[#09090b] dark:text-gray-200 dark:hover:border-red-400"
                    >
                      <span className="truncate pr-2">{fileName}</span>
                      <ExternalLink size={13} className="shrink-0 text-gray-400 print:hidden" />
                    </a>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No documents attached with this submission.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONS, STATUS & COUNSELOR (1 col) */}
        <div className="space-y-6 print:w-full print:space-y-6">
          {/* Status Management */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] print:break-inside-avoid print:border-gray-300 print:bg-white print:text-black print:shadow-none">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Application Status
            </h3>
            <div className="mb-4">
              <StatusBadge status={app.status || 'SUBMITTED'} />
            </div>

            <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400 print:hidden">
              Update Admission Status
            </label>
            <select
              aria-label="Change application status"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white print:hidden"
              value={app.status || 'SUBMITTED'}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusMutation.isPending}
            >
              <option value="DRAFT">Draft</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="DOCUMENTS_REQUIRED">Documents Required</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="WAITLISTED">Waitlisted</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          {/* Assigned Counselor */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] print:break-inside-avoid print:border-gray-300 print:bg-white print:text-black print:shadow-none">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Assigned Counselor
              </h3>
              {app.counselor?.user?.name && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Assigned
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xs font-bold text-purple-600 dark:bg-purple-950/40 dark:text-purple-300">
                {app.counselor?.user?.name ? app.counselor.user.name.slice(0, 2).toUpperCase() : 'CO'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-gray-900 dark:text-white">
                  {app.counselor?.user?.name || 'Unassigned Counselor'}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {app.counselor?.user?.email || 'No counselor assigned to this application'}
                </p>
              </div>
            </div>

            {/* Reassign Counselor Control */}
            <div className="mt-4 border-t border-gray-100 pt-3 dark:border-white/[0.06] print:hidden">
              <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Assign / Change Counselor
              </label>
              <select
                aria-label="Assign counselor"
                value={app.counselor?.id || ''}
                onChange={(e) =>
                  assignMutation.mutate({
                    applicationId: id,
                    counselorId: e.target.value || null,
                  })
                }
                disabled={assignMutation.isPending}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
              >
                <option value="">Unassigned</option>
                {counselors
                  .filter((c) => c.counselorProfile?.id)
                  .map((c) => (
                    <option key={c.counselorProfile!.id} value={c.counselorProfile!.id}>
                      {c.name || c.email} ({c.role || 'Counselor'})
                    </option>
                  ))}
              </select>
              {assignMutation.isPending && (
                <p className="mt-1 text-[11px] font-medium text-[#c41e3a]">Saving assignment...</p>
              )}
            </div>

            {app.student?.user?.id && (
              <div className="mt-3 pt-2 print:hidden">
                <Link
                  href={`/admin/students/${app.student.user.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c41e3a] hover:underline dark:text-red-400"
                >
                  <span>View Student Profile</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            )}
          </div>

          {/* Counselor Internal Notes */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] print:break-inside-avoid print:border-gray-300 print:bg-white print:text-black print:shadow-none">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Counselor Internal Notes
            </h3>

            {!isEditingNotes ? (
              <div>
                <div className="mb-4 rounded-xl bg-gray-50/80 p-3.5 text-xs leading-relaxed text-gray-700 dark:bg-[#09090b] dark:text-gray-300">
                  {app.counselorNotes || 'No internal notes added yet.'}
                </div>
                <button
                  onClick={() => {
                    setNotes(app.counselorNotes || '')
                    setIsEditingNotes(true)
                  }}
                  className="rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-[#c41e3a] transition-colors hover:bg-red-50 dark:border-white/[0.08] dark:text-[#e05266] dark:hover:bg-white/[0.06] print:hidden"
                >
                  Edit Notes
                </button>
              </div>
            ) : (
              <div className="space-y-3 print:hidden">
                <textarea
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter internal notes for this applicant..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={notesMutation.isPending}
                    style={{ background: '#c41e3a' }}
                    className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
                  >
                    {notesMutation.isPending ? 'Saving...' : 'Save Notes'}
                  </button>
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Specific CSS to completely eliminate buttons, overflow clips, and margins */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 12mm;
            size: auto;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
            color: black !important;
          }
          button,
          select,
          textarea,
          a[href^="mailto:"],
          a[href^="https://wa.me"],
          a[href^="tel:"],
          .no-print,
          .print\\:hidden {
            display: none !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  )
}
