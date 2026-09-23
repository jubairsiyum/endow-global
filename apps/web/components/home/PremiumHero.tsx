'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion, AnimatePresence, type PanInfo } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
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

const FALLBACK_IMAGE = '/hero-1.jpg'

const BUDGET_RANGES: Record<string, { feeMin?: number; feeMax?: number }> = {
  'Any budget': {},
  'Under $5k': { feeMax: 5000 },
  '$5k-$15k': { feeMin: 5000, feeMax: 15000 },
  '$15k+': { feeMin: 15000 },
}

const INTAKE_YEARS: Record<string, string | undefined> = {
  'Any intake': undefined,
  'Spring 2026': '2026',
  'Fall 2026': '2026',
  'Spring 2027': '2027',
}

const LEVEL_VALUES: Record<string, string> = {
  "Bachelor's": 'UNDERGRADUATE',
  "Master's": 'POSTGRADUATE',
  PhD: 'PHD',
  Diploma: 'DIPLOMA',
  Certificate: 'CERTIFICATE',
}

export default function PremiumHero() {
  const prefersReducedMotion = useReducedMotion()
  const [[page, direction], setPage] = useState<[number,number]>([0,0])
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const [failedImages, setFailedImages] = useState<number[]>([])
  const [fCountry, setFCountry] = useState('')
  const [fLevel, setFLevel] = useState('')
  const [fBudget, setFBudget] = useState('Any budget')
  const [fIntake, setFIntake] = useState('Any intake')
  const { data: stats } = trpc.university.stats.useQuery()
  const uniCount = stats?.universities || 50
  const countryCount = stats?.countries || 2
  const { data: reviews } = trpc.testimonial.published.useQuery()
  const publishedReviews = reviews ?? []
  const reviewCount = publishedReviews.length
  const avgRating = reviewCount > 0
    ? (publishedReviews.reduce((sum, t) => sum + t.rating, 0) / reviewCount).toFixed(1)
    : null

  const paginate = useCallback((dir:number) => {
    setPage(([current]) => [mod(current + dir, images.length), dir])
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || isCarouselPaused) return

    const interval = window.setInterval(() => paginate(1), 6000)
    return () => window.clearInterval(interval)
  }, [isCarouselPaused, paginate, prefersReducedMotion])

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info:PanInfo){
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
    if(fLevel)p.set('level', LEVEL_VALUES[fLevel] ?? fLevel)
    const budget = BUDGET_RANGES[fBudget]
    if(budget?.feeMin)p.set('feeMin', String(budget.feeMin))
    if(budget?.feeMax)p.set('feeMax', String(budget.feeMax))
    const year = INTAKE_YEARS[fIntake]
    if(year)p.set('year', year)
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
              <span className="tracking-[2px]" style={{color:BRAND_GOLD,fontSize:'14px'}}>★★★★★</span>
              <span>{avgRating ? `${avgRating} rated by ${reviewCount.toLocaleString()} students` : 'Trusted by students across South Korea & Australia'}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/apply-now" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{background:BRAND_RED}}>Apply Now</Link>
              <Link href="/universities" className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors" style={{borderColor:'rgba(16,27,61,0.2)',color:BRAND_NAVY}}>Explore Universities</Link>
            </div>
          </motion.div>

          {/* Right: notice-ready animated photo carousel */}
          <div
            className="relative z-10 flex h-[390px] select-none items-center justify-center sm:h-[480px] lg:h-[520px]"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured Endow Global stories"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            onFocusCapture={() => setIsCarouselPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsCarouselPaused(false)
              }
            }}
          >
            <div className="pointer-events-none absolute h-[82%] w-[76%] rounded-3xl bg-white/70 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute h-[78%] w-[68%] rounded-3xl border border-white/80 bg-white/20" aria-hidden="true" />

            {/* Stacked background cards */}
            <div className="absolute h-[324px] w-[250px] rotate-6 rounded-2xl bg-gray-200 opacity-30 shadow-xl sm:h-[403px] sm:w-[310px]" aria-hidden="true" />
            <div className="absolute h-[324px] w-[250px] -rotate-3 rounded-2xl bg-gray-200 opacity-20 shadow-xl sm:h-[403px] sm:w-[310px]" aria-hidden="true" />

            <div className="relative h-[330px] w-[255px] sm:h-[416px] sm:w-[320px] lg:h-[455px] lg:w-[350px]">
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
                  transition={prefersReducedMotion ? {duration:0.01} : {type:'spring',stiffness:350,damping:30}}
                  className="absolute inset-0 cursor-grab overflow-hidden rounded-2xl border border-white/70 bg-gray-200 shadow-[0_24px_70px_rgba(16,27,61,0.24)] active:cursor-grabbing"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Featured image ${page + 1} of ${images.length}`}
                >
                  <Image
                    src={failedImages.includes(page) ? FALLBACK_IMAGE : images[page].src}
                    alt={images[page].alt}
                    fill
                    priority={page === 0}
                    quality={100}
                    sizes="(max-width: 639px) 255px, (max-width: 1023px) 320px, 350px"
                    className="object-cover"
                    onError={() => setFailedImages((current) => current.includes(page) ? current : [...current, page])}
                  />
                  <span className="pointer-events-none absolute bottom-5 right-5 shrink-0 rounded-full border border-white/45 bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white/95 backdrop-blur-sm">
                    {String(page + 1).padStart(2, '0')}/{String(images.length).padStart(2, '0')}
                  </span>
                </motion.div>
              </AnimatePresence>
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
              {[
                {label:'Country',val:fCountry,set:setFCountry,opts:['','South Korea','Australia','UK'],disabled:['Australia','UK']},
                {label:'Degree',val:fLevel,set:setFLevel,opts:['',"Bachelor's","Master's",'PhD','Diploma','Certificate'],disabled:[]},
                {label:'Budget',val:fBudget,set:setFBudget,opts:['Any budget','Under $5k','$5k-$15k','$15k+'],disabled:[]},
                {label:'Intake',val:fIntake,set:setFIntake,opts:['Any intake','Spring 2026','Fall 2026','Spring 2027'],disabled:[]},
              ].map(f=>(
                <div key={f.label} className="w-full">
                  <label className="block text-[9px] uppercase tracking-[0.07em] mb-1.5 font-medium" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#9299a8'}}>{f.label}</label>
                  <select value={f.val||''} onChange={e=>f.set(e.target.value)} className="w-full py-2.5 px-3 rounded-lg border text-[13px] bg-[#F5F6F9] outline-none focus:border-[#C41E3A]" style={{fontFamily:"'IBM Plex Sans',sans-serif",borderColor:'rgba(16,27,61,0.13)',color:BRAND_NAVY}}>
                    {f.opts.map(o=>{
                      const isDisabled = f.disabled.includes(o)
                      return <option key={o} value={o} disabled={isDisabled}>{o||'Any'}{isDisabled ? ' (coming soon)' : ''}</option>
                    })}
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
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-gradient-to-r from-[#EEF2FF] via-[#F4E8FF] to-[#FFE4F0]">
            {[{num:'2,000+',lbl:'Students placed'},{num:`${uniCount}+`,lbl:'Partner universities'},{num:`${countryCount}`,lbl:'Countries'},{num:'98%',lbl:'Success rate'}].map((s,i)=>(
              <div key={i} className="relative py-5 px-4 text-center">
                {i<3&&<div className="absolute right-0 top-3 bottom-3 border-r-[1.5px] border-dashed border-[#101B3D]/15"/>}
                <div className="text-2xl sm:text-[26px] font-semibold text-[#101B3D]" style={{fontFamily:"'IBM Plex Mono',monospace"}}>{s.num}</div>
                <div className="text-[9px] uppercase tracking-[0.09em] mt-1.5" style={{fontFamily:"'IBM Plex Mono',monospace",color:'#5b6070'}}>{s.lbl}</div>
                <div className="mt-3 mx-auto w-[70%] h-3 opacity-40" style={{background:'repeating-linear-gradient(90deg, rgba(16,27,61,0.5) 0 2px, transparent 2px 4px, rgba(16,27,61,0.5) 4px 5px, transparent 5px 8px)'}}/>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
