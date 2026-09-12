'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  MapPin,
  Check,
  Plus,
  Star,
  Clock,
  Briefcase,
} from 'lucide-react'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'
import type { University, Scholarship, StudentStory } from '@/lib/universities/data'
import type { CountryMetadata } from '@/lib/universities/country-metadata'

type CountryDetailContentProps = {
  country: {
    name: string
    code: string
    description: string
    universities: number
    avgTuition: number
    visaSuccessRate: number
    costOfLiving: number
    partTimeIncome: number
    topUniversities: string[]
    flag: string
  }
  universities: University[]
  scholarships: Scholarship[]
  studentStories: StudentStory[]
  metadata?: CountryMetadata | null
}

const RED = '#C41E3A'
const RED_LIGHT = '#E05266'

type UniversityWithSlug = University & { slug?: string }

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-px w-8 ${light ? 'bg-[#E05266]' : 'bg-[#C41E3A]'}`} />
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.22em] sm:text-xs ${
          light ? 'text-white/70' : 'text-[#C41E3A]'
        }`}
      >
        {children}
      </span>
    </div>
  )
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="border-b border-black/10"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-6 py-6 text-left"
      >
        <span
          className={`font-display text-lg font-medium leading-snug transition-colors sm:text-[22px] ${
            isOpen ? 'text-[#C41E3A]' : 'text-[#0E1116]'
          }`}
        >
          {question}
        </span>
        <span
          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isOpen ? 'border-[#C41E3A] text-[#C41E3A]' : 'border-black/[0.15] text-black/50'
          }`}
        >
          <Plus size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-base leading-relaxed text-[#4b5563]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function tuitionLabel(uni: University): string | null {
  const t = uni?.tuition
  if (!t || (t.min === 0 && t.max === 0)) return null
  const c = t.currency === 'USD' || !t.currency ? '$' : `${t.currency} `
  return `${c}${t.min.toLocaleString()} – ${c}${t.max.toLocaleString()}`
}

export default function CountryDetailContent({
  country,
  universities,
  studentStories,
  metadata,
}: CountryDetailContentProps) {
  const meta = metadata

  const stats: { label: string; value: string }[] = meta?.quickStats?.length
    ? meta.quickStats
    : [
        { label: 'Universities', value: `${country.universities}+` },
        { label: 'Avg Tuition/Year', value: `$${country.avgTuition.toLocaleString()}` },
        { label: 'Visa Success Rate', value: `${country.visaSuccessRate}%` },
        { label: 'Cost of Living', value: `$${country.costOfLiving.toLocaleString()}/mo` },
      ]

  const [featured, ...restUnis] = universities
  const reasons = meta?.whyStudyHere ?? []
  const highlights = meta?.highlights ?? []
  const stories = studentStories
  const visaInfo = meta?.visaInfo
  const costItems = meta?.costOfLiving ?? []
  const lifePoints = meta?.studentLife ?? []
  const faqs = meta?.faqs ?? []

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative flex min-h-[92vh] flex-col overflow-hidden bg-[#0B0C0F]">
        <div className="absolute inset-0">
          {meta?.heroImage ? (
            <Image
              src={meta.heroImage}
              alt={`Study in ${country.name}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#0B0C0F] via-[#16181d] to-[#0B0C0F]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1200px] flex-1 px-6 sm:px-8 lg:px-10">
          <div className="pt-6">
            <Navbar />
          </div>

          <div className="flex flex-col justify-center pb-10 pt-24 sm:pt-28 lg:pt-36 lg:pb-16">
            <FadeUp>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {meta?.flag && (
                  <img
                    src={meta.flag}
                    alt={`${country.name} flag`}
                    className="h-7 w-11 rounded-[3px] object-cover shadow-md ring-1 ring-white/20"
                  />
                )}
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/70 sm:text-xs">
                  Study destination{meta?.tagline ? ` — ${meta.tagline}` : ''}
                </span>
              </div>

              <h1
                className="mt-8 max-w-[900px] font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.02em] text-white sm:text-[64px] lg:text-[78px]"
              >
                Study in
                <br />
                <span style={{ color: RED_LIGHT }}>{country.name}</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                {meta?.description || country.description}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-[#0B0C0F] transition-all hover:-translate-y-0.5 hover:bg-gray-100"
                >
                  Start Your Application
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/universities"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 text-[15px] font-semibold text-white transition-all hover:bg-white/10"
                >
                  Explore Universities
                </Link>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="mt-16 border-t border-white/[0.15] lg:mt-24">
                <div className="grid grid-cols-2 md:grid-cols-4">
                  {stats.map((stat, i) => (
                    <div
                      key={stat.label}
                      className="relative py-7 pr-4 sm:py-8 sm:pr-6"
                    >
                      {i !== 0 && (
                        <span className="absolute bottom-7 left-0 top-7 hidden w-px bg-white/[0.12] md:block sm:bottom-8 sm:top-8" />
                      )}
                      <div className="font-display text-3xl font-semibold text-white sm:text-4xl">
                        {stat.value}
                      </div>
                      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/[0.55] sm:text-[11px]">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <main className="flex-grow">
        {/* ───────────────────── WHY STUDY HERE ───────────────────── */}
        {reasons.length > 0 && (
          <section className="bg-white py-20 lg:py-28">
            <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
                <div className="lg:col-span-5">
                  <FadeUp>
                    <Eyebrow>Why study here</Eyebrow>
                    <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl">
                      Why study in <span style={{ color: RED }}>{country.name}</span>?
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-[#4b5563]">
                      A world-class education, a safe and modern society, and a cost of study that
                      stays within reach — here is what makes {country.name} a serious, exciting
                      opportunity for international students.
                    </p>
                  </FadeUp>
                </div>

                <div className="lg:col-span-7">
                  <FadeUpStagger className="border-t border-black/10">
                    {reasons.map((reason, i) => (
                      <FadeUpItem key={i}>
                        <div className="grid grid-cols-[56px_1fr] gap-6 border-b border-black/10 py-6 sm:grid-cols-[72px_1fr] sm:py-7">
                          <span className="font-mono text-xl font-medium leading-none pt-0.5 sm:text-2xl" style={{ color: RED }}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="text-base leading-relaxed text-[#3f4752] sm:text-[17px]">{reason}</p>
                        </div>
                      </FadeUpItem>
                    ))}
                  </FadeUpStagger>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─────────────── WHAT MAKES IT SPECIAL ─────────────── */}
        {highlights.length > 0 && (
          <section className="bg-[#F7F5F1] py-20 lg:py-28">
            <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                  <FadeUp>
                    <Eyebrow>Why it stands out</Eyebrow>
                    <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl">
                      What makes <span style={{ color: RED }}>{country.name}</span> special
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-[#4b5563]">
                      From its top-ranked universities to its unmistakable culture, here is what
                      sets {country.name} apart as a study destination.
                    </p>
                    <div className="relative mt-10">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                          src="/student-3.jpg"
                          alt={`Student life in ${country.name}`}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 40vw, 100vw"
                        />
                      </div>
                      {meta?.tagline && (
                        <div className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/90">
                          {meta.tagline}
                        </div>
                      )}
                    </div>
                  </FadeUp>
                </div>

                <div className="lg:col-span-7">
                  <FadeUpStagger className="grid h-full content-center gap-x-10 gap-y-9 sm:grid-cols-2">
                    {highlights.map((highlight, i) => (
                      <FadeUpItem key={highlight}>
                        <div className="border-t border-black/10 pt-5">
                          <span className="font-mono text-sm" style={{ color: RED }}>
                            /{String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="mt-3 text-lg font-medium leading-snug text-[#0E1116]">
                            {highlight}
                          </p>
                        </div>
                      </FadeUpItem>
                    ))}
                  </FadeUpStagger>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ────────────────────── UNIVERSITIES ────────────────────── */}
        {universities.length > 0 && (
          <section className="bg-white py-20 lg:py-28">
            <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
              <FadeUp>
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
                  <div>
                    <Eyebrow>Partner universities</Eyebrow>
                    <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl">
                      Top universities in <span style={{ color: RED }}>{country.name}</span>
                    </h2>
                    <p className="mt-5 max-w-lg text-base leading-relaxed text-[#4b5563]">
                      Explore universities that match your academic goals and budget.
                    </p>
                  </div>
                  <Link
                    href="/universities"
                    className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#0E1116] transition-colors hover:text-[#C41E3A]"
                  >
                    View all universities
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </FadeUp>

              {/* Featured university */}
              {featured && (
                <FadeUp className="mt-12">
                  <article className="relative overflow-hidden rounded-2xl bg-[#0C1220] text-white">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C41E3A]/20 blur-[100px]" />
                    <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-12">
                      <div>
                        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#E05266]">
                          Featured university
                        </span>
                        <div className="mt-5 flex items-center gap-5">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                            {featured.logo ? (
                              <img
                                src={featured.logo}
                                alt={featured.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <span className="font-display text-2xl font-semibold text-white/50">
                                {featured.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
                              {featured.name}
                            </h3>
                            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/60">
                              <MapPin size={14} />
                              {featured.city}, {country.name}
                            </p>
                          </div>
                        </div>
                        <p className="mt-6 max-w-lg leading-relaxed text-white/70">{featured.description}</p>
                        <div className="mt-7 flex flex-wrap items-center gap-4">
                          {(featured as UniversityWithSlug).slug ? (
                            <Link
                              href={`/universities/${country.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${(featured as UniversityWithSlug).slug}`}
                              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0C1220] transition-all hover:-translate-y-0.5 hover:bg-gray-100"
                            >
                              View University
                              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0C1220]">
                              View University
                              <ArrowRight size={15} />
                            </span>
                          )}
                          {tuitionLabel(featured) && (
                            <span className="text-sm text-white/60">
                              From <span className="font-semibold text-white">{tuitionLabel(featured)}</span> / year
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-white/10">
                        {[
                          { label: 'Scholarship', value: featured.scholarship > 0 ? `Up to ${featured.scholarship}%` : 'Merit-based' },
                          { label: 'Ranking', value: `#${featured.ranking}` },
                          { label: 'Visa success', value: `${featured.visaSuccessRate}%` },
                        ].map((fact, i) => (
                          <div key={fact.label} className={`px-6 py-5 ${i !== 0 ? 'border-t border-white/10' : ''}`}>
                            <div className="font-display text-xl font-semibold text-white">{fact.value}</div>
                            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/[0.45]">
                              {fact.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </FadeUp>
              )}

              {/* Remaining universities */}
              {restUnis.length > 0 && (
                <FadeUpStagger className="mt-6 grid gap-6 lg:grid-cols-2" amount={0.06}>
                  {restUnis.map((uni) => (
                    <FadeUpItem key={uni.id} className="h-full">
                      <article className="group flex h-full flex-col rounded-xl border border-black/[0.08] bg-white p-7 transition-all duration-300 hover:border-black/[0.16] hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,0.18)] sm:p-8">
                        <div className="flex items-start justify-between">
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-black/[0.06] bg-[#FAFAFA] p-2.5">
                            {uni.logo ? (
                              <img src={uni.logo} alt={uni.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                              <span className="font-display text-xl font-semibold text-black/40">
                                {uni.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-[#9aa0a8]">#{uni.ranking}</span>
                        </div>

                        <h3 className="mt-5 font-display text-xl font-semibold text-[#0E1116] transition-colors group-hover:text-[#C41E3A]">
                          {uni.name}
                        </h3>
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#6b7280]">
                          <MapPin size={13} />
                          {uni.city}, {country.name}
                        </p>
                        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[#4b5563]">
                          {uni.description}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-black/[0.08] pt-5">
                          <span className="text-sm text-[#6b7280]">
                            Scholarship{' '}
                            <span className="font-semibold text-[#0E1116]">
                              {uni.scholarship > 0 ? `${uni.scholarship}%` : '—'}
                            </span>
                          </span>
                          <span className="text-sm text-[#6b7280]">
                            Visa <span className="font-semibold text-[#0E1116]">{uni.visaSuccessRate}%</span>
                          </span>
                        </div>

                        <div className="mt-auto flex items-end justify-between pt-5">
                          {tuitionLabel(uni) ? (
                            <div>
                              <span className="font-display text-lg font-semibold text-[#0E1116]">
                                {tuitionLabel(uni)}
                              </span>
                              <span className="text-sm text-[#9aa0a8]"> / year</span>
                            </div>
                          ) : (
                            <span className="text-sm text-[#9aa0a8]">Fees on request</span>
                          )}
                          {(uni as UniversityWithSlug).slug ? (
                            <Link
                              href={`/universities/${country.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${(uni as UniversityWithSlug).slug}`}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] transition-all group-hover:gap-2.5"
                            >
                              View University
                              <ArrowRight size={14} />
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A]">
                              View University
                              <ArrowRight size={14} />
                            </span>
                          )}
                        </div>
                      </article>
                    </FadeUpItem>
                  ))}
                </FadeUpStagger>
              )}
            </div>
          </section>
        )}

        {/* ────────────────────── VISA INFO ────────────────────── */}
        {visaInfo && (
          <section className="relative overflow-hidden bg-[#0C1220] py-20 text-white lg:py-28">
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
            <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                <div>
                  <FadeUp>
                    <Eyebrow light>Visa information</Eyebrow>
                    <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                      {visaInfo.title}
                    </h2>
                    <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70">
                      {visaInfo.description}
                    </p>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                      <div className="border-l-2 pl-5" style={{ borderColor: RED_LIGHT }}>
                        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/[0.45]">
                          <Clock size={13} /> Processing time
                        </div>
                        <div className="mt-2 font-display text-2xl font-semibold text-white">
                          {visaInfo.processingTime}
                        </div>
                      </div>
                      <div className="border-l-2 pl-5" style={{ borderColor: RED_LIGHT }}>
                        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/[0.45]">
                          <Briefcase size={13} /> Work rights
                        </div>
                        <div className="mt-2 text-[15px] font-medium leading-snug text-white">
                          {visaInfo.workRights}
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/register"
                      className="group mt-10 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: RED }}
                    >
                      Get Visa Guidance
                      <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </FadeUp>
                </div>

                <div>
                  <FadeUp>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10">
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/50">
                        Requirements
                      </h3>
                      <ul className="mt-6 space-y-4">
                        {visaInfo.requirements.map((req) => (
                          <li key={req} className="flex items-start gap-3.5">
                            <span
                              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                              style={{ background: 'rgba(224,82,102,0.18)' }}
                            >
                              <Check size={12} style={{ color: RED_LIGHT }} />
                            </span>
                            <span className="text-[15px] leading-relaxed text-white/80">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeUp>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────── COST OF LIVING ─────────────────── */}
        {costItems.length > 0 && (
          <section className="bg-white py-20 lg:py-28">
            <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
                <div className="lg:col-span-5">
                  <FadeUp>
                    <Eyebrow>Cost of living</Eyebrow>
                    <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl">
                      Living costs in <span style={{ color: RED }}>{country.name}</span>
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-[#4b5563]">
                      Affordable living with excellent quality of life.
                    </p>
                    {country.costOfLiving > 0 && (
                      <div className="mt-10 border-l-2 pl-5" style={{ borderColor: RED }}>
                        <div className="font-display text-5xl font-semibold tracking-tight text-[#0E1116]">
                          ${country.costOfLiving.toLocaleString()}
                        </div>
                        <div className="mt-2 text-sm text-[#6b7280]">average monthly living cost</div>
                      </div>
                    )}
                  </FadeUp>
                </div>

                <div className="lg:col-span-7">
                  <FadeUp>
                    <div className="border-y border-black/10">
                      {costItems.map((item) => (
                        <div
                          key={item.category}
                          className="flex items-baseline justify-between gap-6 border-b border-black/[0.07] py-5 last:border-b-0"
                        >
                          <div>
                            <div className="font-semibold text-[#0E1116]">{item.category}</div>
                            <div className="mt-1 text-sm text-[#6b7280]">{item.details}</div>
                          </div>
                          <div className="whitespace-nowrap font-mono text-sm text-[#0E1116] sm:text-[15px]">
                            {item.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </FadeUp>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────── STUDENT LIFE ─────────────────── */}
        {lifePoints.length > 0 && (
          <section className="bg-[#F7F5F1] py-20 lg:py-28">
            <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
              <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
                <div className="lg:col-span-7">
                  <FadeUp>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image
                        src="/hero-1.jpg"
                        alt={`Life as a student in ${country.name}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 58vw, 100vw"
                      />
                    </div>
                  </FadeUp>
                </div>

                <div className="lg:col-span-5">
                  <FadeUp>
                    <Eyebrow>Student life</Eyebrow>
                    <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl">
                      Life as a student in <span style={{ color: RED }}>{country.name}</span>
                    </h2>
                  </FadeUp>
                  <FadeUpStagger className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {lifePoints.map((point) => (
                      <FadeUpItem key={point}>
                        <div className="flex items-start gap-3">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: RED }} />
                          <span className="text-[15px] leading-relaxed text-[#3f4752]">{point}</span>
                        </div>
                      </FadeUpItem>
                    ))}
                  </FadeUpStagger>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────── STUDENT STORIES ─────────────────── */}
        {stories.length > 0 && (
          <section className="bg-white py-20 lg:py-28">
            <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
              <FadeUp>
                <div className="max-w-2xl">
                  <Eyebrow>Student stories</Eyebrow>
                  <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl">
                    Hear from our students
                  </h2>
                </div>
              </FadeUp>

              <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
                {/* Featured story */}
                {stories[0] && (
                  <FadeUp>
                    <figure className="flex h-full flex-col justify-center">
                      <span className="font-display text-7xl leading-[0.6]" style={{ color: RED }}>
                        &ldquo;
                      </span>
                      <blockquote className="mt-6 font-display text-2xl font-medium leading-snug text-[#0E1116] sm:text-[28px]">
                        {stories[0].review}
                      </blockquote>
                      <figcaption className="mt-8 flex items-center gap-4">
                        <img
                          src={stories[0].image}
                          alt={stories[0].name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-[#0E1116]">{stories[0].name}</div>
                          <div className="text-sm text-[#6b7280]">
                            {stories[0].university}
                            {stories[0].scholarship > 0 ? ` · ${stories[0].scholarship}% scholarship` : ''}
                          </div>
                        </div>
                      </figcaption>
                    </figure>
                  </FadeUp>
                )}

                {/* Smaller stories */}
                <div className="flex flex-col gap-8 lg:gap-10">
                  <FadeUpStagger className="flex flex-col gap-8 lg:gap-10">
                    {stories.slice(1, 4).map((story) => (
                      <FadeUpItem key={story.id}>
                        <figure className="border-t border-black/10 pt-6">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: story.rating }).map((_, i) => (
                              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <blockquote className="mt-4 text-base leading-relaxed text-[#3f4752]">
                            &ldquo;{story.review}&rdquo;
                          </blockquote>
                          <figcaption className="mt-5 flex items-center gap-3">
                            <img
                              src={story.image}
                              alt={story.name}
                              className="h-11 w-11 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-sm font-semibold text-[#0E1116]">{story.name}</div>
                              <div className="text-sm text-[#6b7280]">{story.university}</div>
                            </div>
                          </figcaption>
                        </figure>
                      </FadeUpItem>
                    ))}
                  </FadeUpStagger>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────── FAQ ─────────────────────── */}
        {faqs.length > 0 && (
          <section className="bg-[#F7F5F1] py-20 lg:py-28">
            <div className="mx-auto max-w-[900px] px-6 sm:px-8 lg:px-10">
              <FadeUp>
                <Eyebrow>FAQ</Eyebrow>
                <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl">
                  Frequently asked questions
                </h2>
              </FadeUp>
              <div className="mt-10 border-t border-black/10">
                {faqs.map((faq, i) => (
                  <FaqItem key={faq.question} question={faq.question} answer={faq.answer} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────── CTA ─────────────────────── */}
        <section className="relative overflow-hidden bg-[#08090C] py-24 text-center text-white lg:py-36">
          <div className="absolute inset-0">
            {meta?.heroImage && (
              <Image
                src={meta.heroImage}
                alt=""
                fill
                className="object-cover opacity-20"
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#08090C]/80 via-[#08090C]/60 to-[#08090C]" />
          </div>

          <div className="relative mx-auto max-w-[900px] px-6 sm:px-8">
            <FadeUp>
              <div className="flex justify-center">
                <Eyebrow light>Start your journey</Eyebrow>
              </div>
              <h2 className="mt-8 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Ready to start your journey
                <br />
                in <span style={{ color: RED_LIGHT }}>{country.name}</span>?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
                Get personalized guidance from our expert counselors. From university selection to
                visa approval, we&apos;re with you every step of the way.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-[#08090C] transition-all hover:-translate-y-0.5 hover:bg-gray-100 sm:w-auto"
                >
                  Start Your Application
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-[15px] font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
                >
                  Talk to an Advisor
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
