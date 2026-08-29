'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  MapPin,
  DollarSign,
  Clock,
  Award,
  Star,
  Globe,
  TrendingUp,
  Users,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Shield,
  Briefcase,
  Heart,
  Plane,
  Home,
  Utensils,
  Bus,
  Stethoscope,
  ChevronRight,
  Info,
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

const costOfLivingIcons: Record<string, typeof Home> = {
  Accommodation: Home,
  Food: Utensils,
  Transportation: Bus,
  Health: Stethoscope,
  Books: BookOpen,
  Entertainment: Heart,
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-gray-50 px-5 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-gray-500">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function CountryDetailContent({
  country,
  universities,
  scholarships,
  studentStories,
  metadata,
}: CountryDetailContentProps) {
  const meta = metadata

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {meta?.heroImage ? (
            <Image
              src={meta.heroImage}
              alt={`Study in ${country.name}`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/80" />
        </div>

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="pt-4 pb-6 lg:pb-8">
            <Navbar />
          </div>

          <div className="py-16 lg:py-28">
            <FadeUp>
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  {meta?.flag && (
                    <img
                      src={meta.flag}
                      alt={`${country.name} flag`}
                      className="h-8 w-12 rounded-md object-cover shadow-lg"
                    />
                  )}
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                    <Globe size={13} />
                    Study Destination
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Study in{' '}
                  <span className="text-[#E05266]">{country.name}</span>
                </h1>
                <p className="mt-4 max-w-xl text-lg leading-7 text-white/70">
                  {meta?.description || country.description}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/register"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                  >
                    Start Your Application
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/universities"
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                  >
                    Explore Universities
                  </Link>
                </div>
              </div>
            </FadeUp>

            {/* Quick Stats */}
            <FadeUp>
              <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
                {meta?.quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm"
                  >
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="mt-1 text-xs font-medium text-white/60">{stat.label}</div>
                  </div>
                )) || (
                  <>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">{country.universities}+</div>
                      <div className="mt-1 text-xs font-medium text-white/60">Universities</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">${country.avgTuition.toLocaleString()}/yr</div>
                      <div className="mt-1 text-xs font-medium text-white/60">Avg Tuition</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">{country.visaSuccessRate}%</div>
                      <div className="mt-1 text-xs font-medium text-white/60">Visa Success</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">${country.costOfLiving}/mo</div>
                      <div className="mt-1 text-xs font-medium text-white/60">Cost of Living</div>
                    </div>
                  </>
                )}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <main className="flex-grow bg-white">
        {/* Why Study Here */}
        {meta?.whyStudyHere && (
          <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <FadeUp>
                <div className="mx-auto max-w-3xl text-center">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C41E3A]/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
                    <Info size={13} />
                    Why Choose {country.name}
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    Why study in <span className="text-[#C41E3A]">{country.name}</span>?
                  </h2>
                </div>
              </FadeUp>

              <FadeUpStagger className="mx-auto mt-12 grid max-w-4xl gap-4" amount={0.05}>
                {meta.whyStudyHere.map((reason, i) => (
                  <FadeUpItem key={i}>
                    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-5 transition-all duration-300 hover:border-[#C41E3A]/20 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C41E3A]/10 text-[#C41E3A]">
                        <CheckCircle2 size={16} />
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">{reason}</p>
                    </div>
                  </FadeUpItem>
                ))}
              </FadeUpStagger>
            </div>
          </section>
        )}

        {/* Highlights */}
        {meta?.highlights && (
          <section className="border-y border-gray-100 bg-gray-50/50 py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <FadeUp>
                <div className="text-center">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
                    <Star size={13} />
                    Key Highlights
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    What makes <span className="text-[#C41E3A]">{country.name}</span> special
                  </h2>
                </div>
              </FadeUp>

              <FadeUpStagger className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
                {meta.highlights.map((highlight) => (
                  <FadeUpItem key={highlight}>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 size={12} className="text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{highlight}</span>
                    </div>
                  </FadeUpItem>
                ))}
              </FadeUpStagger>
            </div>
          </section>
        )}

        {/* Universities */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <FadeUp>
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C41E3A]/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
                    <GraduationCap size={13} />
                    Partner Universities
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    Top universities in{' '}
                    <span className="text-[#C41E3A]">{country.name}</span>
                  </h2>
                </div>
                <Link
                  href="/universities"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] hover:text-[#A01830]"
                >
                  View all
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </FadeUp>

            <FadeUpStagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
              {universities.map((uni) => (
                <FadeUpItem key={uni.id}>
                  <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="flex h-full flex-col p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {uni.logo && (
                            <img
                              src={uni.logo}
                              alt={uni.name}
                              className="h-12 w-12 rounded-xl object-contain"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#C41E3A] transition-colors">
                              {uni.name}
                            </h3>
                            <p className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin size={12} />
                              {uni.city}, {country.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
                        {uni.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(Array.isArray(uni.highlights) ? uni.highlights.slice(0, 3) : []).map((h) => (
                          <span key={h} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            <CheckCircle2 size={10} className="text-green-500" />
                            {h}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                        <div className="text-center">
                          <div className="text-sm font-bold text-gray-900">{uni.scholarship}%</div>
                          <div className="text-[10px] text-gray-400">Scholarship</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-gray-900">{uni.visaSuccessRate}%</div>
                          <div className="text-[10px] text-gray-400">Visa Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-gray-900">#{uni.ranking}</div>
                          <div className="text-[10px] text-gray-400">Ranking</div>
                        </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          <span className="text-base font-bold text-gray-900">
                            ${uni.tuition.min.toLocaleString()} - ${uni.tuition.max.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-400"> / year</span>
                        </div>
                        {(uni as any).slug ? (
                          <Link
                            href={`/universities/${country.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${(uni as any).slug}`}
                            aria-label={`View ${uni.name}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#C41E3A] transition-all group-hover:gap-2"
                          >
                            View
                            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#C41E3A]">
                            View
                            <ArrowRight size={13} />
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </FadeUpItem>
              ))}
            </FadeUpStagger>
          </div>
        </section>

        {/* Visa Information */}
        {meta?.visaInfo && (
          <section className="border-y border-gray-100 bg-gray-50/50 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <FadeUp>
                <div className="mx-auto max-w-3xl text-center">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C41E3A]/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
                    <Shield size={13} />
                    Visa Information
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    <span className="text-[#C41E3A]">{meta.visaInfo.title}</span>
                  </h2>
                  <p className="mt-4 text-base text-gray-500">{meta.visaInfo.description}</p>
                </div>
              </FadeUp>

              <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
                <FadeUp>
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">Requirements</h3>
                    <ul className="space-y-3">
                      {meta.visaInfo.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />
                          <span className="text-sm text-gray-600">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>

                <FadeUp>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C41E3A]/10">
                          <Clock size={18} className="text-[#C41E3A]" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Processing Time</div>
                          <div className="font-semibold text-gray-900">{meta.visaInfo.processingTime}</div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C41E3A]/10">
                          <Briefcase size={18} className="text-[#C41E3A]" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Work Rights</div>
                          <div className="font-semibold text-gray-900">{meta.visaInfo.workRights}</div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-2 rounded-full bg-[#C41E3A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(196,30,58,0.3)] transition-all hover:bg-[#A01830] hover:-translate-y-0.5"
                    >
                      Get Visa Guidance
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </FadeUp>
              </div>
            </div>
          </section>
        )}

        {/* Cost of Living */}
        {meta?.costOfLiving && (
          <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <FadeUp>
                <div className="mx-auto max-w-3xl text-center">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C41E3A]/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
                    <DollarSign size={13} />
                    Cost of Living
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    Living costs in <span className="text-[#C41E3A]">{country.name}</span>
                  </h2>
                  <p className="mt-4 text-base text-gray-500">
                    Affordable living with excellent quality of life
                  </p>
                </div>
              </FadeUp>

              <FadeUpStagger className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
                {meta.costOfLiving.map((item) => {
                  const IconComponent = Object.entries(costOfLivingIcons).find(([key]) =>
                    item.category.includes(key)
                  )?.[1] || DollarSign
                  return (
                    <FadeUpItem key={item.category}>
                      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#C41E3A]/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C41E3A]/10">
                            <IconComponent size={18} className="text-[#C41E3A]" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-400">{item.category}</div>
                            <div className="font-bold text-gray-900">{item.amount}</div>
                          </div>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-gray-500">{item.details}</p>
                      </div>
                    </FadeUpItem>
                  )
                })}
              </FadeUpStagger>
            </div>
          </section>
        )}

        {/* Student Life */}
        {meta?.studentLife && (
          <section className="border-y border-gray-100 bg-gray-50/50 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <FadeUp>
                <div className="mx-auto max-w-3xl text-center">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C41E3A]/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
                    <Heart size={13} />
                    Student Life
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    Life as a student in <span className="text-[#C41E3A]">{country.name}</span>
                  </h2>
                </div>
              </FadeUp>

              <FadeUpStagger className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2" amount={0.08}>
                {meta.studentLife.map((item) => (
                  <FadeUpItem key={item}>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C41E3A]/10">
                        <Plane size={12} className="text-[#C41E3A]" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  </FadeUpItem>
                ))}
              </FadeUpStagger>
            </div>
          </section>
        )}

        {/* Student Stories */}
        {studentStories.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <FadeUp>
                <div className="text-center">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C41E3A]/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
                    <Users size={13} />
                    Success Stories
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    Hear from our <span className="text-[#C41E3A]">students</span>
                  </h2>
                </div>
              </FadeUp>

              <FadeUpStagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
                {studentStories.map((story) => (
                  <FadeUpItem key={story.id}>
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent opacity-60" />
                      <div className="mt-4 flex items-center gap-3">
                        <img
                          src={story.image}
                          alt={story.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900">{story.name}</h4>
                          <p className="text-sm text-gray-500">{story.university}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-gray-500">
                        &ldquo;{story.review}&rdquo;
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(story.rating)].map((_, i) => (
                            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                          <Award size={10} />
                          {story.scholarship}% Scholarship
                        </span>
                      </div>
                    </div>
                  </FadeUpItem>
                ))}
              </FadeUpStagger>
            </div>
          </section>
        )}

        {/* FAQs */}
        {meta?.faqs && (
          <section className="border-t border-gray-100 bg-gray-50/50 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <FadeUp>
                <div className="mx-auto max-w-3xl text-center">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C41E3A]/[0.06] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
                    <BookOpen size={13} />
                    FAQ
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    Frequently asked questions
                  </h2>
                </div>
              </FadeUp>

              <FadeUpStagger className="mx-auto mt-10 max-w-3xl space-y-3" amount={0.05}>
                {meta.faqs.map((faq) => (
                  <FadeUpItem key={faq.question}>
                    <FaqItem question={faq.question} answer={faq.answer} />
                  </FadeUpItem>
                ))}
              </FadeUpStagger>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gray-950 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <FadeUp>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 px-8 py-12 text-center sm:px-16 sm:py-16">
                <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#C41E3A]/20 blur-[100px]" />
                <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[#C41E3A]/10 blur-[100px]" />
                <div className="relative z-10">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
                    <BookOpen size={13} />
                    Start Your Journey
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Ready to study in{' '}
                    <span className="text-[#E05266]">{country.name}</span>?
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-base text-gray-400">
                    Get personalized guidance from our expert counselors. From university selection
                    to visa approval, we&apos;re with you every step of the way.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href="/register"
                      className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                    >
                      Create Free Account
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/courses"
                      className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                    >
                      Browse Courses
                    </Link>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
