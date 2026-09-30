'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock3, GraduationCap, MapPin } from 'lucide-react'
import { FadeUp, FadeUpItem, FadeUpStagger } from '@/components/home/FadeUp'
import { TiltCard } from '@/components/ui/TiltCard'

const destinations = [
  {
    country: 'South Korea',
    slug: 'south-korea',
    code: 'KR',
    available: true,
    featured: true,
    tagline: 'Where tradition meets innovation',
    description:
      "World-class universities, cutting-edge research, and a vibrant campus life in one of Asia's most dynamic countries.",
    universities: '10+',
    tags: ['Engineering', 'Business', 'IT', 'Design'],
    accent: '#C41E3A',
    accentLight: '#A01830',
    gradient: 'from-[#C41E3A]/12 to-rose-600/5',
  },
  {
    country: 'Australia',
    slug: 'australia',
    code: 'AU',
    available: false,
    featured: false,
    tagline: 'A new route is taking shape',
    description:
      'Globally ranked institutions and post-study work pathways are coming soon for Endow students.',
    universities: 'Coming soon',
    tags: ['Healthcare', 'Engineering', 'IT', 'Business'],
    accent: '#B88952',
    accentLight: '#8B663D',
    gradient: 'from-amber-500/12 to-amber-600/5',
  },
  {
    country: 'United Kingdom',
    slug: 'united-kingdom',
    code: 'GB',
    available: false,
    featured: false,
    tagline: 'A classic path, coming soon',
    description: 'Explore a new study route with Endow Global. UK applications will open soon.',
    universities: 'Coming soon',
    tags: ['Business', 'Engineering', 'Healthcare', 'Arts'],
    accent: '#65748B',
    accentLight: '#526176',
    gradient: 'from-slate-500/12 to-slate-600/5',
  },
] as const

type Destination = (typeof destinations)[number]

export default function CountryCards() {
  return (
    <section
      aria-labelledby="study-destinations-title"
      className="destinations-section relative overflow-hidden py-20 sm:py-28"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C41E3A]/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#A01830] shadow-sm">
              <MapPin size={13} aria-hidden="true" />
              STUDY DESTINATIONS
            </span>
            <h2
              id="study-destinations-title"
              className="mt-5 text-3xl font-bold tracking-tight text-[#101B3D] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Choose your <span className="text-[#C41E3A]">destination</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-600">
              Start with South Korea today. Australia and the UK are coming soon.
            </p>
          </div>
        </FadeUp>

        <FadeUpStagger
          className="mx-auto mt-14 grid max-w-6xl items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
          amount={0.08}
          staggerChildren={0.08}
        >
          {destinations.map((destination) => (
            <FadeUpItem
              key={destination.slug}
              className={`h-full ${
                destination.featured
                  ? 'lg:order-2'
                  : destination.slug === 'australia'
                    ? 'lg:order-1'
                    : 'lg:order-3'
              }`}
            >
              <DestinationCard destination={destination} />
            </FadeUpItem>
          ))}
        </FadeUpStagger>
      </div>
    </section>
  )
}

function DestinationCard({ destination }: { destination: Destination }) {
  const visibleTags = destination.tags.slice(0, 3)
  const overflowCount = destination.tags.length - visibleTags.length

  return (
    <TiltCard tiltDegree={destination.featured ? 3 : 4} className="h-full">
      <article
        className={`group relative flex h-full min-h-[370px] flex-col rounded-[20px] border bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition-all duration-300 sm:p-7 ${
          destination.featured
            ? 'border-[#C41E3A]/30 bg-gradient-to-br from-white via-[#fffafb] to-[#fff4f6] ring-1 ring-[#C41E3A]/[0.08] hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(196,30,58,0.16)] lg:scale-[1.03]'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
          <div
            className="absolute inset-x-0 top-0 h-[3px]"
            style={{ backgroundColor: destination.accent }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${destination.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          />
          {destination.featured && (
            <>
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-[#C41E3A]/10" />
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[#C41E3A]/10" />
            </>
          )}
        </div>

        {destination.featured && (
          <span className="absolute left-6 top-0 z-20 -translate-y-1/2 rounded-full border border-[#C41E3A]/15 bg-[#FFF5F6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A01830] shadow-sm">
            OPEN NOW
          </span>
        )}

        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-4 flex min-h-6 items-start justify-end">
            <span
              aria-label={
                destination.available
                  ? `${destination.universities} universities available`
                  : `${destination.country} coming soon`
              }
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                destination.available
                  ? 'border-[#C41E3A]/20 bg-[#FFF5F6] text-[#A01830]'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              {destination.available ? (
                <GraduationCap size={13} aria-hidden="true" />
              ) : (
                <Clock3 size={13} aria-hidden="true" />
              )}
              {destination.available ? `${destination.universities} universities` : 'Coming soon'}
            </span>
          </div>

          <header className="flex min-w-0 items-start gap-3">
            <CountryFlag code={destination.code} country={destination.country} />
            <div className="min-w-0 pt-0.5">
              <h3
                className="whitespace-nowrap text-[20px] font-bold leading-tight tracking-tight text-[#101B3D]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {destination.country}
              </h3>
              <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-600">
                {destination.tagline}
              </p>
            </div>
          </header>

          <p className="mt-5 text-sm leading-relaxed text-slate-600">{destination.description}</p>

          <div
            className="mt-5 flex flex-nowrap items-center gap-2 overflow-hidden"
            aria-label="Popular programs"
          >
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${
                  destination.featured
                    ? 'border-[#C41E3A]/15 bg-[#FFF5F6] text-[#A01830]'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                {tag}
              </span>
            ))}
            {overflowCount > 0 && (
              <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                +{overflowCount}
              </span>
            )}
          </div>

          <footer data-tilt-ignore className="mt-auto pt-6">
            {destination.available ? (
              <Link
                href={`/universities?country=${destination.slug}`}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#C41E3A] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(196,30,58,0.18)] transition-[background-color,box-shadow] duration-300 ease-out hover:bg-[#A01830] hover:shadow-[0_12px_26px_rgba(196,30,58,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C41E3A] focus-visible:ring-offset-2"
              >
                Explore programs
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-400 opacity-90 transition-[background-color,box-shadow] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
              >
                Notify me
                <Clock3 size={15} aria-hidden="true" />
              </button>
            )}
          </footer>
        </div>
      </article>
    </TiltCard>
  )
}

function CountryFlag({ code, country }: { code: string; country: string }) {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      {code === 'GB' ? (
        <svg
          viewBox="0 0 60 40"
          className="h-full w-full"
          role="img"
          aria-label={`${country} flag`}
        >
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0 60 40M60 0 0 40" stroke="#FFF" strokeWidth="10" />
          <path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" strokeWidth="4" />
          <path d="M30 0v40M0 20h60" stroke="#FFF" strokeWidth="14" />
          <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="8" />
        </svg>
      ) : (
        <Image
          src={`/flags/${code.toLowerCase()}.png`}
          alt={`${country} flag`}
          fill
          sizes="48px"
          className="object-cover"
        />
      )}
    </div>
  )
}
