'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Camera, GraduationCap, MapPin, SlidersHorizontal, User } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

interface Props {
  name: string
  image?: string | null
  email?: string | null
  intakeLabel?: string
  targetCountries?: string[]
  matchCount?: number
  completionPercent?: number
  interestedProgram?: string | null
  budgetMax?: number | null
}

export function OverviewHeader({
  name,
  image,
  email,
  intakeLabel,
  targetCountries = [],
  matchCount = 0,
  completionPercent = 0,
  interestedProgram,
  budgetMax,
}: Props) {
  const firstName = name?.split(' ')[0] || 'there'
  const initials = (name || 'Student')
  .split(' ')
  .map((n) => n[0])
  .slice(0, 2)
  .join('')
  .toUpperCase()

  const countriesList: string[] = Array.isArray(targetCountries)
    ? targetCountries
    : (() => {
        if (typeof targetCountries === 'string') {
          try {
            const p = JSON.parse(targetCountries as unknown as string)
            if (Array.isArray(p)) return p as string[]
            return targetCountries ? [String(targetCountries)] : []
          } catch {
            return targetCountries ? [String(targetCountries)] : []
          }
        }
        return []
      })()

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-[#12141c]"
    >
      {/* Background Ambient Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl dark:bg-rose-500/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 -bottom-20 h-48 w-48 rounded-full bg-amber-400/5 blur-3xl"
      />

      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Avatar & Identity Section */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Profile Avatar Hero */}
            <div className="relative shrink-0">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-2xl border-2 border-white bg-slate-100 shadow-md ring-2 ring-rose-500/20 dark:border-slate-800 dark:bg-slate-800 dark:ring-rose-500/30">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-rose-500 to-rose-700 text-white font-extrabold text-xl sm:text-2xl shadow-inner">
                    {initials}
                  </div>
                )}
              </div>

              {/* Edit Photo Quick Pill / Camera Icon */}
              <Link
                href="/dashboard/settings?tab=personal"
                title="Edit profile photo in settings"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-rose-600 text-white shadow-xs transition-transform hover:scale-110 hover:bg-rose-700 dark:border-slate-900"
              >
                <Camera size={12} />
              </Link>
            </div>

            {/* Greeting & Academic Context */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
                  <GraduationCap size={13} className="text-rose-600 dark:text-rose-400" />
                  <span>Student Portal</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Applicant
                </span>
              </div>

              <h1 className="mt-1.5 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-[26px]">
                Welcome back, {firstName} 👋
              </h1>

              {/* Intake & Destination Capsule */}
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {interestedProgram && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    <GraduationCap size={13} className="text-rose-600 dark:text-rose-400" />
                    Target: {interestedProgram}
                  </span>
                )}

                {budgetMax ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Budget: &le; ${Number(budgetMax).toLocaleString()}
                  </span>
                ) : null}

                {intakeLabel ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    {intakeLabel} Intake
                  </span>
                ) : (
                  <span>· Ready to explore university options</span>
                )}

                {countriesList.length > 0 && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                      <MapPin size={13} className="text-rose-500" />
                      Targeting {countriesList.slice(0, 3).join(', ')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions & Preferences Button Group */}
          <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:gap-3 lg:justify-end">
            <Link
              href={matchCount > 0 ? '/dashboard#matches' : '/dashboard/settings?tab=study'}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-rose-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              <span>{matchCount > 0 ? `See ${matchCount} matches` : 'Set study preferences'}</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-300"
            >
              <SlidersHorizontal size={14} />
              <span>Profile Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
