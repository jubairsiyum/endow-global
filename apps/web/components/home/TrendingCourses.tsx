import Link from 'next/link'
import { ArrowRight, Clock, TrendingUp } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const courses = [
  { title: 'Computer Science & IT', slug: 'computer-science', degree: 'Bachelors / Masters', duration: '3-4 years', trending: true, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { title: 'Business & Management', slug: 'business-management', degree: 'Bachelors / MBA', duration: '2-4 years', trending: true, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { title: 'Engineering', slug: 'engineering', degree: 'Bachelors / Masters', duration: '3-5 years', trending: false, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { title: 'Healthcare & Medicine', slug: 'healthcare-medicine', degree: 'MD / Nursing', duration: '4-6 years', trending: false, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { title: 'Data Science & AI', slug: 'data-science-ai', degree: 'Masters / PhD', duration: '2-4 years', trending: true, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  { title: 'Arts & Design', slug: 'arts-design', degree: 'BFA / MFA', duration: '3-4 years', trending: false, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
] as const

export default function TrendingCourses() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
                <TrendingUp size={14} />
                Trending Programs
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Popular <span className="text-gradient-brand">courses</span>
              </h2>
            </div>
            <Link href="/courses" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] hover:text-[#A01830]">
              Browse all courses
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
          {courses.map((course) => (
            <FadeUpItem key={course.slug}>
              <Link href={`/courses/${course.slug}`}>
                <article className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1">
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`inline-flex items-center rounded-lg border ${course.bg} ${course.border} px-2 py-1 text-[11px] font-bold ${course.color}`}>
                      {course.degree}
                    </span>
                    {course.trending && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C41E3A]">
                        Trending
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{course.title}</h3>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />{course.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#C41E3A] group-hover:gap-1.5">
                      View<ArrowRight size={13} />
                    </span>
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
