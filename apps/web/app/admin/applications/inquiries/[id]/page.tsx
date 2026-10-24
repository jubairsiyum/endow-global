'use client'

import { confirmToast } from '@/components/ui/confirmToast'
import { trpc } from '@/lib/trpc-client'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Check,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Globe,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  Sparkles,
  Trash2,
  User,
  Users,
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

export default function InquiryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const {
    data: inquiry,
    isLoading,
    error,
  } = trpc.endow.getInquiryById.useQuery({ id }, { enabled: !!id })

  const utils = trpc.useUtils()
  const deleteMutation = trpc.endow.deleteInquiry.useMutation({
    onSuccess: () => {
      toast.success('Inquiry deleted successfully')
      utils.endow.listInquiries.invalidate()
      router.push('/admin/applications')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete inquiry')
    },
  })

  function handleCopy(text: string, key: string) {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedKey(null), 2000)
  }

  function handleDelete() {
    confirmToast({
      title: 'Delete this inquiry?',
      description: 'This will permanently remove this inquiry submission. This action cannot be undone.',
      confirmLabel: 'Delete Inquiry',
      onConfirm: () => deleteMutation.mutate({ id }),
    })
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-6 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="h-32 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 space-y-6">
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="space-y-6">
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !inquiry) {
    return (
      <div className="mx-auto max-w-lg py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <User size={28} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          Inquiry Not Found
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The requested application inquiry could not be found or may have been removed.
        </p>
        <Link
          href="/admin/applications"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c41e3a] px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-[#a01830]"
        >
          <ArrowLeft size={16} />
          Back to Applications
        </Link>
      </div>
    )
  }

  const fullName = `${inquiry.givenName} ${inquiry.surname}`
  const initials = `${inquiry.givenName[0] || ''}${inquiry.surname[0] || ''}`.toUpperCase()
  const waNumber = cleanPhoneForWhatsApp(inquiry.whatsapp || inquiry.phone)

  const academicItems = [
    {
      level: 'Secondary (SSC)',
      year: inquiry.sscYear,
      result: inquiry.sscResult,
      key: 'ssc',
    },
    {
      level: 'Higher Secondary (HSC)',
      year: inquiry.hscYear,
      result: inquiry.hscResult,
      key: 'hsc',
    },
    {
      level: "Bachelor's Degree",
      year: inquiry.bachelorsYear,
      result: inquiry.bachelorsResult,
      key: 'bachelors',
    },
    {
      level: "Master's Degree",
      year: inquiry.mastersYear,
      result: inquiry.mastersResult,
      key: 'masters',
    },
  ]

  const hasAnyAcademicData = academicItems.some((i) => i.year || i.result)

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12 pt-2">
      {/* Top Navigation & Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.04]"
          >
            <ArrowLeft size={14} />
            Applications
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-xs font-medium text-gray-400">Apply Now Inquiries</span>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="truncate text-xs font-semibold text-gray-900 dark:text-white">
            {fullName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.04]"
          >
            <Printer size={13} />
            Print
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm transition-colors hover:bg-red-100/70 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </motion.div>

      {/* Hero Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]"
      >
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#c41e3a]/10 to-[#e8a33d]/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            {inquiry.photoUrl ? (
              <img
                src={inquiry.photoUrl}
                alt={fullName}
                className="h-16 w-16 shrink-0 rounded-2xl border border-gray-100 object-cover shadow-md shadow-red-500/10 dark:border-white/[0.08]"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c41e3a] to-[#99142b] text-xl font-bold text-white shadow-md shadow-red-500/10">
                {initials}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  style={{ fontFamily: "'Space Grotesk',sans-serif" }}
                >
                  {fullName}
                </h1>
                {inquiry.applyingTo && (
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/70 dark:text-purple-300">
                    {inquiry.applyingTo}
                  </span>
                )}
                {inquiry.userAccount && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                    <User size={11} />
                    Registered Account
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-gray-400" />
                  {inquiry.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={13} className="text-gray-400" />
                  {inquiry.phone}
                </span>
                {inquiry.country && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-gray-400" />
                    {inquiry.country}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-gray-400" />
                  Submitted{' '}
                  {formatDistanceToNow(new Date(inquiry.submittedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Communication CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <a
              href={`mailto:${inquiry.email}?subject=Regarding your application inquiry with Endow Global`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#c41e3a] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#a3152e]"
            >
              <Mail size={14} />
              Email Student
            </a>

            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            )}

            <a
              href={`tel:${inquiry.phone}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-200 dark:hover:bg-white/[0.06]"
            >
              <Phone size={14} />
              Call
            </a>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5 dark:border-white/[0.06] sm:grid-cols-4">
          <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
            <p className="text-[11px] font-medium text-gray-400">Target Country</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-white">
              {inquiry.targetCountry || '—'}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
            <p className="text-[11px] font-medium text-gray-400">Target University</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-white">
              {inquiry.targetUniversity || 'General / Unspecified'}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
            <p className="text-[11px] font-medium text-gray-400">Applying Level</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-purple-600 dark:text-purple-400">
              {inquiry.applyingTo || '—'}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
            <p className="text-[11px] font-medium text-gray-400">Language Test</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {inquiry.englishTest && inquiry.englishTest !== 'None'
                ? inquiry.englishTest
                : 'None'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Details Sections & Sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: Main Details */}
        <div className="col-span-2 space-y-6">
          {/* Target Preference & Course Selection */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Compass size={16} />
              </div>
              <h2
                className="text-base font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: "'Space Grotesk',sans-serif" }}
              >
                Study Preference & Goal
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">Target Country</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                  <Globe size={15} className="text-[#c41e3a]" />
                  {inquiry.targetCountry || 'Not Specified'}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400">Target University</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                  <Building2 size={15} className="text-blue-500" />
                  {inquiry.targetUniversity || 'Any Suitable University'}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400">Desired Degree Level</p>
                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {inquiry.applyingTo || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Specific Course / Program</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                  <BookOpen size={15} className="text-purple-500" />
                  {inquiry.courseName || 'Open / General Inquiry'}
                </div>
                {inquiry.courseSlug && (
                  <span className="mt-0.5 font-mono text-[11px] text-gray-400">
                    Slug: {inquiry.courseSlug}
                  </span>
                )}
              </div>
            </div>

            {/* Statement / Reason to Choose */}
            <div className="mt-5 border-t border-gray-100 pt-5 dark:border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <Sparkles size={14} className="text-[#e8a33d]" />
                Reason for Choosing Country & University
              </div>
              <div className="mt-2.5 rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-white/[0.04] dark:bg-white/[0.02]">
                {inquiry.reasonToChoose ? (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    &ldquo;{inquiry.reasonToChoose}&rdquo;
                  </p>
                ) : (
                  <p className="text-xs italic text-gray-400">
                    No personal statement or reason provided.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Background */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <GraduationCap size={16} />
              </div>
              <h2
                className="text-base font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: "'Space Grotesk',sans-serif" }}
              >
                Academic Qualifications
              </h2>
            </div>

            {hasAnyAcademicData ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {academicItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all dark:border-white/[0.04] dark:bg-white/[0.02]"
                  >
                    <div>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {item.level}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[11px] text-gray-400">Passing Year</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {item.year || '—'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-gray-400">GPA / Result</p>
                        <p className="font-semibold text-[#c41e3a] dark:text-red-400">
                          {item.result || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-gray-400">No academic history provided.</p>
            )}
          </div>

          {/* Standardized Tests & Language Proficiency */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <Languages size={16} />
              </div>
              <h2
                className="text-base font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: "'Space Grotesk',sans-serif" }}
              >
                Language & Standardized Tests
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
                <p className="text-[11px] text-gray-400">Primary Test</p>
                <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {inquiry.englishTest || 'None'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
                <p className="text-[11px] text-gray-400">IELTS Score</p>
                <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {inquiry.ieltsScore ? `${inquiry.ieltsScore} Band` : '—'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
                <p className="text-[11px] text-gray-400">TOEFL Score</p>
                <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {inquiry.toeflScore || '—'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
                <p className="text-[11px] text-gray-400">TOPIK Level</p>
                <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {inquiry.topikLevel ? `Level ${inquiry.topikLevel}` : '—'}
                </p>
              </div>
            </div>

            {inquiry.satScore && (
              <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
                <p className="text-[11px] text-gray-400">SAT Score</p>
                <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-white">
                  {inquiry.satScore}
                </p>
              </div>
            )}
          </div>

          {/* Personal & Family Background */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Users size={16} />
              </div>
              <h2
                className="text-base font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: "'Space Grotesk',sans-serif" }}
              >
                Personal & Family Details
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">Full Given Name</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  {inquiry.givenName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Surname / Family Name</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  {inquiry.surname}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Date of Birth</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  {inquiry.dob || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Gender</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  {inquiry.gender || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Nationality</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  {inquiry.nationality || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Hometown</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  {inquiry.hometown || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Father&apos;s Name</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  {inquiry.fatherName || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Mother&apos;s Name</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
                  {inquiry.motherName || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contact, Address, Acquisition & Metadata */}
        <div className="space-y-6">
          {/* Contact Details Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h3
              className="text-sm font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Space Grotesk',sans-serif" }}
            >
              Contact Information
            </h3>

            <div className="mt-4 space-y-3.5">
              <div className="flex items-center justify-between rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Mail size={15} className="shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400">Email Address</p>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="truncate text-xs font-semibold text-gray-900 hover:text-[#c41e3a] dark:text-white"
                    >
                      {inquiry.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(inquiry.email, 'email')}
                  className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/[0.08] dark:hover:text-gray-200"
                  title="Copy email"
                >
                  {copiedKey === 'email' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Phone size={15} className="shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400">Phone</p>
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="truncate text-xs font-semibold text-gray-900 hover:text-[#c41e3a] dark:text-white"
                    >
                      {inquiry.phone}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(inquiry.phone, 'phone')}
                  className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/[0.08] dark:hover:text-gray-200"
                  title="Copy phone"
                >
                  {copiedKey === 'phone' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>

              {inquiry.whatsapp && (
                <div className="flex items-center justify-between rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageCircle size={15} className="shrink-0 text-emerald-500" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400">WhatsApp</p>
                      <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        {inquiry.whatsapp}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(inquiry.whatsapp || '', 'wa')}
                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/[0.08] dark:hover:text-gray-200"
                    title="Copy WhatsApp"
                  >
                    {copiedKey === 'wa' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Address & Residence Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h3
              className="text-sm font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Space Grotesk',sans-serif" }}
            >
              Residential Address
            </h3>

            <div className="mt-4 space-y-2.5 text-xs">
              <div>
                <p className="text-[10px] text-gray-400">Country of Residence</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {inquiry.country}
                </p>
              </div>

              {(inquiry.addressLine1 || inquiry.addressLine2) && (
                <div>
                  <p className="text-[10px] text-gray-400">Street Address</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {inquiry.addressLine1}
                    {inquiry.addressLine2 ? `, ${inquiry.addressLine2}` : ''}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-[10px] text-gray-400">City</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {inquiry.city || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">State / Division</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {inquiry.state || '—'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400">Postal / Zip Code</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {inquiry.zipCode || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Acquisition & Source Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
            <h3
              className="text-sm font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Space Grotesk',sans-serif" }}
            >
              Source & Acquisition
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <p className="text-[10px] text-gray-400">How did you hear about us?</p>
                <p className="mt-0.5 font-semibold text-gray-900 dark:text-white">
                  {inquiry.heardFrom || 'Not specified'}
                </p>
              </div>

              {inquiry.referralName && (
                <div>
                  <p className="text-[10px] text-gray-400">Referral Name / Counselor</p>
                  <p className="mt-0.5 font-semibold text-[#c41e3a]">
                    {inquiry.referralName}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 dark:border-white/[0.06]">
                <p className="text-[10px] text-gray-400">Submitted Timestamp</p>
                <p className="mt-0.5 text-gray-700 dark:text-gray-300">
                  {formatDate(inquiry.submittedAt)}
                </p>
              </div>

              {inquiry.ipAddress && (
                <div>
                  <p className="text-[10px] text-gray-400">Submitter IP Address</p>
                  <p className="mt-0.5 font-mono text-[11px] text-gray-500">
                    {inquiry.ipAddress}
                  </p>
                </div>
              )}

              {inquiry.userAccount && (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Linked User Account
                  </p>
                  <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">
                    {inquiry.userAccount.name} ({inquiry.userAccount.email})
                  </p>
                  <Link
                    href={`/admin/students`}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 underline dark:text-emerald-300"
                  >
                    View in Student Management <ExternalLink size={11} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
