'use client'

import { trpc } from '@/lib/trpc-client'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import Carousel, { CarouselItem } from './Carousel'
import { CloudShader } from './cloud-shader'

const BRAND_RED = '#C41E3A'
const BRAND_NAVY = '#101B3D'
const BRAND_GOLD = '#B8934A'

const fallbackImages: CarouselItem[] = [
  {
    image: '/student-1.jpg',
    alt: 'Seoul National University',
    title: 'Seoul National University',
    description: 'South Korea · Leading National University',
  },
  {
    image: '/student-2.jpg',
    alt: 'KAIST',
    title: 'KAIST',
    description: 'Daejeon · Top Science & Technology',
  },
  {
    image: '/student-3.jpg',
    alt: 'Yonsei University',
    title: 'Yonsei University',
    description: 'Seoul · Prestigious Global Campus',
  },
  {
    image: '/student-4.jpg',
    alt: 'Korea University',
    title: 'Korea University',
    description: 'Seoul · World-Class Education',
  },
  {
    image: '/student-5.jpg',
    alt: 'Sungkyunkwan University',
    title: 'Sungkyunkwan University',
    description: 'Suwon · Historic Excellence',
  },
]

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

/* ==========================================================================
   Main PremiumHero Component
   ========================================================================== */

export default function PremiumHeroCloudAnimation() {
  const prefersReducedMotion = useReducedMotion()
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

  // Carousel items preparation
  const carouselItems: CarouselItem[] = useMemo(() => {
    if (managedHeroImages?.length) {
      return managedHeroImages.map((image, i) => ({
        image: image.imageUrl,
        alt: image.altText || `Campus Story ${i + 1}`,
        title: image.altText || `Partner University ${i + 1}`,
        description: 'South Korea & Global',
      }))
    }
    return fallbackImages
  }, [managedHeroImages])

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
      className="relative overflow-hidden bg-gradient-to-b from-[#255e9c] via-[#4d86c4] to-[#88bbe8] pb-8 pt-6 sm:pb-14 sm:pt-10 lg:pb-16 lg:pt-12"
    >
      {/* Dynamic Atmospheric Cloud Shader Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Render at half-resolution and upscale 2x for smooth 60fps GPU performance */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <div className="absolute h-1/2 w-1/2 origin-top-left" style={{ transform: 'scale(2)' }}>
            <CloudShader
              speed={prefersReducedMotion ? 0 : 0.8}
              count={5}
              cloudColor="#ffffff"
              skyTopColor="#205590"
              skyBottomColor="#8cbfe8"
              className="absolute inset-0"
            />
          </div>
        </motion.div>

        {/* Soft atmospheric top vignette */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0e2a4d]/30 to-transparent" />

        {/* Bottom cloud mist gradient smoothly fading into the Boarding Pass ticket & #F5F6F9 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#F5F6F9] via-[#F5F6F9]/85 to-transparent sm:h-64" />
      </div>

      {/* window-seat wing view with a gentle in-flight bob - anchored to true bottom-left corner */}
      <motion.div
        className="pointer-events-none absolute -bottom-6 left-0 z-10 w-[85%] max-w-[1150px] select-none sm:-bottom-10 sm:w-[75%] md:w-[68%] lg:w-[58%]"
        animate={prefersReducedMotion ? {} : { y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src="/plane-wing.png"
          alt="Airplane wing above the clouds"
          className="h-auto w-full object-cover drop-shadow-[0_30px_60px_rgba(10,25,50,0.55)]"
        />
      </motion.div>

      <div className="relative z-20 mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="relative mb-6 mt-20 grid grid-cols-1 items-center gap-6 sm:mb-8 sm:gap-8 lg:mb-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          {/* Left Hero Content */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] shadow-sm backdrop-blur-md"
              style={{
                fontFamily: "'IBM Plex Mono',monospace",
                color: '#ffffff',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D6D] shadow-[0_2px_2px_#FF4D6D]" />{' '}
              Bangladesh&apos;s Trusted Partner
            </div>
            <h1
              className="mb-3 max-w-[540px] text-4xl font-extrabold leading-[1.1] text-white [text-shadow:0_2px_2px_rgba(10,25,50,0.45)] sm:mb-4 sm:text-[46px]"
              style={{ fontFamily: "'Space Grotesk',sans-serif" }}
            >
              Study abroad with{' '}
              <span className="text-[#ff133e] [text-shadow:0_2px_2px_rgba(0,0,0,0.3)]">Endow</span>{' '}
              guidance.
            </h1>
            <p className="mb-4 max-w-[460px] text-base leading-relaxed text-white/95 [text-shadow:0_1px_6px_rgba(10,25,50,0.3)] sm:mb-5 sm:text-[16px]">
              Personalised counselling for South Korea — from university selection to the day your
              visa clears.
            </p>
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3.5 py-1.5 text-[12px] text-white shadow-sm backdrop-blur-md"
              style={{ fontFamily: "'IBM Plex Mono',monospace" }}
            >
              <span className="text-[13px] tracking-[2px] text-[#FFD700]">★★★★★</span>
              <span className="text-white/95">
                {avgRating
                  ? `${avgRating} rated by ${reviewCount.toLocaleString()} students`
                  : 'Trusted by students across South Korea & Australia'}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/apply-now"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/25 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                style={{ background: BRAND_RED }}
              >
                Apply Now
              </Link>
              <Link
                href="/universities"
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-6 py-3 text-sm font-semibold text-[#101B3D] shadow-md backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white active:scale-[0.98]"
              >
                Explore Universities
              </Link>
            </div>
          </motion.div>

          {/* Right: Cube Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative flex w-full select-none items-center justify-center overflow-hidden"
          >
            {/* Luminous atmospheric aura behind the 3D rotating cube carousel */}
            <div className="pointer-events-none absolute h-[460px] w-[320px] rounded-full bg-white/15 blur-3xl" />
            <div
              style={{ height: '600px', position: 'relative' }}
              className="flex w-full items-center justify-center"
            >
              <Carousel
                items={carouselItems}
                baseWidth={270}
                aspectRatio={0.62}
                effect="tilt"
                indicator="bars"
                frame={false}
                arrows={false}
                loop
                autoplay
                autoplayDelay={5000}
                pauseOnHover
                theme="light"
                peek={0}
                gap={16}
                radius={18}
                draggable
                round={false}
              />
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
    </section>
  )
}
