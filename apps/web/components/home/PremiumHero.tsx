'use client'

import { useState } from 'react'
import { motion, useReducedMotion, AnimatePresence, type PanInfo } from 'framer-motion'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'

const BRAND_RED = '#C41E3A'
const BRAND_NAVY = '#101B3D'
const BRAND_GOLD = '#B8934A'

const images = [
  { src:'/student-1.jpg', alt:'Student studying abroad' },
  { src:'/student-2.jpg', alt:'International student' },
  { src:'/student-3.jpg', alt:'University student' },
  { src:'/student-4.jpg', alt:'Graduate student' },
  { src:'/student-5.jpg', alt:'Exchange student' },
]

function mod(n:number,m:number){return((n%m)+m)%m}

const SVGFallback = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect fill="%23e5e7eb" width="200" height="260"/><text x="100" y="130" text-anchor="middle" fill="%239ca3af" font-size="14">Student</text></svg>`

export default function PremiumHero() {
  const prefersReducedMotion = useReducedMotion()
  const [[page, direction], setPage] = useState<[number,number]>([0,0])
  const [fCountry, setFCountry] = useState('')
  const [fLevel, setFLevel] = useState('')
  const { data: stats } = trpc.university.stats.useQuery()
  const uniCount = stats?.universities || 50
  const countryCount = stats?.countries || 2

  function paginate(dir:number){setPage([mod(page+dir,images.length),dir])}
  function handleDragEnd(_:any, info:PanInfo){
    if(Math.abs(info.offset.x)>60) paginate(info.offset.x<0?1:-1)
  }

  const variants = {
    enter: (d:number)=>({x:d>0?300:-300,opacity:0,scale:0.88,rotate:d>0?5:-5}),
    center:{x:0,opacity:1,scale:1,rotate:0,zIndex:1},
    exit: (d:number)=>({x:d>0?-200:200,opacity:0,scale:0.88,rotate:d>0?-3:3,zIndex:0}),
  }

  function buildSearchUrl(){
    const p=new URLSearchParams()
    if(fCountry)p.set('country',fCountry)
    if(fLevel)p.set('level',fLevel)
    return `/courses?${p.toString()}`
  }

  return (
    <section className="relative bg-[#F5F6F9] pt-20 sm:pt-24 pb-16 sm:pb-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{backgroundImage:'radial-gradient(circle, #101B3D 1px, transparent 1px)',backgroundSize:'28px 28px'}}/>
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rose-100/40 blur-3xl"/>
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-blue-50/30 blur-3xl"/>

      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center mb-12">
          {/* Left */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.08em] font-semibold" style={{fontFamily:"'IBM Plex Mono',monospace",color:BRAND_RED,background:'rgba(196,30,58,0.07)',border:`1px solid rgba(196,30,58,0.2)`}}>
              <span className="h-1.5 w-1.5 rounded-full" style={{background:BRAND_RED}}/> Bangladesh&apos;s Trusted Partner
            </div>
            <h1 className="text-4xl sm:text-[46px] font-bold leading-[1.1] mb-4 max-w-[520px]" style={{fontFamily:"'Space Grotesk',sans-serif",color:BRAND_NAVY}}>
              Study abroad with <span style={{color:BRAND_RED}}>Endow</span> guidance.
            </h1>
            <p className="text-base sm:text-[16px] leading-relaxed mb-5 max-w-[440px]" style={{color:'#5b6070'}}>
              Personalised counselling for South Korea — from university selection to the day your visa clears.
            </p>
            <div className="flex items-center gap-2 text-[12px] mb-5" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#5b6070'}}>
              <span className="tracking-[2px]" style={{color:BRAND_GOLD,fontSize:'14px'}}>★★★★★</span> 4.7 rated by 5,000+ students
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/apply-now" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{background:BRAND_RED}}>Apply Now</Link>
              <Link href="/universities" className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors" style={{borderColor:'rgba(16,27,61,0.2)',color:BRAND_NAVY}}>Explore Universities</Link>
            </div>
          </motion.div>

          {/* Right: Animated slider */}
          <div className="relative flex items-center justify-center h-[360px] sm:h-[420px] select-none z-10">
            {/* Stacked background cards */}
            <div className="absolute w-48 h-60 sm:w-56 sm:h-72 rounded-2xl bg-gray-200 rotate-6 opacity-30"/>
            <div className="absolute w-48 h-60 sm:w-56 sm:h-72 rounded-2xl bg-gray-200 -rotate-3 opacity-20"/>

            <div className="relative w-48 h-60 sm:w-56 sm:h-72">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag={prefersReducedMotion?false:'x'}
                  dragConstraints={{left:0,right:0}}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  transition={{type:'spring',stiffness:350,damping:30}}
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
                >
                  <img src={images[page].src} alt={images[page].alt} className="w-full h-full object-cover" onError={(e)=>{ (e.target as HTMLImageElement).src = `data:image/svg+xml,${SVGFallback}` }}/>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Arrows */}
            <button onClick={()=>paginate(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-20"><ChevronLeft size={18} className="text-gray-600"/></button>
            <button onClick={()=>paginate(1)} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-20"><ChevronRight size={18} className="text-gray-600"/></button>

            {/* Dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_,i)=>(
                <button key={i} onClick={()=>setPage([i,i>page?1:-1])} className={`rounded-full transition-all ${i===page?'w-5 h-2 bg-[#C41E3A]':'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`}/>
              ))}
            </div>
          </div>
        </div>

        {/* Boarding pass ticket: finder + stats stub */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.3}} className="rounded-[20px] overflow-hidden border bg-white shadow-[0_34px_70px_-30px_rgba(16,27,61,0.28)]" style={{borderColor:'rgba(16,27,61,0.13)'}}>
          <div className="px-6 sm:px-8 py-6 sm:py-7">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2.5 font-semibold text-[14px]">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-[13px]" style={{background:'rgba(196,30,58,0.1)',color:BRAND_RED}}><Search size={13}/></div>
                Find your university
              </div>
              <span className="text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 rounded font-medium" style={{fontFamily:"'IBM Plex Mono',monospace",color:BRAND_GOLD,background:'rgba(184,147,74,0.12)'}}>Search Class · All Routes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 sm:gap-4 items-end">
              {[{label:'Country',val:fCountry,set:setFCountry,opts:['','South Korea','Australia']},{label:'Degree',val:fLevel,set:setFLevel,opts:['',"Bachelor's","Master's",'PhD','Diploma']},{label:'Budget',opts:['Any budget','Under $5k','$5k-$15k','$15k+']},{label:'Intake',opts:['Any intake','Spring 2026','Fall 2026','Spring 2027']}].map(f=>(
                <div key={f.label} className="w-full">
                  <label className="block text-[9px] uppercase tracking-[0.07em] mb-1.5 font-medium" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#9299a8'}}>{f.label}</label>
                  <select value={f.val||''} onChange={e=>f.set?.(e.target.value)} className="w-full py-2.5 px-3 rounded-lg border text-[13px] bg-[#F5F6F9] outline-none focus:border-[#C41E3A]" style={{fontFamily:"'IBM Plex Sans',sans-serif",borderColor:'rgba(16,27,61,0.13)',color:BRAND_NAVY}}>
                    {f.opts.map(o=><option key={o} value={o}>{o||'Any'}</option>)}
                  </select>
                </div>
              ))}
              <Link href={buildSearchUrl()} className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap hover:opacity-90 transition-opacity" style={{background:BRAND_RED}}><Search size={14}/>Search</Link>
            </div>
            <div className="flex items-center gap-2 mt-4 flex-wrap text-[12px]" style={{color:'#9299a8'}}>
              Popular:{' '}
              {['Computer Science','MBA','Engineering','Data Science'].map(t=>(
                <Link key={t} href={`/courses?subject=${encodeURIComponent(t)}`} className="px-2.5 py-1 rounded-full hover:text-[#C41E3A] transition-colors" style={{background:'#F5F6F9',color:BRAND_NAVY}}>{t}</Link>
              ))}
            </div>
          </div>
          <div className="relative mx-8 border-t-2 border-dashed" style={{borderColor:'rgba(16,27,61,0.13)'}}>
            <div className="absolute -top-[11px] -left-[45px] w-[22px] h-[22px] rounded-full bg-[#F5F6F9]"/><div className="absolute -top-[11px] -right-[45px] w-[22px] h-[22px] rounded-full bg-[#F5F6F9]"/>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {[{num:'2,000+',lbl:'Students placed'},{num:`${uniCount}+`,lbl:'Partner universities'},{num:`${countryCount}`,lbl:'Countries'},{num:'98%',lbl:'Success rate'}].map((s,i)=>(
              <div key={i} className="relative py-5 px-4 text-center text-white" style={{background:BRAND_NAVY}}>
                {i<3&&<div className="absolute right-0 top-3 bottom-3 border-r-[1.5px] border-dashed border-white/20"/>}
                <div className="text-2xl sm:text-[26px] font-semibold" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#F5A623'}}>{s.num}</div>
                <div className="text-[9px] uppercase tracking-[0.09em] mt-1.5" style={{fontFamily:"'IBM Plex Mono',monospace",color:'rgba(255,255,255,0.5)'}}>{s.lbl}</div>
                <div className="mt-3 mx-auto w-[70%] h-3 opacity-60" style={{background:'repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 2px, transparent 2px 4px, rgba(255,255,255,0.5) 4px 5px, transparent 5px 8px)'}}/>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
