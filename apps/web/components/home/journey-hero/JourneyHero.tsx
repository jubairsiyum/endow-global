'use client'

import { trpc } from '@/lib/trpc-client'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import { mergeConfig } from './defaults'
import { HeroNoticeBoard } from './HeroNoticeBoard'
import styles from './journey-hero.module.css'
import { JourneyStage } from './JourneyStage'
import type { DeepPartial, JourneyConfig, JourneyController } from './types'

export interface JourneyHeroProps {
  /** Override any part of the default Endow Global (Bangladesh → South Korea) configuration */
  config?: DeepPartial<JourneyConfig>
  /** Imperative controller handle: replay(), seek(), skipIntro(), showCity(id) */
  controllerRef?:
    | React.MutableRefObject<JourneyController | null>
    | ((c: JourneyController | null) => void)
  className?: string
}

const BRAND_RED = '#C41E3A'
const BRAND_NAVY = '#101B3D'
const BRAND_GOLD = '#B8934A'
const ease = [0.22, 1, 0.36, 1] as const

const BUDGET_RANGES: Record<string, { feeMin?: number; feeMax?: number }> = {
  'Any budget': {},
  'Under $5k': { feeMax: 5000 },
  '$5k-$15k': { feeMin: 5000, feeMax: 15000 },
  '$15k+': { feeMin: 15000 },
}

const INTAKE_YEARS: Record<string, string | undefined> = {
  'Any intake': undefined,
  'Spring 2026': '2026',
  'Fall 2026': '2026',
  'Spring 2027': '2027',
}

const LEVEL_VALUES: Record<string, string> = {
  "Bachelor's": 'UNDERGRADUATE',
  "Master's": 'POSTGRADUATE',
  PhD: 'PHD',
  Diploma: 'DIPLOMA',
  Certificate: 'CERTIFICATE',
}

export function JourneyHero({ config, controllerRef, className }: JourneyHeroProps) {
  // Keep the merged config referentially stable
  const key = JSON.stringify(config ?? null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cfg = React.useMemo(() => mergeConfig(config), [key])
  const reduced = useReducedMotion()
  const { theme } = cfg

  const { data: reviews } = trpc.testimonial.published.useQuery(undefined, {
    staleTime: 60_000,
  })
  const publishedReviews = reviews ?? []
  const reviewCount = publishedReviews.length
  const avgRating =
    reviewCount > 0
      ? (publishedReviews.reduce((sum, t) => sum + t.rating, 0) / reviewCount).toFixed(1)
      : null

  const [fCountry, setFCountry] = React.useState('')
  const [fLevel, setFLevel] = React.useState('')
  const [fBudget, setFBudget] = React.useState('Any budget')
  const [fIntake, setFIntake] = React.useState('Any intake')

  const sectionRef = React.useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const ticketY = useTransform(scrollYProgress, [0, 1], [0, -220])
  const ticketScale = useTransform(scrollYProgress, [0, 1], [1, 1.03])

  const { data: stats } = trpc.university.stats.useQuery()
  const uniCount = stats?.universities || 50
  const countryCount = stats?.countries || 2

  function buildSearchUrl() {
    const p = new URLSearchParams()
    if (fCountry) p.set('country', fCountry)
    if (fLevel) p.set('level', LEVEL_VALUES[fLevel] ?? fLevel)
    const budget = BUDGET_RANGES[fBudget]
    if (budget?.feeMin) p.set('feeMin', String(budget.feeMin))
    if (budget?.feeMax) p.set('feeMax', String(budget.feeMax))
    const year = INTAKE_YEARS[fIntake]
    if (year) p.set('year', year)
    return `/courses?${p.toString()}`
  }

  const vars = {
    '--jh-ink': theme.ink,
    '--jh-text': theme.text,
    '--jh-accent': theme.accent,
    '--jh-lime': theme.lime,
    '--jh-surface': theme.surface,
    '--jh-radius': `${theme.radius}px`,
  } as React.CSSProperties

  return (
    <section
      ref={sectionRef}
      className={`${styles.hero} relative overflow-hidden bg-[#F5F6F9] ${className ?? ''}`}
      style={vars}
      aria-labelledby="endow-hero-title"
    >
      {/* Premium Hero Background with atmospheric signin-bg, soft gradient wash & micro dot pattern */}
      <Image
        src="/images/signin-bg.png"
        alt=""
        fill
        priority
        quality={100}
        sizes="100vw"
        className="pointer-events-none object-cover object-center opacity-25"
        aria-hidden="true"
      />
      <div className="via-[#f5f6f9]/88 to-[#f5f6f9]/72 pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fdf8f4]/95" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #101B3D 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className={`${styles.inner} relative z-10`}>
        <motion.div
          className={`${styles.copy} relative z-10`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{
              fontFamily: "'IBM Plex Mono',monospace",
              color: BRAND_RED,
            }}
          >
            {/* <span className="h-1.5 w-1.5 rounded-full" style={{ background: BRAND_RED }} />{' '} */}
            Bangladesh&apos;s Trusted Partner
          </div>
          <h1
            id="endow-hero-title"
            className="mb-3 max-w-[520px] text-4xl font-bold leading-[1.1] sm:mb-4 sm:text-[46px]"
            style={{ fontFamily: "'Space Grotesk',sans-serif", color: BRAND_NAVY }}
          >
            Study abroad with <span style={{ color: BRAND_RED }}>Endow</span> guidance.
          </h1>
          <p
            className="mb-4 max-w-[440px] text-base leading-relaxed sm:mb-5 sm:text-[16px]"
            style={{ color: '#5b6070' }}
          >
            Personalised counselling for South Korea — from university selection to the day your
            visa clears.
          </p>
          <div
            className="mb-4 flex items-center gap-2 text-[12px] sm:mb-5"
            style={{ fontFamily: "'IBM Plex Mono',monospace", color: '#5b6070' }}
          >
            <span className="tracking-[2px]" style={{ color: BRAND_GOLD, fontSize: '14px' }}>
              ★★★★★
            </span>
            <span>
              {avgRating
                ? `${avgRating} rated by ${reviewCount.toLocaleString()} students`
                : 'Trusted by students across South Korea & Australia'}
            </span>
          </div>
          <div className="mb-10 flex flex-wrap gap-3">
            <Link
              href="/apply-now"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: BRAND_RED }}
            >
              Apply Now
            </Link>
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:bg-gray-50"
              style={{ borderColor: 'rgba(16,27,61,0.2)', color: BRAND_NAVY }}
            >
              Explore Universities
            </Link>
          </div>

          {/* Dynamic University Admissions Notice Board */}
          <HeroNoticeBoard />
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease, delay: 0.1 }}
        >
          <JourneyStage config={cfg} controllerRef={controllerRef} />
        </motion.div>

        {/* Boarding pass ticket with Parallax scroll & scale effect */}
        <div className="col-span-1 pt-2 sm:pt-6 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              y: reduced ? 0 : ticketY,
              scale: reduced ? 1 : ticketScale,
              borderColor: 'rgba(16,27,61,0.13)',
            }}
            className="z-20 overflow-hidden rounded-[20px] border bg-white shadow-[0_34px_70px_-30px_rgba(16,27,61,0.28)]"
          >
            <div className="px-6 py-6 sm:px-8 sm:py-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-[14px] font-semibold text-[#101B3D]">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-md text-[13px]"
                    style={{ background: 'rgba(196,30,58,0.1)', color: BRAND_RED }}
                  >
                    <Search size={13} />
                  </div>
                  Find your university
                </div>
                <span
                  className="rounded px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em]"
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    color: BRAND_GOLD,
                    background: 'rgba(184,147,74,0.12)',
                  }}
                >
                  Search Class · All Routes
                </span>
              </div>
              <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
                {[
                  {
                    label: 'Country',
                    val: fCountry,
                    set: setFCountry,
                    opts: ['', 'South Korea', 'Australia', 'UK'],
                    disabled: ['Australia', 'UK'],
                  },
                  {
                    label: 'Degree',
                    val: fLevel,
                    set: setFLevel,
                    opts: ['', "Bachelor's", "Master's", 'PhD', 'Diploma', 'Certificate'],
                    disabled: [],
                  },
                  {
                    label: 'Budget',
                    val: fBudget,
                    set: setFBudget,
                    opts: ['Any budget', 'Under $5k', '$5k-$15k', '$15k+'],
                    disabled: [],
                  },
                  {
                    label: 'Intake',
                    val: fIntake,
                    set: setFIntake,
                    opts: ['Any intake', 'Spring 2026', 'Fall 2026', 'Spring 2027'],
                    disabled: [],
                  },
                ].map((f) => (
                  <div key={f.label} className="w-full">
                    <label
                      className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.07em]"
                      style={{ fontFamily: "'IBM Plex Mono',monospace", color: '#9299a8' }}
                    >
                      {f.label}
                    </label>
                    <select
                      value={f.val || ''}
                      onChange={(e) => f.set(e.target.value)}
                      className="w-full rounded-lg border bg-[#F5F6F9] px-3 py-2.5 text-[13px] outline-none focus:border-[#C41E3A]"
                      style={{
                        fontFamily: "'IBM Plex Sans',sans-serif",
                        borderColor: 'rgba(16,27,61,0.13)',
                        color: BRAND_NAVY,
                      }}
                    >
                      {f.opts.map((o) => {
                        const isDisabled = f.disabled.includes(o)
                        return (
                          <option key={o} value={o} disabled={isDisabled}>
                            {o || 'Any'}
                            {isDisabled ? ' (coming soon)' : ''}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                ))}
                <Link
                  href={buildSearchUrl()}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: BRAND_RED }}
                >
                  <Search size={14} />
                  Search
                </Link>
              </div>
              <div
                className="mt-4 flex flex-wrap items-center gap-2 text-[12px]"
                style={{ color: '#9299a8' }}
              >
                Popular:{' '}
                {['Computer Science', 'MBA', 'Engineering', 'Data Science'].map((t) => (
                  <Link
                    key={t}
                    href={`/courses?subject=${encodeURIComponent(t)}`}
                    className="rounded-full px-2.5 py-1 transition-colors hover:text-[#C41E3A]"
                    style={{ background: '#F5F6F9', color: BRAND_NAVY }}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
            <div
              className="relative mx-8 border-t-2 border-dashed"
              style={{ borderColor: 'rgba(16,27,61,0.13)' }}
            >
              <div className="absolute -left-[45px] -top-[11px] h-[22px] w-[22px] rounded-full bg-[#F5F6F9]" />
              <div className="absolute -right-[45px] -top-[11px] h-[22px] w-[22px] rounded-full bg-[#F5F6F9]" />
            </div>
            <div className="grid grid-cols-2 bg-gradient-to-r from-[#EEF2FF] via-[#F4E8FF] to-[#FFE4F0] sm:grid-cols-4">
              {[
                { num: '2,000+', lbl: 'Students placed' },
                { num: `${uniCount}+`, lbl: 'Partner universities' },
                { num: `${countryCount}`, lbl: 'Countries' },
                { num: '98%', lbl: 'Success rate' },
              ].map((s, i) => (
                <div key={i} className="relative px-4 py-5 text-center">
                  {i < 3 && (
                    <div className="absolute bottom-3 right-0 top-3 border-r-[1.5px] border-dashed border-[#101B3D]/15" />
                  )}
                  <div
                    className="text-2xl font-semibold text-[#101B3D] sm:text-[26px]"
                    style={{ fontFamily: "'IBM Plex Mono',monospace" }}
                  >
                    {s.num}
                  </div>
                  <div
                    className="mt-1.5 text-[9px] uppercase tracking-[0.09em]"
                    style={{ fontFamily: "'IBM Plex Mono',monospace", color: '#5b6070' }}
                  >
                    {s.lbl}
                  </div>
                  <div
                    className="mx-auto mt-3 h-3 w-[70%] opacity-40"
                    style={{
                      background:
                        'repeating-linear-gradient(90deg, rgba(16,27,61,0.5) 0 2px, transparent 2px 4px, rgba(16,27,61,0.5) 4px 5px, transparent 5px 8px)',
                    }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
