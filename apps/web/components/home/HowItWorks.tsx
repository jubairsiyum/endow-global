import { Search, FileCheck, Plane } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Discover',
    description:
      'Browse universities and courses in South Korea and Australia. Use our AI-powered matching to find programs that fit your goals, budget, and career plans.',
  },
  {
    icon: FileCheck,
    number: '02',
    title: 'Apply',
    description:
      'Build your application with expert counselor support. We review documents, prep you for interviews, and ensure every submission is deadline-ready.',
  },
  {
    icon: Plane,
    number: '03',
    title: 'Depart',
    description:
      'Accept your offer, process your visa, and get pre-departure support. From accommodation to airport pickup — we handle the logistics.',
  },
] as const

export default function HowItWorks() {
  return (
    <section className="bg-[#f7f8fb] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#C41E3A] shadow-sm">
              Simple Process
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              How it <span className="text-[#C41E3A]">works</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-500">
              Three straightforward steps from exploring your options to boarding your flight.
            </p>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-14 grid gap-6 md:grid-cols-3" amount={0.1}>
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <FadeUpItem key={step.number}>
                <article className="group relative h-full rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-[#C41E3A]/15 hover:shadow-[0_16px_48px_rgba(196,30,58,0.08)]">
                  <div className="mb-5 flex items-center gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-[#C41E3A] transition-colors group-hover:bg-[#C41E3A] group-hover:text-white">
                      <Icon size={22} />
                    </span>
                    <span className="text-xs font-black tracking-widest text-gray-200">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{step.description}</p>
                </article>
              </FadeUpItem>
            )
          })}
        </FadeUpStagger>
      </div>
    </section>
  )
}
