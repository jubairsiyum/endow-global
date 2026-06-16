import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const destinations = [
  {
    country: 'South Korea',
    slug: 'south-korea',
    tagline: 'Tech-forward education',
    universities: '130+',
    gradient: 'from-blue-500/10 to-rose-500/10',
    flag: '🇰🇷',
    color: 'text-blue-600',
  },
  {
    country: 'United Kingdom',
    slug: 'uk',
    tagline: 'World-class research',
    universities: '160+',
    gradient: 'from-indigo-500/10 to-purple-500/10',
    flag: '🇬🇧',
    color: 'text-indigo-600',
  },
  {
    country: 'Finland',
    slug: 'finland',
    tagline: 'Innovation hub of Europe',
    universities: '40+',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    flag: '🇫🇮',
    color: 'text-cyan-600',
  },
  {
    country: 'Australia',
    slug: 'australia',
    tagline: 'Global research leader',
    universities: '43',
    gradient: 'from-amber-500/10 to-orange-500/10',
    flag: '🇦🇺',
    color: 'text-amber-600',
  },
  {
    country: 'United States',
    slug: 'usa',
    tagline: 'Unlimited possibilities',
    universities: '4000+',
    gradient: 'from-red-500/10 to-blue-500/10',
    flag: '🇺🇸',
    color: 'text-red-600',
  },
  {
    country: 'Canada',
    slug: 'canada',
    tagline: 'Welcoming & affordable',
    universities: '100+',
    gradient: 'from-rose-500/10 to-pink-500/10',
    flag: '🇨🇦',
    color: 'text-rose-600',
  },
] as const

export default function PopularDestinations() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-sm font-semibold text-[#C41E3A] shadow-sm">
                <span className="text-base">🌍</span>
                Top Destinations
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Study in your dream <span className="text-[#C41E3A]">country</span>
              </h2>
            </div>
            <Link
              href="/universities"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] transition-colors hover:text-[#A01830]"
            >
              View all destinations
              <ArrowRight size={16} />
            </Link>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
          {destinations.map((dest) => (
            <FadeUpItem key={dest.slug}>
              <Link href={`/universities?country=${dest.slug}`}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-[#C41E3A]/15 hover:shadow-[0_12px_40px_rgba(196,30,58,0.08)] hover:-translate-y-1">
                  <div className={`absolute inset-0 bg-gradient-to-br ${dest.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-4xl">{dest.flag}</span>
                      <span className={`text-xs font-bold ${dest.color}`}>
                        {dest.universities} universities
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-950">{dest.country}</h3>
                    <p className="mt-1 text-sm text-gray-500">{dest.tagline}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#C41E3A] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Explore
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </article>
              </Link>
            </FadeUpItem>
          ))}
        </FadeUpStagger>
      </div>
    </section>
  )
}
