import Link from 'next/link'
import { ArrowRight, Clock, TrendingUp, BookOpen } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const courses = [
  {
    title: 'Computer Science & IT',
    slug: 'computer-science',
    degree: 'Bachelors / Masters',
    duration: '3-4 years',
    trending: true,
    accent: '#3b82f6',
    description: 'Software engineering, AI, cybersecurity, and cloud computing at top global universities.',
  },
  {
    title: 'Business & Management',
    slug: 'business-management',
    degree: 'Bachelors / MBA',
    duration: '2-4 years',
    trending: true,
    accent: '#f59e0b',
    description: 'Global business strategy, entrepreneurship, finance, and leadership programs.',
  },
  {
    title: 'Engineering',
    slug: 'engineering',
    degree: 'Bachelors / Masters',
    duration: '3-5 years',
    trending: false,
    accent: '#10b981',
    description: 'Mechanical, civil, electrical, and chemical engineering with hands-on research.',
  },
  {
    title: 'Healthcare & Medicine',
    slug: 'healthcare-medicine',
    degree: 'MD / Nursing',
    duration: '4-6 years',
    trending: false,
    accent: '#ef4444',
    description: 'Medical degrees, nursing, public health, and allied health professions.',
  },
  {
    title: 'Data Science & AI',
    slug: 'data-science-ai',
    degree: 'Masters / PhD',
    duration: '2-4 years',
    trending: true,
    accent: '#8b5cf6',
    description: 'Machine learning, big data analytics, NLP, and computational research.',
  },
  {
    title: 'Arts & Design',
    slug: 'arts-design',
    degree: 'BFA / MFA',
    duration: '3-4 years',
    trending: false,
    accent: '#ec4899',
    description: 'Visual arts, graphic design, UX/UI, animation, and creative media.',
  },
] as const

export default function TrendingCourses() {
  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
                <BookOpen size={13} />
                Popular Programs
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Explore <span className="text-[#C41E3A]">trending</span> courses
              </h2>
            </div>
            <Link href="/courses" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] hover:text-[#A01830]">
              Browse all courses
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
          {courses.map((course) => (
            <FadeUpItem key={course.slug}>
              <Link href={`/courses/${course.slug}`}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  {/* Top accent line */}
                  <div
                    className="h-[2px] w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `linear-gradient(to right, transparent, ${course.accent}, transparent)` }}
                  />

                  <div className="flex h-full flex-col p-6">
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <span
                        className="inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-bold"
                        style={{
                          borderColor: `${course.accent}20`,
                          backgroundColor: `${course.accent}08`,
                          color: course.accent,
                        }}
                      >
                        {course.degree}
                      </span>
                      {course.trending && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#C41E3A]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C41E3A]">
                          <TrendingUp size={10} />
                          Trending
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{course.description}</p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock size={12} />
                        {course.duration}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2"
                        style={{ color: course.accent }}
                      >
                        View
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
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
