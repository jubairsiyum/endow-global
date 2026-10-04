'use client'

import { trpc } from '@/lib/trpc-client'

import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type CategoryKey = 'bachelors' | 'language' | 'eap'

type StaticUniversityCard = {
  id: string
  name: string
  slug: string
  logo: string
  website: string
  isStatic: true
}

type DbUniversityCard = {
  id: string
  name: string
  slug: string
  logo: string
  isStatic: false
}

type UniversityCardItem = StaticUniversityCard | DbUniversityCard

// Static categories data matching your public/universities folder exactly
const staticUniversitiesData: Record<CategoryKey, StaticUniversityCard[]> = {
  bachelors: [
    {
      id: '1',
      name: 'Kyung Hee University',
      slug: 'kyung-hee-university',
      logo: '/universities/Kyung Hee University.png',
      website: 'https://www.khu.ac.kr',
      isStatic: true,
    },
    {
      id: '2',
      name: 'Sejong University',
      slug: 'sejong-university',
      logo: '/universities/Sejong University.png',
      website: 'https://en.sejong.ac.kr',
      isStatic: true,
    },
    {
      id: '3',
      name: 'Busan University',
      slug: 'busan-university',
      logo: '/universities/Busan University.png',
      website: 'https://www.pusan.ac.kr',
      isStatic: true,
    },
    {
      id: '4',
      name: 'BUFS',
      slug: 'bufs',
      logo: '/universities/BUFS_logo.jpg',
      website: 'https://www.bufs.ac.kr',
      isStatic: true,
    },
    {
      id: '5',
      name: 'Chungwoon University',
      slug: 'chungwoon-university',
      logo: '/universities/Chungwoon University.png',
      website: 'https://www.chungwoon.ac.kr',
      isStatic: true,
    },
    {
      id: '6',
      name: 'Daejin University',
      slug: 'daejin-university',
      logo: '/universities/Daejin University.png',
      website: 'https://www.daejin.ac.kr',
      isStatic: true,
    },
    {
      id: '7',
      name: 'Dong-Eui University',
      slug: 'dong-eui-university',
      logo: '/universities/Dong-Eui University.png',
      website: 'https://www.deu.ac.kr',
      isStatic: true,
    },
    {
      id: '8',
      name: 'Hanseo University',
      slug: 'hanseo-university',
      logo: '/universities/Hanseo University.png',
      website: 'https://www.hanseo.ac.kr',
      isStatic: true,
    },
    {
      id: '9',
      name: 'Sahmyook University',
      slug: 'sahmyook-university',
      logo: '/universities/Sahmyook University.png',
      website: 'https://www.syu.ac.kr',
      isStatic: true,
    },
    {
      id: '10',
      name: 'Sun Moon University',
      slug: 'sun-moon-university',
      logo: '/universities/Sun Moon University.png',
      website: 'https://eng.sunmoon.ac.kr',
      isStatic: true,
    },
    {
      id: '11',
      name: 'Yeungjin University',
      slug: 'yeungjin-university',
      logo: '/universities/Yeungjin University.png',
      website: 'https://www.yju.ac.kr',
      isStatic: true,
    },
    {
      id: '12',
      name: 'Aalto University',
      slug: 'aalto-university',
      logo: '/universities/Aalto University.png',
      website: 'https://www.aalto.fi',
      isStatic: true,
    },
  ],
  language: [
    {
      id: 'l1',
      name: 'Busan University (KLP)',
      slug: 'busan-university',
      logo: '/universities/Busan University.png',
      website: 'https://www.pusan.ac.kr',
      isStatic: true,
    },
  ],
  eap: [],
}

export function UniversitiesSection() {
  const [activeTab, setActiveTab] = useState<CategoryKey>('bachelors')

  const { data } = trpc.university.list.useQuery({
    perPage: 30,
  })
  console.log(data)
  const dbUniversities = data?.universities ?? []

  // Check if we have database data, otherwise fallback to static data
  const hasDbData = dbUniversities.length > 0

  const rawList: UniversityCardItem[] = hasDbData
    ? dbUniversities.map((uni) => ({
        id: uni.id,
        name: uni.name,
        slug: uni.slug,
        logo: uni.logo || '/logo/endoedu.svg',
        isStatic: false,
      }))
    : staticUniversitiesData[activeTab] || []

  const currentList = Array.isArray(rawList) ? rawList : []

  const counts = {
    bachelors: staticUniversitiesData.bachelors.length,
    language: staticUniversitiesData.language.length,
    eap: staticUniversitiesData.eap.length,
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block rounded-full bg-[#C41E3A]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C41E3A]">
              Partner Institutions
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Universities we apply to <span className="text-[#C41E3A]">South Korea</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-gray-600">
            We have direct partnerships with leading universities across all program levels.
          </p>
        </div>

        {/* Program Category Tabs with Counts */}
        <div className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200/60 bg-gray-100/80 p-1.5">
          <button
            onClick={() => setActiveTab('bachelors')}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'bachelors'
                ? 'bg-white text-[#C41E3A] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bachelor&apos;s / Master&apos;s / PhD{' '}
            <span className="ml-1.5 rounded-full bg-gray-200/70 px-2 py-0.5 text-xs text-gray-700">
              {counts.bachelors}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('language')}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'language'
                ? 'bg-white text-[#C41E3A] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Korean Language (KLP){' '}
            <span className="ml-1.5 rounded-full bg-gray-200/70 px-2 py-0.5 text-xs text-gray-700">
              {counts.language}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('eap')}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'eap'
                ? 'bg-white text-[#C41E3A] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            EAP Program{' '}
            <span className="ml-1.5 rounded-full bg-gray-200/70 px-2 py-0.5 text-xs text-gray-700">
              {counts.eap}
            </span>
          </button>
        </div>

        {/* University Grid */}
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {currentList.map((uni) => {
            const cardContent = (
              <div className="group flex h-full flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C41E3A]/40 hover:shadow-[0_12px_30px_rgba(196,30,58,0.1)]">
                <div className="relative flex h-20 w-full items-center justify-center p-2">
                  <Image
                    src={uni.logo}
                    alt={uni.name}
                    width={64}
                    height={64}
                    className="max-h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="mt-4 flex items-center justify-center gap-1 text-sm font-bold text-gray-800 transition-colors group-hover:text-[#C41E3A]">
                  <span className="line-clamp-2">{uni.name}</span>
                  <ExternalLink size={13} className="shrink-0 opacity-60 group-hover:opacity-100" />
                </div>
              </div>
            )

            // Jodi static data hoy tahole external website link, r database data hole details page link
            if (uni.isStatic) {
              return (
                <a
                  key={uni.id}
                  href={uni.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {cardContent}
                </a>
              )
            }

            return (
              <Link key={uni.id} href={`/universities/${uni.slug}`} className="block h-full">
                {cardContent}
              </Link>
            )
          })}

          {/* Profile Match Highlight Card */}
          <Link href="/contact" className="block h-full">
            <div className="group flex h-full flex-col justify-between rounded-2xl border border-dashed border-[#C41E3A]/30 bg-gradient-to-br from-rose-50/60 via-white to-gray-50 p-6 text-left shadow-sm">
              <div>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#C41E3A] text-white shadow-md shadow-[#C41E3A]/20">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-sm font-bold leading-snug text-gray-900">
                  Not sure which university fits your profile?
                </h3>
              </div>
              <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#C41E3A] transition-all group-hover:translate-x-1">
                We&apos;ll match you <ArrowRight size={14} />
              </p>
            </div>
          </Link>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200/80 pt-6 text-sm text-gray-500 sm:flex-row">
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#C41E3A]" />
            Click any university logo to view details or visit official website
          </p>
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C41E3A] px-6 py-3 font-semibold text-white shadow-[0_4px_16px_rgba(196,30,58,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#A01830]"
          >
            Explore All Universities <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
