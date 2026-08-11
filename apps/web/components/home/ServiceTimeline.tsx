import { Compass, FileSearch, Send, Shield, Plane, ArrowRight } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const steps = [
  { icon: Compass, num: '01', title: 'Explore', desc: 'Discover universities and programs matching your goals.', color: '#C41E3A', bg: 'from-red-500/5 to-red-500/0' },
  { icon: FileSearch, num: '02', title: 'Shortlist', desc: 'Compare programs, scholarships, and costs.', color: '#7A0713', bg: 'from-red-700/5 to-red-700/0' },
  { icon: Send, num: '03', title: 'Apply', desc: 'Submit polished applications with expert guidance.', color: '#A01830', bg: 'from-red-600/5 to-red-600/0' },
  { icon: Shield, num: '04', title: 'Visa', desc: 'Document prep, mock interviews, embassy support.', color: '#7A0713', bg: 'from-red-700/5 to-red-700/0' },
  { icon: Plane, num: '05', title: 'Departure', desc: 'Pre-departure briefing and arrival support.', color: '#C41E3A', bg: 'from-red-500/5 to-red-500/0' },
]

export default function ServiceTimeline() {
  return (
    <section className="relative bg-white py-20 sm:py-28 overflow-hidden">
      {/* Subtle bg pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{backgroundImage:'radial-gradient(circle, #C41E3A 1px, transparent 1px)',backgroundSize:'40px 40px'}}/>

      <div className="relative z-10 mx-auto max-w-[1180px] px-5 sm:px-8">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="text-[11px] uppercase tracking-[0.1em] mb-3 block font-semibold text-[#C41E3A]" style={{fontFamily:"'IBM Plex Mono',monospace"}}>Application Journey</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{fontFamily:"'Space Grotesk',sans-serif"}}>From exploration to <span className="text-[#C41E3A]">departure</span></h2>
            <p className="mt-3 mx-auto max-w-lg text-sm text-gray-500">A structured five-phase process that transforms your study abroad dream into reality.</p>
          </div>
        </FadeUp>

        {/* Timeline track */}
        <div className="relative">
          {/* Horizontal track line */}
          <div className="absolute top-12 left-0 right-0 hidden lg:block">
            <div className="h-0.5 mx-16 bg-gradient-to-r from-transparent via-gray-200 to-transparent"/>
          </div>

          <FadeUpStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" amount={0.08}>
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <FadeUpItem key={s.num}>
                  <div className="relative group text-center">
                    {/* Step circle */}
                    <div className="relative inline-flex">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white border-2 border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-[#C41E3A]/20 transition-all z-10 relative">
                        <div className={`absolute inset-2 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity`} style={{background:`radial-gradient(circle, ${s.color}10, transparent 70%)`}}/>
                        <Icon size={28} className="text-gray-400 group-hover:text-[#C41E3A] transition-colors relative z-10"/>
                      </div>
                      {/* Number badge */}
                      <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#C41E3A] text-[11px] font-bold text-white shadow-md" style={{fontFamily:"'IBM Plex Mono',monospace"}}>
                        {i+1}
                      </div>
                    </div>

                    {/* Connector arrow between steps */}
                    {i < 4 && (
                      <div className="hidden lg:flex absolute top-12 left-[calc(100%-2rem)] right-0 items-center justify-center z-0">
                        <ArrowRight size={16} className="text-gray-300"/>
                      </div>
                    )}

                    <div className="mt-5 px-2">
                      <h3 className="text-base font-bold text-gray-900" style={{fontFamily:"'Space Grotesk',sans-serif"}}>{s.title}</h3>
                      <p className="mt-1.5 text-[13px] text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </FadeUpItem>
              )
            })}
          </FadeUpStagger>
        </div>
      </div>
    </section>
  )
}
