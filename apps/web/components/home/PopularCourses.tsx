import Link from 'next/link'
import { ArrowRight, Clock, BookOpen } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const courses = [
  {
    title: 'Computer Science & IT',
    slug: 'computer-science',
    degree: 'Bachelors / Masters',
    duration: '3-4 years',
    demand: 'High demand',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Business & Management',
    slug: 'business-management',
    degree: 'Bachelors / MBA',
    duration: '2-4 years',
    demand: 'Most popular',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Engineering',
    slug: 'engineering',
    degree: 'Bachelors / Masters',
    duration: '3-5 years',
    demand: 'Top rated',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Healthcare & Medicine',
    slug: 'healthcare-medicine',
    degree: 'MD / Nursing',
    duration: '4-6 years',
    demand: 'Growing fast',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    title: 'Arts & Design',
    slug: 'arts-design',
    degree: 'BFA / MFA',
    duration: '3-4 years',
    demand: 'Creative field',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Data Science & AI',
    slug: 'data-science-ai',
    degree: 'Masters / PhD',
    duration: '2-4 years',
    demand: 'Trending now',
    color: 'bg-cyan-50 text-cyan-600',
  },
] as const

export default function PopularCourses() {
  return (
    <section className="bg-[#f7f8fb] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#C41E3A] shadow-sm">
                <BookOpen size={16} />
                Popular Programs
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Trending <span className="text-[#C41E3A]">courses</span>
              </h2>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] transition-colors hover:text-[#A01830]"
            >
              Browse all courses
              <ArrowRight size={16} />
            </Link>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
          {courses.map((course) => (
            <FadeUpItem key={course.slug}>
              <Link href={`/courses/${course.slug}`}>
                <article className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-[#C41E3A]/15 hover:shadow-[0_12px_40px_rgba(196,30,58,0.08)] hover:-translate-y-1">
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${course.color}`}
                    >
                      {course.demand}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />
                      {course.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-950">{course.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{course.degree}</p>
                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#C41E3A] transition-all group-hover:gap-2">
                      View programs
                      <ArrowRight size={14} />
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
