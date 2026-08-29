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

  if (!data) {
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

  const countryName = data.country

  // Match scholarships and stories from static data
  const countryScholarships = staticScholarships.filter(
    (s) =>
      data.universities.some((u) => u.name === s.universityName) ||
      data.universities.some((u) => (u as any).slug === s.universityId)
  )

  const countryStories = staticStories.filter(
    (s) => s.country.toLowerCase() === countryName.toLowerCase()
  )

  // Static country info fallback
  const staticCountry = staticCountries.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  )

  return (
    <CountryDetailContent
      country={{
        name: countryName,
        code: metadata?.code || countryName.slice(0, 2).toUpperCase(),
        description:
          metadata?.description ||
          `Explore top universities in ${countryName}. Find the best programs, scholarships, and student life information.`,
        universities: data.universities.length,
        avgTuition: staticCountry?.avgTuition || metadata?.quickStats?.find((s) => s.label === 'Avg Tuition/Year')?.value
          ? parseInt(metadata?.quickStats?.find((s) => s.label === 'Avg Tuition/Year')?.value?.replace(/[^0-9]/g, '') || '0')
          : 0,
        visaSuccessRate: staticCountry?.visaSuccessRate || 90,
        costOfLiving: staticCountry?.costOfLiving || 0,
        partTimeIncome: staticCountry?.partTimeIncome || 0,
        topUniversities: data.universities.slice(0, 3).map((u) => u.name),
        flag: metadata?.flag || '',
      }}
      universities={(data.universities as any[]).map((u: any) => ({
        ...u,
        logo: u.logo || '/placeholder.png',
        highlights: Array.isArray(u.highlights)
          ? u.highlights
          : typeof u.highlights === 'string'
            ? (() => {
                try { return JSON.parse(u.highlights || '[]') } catch { return [] }
              })()
            : [],
        scholarship: 0,
        visaSuccessRate: 95,
        tuition: { min: 0, max: 0, currency: 'USD' },
      }))}
      scholarships={countryScholarships}
      studentStories={countryStories}
      metadata={metadata}
    />
  )
}
