'use client'

import { useParams, notFound } from 'next/navigation'
import { trpc } from '@/lib/trpc-client'
import CountryDetailContent from './CountryDetailContent'

export default function CountryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading } = trpc.university.byCountry.useQuery({ slug })

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Country not found</h1>
        <p className="mt-2 text-gray-500">The country you&apos;re looking for doesn&apos;t exist or isn&apos;t available yet.</p>
        <a href="/universities" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#760B16] via-[#8B0E1A] to-[#A91324] px-6 py-3 text-sm font-bold text-white">Browse All Universities</a>
      </div>
    )
  }

  return (
    <CountryDetailContent
      country={{ name: data.country, code: data.country.slice(0, 2).toUpperCase(), description: `Explore top universities in ${data.country}.`, universities: data.universities.length, avgTuition: 0, visaSuccessRate: 95, costOfLiving: 0, partTimeIncome: 0, topUniversities: data.universities.slice(0, 3).map(u => u.name), flag: '' }}
      universities={(data.universities as any[]).map((u: any) => ({
        ...u,
        logo: u.logo || '/placeholder.png',
        highlights: Array.isArray(u.highlights) ? u.highlights : (typeof u.highlights === 'string' ? JSON.parse(u.highlights || '[]') : []),
        scholarship: 0,
        visaSuccessRate: 95,
        tuition: { min: 0, max: 0, currency: 'USD' },
      })) as any}
      scholarships={[]}
      studentStories={[]}
    />
  )
}
