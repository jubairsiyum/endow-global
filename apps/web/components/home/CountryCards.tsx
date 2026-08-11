'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, GraduationCap, MapPin } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'
import { TiltCard } from '@/components/ui/TiltCard'

const destinations = [
  {
    country: 'South Korea',
    slug: 'south-korea',
    code: 'KR',
    tagline: 'Where tradition meets innovation',
    description: 'World-class universities, cutting-edge research, and a vibrant campus life in one of Asia\'s most dynamic countries.',
    unis: '10+',
    programs: ['Engineering', 'Business', 'IT', 'Design'],
    accent: '#3b82f6',
    accentLight: '#60a5fa',
    gradient: 'from-blue-500/20 to-blue-600/5',
  },
  {
    country: 'Australia',
    slug: 'australia',
    code: 'AU',
    tagline: 'Learn where opportunity grows',
    description: 'Globally ranked institutions, post-study work pathways, and a welcoming multicultural environment.',
    unis: '8+',
    programs: ['Healthcare', 'Engineering', 'IT', 'Business'],
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    gradient: 'from-amber-500/20 to-amber-600/5',
  },
] as const

export default function CountryCards() {
  return (
    <section className="relative overflow-hidden bg-[#F5F6F9] py-20 sm:py-28">
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(196,30,58,0.04),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]" style={{backgroundImage:'radial-gradient(circle, #C41E3A 1px, transparent 1px)',backgroundSize:'32px 32px'}}/>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-600 shadow-sm">
              <MapPin size={13} className="text-[#C41E3A]" />
              Study Destinations
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
              Choose your{' '}
              <span className="text-[#C41E3A]">
                destination
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-gray-500">
              Two countries, endless possibilities. We specialize in helping
              students navigate education in South Korea and Australia.
            </p>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-14 grid gap-6 sm:grid-cols-2" amount={0.08}>
          {destinations.map((dest) => (
            <FadeUpItem key={dest.slug} className="h-full">
              <TiltCard tiltDegree={4} className="h-full">
                <Link href={`/universities?country=${dest.slug}`} className="block h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 sm:p-9">
                    {/* Accent gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${dest.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    />

                    {/* Top accent line */}
                    <div
                      className="absolute left-0 top-0 h-[2px] w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: `linear-gradient(to right, transparent, ${dest.accent}, transparent)` }}
                    />

                    <div className="relative flex h-full flex-col">
                      {/* Header */}
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {/* Country flag */}
                          <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                            <Image
                              src={`/flags/${dest.code.toLowerCase()}.png`}
                              alt={`${dest.country} flag`}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{dest.country}</h3>
                            <p className="mt-0.5 text-sm font-medium text-gray-500">{dest.tagline}</p>
                          </div>
                        </div>
                        <span
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                          style={{
                            borderColor: `${dest.accent}30`,
                            backgroundColor: `${dest.accent}10`,
                            color: dest.accentLight,
                          }}
                        >
                          <GraduationCap size={13} />
                          {dest.unis}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm leading-relaxed text-gray-500">{dest.description}</p>

                      {/* Programs */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {dest.programs.map((p) => (
                          <span
                            key={p}
                            className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="mt-auto pt-6">
                        <div
                          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
                          style={{ color: dest.accentLight }}
                        >
                          Explore programs
                          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </TiltCard>
            </FadeUpItem>
          ))}
        </FadeUpStagger>
      </div>
    </section>
  )
}
