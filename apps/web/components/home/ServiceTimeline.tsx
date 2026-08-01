import { Compass, FileSearch, Send, Shield, Plane } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const steps = [
  { icon: Compass, number: '01', title: 'Explore', desc: 'Discover universities, courses, and destinations that match your academic profile and career goals.', color: 'text-[#C41E3A]', bg: 'bg-rose-50', hover: 'hover:border-red-200' },
  { icon: FileSearch, number: '02', title: 'Shortlist', desc: 'Compare programs, scholarships, and costs. Build a balanced list of reach, match, and safety schools.', color: 'text-[#C41E3A]', bg: 'bg-rose-50', hover: 'hover:border-red-200' },
  { icon: Send, number: '03', title: 'Apply', desc: 'Submit polished applications with counselor-reviewed documents, SOPs, and recommendation letters.', color: 'text-[#C41E3A]', bg: 'bg-rose-50', hover: 'hover:border-red-200' },
  { icon: Shield, number: '04', title: 'Visa', desc: 'Navigate visa processing with complete support — document prep, mock interviews, and embassy coordination.', color: 'text-[#C41E3A]', bg: 'bg-rose-50', hover: 'hover:border-red-200' },
  { icon: Plane, number: '05', title: 'Departure', desc: 'Pre-departure briefing, accommodation help, and airport pickup. Your new chapter begins.', color: 'text-[#C41E3A]', bg: 'bg-rose-50', hover: 'hover:border-red-200' },
] as const

export default function ServiceTimeline() {
  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
              Application Journey
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              From exploration to <span className="text-gradient-brand">departure</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
              A structured, five-phase process that transforms your study abroad dream into reality.
            </p>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-14 grid gap-6 md:grid-cols-5" amount={0.1}>
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <FadeUpItem key={step.number}>
                <article className={`group relative h-full rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${step.hover}`}>
                  {/* Connector Line */}
                  {i < steps.length - 1 && (
                    <>
                      {/* Desktop horizontal connector */}
                      <div className="absolute left-full top-1/2 hidden h-0.5 w-6 -translate-y-1/2 lg:block">
                        <div className="h-full w-full bg-gradient-to-r from-gray-200 via-rose-200 to-gray-200 opacity-60 transition-opacity group-hover:opacity-100" />
                        <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1 rotate-45 border-r border-t border-gray-300 bg-white opacity-60 group-hover:opacity-100" />
                      </div>
                      {/* Mobile vertical connector */}
                      <div className="absolute bottom-0 left-1/2 h-6 w-0.5 -translate-x-1/2 translate-y-full bg-gradient-to-b from-gray-200 via-rose-200 to-gray-200 opacity-60 md:hidden" />
                    </>
                  )}
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${step.bg} transition-transform group-hover:scale-110`}>
                      <Icon size={20} className={step.color} />
                    </span>
                    <span className="text-[11px] font-bold tracking-widest text-gray-200">{step.number}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-400">{step.desc}</p>
                </article>
              </FadeUpItem>
            )
          })}
        </FadeUpStagger>
      </div>
    </section>
  )
}
