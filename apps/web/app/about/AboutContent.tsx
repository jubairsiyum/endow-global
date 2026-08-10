'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const BRAND_RED = '#C41E3A'
const BRAND_DARK = '#0A0A0A'
const BRAND_BG = '#F8F9FB'

export function AboutContent() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden" style={{background:BRAND_BG,color:BRAND_DARK,fontFamily:"'IBM Plex Sans',sans-serif"}}>
      <Navbar />

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{background:`radial-gradient(ellipse at 15% -10%, rgba(196,30,58,0.25), transparent 45%), linear-gradient(180deg, ${BRAND_DARK} 0%, #050505 100%)`,color:'#fff'}}>
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

            {/* LEFT */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest" style={{fontFamily:"'IBM Plex Mono',monospace",color:BRAND_RED,background:'rgba(196,30,58,0.12)',border:'1px solid rgba(196,30,58,0.35)'}}>
                <span className="h-1.5 w-1.5 rounded-full" style={{background:BRAND_RED}}/> Bangladesh&apos;s Trusted Partner
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-5 max-w-[560px]" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
                Boarding pass to <span style={{color:'#E8836F'}}>South Korean</span> education.
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base sm:text-[17px] leading-relaxed mb-8 max-w-[460px]" style={{color:'rgba(255,255,255,0.68)'}}>
                We guide Bangladeshi students from application to arrival — the full route, one consultancy, no layovers.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-12">
                <Link href="/apply-now" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{background:BRAND_RED,color:'#fff'}}>Apply Now <ArrowRight size={16}/></Link>
                <Link href="/universities" className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-all hover:bg-white/10" style={{borderColor:'rgba(255,255,255,0.3)',color:'#fff'}}>Explore Universities</Link>
              </motion.div>
              <motion.div variants={fadeUp} className="flex items-center gap-4 text-[13px]" style={{fontFamily:"'IBM Plex Mono',monospace",color:'rgba(255,255,255,0.55)'}}>
                <span className="font-semibold tracking-wider text-white">DHA</span>
                <span className="flex-1 relative max-w-[120px]" style={{height:1,background:'repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 12px)'}}>✈</span>
                <span className="font-semibold tracking-wider text-white">ICN</span>
                <span className="ml-auto">Est. journey: 6–9 months</span>
              </motion.div>
            </motion.div>

            {/* RIGHT — Boarding Pass */}
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.8,delay:0.3}}>
              <div className="relative rounded-[18px] bg-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)] overflow-hidden" style={{color:BRAND_DARK,transform:'rotate(1.5deg)'}}>
                {/* Notches */}
                <div className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-white shadow-sm"/>
                <div className="absolute -bottom-2.5 -left-2.5 w-5 h-5 rounded-full bg-white shadow-sm"/>
                <div className="absolute top-0 bottom-0 left-[calc(100%-110px)] border-l-2 border-dashed" style={{borderColor:'rgba(16,27,61,0.15)'}}/>

                <div className="flex">
                  <div className="flex-1 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2 font-bold text-sm"><span className="w-5 h-5 rounded inline-block" style={{background:`linear-gradient(135deg,${BRAND_RED},#B8934A)`}}/> Endow Global</div>
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded font-medium" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#B8934A',background:'rgba(184,147,74,0.12)'}}>Student Class</span>
                    </div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="font-bold text-2xl sm:text-3xl" style={{fontFamily:"'Space Grotesk',sans-serif"}}>DHA<span className="block text-[10px] font-medium tracking-wider mt-0.5" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#8a8f9c'}}>Dhaka</span></div>
                      <div className="flex-1 text-center text-lg" style={{color:'#B8934A'}}>✈</div>
                      <div className="font-bold text-2xl sm:text-3xl" style={{fontFamily:"'Space Grotesk',sans-serif"}}>ICN<span className="block text-[10px] font-medium tracking-wider mt-0.5" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#8a8f9c'}}>Seoul</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div><p className="text-[10px] uppercase tracking-widest mb-1" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#8a8f9c'}}>Passenger</p><p className="font-semibold text-[13px]">You, Class of 2026</p></div>
                      <div><p className="text-[10px] uppercase tracking-widest mb-1" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#8a8f9c'}}>Program</p><p className="font-semibold text-[13px]">Choose on arrival</p></div>
                    </div>
                    <div className="border-t border-dashed pt-4 space-y-1.5" style={{borderColor:'rgba(16,27,61,0.14)'}}>
                      {[{n:'01',t:'University selection',d:'matched to your goals'},{n:'02',t:'Application filed',d:'docs handled for you'},{n:'03',t:'Visa approved',d:'95% success rate'},{n:'04',t:'Arrival support',d:'pickup & housing'}].map(s=>(
                        <div key={s.n} className="flex items-baseline gap-2.5 text-[12px]"><span className="w-4 text-[11px]" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#B8934A'}}>{s.n}</span><span className="font-semibold">{s.t}</span><span className="ml-1" style={{color:'#8a8f9c'}}>— {s.d}</span></div>
                      ))}
                    </div>
                  </div>
                  {/* Stub */}
                  <div className="w-[110px] flex flex-col items-center justify-between p-5 text-white relative" style={{background:BRAND_DARK}}>
                    <div className="w-14 h-14 rounded" style={{background:'repeating-conic-gradient(#0A0A0A 0% 25%, transparent 0% 50%) 0 0/10px 10px'}}/>
                    <div className="text-center text-[11px] leading-relaxed opacity-85" style={{fontFamily:"'IBM Plex Mono',monospace"}}>GATE<br/><b className="text-base">EG-01</b></div>
                    <div className="w-full h-8 opacity-90" style={{background:'repeating-linear-gradient(90deg, #fff 0 2px, transparent 2px 4px, #fff 4px 5px, transparent 5px 9px)'}}/>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ DEPARTURE BOARD ═══════ */}
      <div style={{background:'#050505',borderTop:'1px solid rgba(255,255,255,0.06)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 py-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 text-center">
            {[{n:'5000+',l:'Students'},{n:'20+',l:'Universities'},{n:'95%',l:'Visa Rate'},{n:'10+',l:'Years flying'}].map(s=>(
              <div key={s.l} className="px-3 py-1.5 border-r last:border-r-0" style={{borderColor:'rgba(255,255,255,0.06)'}}>
                <div className="text-3xl sm:text-[34px] font-semibold" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#F5A623',textShadow:'0 0 18px rgba(245,166,35,0.35)'}}>{s.n}</div>
                <div className="text-[10px] uppercase tracking-[0.1em] mt-1.5" style={{fontFamily:"'IBM Plex Mono',monospace",color:'rgba(255,255,255,0.45)'}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ WHO WE ARE ═══════ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-center">
            <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.8}}>
              <div className="relative bg-white border rounded-[18px] p-8 sm:p-10 min-h-[340px] flex items-center justify-center" style={{borderColor:'rgba(16,27,61,0.14)'}}>
                <span className="absolute top-4 left-5 text-[10px] tracking-wider" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#b7bcc9'}}>EST. 2016</span>
                <span className="absolute bottom-4 right-5 text-[10px] tracking-wider" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#b7bcc9'}}>DHAKA · SEOUL</span>
                <div className="w-[190px] h-[190px] rounded-full border-[2.5px] flex items-center justify-center rotate-[-9deg] opacity-90 relative" style={{borderColor:BRAND_RED}}>
                  <div className="absolute inset-[10px] rounded-full border" style={{borderColor:BRAND_RED}}/>
                  <div className="text-center text-[11px] uppercase tracking-[0.12em] leading-relaxed" style={{fontFamily:"'IBM Plex Mono',monospace",color:BRAND_RED}}>
                    ENDOW GLOBAL<b className="block font-bold text-xl mt-1 mb-1" style={{fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'0.02em'}}>APPROVED</b>REPUBLIC OF KOREA
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.8}}>
              <span className="text-xs uppercase tracking-[0.08em] mb-3 block" style={{fontFamily:"'IBM Plex Mono',monospace",color:BRAND_RED}}>Who we are</span>
              <h2 className="text-2xl sm:text-[32px] font-bold leading-tight mb-4" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Empowering dreams, one student at a time.</h2>
              <p className="text-[15px] leading-relaxed mb-4" style={{color:'#565b6b'}}>We&apos;re more than a consultancy — we&apos;re the counter you check in at before the biggest trip of your academic life. Our team has built direct relationships with partner universities across South Korea.</p>
              <p className="text-[15px] leading-relaxed mb-6" style={{color:'#565b6b'}}>From your first counselling session to the day you land in Incheon, someone at Endow is tracking your file.</p>
              <Link href="/apply-now" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{background:BRAND_RED}}>Start Your Journey <ArrowRight size={16}/></Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ MISSION / VISION ═══════ */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[{tag:'Page 1 · Mission',title:'Every student boards.',text:'To give Bangladeshi students unparalleled guidance and honest support through every stage of the journey to study in South Korea — no gatekeeping, no guesswork.'},{tag:'Page 2 · Vision',title:'The reference route.',text:'To be the consultancy others get compared to — known in Bangladesh for integrity, and known in South Korea for sending prepared, capable students.'}].map((c,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6,delay:i*0.15}} className="relative overflow-hidden rounded-[18px] p-8 sm:p-9 text-white" style={{background:BRAND_DARK}}>
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-20" style={{background:`radial-gradient(circle, ${BRAND_RED}, transparent 70%)`}}/>
                <span className="relative z-10 text-[11px] uppercase tracking-[0.1em] mb-3 block" style={{fontFamily:"'IBM Plex Mono',monospace",color:BRAND_RED}}>{c.tag}</span>
                <h3 className="relative z-10 text-xl sm:text-[23px] font-bold mb-3" style={{fontFamily:"'Space Grotesk',sans-serif"}}>{c.title}</h3>
                <p className="relative z-10 text-[14px] leading-relaxed" style={{color:'rgba(255,255,255,0.68)'}}>{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FOUNDER ═══════ */}
      <section className="py-16 sm:py-24" style={{background:'#EEF1F6'}}>
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.08em] mb-3 block" style={{fontFamily:"'IBM Plex Mono',monospace",color:BRAND_RED}}>From our founder</span>
            <h2 className="text-2xl sm:text-[34px] font-bold" style={{fontFamily:"'Space Grotesk',sans-serif"}}>A message before you fly.</h2>
          </div>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="relative bg-white rounded-2xl shadow-[0_24px_60px_-30px_rgba(16,27,61,0.35)] p-8 sm:p-12">
            <div className="absolute -top-5 right-10 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-[15px] shadow-lg -rotate-6" style={{background:`linear-gradient(150deg, ${BRAND_RED}, #7A0713)`,fontFamily:"'Space Grotesk',sans-serif"}}>EG</div>
            <p className="text-lg font-semibold mb-4" style={{fontFamily:"'Space Grotesk',sans-serif",color:BRAND_RED}}>Dear students and parents,</p>
            <p className="text-[15px] leading-relaxed mb-4" style={{color:'#3a3f4d'}}>Welcome to Endow Global Education. I started this consultancy believing education can move a family forward in one generation — I watched it happen in my own. That belief is still the whole business plan.</p>
            <p className="text-[15px] leading-relaxed mb-6" style={{color:'#3a3f4d'}}>Our job is simple to state and hard to do well: make the path to a South Korean classroom feel as clear on day one as it does on the day you board. My team and I walk every step with you.</p>
            <div className="pt-4 border-t" style={{borderColor:'rgba(16,27,61,0.14)'}}>
              <b className="text-base" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Md. Abdullah Al Faruq</b>
              <span className="block text-[13px] mt-0.5" style={{color:'#8a8f9c'}}>Founder, Endow Global Education</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 sm:py-24 text-center text-white" style={{background:`linear-gradient(120deg, #050505 0%, ${BRAND_DARK} 55%, #7a2019 130%)`}}>
        <div className="mx-auto max-w-[640px] px-5">
          <h2 className="text-3xl sm:text-[36px] font-bold mb-3" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Ready for takeoff?</h2>
          <p className="text-[15px] mb-9 max-w-[460px] mx-auto" style={{color:'rgba(255,255,255,0.65)'}}>Get personalised guidance from a real consultant and start your file today.</p>
          <Link href="/apply-now" className="inline-flex items-center rounded-full overflow-hidden shadow-[0_18px_40px_-14px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform">
            <span className="px-7 py-4 font-semibold text-[15px] bg-white" style={{color:BRAND_DARK}}>Apply Now</span>
            <span className="relative px-5 py-4 font-semibold text-[15px] text-white flex items-center gap-1.5" style={{background:BRAND_RED}}>
              Boarding <ArrowRight size={16}/>
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
