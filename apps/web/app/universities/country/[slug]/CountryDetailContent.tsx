'use client'

import Link from 'next/link'
import Image from 'next/image'
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
} from 'lucide-react'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'
import type { University, Country, Scholarship, StudentStory } from '@/lib/universities/data'

type CountryDetailContentProps = {
  country: Country
  universities: University[]
  scholarships: Scholarship[]
  studentStories: StudentStory[]
}

export default function CountryDetailContent({
  country,
  universities,
  scholarships,
  studentStories,
}: CountryDetailContentProps) {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="pt-4 pb-6 lg:pb-8">
            <Navbar />
          </div>

          <div className="py-16 lg:py-24">
            <FadeUp>
              <div className="text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
                  <Globe size={13} />
                  Study Destination
                </span>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
                  Study in <span className="text-[#C41E3A]">{country.name}</span>
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
                  {country.description}
                </p>
              </div>
            </FadeUp>

            {/* Quick Stats */}
            <FadeUp>
              <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { icon: GraduationCap, label: 'Universities', value: `${country.universities}+` },
                  { icon: DollarSign, label: 'Avg Tuition', value: `$${country.avgTuition.toLocaleString()}/yr` },
                  { icon: TrendingUp, label: 'Visa Success', value: `${country.visaSuccessRate}%` },
                  { icon: Users, label: 'Cost of Living', value: `$${country.costOfLiving}/mo` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-gray-100 bg-white px-4 py-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                    <stat.icon size={20} className="mx-auto mb-2 text-[#C41E3A]" />
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <main className="flex-grow bg-gray-50">
        {/* Universities */}
        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <FadeUp>
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
                    <GraduationCap size={13} />
                    Partner Universities
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    Top universities in <span className="text-[#C41E3A]">{country.name}</span>
                  </h2>
                </div>
                <Link href="/universities" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] hover:text-[#A01830]">
                  View all
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </FadeUp>

            <FadeUpStagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
              {universities.map((uni) => (
                <FadeUpItem key={uni.id}>
                  <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    {/* Top accent line */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="flex h-full flex-col p-6">
                      {/* Header */}
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

                      {/* Description */}
                      <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
                        {uni.description}
                      </p>

                      {/* Highlights */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {uni.highlights.slice(0, 3).map((h) => (
                          <span key={h} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            <CheckCircle2 size={10} className="text-green-500" />
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
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

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          <span className="text-base font-bold text-gray-900">
                            ${uni.tuition.min.toLocaleString()} - ${uni.tuition.max.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-400"> / year</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#C41E3A] transition-all group-hover:gap-2">
                          View
                          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </FadeUpItem>
              ))}
            </FadeUpStagger>
          </div>
        </section>

        {/* Scholarships */}
        {scholarships.length > 0 && (
          <section className="bg-white py-12 lg:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <FadeUp>
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
                      <Award size={13} />
                      Financial Aid
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                      Available <span className="text-[#C41E3A]">scholarships</span>
                    </h2>
                  </div>
                </div>
              </FadeUp>

              <FadeUpStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
                {scholarships.map((sch) => (
                  <FadeUpItem key={sch.id}>
                    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-gray-900">{sch.universityName}</h3>
                          <span className="inline-flex items-center rounded-lg bg-[#C41E3A]/10 px-2.5 py-1 text-sm font-bold text-[#C41E3A]">
                            {sch.percentage}% OFF
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{sch.description}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400" />
                            IELTS {sch.ieltsRequirement}+
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {sch.daysToDeadline} days left
                          </span>
                        </div>
                      </div>
                    </div>
                  </FadeUpItem>
                ))}
              </FadeUpStagger>
            </div>
          </section>
        )}

        {/* Student Stories */}
        {studentStories.length > 0 && (
          <section className="py-12 lg:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <FadeUp>
                <div className="text-center">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
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

        {/* CTA */}
        <section className="bg-gray-950 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <FadeUp>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 px-8 py-12 text-center sm:px-16 sm:py-16">
                {/* Glow */}
                <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#C41E3A]/20 blur-[100px]" />
                <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[#C41E3A]/10 blur-[100px]" />

                <div className="relative z-10">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
                    <BookOpen size={13} />
                    Start Your Journey
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Ready to study in <span className="text-[#E05266]">{country.name}</span>?
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-base text-gray-400">
                    Get personalized guidance from our expert counselors. From university selection to visa approval, we&apos;re with you every step of the way.
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
