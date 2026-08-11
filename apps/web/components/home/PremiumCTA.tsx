import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function PremiumCTA() {
  return (
    <section className="relative py-24 sm:py-28 text-center text-white overflow-hidden" style={{background:`radial-gradient(ellipse at 85% 0%, rgba(196,30,58,0.35), transparent 55%), linear-gradient(180deg, #0A0A0A 0%, #161616 100%)`}}>
      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0" style={{backgroundImage:'repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 64px)'}}/>

      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8">
        <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.1em] font-semibold mb-6" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#D5342A',background:'rgba(213,52,42,0.12)',border:'1px solid rgba(213,52,42,0.35)'}}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#D5342A]"/> Start today
        </span>

        <h2 className="text-3xl sm:text-[38px] font-bold leading-[1.15] mb-4" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
          Your future abroad <span style={{color:'#D5342A'}}>starts with one step.</span>
        </h2>

        <p className="max-w-[460px] mx-auto mb-10 text-[15px] leading-relaxed" style={{color:'rgba(255,255,255,0.6)'}}>
          Join thousands of students who found their university match. Free consultation, zero hidden fees.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap mb-11">
          {/* Ticket button */}
          <Link href="/register" className="group inline-flex rounded-full overflow-hidden shadow-[0_20px_44px_-16px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 transition-transform">
            <span className="px-7 py-4 font-semibold text-[15px] bg-white text-[#0A0A0A] group-hover:bg-gray-50 transition-colors">Create free account</span>
            <span className="relative px-6 py-4 font-semibold text-[15px] text-white flex items-center gap-1.5" style={{background:'#D5342A'}}>
              Board <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform"/>
              {/* Perforation tear-line on the left edge */}
              <span className="absolute left-0 top-0 bottom-0 w-[6px]" style={{
                backgroundImage:'radial-gradient(circle at left, transparent 3px, #D5342A 3.5px)',
                backgroundSize:'8px 8px',
                backgroundRepeat:'repeat-y',
                transform:'translateX(-50%)',
              }}/>
            </span>
          </Link>
          <Link href="/courses" className="px-6 py-4 rounded-full border text-[15px] font-semibold text-white hover:bg-white/5 transition-colors" style={{borderColor:'rgba(255,255,255,0.28)'}}>
            Browse courses
          </Link>
        </div>

        {/* Trust strip */}
        <div className="inline-flex items-center justify-center gap-6 sm:gap-7 flex-wrap pt-8 border-t border-dashed text-[12px]" style={{fontFamily:"'IBM Plex Mono',monospace",color:'rgba(255,255,255,0.5)',borderColor:'rgba(255,255,255,0.14)'}}>
          <span><b className="text-white font-semibold">2,000+</b> students placed</span>
          <span className="w-1 h-1 rounded-full opacity-70" style={{background:'#D5342A'}}/>
          <span><b className="text-white font-semibold">98%</b> visa success</span>
          <span className="w-1 h-1 rounded-full opacity-70" style={{background:'#D5342A'}}/>
          <span><b className="text-white font-semibold">Free</b> first consultation</span>
        </div>
      </div>
    </section>
  )
}
