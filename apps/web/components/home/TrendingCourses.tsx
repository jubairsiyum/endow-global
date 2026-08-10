'use client'

import Link from 'next/link'
import { ArrowRight, Clock, BookOpen, MapPin, GraduationCap, DollarSign } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const accentColors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4','#84cc16']
const levelLabels: Record<string,string> = { UNDERGRADUATE:'Bachelors', POSTGRADUATE:'Masters', PHD:'PhD', DIPLOMA:'Diploma', CERTIFICATE:'Certificate', FOUNDATION:'Foundation' }

export default function TrendingCourses() {
  const { data: result } = trpc.course.list.useQuery({ perPage: 6 })
  const courses = (result as any)?.hits?.slice(0, 6) || []

  if (!courses.length) return null

  return (
    <section style={{background:'#F8F9FB'}} className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <FadeUp>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
            <div>
              <span className="text-[11px] uppercase tracking-[0.1em] mb-3 block font-semibold text-[#C41E3A]" style={{fontFamily:"'IBM Plex Mono',monospace"}}>Popular Programs</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Featured <span className="text-[#C41E3A]">courses</span> from our partners</h2>
            </div>
            <Link href="/courses" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C41E3A] hover:text-[#A01830] shrink-0">
              View all courses <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5"/>
            </Link>
          </div>
        </FadeUp>

        <FadeUpStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" amount={0.06}>
          {courses.map((course: any, i: number) => {
            const accent = accentColors[i % accentColors.length]
            return (
              <FadeUpItem key={course.slug || i}>
                <Link href={`/institutions/${course.universitySlug || 'unknown'}/${(course.level || 'postgraduate').toLowerCase()}/${course.slug}`}>
                  <article className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1">
                    {/* Accent line */}
                    <div className="h-0.5 w-full opacity-60 group-hover:opacity-100 transition-opacity" style={{background:`linear-gradient(to right, transparent, ${accent}, transparent)`}}/>
                    <div className="p-5 sm:p-6">
                      {/* University */}
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-3">
                        <MapPin size={12} className="text-gray-400 shrink-0"/>
                        <span className="truncate">{course.universityName || 'University'}</span>
                        {course.universityCountry && <span className="text-gray-400">· {course.universityCountry}</span>}
                      </div>
                      {/* Course name */}
                      <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#C41E3A] transition-colors line-clamp-2" style={{fontFamily:"'Space Grotesk',sans-serif"}}>{course.name}</h3>
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-semibold" style={{background:`${accent}10`,color:accent,border:`1px solid ${accent}20`}}>{levelLabels[course.level] || course.level}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400"><Clock size={11}/>{course.duration} {course.durationUnit?.toLowerCase()}</span>
                      </div>
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <span className="text-sm font-bold text-gray-900">{course.currency} {course.tuitionFee?.toLocaleString()}<span className="text-[10px] font-normal text-gray-400 ml-0.5">/yr</span></span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-1.5" style={{color:accent}}>Details <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5"/></span>
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeUpItem>
            )
          })}
        </FadeUpStagger>
      </div>
    </section>
  )
}
