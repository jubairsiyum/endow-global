'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/lib/trpc-client'
import { getCountryMetadata } from '@/lib/universities/country-metadata'
import {
  countries as staticCountries,
  universities as staticUnis,
  scholarships as staticScholarships,
  studentStories as staticStories,
} from '@/lib/universities/data'
import CountryDetailContent from './CountryDetailContent'

export default function CountryPage() {
  const { slug } = useParams<{ slug: string }>()
  const metadata = getCountryMetadata(slug)

  const { data, isLoading } = trpc.university.byCountry.useQuery({ slug })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-5 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mx-auto h-6 w-32 animate-pulse rounded-full bg-gray-200" />
              <div className="mx-auto mt-4 h-12 w-80 animate-pulse rounded-lg bg-gray-200" />
              <div className="mx-auto mt-4 h-5 w-96 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 text-center">
                  <div className="mx-auto h-8 w-8 rounded-lg bg-gray-200" />
                  <div className="mx-auto mt-2 h-5 w-16 rounded bg-gray-200" />
                  <div className="mx-auto mt-1 h-3 w-12 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const countryName =
    (data as any)?.country ||
    metadata?.name ||
    staticCountries.find(
      (c) => c.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug
    )?.name ||
    ''

  // Prefer live universities from the DB; fall back to the curated static
  // catalogue so destination pages render even if the DB has no rows for the
  // country yet (e.g. staging/empty environments).
  const dbUniversities: any[] = (data as any)?.universities || []
  const universities: any[] = dbUniversities.length
    ? dbUniversities
    : staticUnis.filter((u) => u.country.toLowerCase() === countryName.toLowerCase())

  if (!countryName || universities.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Country not found</h1>
        <p className="mt-2 text-gray-500">
          The country you&apos;re looking for doesn&apos;t exist or isn&apos;t available yet.
        </p>
        <a
          href="/universities"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#760B16] via-[#8B0E1A] to-[#A91324] px-6 py-3 text-sm font-bold text-white"
        >
          Browse All Universities
        </a>
      </div>
    )
  }

  // Match scholarships and stories from static data (against whatever
  // university set we resolved above).
  const countryScholarships = staticScholarships.filter(
    (s) =>
      universities.some((u: any) => u.name === s.universityName) ||
      universities.some((u: any) => u.slug === s.universityId)
  )

  const countryStories = staticStories.filter(
    (s) => s.country.toLowerCase() === countryName.toLowerCase()
  )

  // Static country info fallback
  const staticCountry = staticCountries.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  )

  const normalizeUni = (u: any): any => {
    // Already shape-complete (curated static data).
    if (u && typeof u.tuition === 'object' && u.tuition && 'min' in u.tuition) return u
    // DB row → fill UI defaults.
    let highlights: string[] = []
    if (Array.isArray(u.highlights)) highlights = u.highlights
    else if (typeof u.highlights === 'string') {
      try { highlights = JSON.parse(u.highlights || '[]') } catch { highlights = [] }
    }
    return {
      ...u,
      logo: u.logo || '/placeholder.png',
      highlights,
      scholarship: 0,
      visaSuccessRate: 95,
      tuition: { min: 0, max: 0, currency: 'USD' },
    }
  }

  return (
    <CountryDetailContent
      country={{
        name: countryName,
        code: metadata?.code || countryName.slice(0, 2).toUpperCase(),
        description:
          metadata?.description ||
          `Explore top universities in ${countryName}. Find the best programs, scholarships, and student life information.`,
        universities: universities.length,
        avgTuition: staticCountry?.avgTuition || metadata?.quickStats?.find((s) => s.label === 'Avg Tuition/Year')?.value
          ? parseInt(metadata?.quickStats?.find((s) => s.label === 'Avg Tuition/Year')?.value?.replace(/[^0-9]/g, '') || '0')
          : 0,
        visaSuccessRate: staticCountry?.visaSuccessRate || 90,
        costOfLiving: staticCountry?.costOfLiving || 0,
        partTimeIncome: staticCountry?.partTimeIncome || 0,
        topUniversities: universities.slice(0, 3).map((u) => u.name),
        flag: metadata?.flag || '',
      }}
      universities={universities.map(normalizeUni)}
      scholarships={countryScholarships}
      studentStories={countryStories}
      metadata={metadata}
    />
  )
}
