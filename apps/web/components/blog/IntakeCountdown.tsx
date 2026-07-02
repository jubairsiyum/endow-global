'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, ArrowRight, Clock } from 'lucide-react'
import { ROUTES } from '@/lib/config/routes'
import { staggerContainerSlow, fadeUp } from './animations'
import { intakes } from '@/lib/data/intakes'

/* ── Helpers ──────────────────────────────────────────────────── */

function getTimeRemaining(deadline: string, now: Date) {
  const d = new Date(deadline)
  d.setHours(23, 59, 59, 999)
  const diff = Math.max(0, d.getTime() - now.getTime())
  return {
    days: Math.floor(diff / 864e5),
    hours: Math.floor((diff / 36e5) % 24),
    minutes: Math.floor((diff / 6e4) % 60),
    seconds: Math.floor((diff / 1e3) % 60),
  }
}

type IntakeStatus = 'archived' | 'recently-closed' | 'active'

function getStatus(
  intake: (typeof intakes)[number],
  now: Date,
  closedIntakes: (typeof intakes)[number][],
): IntakeStatus {
  const d = new Date(intake.deadline)
  d.setHours(23, 59, 59, 999)
  if (d.getTime() > now.getTime()) return 'active'
  if (
    closedIntakes.length > 0 &&
    closedIntakes[closedIntakes.length - 1].season === intake.season
  )
    return 'recently-closed'
  return 'archived'
}

/* ── Timeline strip ──────────────────────────────────────────── */

function Timeline({ now, closedIntakes }: { now: Date; closedIntakes: (typeof intakes)[number][] }) {
  return (
    <div className="mb-10 lg:mb-12">
      <div className="hidden items-center justify-between lg:flex">
        {intakes.map((intake, i) => {
          const s = getStatus(intake, now, closedIntakes)
          return (
            <div key={intake.season} className="flex flex-1 items-center">
              {/* node + label */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`relative flex items-center justify-center ${
                    s === 'active'
                      ? 'h-4 w-4'
                      : s === 'recently-closed'
                        ? 'h-3.5 w-3.5'
                        : 'h-2.5 w-2.5'
                  }`}
                >
                  {s === 'active' && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-30" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full ${
                      s === 'active'
                        ? 'h-4 w-4 bg-[#10B981]'
                        : s === 'recently-closed'
                          ? 'h-3.5 w-3.5 bg-[#E7C56D]'
                          : 'h-2.5 w-2.5 bg-[#D1D5DB]'
                    }`}
                  />
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    s === 'active'
                      ? 'text-[#111827]'
                      : s === 'recently-closed'
                        ? 'text-[#92700C]'
                        : 'text-[#9CA3AF]'
                  }`}
                >
                  {intake.season.replace(' Intake', '')}
                </span>
              </div>

              {/* connector */}
              {i < intakes.length - 1 && (
                <div className="mx-3 h-px flex-1 bg-[#E5E7EB]" />
              )}
            </div>
          )
        })}
      </div>

      {/* mobile — compact 4-node row */}
      <div className="flex items-center justify-between lg:hidden">
        {intakes.map((intake, i) => {
          const s = getStatus(intake, now, closedIntakes)
          return (
            <div key={intake.season} className="flex flex-1 items-center">
              <div
                className={`relative flex items-center justify-center ${
                  s === 'active'
                    ? 'h-3 w-3'
                    : s === 'recently-closed'
                      ? 'h-2.5 w-2.5'
                      : 'h-2 w-2'
                }`}
              >
                {s === 'active' && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-30" />
                )}
                <span
                  className={`relative inline-flex rounded-full ${
                    s === 'active'
                      ? 'h-3 w-3 bg-[#10B981]'
                      : s === 'recently-closed'
                        ? 'h-2.5 w-2.5 bg-[#E7C56D]'
                        : 'h-2 w-2 bg-[#D1D5DB]'
                  }`}
                />
              </div>
              {i < intakes.length - 1 && (
                <div className="mx-1.5 h-px flex-1 bg-[#E5E7EB]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Archived Card ───────────────────────────────────────────── */

function ArchivedCard({ intake }: { intake: (typeof intakes)[number] }) {
  const Icon = intake.icon
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-[14px] border border-[#E5E7EB]/60 bg-[#F9FAFB] p-3.5 transition-all duration-300 hover:border-[#D1D5DB] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB]/50 bg-white">
          <Icon className="h-3.5 w-3.5 text-[#9CA3AF]" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[13px] font-bold tracking-tight text-[#6B7280]">
              {intake.season}
            </h3>
            <span className="flex flex-shrink-0 items-center gap-1 rounded-full border border-[#E5E7EB] bg-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Archived
            </span>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#9CA3AF]">
            <Calendar className="h-2.5 w-2.5" aria-hidden="true" />
            {intake.month}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Recently Closed Card (September) ────────────────────────── */

function RecentlyClosedCard({ intake }: { intake: (typeof intakes)[number] }) {
  const Icon = intake.icon
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-[16px] border border-[#E7C56D]/20 bg-[#FFFEFB] p-4 transition-all duration-300 hover:border-[#E7C56D]/35 hover:shadow-[0_6px_20px_rgba(231,197,109,0.06)]"
    >
      {/* subtle gold top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C56D]/40 to-transparent" />

      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#E7C56D]/15 bg-[#E7C56D]/[0.04]">
          <Icon className="h-4 w-4 text-[#B8860B]" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold tracking-tight text-[#374151]">
              {intake.season}
            </h3>
            <span className="flex flex-shrink-0 items-center gap-1 rounded-full border border-[#E7C56D]/25 bg-[#E7C56D]/[0.06] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#92700C]">
              Recently Closed
            </span>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#9CA3AF]">
            <Calendar className="h-2.5 w-2.5" aria-hidden="true" />
            {intake.month}
          </p>
        </div>
      </div>

      {/* bridge text */}
      <div className="mt-3 rounded-lg bg-[#F9FAFB] px-3 py-2">
        <p className="text-[11px] leading-relaxed text-[#6B7280]">
          Applications have closed. The next available intake is{' '}
          <span className="font-semibold text-[#111827]">December 2026</span>.
        </p>
      </div>

      {/* deadline */}
      <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-[#9CA3AF]">
        <Clock className="h-2.5 w-2.5" aria-hidden="true" />
        Deadline: {intake.deadline}
      </div>
    </motion.div>
  )
}

/* ── Active Card (December) ──────────────────────────────────── */

function ActiveCard({
  intake,
  tr,
}: {
  intake: (typeof intakes)[number]
  tr: ReturnType<typeof getTimeRemaining>
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E7C56D]/30 bg-white p-5 sm:p-6"
      style={{
        boxShadow:
          '0 8px 40px rgba(231,197,109,0.08), 0 1px 8px rgba(0,0,0,0.03)',
      }}
    >
      {/* top rule */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#E7C56D] via-[#C41E3A] to-[#E7C56D]" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#E7C56D]/[0.05] blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* badge + live dot */}
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E7C56D]/25 bg-[#E7C56D]/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#B8860B]">
            {intake.status}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </span>
            Open
          </span>
        </div>

        {/* title + month */}
        <h3 className="text-lg font-bold tracking-tight text-[#111827] sm:text-xl">
          {intake.season}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {intake.month}
        </p>

        {/* countdown */}
        <div className="my-6 flex items-center justify-center gap-3 sm:gap-4">
          {(['days', 'hours', 'minutes', 'seconds'] as const).map(
            (unit, i) => (
              <span key={unit} className="flex items-center gap-3 sm:gap-4">
                <span className="flex flex-col items-center">
                  <span className="text-3xl font-bold tabular-nums tracking-tight text-[#C41E3A] sm:text-4xl">
                    {String(tr[unit]).padStart(2, '0')}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
                    {unit === 'days'
                      ? 'Days'
                      : unit === 'hours'
                        ? 'Hrs'
                        : unit === 'minutes'
                          ? 'Min'
                          : 'Sec'}
                  </span>
                </span>
                {i < 3 && (
                  <span className="pb-5 text-xl font-light text-[#D1D5DB]">
                    :
                  </span>
                )}
              </span>
            ),
          )}
        </div>

        {/* footer */}
        <div className="mt-auto">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
          <div className="mt-4 space-y-3">
            <p className="text-xs text-[#9CA3AF]">
              Deadline:{' '}
              <span className="font-medium text-[#374151]">
                {intake.deadline}
              </span>
            </p>
            <Link
              href={ROUTES.register}
              aria-label={`Apply for ${intake.season}`}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C41E3A] to-[#A01830] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(196,30,58,0.22)] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(196,30,58,0.30)]"
            >
              Apply Now
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main Export ─────────────────────────────────────────────── */

export function IntakeCountdown() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const activeIntake = useMemo(
    () =>
      intakes.find((i) => {
        const d = new Date(i.deadline)
        d.setHours(23, 59, 59, 999)
        return d.getTime() > now.getTime()
      }),
    [now],
  )

  const closedIntakes = useMemo(
    () =>
      intakes
        .filter((i) => {
          const d = new Date(i.deadline)
          d.setHours(23, 59, 59, 999)
          return d.getTime() <= now.getTime()
        })
        .sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
        ),
    [now],
  )

  const tr = useMemo(
    () =>
      activeIntake
        ? getTimeRemaining(activeIntake.deadline, now)
        : { days: 0, hours: 0, minutes: 0, seconds: 0 },
    [activeIntake, now],
  )

  return (
    <section className="relative overflow-hidden border-y border-[#E5E7EB] bg-[#FFFDF8] py-16 sm:py-20 lg:py-24">
      {/* dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #111827 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center lg:mb-12"
        >
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C41E3A]">
            Academic Intake Cycle
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl lg:text-[42px]">
            Intake <span className="text-[#C41E3A]">Countdown</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-[#6B7280]">
            Follow the intake timeline. Secure your spot before applications
            close.
          </p>
        </motion.div>

        {/* ── timeline ── */}
        <Timeline now={now} closedIntakes={closedIntakes} />

        {/* ── content grid ── */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1fr_1fr] lg:gap-6"
        >
          {/* LEFT — closed cards (2+1 layout) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 lg:gap-3">
            {closedIntakes.slice(0, -1).map((intake) => (
              <ArchivedCard key={intake.season} intake={intake} />
            ))}
            {closedIntakes.length >= 1 && (
              <div className="sm:col-span-2">
                <RecentlyClosedCard
                  intake={closedIntakes[closedIntakes.length - 1]}
                />
              </div>
            )}
          </div>

          {/* RIGHT — active card */}
          {activeIntake && <ActiveCard intake={activeIntake} tr={tr} />}
        </motion.div>
      </div>
    </section>
  )
}
