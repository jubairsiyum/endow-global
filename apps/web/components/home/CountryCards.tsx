import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const destinations = [
  { country: 'South Korea', slug: 'south-korea', flag: '🇰🇷', unis: '130+', courses: 'Computer Science, Engineering, Business', gradient: 'from-blue-600 via-indigo-500 to-violet-500' },
  { country: 'United Kingdom', slug: 'uk', flag: '🇬🇧', unis: '160+', courses: 'Business, Law, Medicine, Arts', gradient: 'from-slate-700 via-slate-600 to-slate-500' },
  { country: 'Finland', slug: 'finland', flag: '🇫🇮', unis: '40+', courses: 'Technology, Design, Education', gradient: 'from-cyan-500 via-blue-500 to-indigo-500' },
  { country: 'Australia', slug: 'australia', flag: '🇦🇺', unis: '43', courses: 'Engineering, Healthcare, IT', gradient: 'from-amber-500 via-orange-500 to-red-500' },
  { country: 'United States', slug: 'usa', flag: '🇺🇸', unis: '4000+', courses: 'CS, MBA, Data Science', gradient: 'from-blue-700 via-indigo-600 to-blue-800' },
  { country: 'Canada', slug: 'canada', flag: '🇨🇦', unis: '100+', courses: 'Business, IT, Healthcare', gradient: 'from-rose-500 via-pink-500 to-fuchsia-500' },
] as const

export default function CountryCards() {
  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
                🌍 Study Destinations
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Choose your <span className="text-gradient-brand">destination</span>
              </h2>
            </div>
            <Link href="/universities" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] hover:text-[#A01830]">
              All destinations
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
          {destinations.map((dest) => (
            <FadeUpItem key={dest.slug}>
              <Link href={`/universities?country=${dest.slug}`}>
                <article className="group relative h-full overflow-hidden rounded-2xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${dest.gradient} transition-transform duration-500 group-hover:scale-105`} />
                  <div className="absolute inset-0 bg-grid opacity-10" />
                  <div className="relative flex h-full min-h-[220px] flex-col justify-between p-6">
                    <div className="flex items-start justify-between">
                      <span className="text-4xl">{dest.flag}</span>
                      <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        {dest.unis} unis
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{dest.country}</h3>
                      <p className="mt-1 text-sm text-white/70">{dest.courses}</p>
                      <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:gap-2">
                        Explore programs
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
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
