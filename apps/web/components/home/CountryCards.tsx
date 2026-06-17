import Link from 'next/link'
import { ArrowRight, GraduationCap, BookOpen } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const destinations = [
  {
    country: 'South Korea',
    slug: 'south-korea',
    flag: '🇰🇷',
    tagline: 'Where tradition meets innovation',
    description: 'World-class universities, cutting-edge research facilities, and a vibrant campus life in one of Asia\'s most dynamic countries.',
    unis: '10+',
    programs: 'Engineering, Business, IT, Design',
    color: '#3b82f6',
    bg: 'from-blue-50 to-indigo-50',
  },
  {
    country: 'Australia',
    slug: 'australia',
    flag: '🇦🇺',
    tagline: 'Learn where opportunity grows',
    description: 'Globally ranked institutions, post-study work pathways, and a welcoming multicultural environment across major cities.',
    unis: '8+',
    programs: 'Healthcare, Engineering, IT, Business',
    color: '#f59e0b',
    bg: 'from-amber-50 to-orange-50',
  },
] as const

export default function CountryCards() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Study Destinations
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Choose your <span className="text-[#C41E3A]">destination</span>
              </h2>
            </div>
            <Link href="/universities" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] hover:text-[#A01830]">
              View all universities
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-12 grid gap-6 sm:grid-cols-2" amount={0.08}>
          {destinations.map((dest) => (
            <FadeUpItem key={dest.slug}>
              <Link href={`/universities?country=${dest.slug}`}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  {/* Top color accent */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${dest.bg}`} />

                  <div className="flex h-full min-h-[320px] flex-col p-7 sm:p-8">
                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between">
                      <span className="text-5xl">{dest.flag}</span>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: `${dest.color}10`, color: dest.color }}
                      >
                        <GraduationCap size={13} />
                        {dest.unis} universities
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-2xl font-bold text-gray-900">{dest.country}</h3>
                      <p className="mt-1 text-sm font-medium text-gray-400">{dest.tagline}</p>
                      <p className="mt-3 text-sm leading-relaxed text-gray-500">{dest.description}</p>

                      {/* Programs */}
                      <div className="mt-auto pt-6">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <BookOpen size={13} />
                          <span>{dest.programs}</span>
                        </div>

                        {/* CTA */}
                        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] group-hover:gap-2.5 transition-all">
                          Explore programs
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
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
