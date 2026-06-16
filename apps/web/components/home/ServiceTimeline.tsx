import { Compass, FileSearch, Send, Shield, Plane } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const steps = [
  { icon: Compass, number: '01', title: 'Explore', desc: 'Discover universities, courses, and destinations that match your academic profile and career goals.', color: 'text-violet-500', bg: 'bg-violet-50', hover: 'hover:border-violet-200' },
  { icon: FileSearch, number: '02', title: 'Shortlist', desc: 'Compare programs, scholarships, and costs. Build a balanced list of reach, match, and safety schools.', color: 'text-blue-500', bg: 'bg-blue-50', hover: 'hover:border-blue-200' },
  { icon: Send, number: '03', title: 'Apply', desc: 'Submit polished applications with counselor-reviewed documents, SOPs, and recommendation letters.', color: 'text-amber-500', bg: 'bg-amber-50', hover: 'hover:border-amber-200' },
  { icon: Shield, number: '04', title: 'Visa', desc: 'Navigate visa processing with complete support — document prep, mock interviews, and embassy coordination.', color: 'text-emerald-500', bg: 'bg-emerald-50', hover: 'hover:border-emerald-200' },
  { icon: Plane, number: '05', title: 'Departure', desc: 'Pre-departure briefing, accommodation help, and airport pickup. Your new chapter begins.', color: 'text-rose-500', bg: 'bg-rose-50', hover: 'hover:border-rose-200' },
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

        <FadeUpStagger className="mt-14 grid gap-4 md:grid-cols-5" amount={0.1}>
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <FadeUpItem key={step.number}>
                <article className={`group relative h-full rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${step.hover}`}>
                  {i < steps.length - 1 && (
                    <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-gray-200 lg:block" />
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
