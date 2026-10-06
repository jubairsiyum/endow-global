'use client'

import { trpc } from '@/lib/trpc-client'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

const BRAND_RED = '#C41E3A'
const BRAND_NAVY = '#101B3D'
const BRAND_GOLD = '#B8934A'

const fallbackImages = [
  { src: '/student-1.jpg', alt: 'Student studying abroad' },
  { src: '/student-2.jpg', alt: 'International student' },
  { src: '/student-3.jpg', alt: 'University student' },
  { src: '/student-4.jpg', alt: 'Graduate student' },
  { src: '/student-5.jpg', alt: 'Exchange student' },
]

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

const FALLBACK_IMAGE = '/hero-1.jpg'

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

export default function PremiumHero() {
  const prefersReducedMotion = useReducedMotion()
  const [[page, direction], setPage] = useState<[number, number]>([0, 0])
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const [failedImages, setFailedImages] = useState<string[]>([])
  const [fCountry, setFCountry] = useState('')
  const [fLevel, setFLevel] = useState('')
  const [fBudget, setFBudget] = useState('Any budget')
  const [fIntake, setFIntake] = useState('Any intake')

  // Parallax setup for the boarding pass section
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const ticketY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const ticketScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])

  const { data: stats } = trpc.university.stats.useQuery()
  const { data: managedHeroImages } = trpc.university.heroImages.useQuery(undefined, {
    staleTime: 30_000,
  })
  const uniCount = stats?.universities || 50
  const countryCount = stats?.countries || 2
  const { data: reviews } = trpc.testimonial.published.useQuery()
  const publishedReviews = reviews ?? []
  const reviewCount = publishedReviews.length
  const avgRating =
    reviewCount > 0
      ? (publishedReviews.reduce((sum, t) => sum + t.rating, 0) / reviewCount).toFixed(1)
      : null

  const images = managedHeroImages?.length
    ? managedHeroImages.map((image) => ({ src: image.imageUrl, alt: image.altText }))
    : fallbackImages
  const activePage = mod(page, images.length)

  const paginate = useCallback(
    (dir: number) => {
      setPage(([current]) => [mod(current + dir, images.length), dir])
    },
    [images.length]
  )

  useEffect(() => {
    if (prefersReducedMotion || isCarouselPaused) return

    const interval = window.setInterval(() => paginate(1), 6000)
    return () => window.clearInterval(interval)
  }, [isCarouselPaused, paginate, prefersReducedMotion])

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (Math.abs(info.offset.x) > 60) paginate(info.offset.x < 0 ? 1 : -1)
  }

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.88,
      rotate: d > 0 ? 5 : -5,
    }),
    center: { x: 0, opacity: 1, scale: 1, rotate: 0, zIndex: 1 },
    exit: (d: number) => ({
      x: d > 0 ? -200 : 200,
      opacity: 0,
      scale: 0.88,
      rotate: d > 0 ? -3 : 3,
      zIndex: 0,
    }),
  }

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

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F5F6F9] pb-16 pt-20 sm:pb-24 sm:pt-24"
    >
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
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rose-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-blue-50/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="mb-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
              style={{
                fontFamily: "'IBM Plex Mono',monospace",
                color: BRAND_RED,
                background: 'rgba(196,30,58,0.07)',
                border: `1px solid rgba(196,30,58,0.2)`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: BRAND_RED }} />{' '}
              Bangladesh&apos;s Trusted Partner
            </div>
            <h1
              className="mb-4 max-w-[520px] text-4xl font-bold leading-[1.1] sm:text-[46px]"
              style={{ fontFamily: "'Space Grotesk',sans-serif", color: BRAND_NAVY }}
            >
              Study abroad with <span style={{ color: BRAND_RED }}>Endow</span> guidance.
            </h1>
            <p
              className="mb-5 max-w-[440px] text-base leading-relaxed sm:text-[16px]"
              style={{ color: '#5b6070' }}
            >
              Personalised counselling for South Korea — from university selection to the day your
              visa clears.
            </p>
            <div
              className="mb-5 flex items-center gap-2 text-[12px]"
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
            <div className="flex flex-wrap gap-3">
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
          </motion.div>

          {/* Right: notice-ready animated photo carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              scale: prefersReducedMotion ? 1 : imgScale,
              borderColor: 'rgba(16,27,61,0.13)',
            }}
            className="relative flex h-[390px] select-none items-center justify-center sm:h-[480px] lg:h-[520px]"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured Endow Global stories"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            onFocusCapture={() => setIsCarouselPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsCarouselPaused(false)
              }
            }}
          >
            <div
              className="pointer-events-none absolute h-[82%] w-[76%] rounded-3xl bg-white/70 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute h-[78%] w-[68%] rounded-3xl border border-white/80 bg-white/20"
              aria-hidden="true"
            />

            {/* Stacked background cards */}
            <div
              className="absolute h-[324px] w-[250px] rotate-6 rounded-2xl bg-gray-200 opacity-30 shadow-md sm:h-[403px] sm:w-[310px]"
              aria-hidden="true"
            />
            <div
              className="absolute h-[324px] w-[250px] -rotate-3 rounded-2xl bg-gray-200 opacity-20 shadow-md sm:h-[403px] sm:w-[310px]"
              aria-hidden="true"
            />

            <div className="relative h-[330px] w-[255px] sm:h-[416px] sm:w-[320px] lg:h-[455px] lg:w-[350px]">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={activePage}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag={prefersReducedMotion ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.01 }
                      : { type: 'spring', stiffness: 350, damping: 30 }
                  }
                  className="absolute inset-0 cursor-grab overflow-hidden rounded-2xl border border-white/70 bg-gray-200 shadow-[0_24px_70px_rgba(16,27,61,0.24)] active:cursor-grabbing"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Featured image ${activePage + 1} of ${images.length}`}
                >
                  <Image
                    draggable={false}
                    src={
                      failedImages.includes(images[activePage].src)
                        ? FALLBACK_IMAGE
                        : images[activePage].src
                    }
                    alt={images[activePage].alt}
                    fill
                    priority={activePage === 0}
                    quality={100}
                    sizes="(max-width: 639px) 255px, (max-width: 1023px) 320px, 350px"
                    className="object-cover"
                    onError={() =>
                      setFailedImages((current) =>
                        current.includes(images[activePage].src)
                          ? current
                          : [...current, images[activePage].src]
                      )
                    }
                  />
                  <span className="pointer-events-none absolute bottom-5 right-5 shrink-0 rounded-full border border-white/45 bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white/95 backdrop-blur-sm">
                    {String(activePage + 1).padStart(2, '0')}/
                    {String(images.length).padStart(2, '0')}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Boarding pass ticket with Parallax scroll & scale effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            y: prefersReducedMotion ? 0 : ticketY,
            scale: prefersReducedMotion ? 1 : ticketScale,
            borderColor: 'rgba(16,27,61,0.13)',
          }}
          className="z-999 overflow-hidden rounded-[20px] border bg-white shadow-[0_34px_70px_-30px_rgba(16,27,61,0.28)]"
        >
          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-[14px] font-semibold">
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
            <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
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
    </section>
  )
}
