'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const RED = '#C41E3A'
const RED_DEEP = '#9C122C'
const RED_SOFT = '#E05266'
const INK = '#0E1116'
const INK_SOFT = '#3F4752'
const MUTED = '#9AA0A8'
const ROUTE = '#E5E1DA'

const steps = [
  { number: 1, title: 'Consultation', description: 'Discuss your goals and preferences.' },
  { number: 2, title: 'University Matching', description: 'Find universities that fit your profile.' },
  { number: 3, title: 'Document Preparation', description: 'Prepare the required documents.' },
  { number: 4, title: 'Application', description: 'Submit your application with guidance.' },
  { number: 5, title: 'Interview Preparation', description: 'Prepare confidently for your interview.' },
  { number: 6, title: 'Visa Processing', description: 'Complete your visa process with guidance.' },
  { number: 7, title: 'Departure', description: 'Begin your journey abroad.' },
]

// A controlled travel route (gentle, low-amplitude) rather than a decorative wave.
const desktopWaypoints: { x: number; y: number; side: 'above' | 'below' }[] = [
  { x: 60, y: 190, side: 'below' },
  { x: 220, y: 240, side: 'above' },
  { x: 380, y: 190, side: 'below' },
  { x: 540, y: 240, side: 'above' },
  { x: 700, y: 190, side: 'below' },
  { x: 860, y: 240, side: 'above' },
  { x: 1020, y: 190, side: 'below' },
]

function buildPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const t = 0.28
    d += ` C ${p1.x + (p2.x - p0.x) * t} ${p1.y + (p2.y - p0.y) * t}, ${p2.x - (p3.x - p1.x) * t} ${p2.y - (p3.y - p1.y) * t}, ${p2.x} ${p2.y}`
  }
  return d
}

function bezierVal(a: number, b: number, c: number, d: number, t: number): number {
  const u = 1 - t
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d
}

function segmentLen(
  p0: { x: number; y: number },
  cp1: { x: number; y: number },
  cp2: { x: number; y: number },
  p3: { x: number; y: number },
  steps = 24,
): number {
  let len = 0
  let px = p0.x, py = p0.y
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const x = bezierVal(p0.x, cp1.x, cp2.x, p3.x, t)
    const y = bezierVal(p0.y, cp1.y, cp2.y, p3.y, t)
    len += Math.sqrt((x - px) ** 2 + (y - py) ** 2)
    px = x; py = y
  }
  return len
}

function computeCumulativeLengths(pts: { x: number; y: number }[]): number[] {
  const cum: number[] = [0]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const k = 0.28
    const cp1 = { x: p1.x + (p2.x - p0.x) * k, y: p1.y + (p2.y - p0.y) * k }
    const cp2 = { x: p2.x - (p3.x - p1.x) * k, y: p2.y - (p3.y - p1.y) * k }
    cum.push(cum[cum.length - 1] + segmentLen(p1, cp1, cp2, p2))
  }
  return cum
}

const DESKTOP_CUM_LENGTHS = computeCumulativeLengths(desktopWaypoints)

function PlaneSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor" />
    </svg>
  )
}

interface FlightPathProps {
  viewBox: string
  activeStep: number
  onStepClick: (n: number) => void
  reduceMotion: boolean
}

const FlightPathScene = memo(function FlightPathScene({ viewBox, activeStep, onStepClick, reduceMotion }: FlightPathProps) {
  const pathD = buildPath(desktopWaypoints)
  const total = DESKTOP_CUM_LENGTHS[DESKTOP_CUM_LENGTHS.length - 1]
  const activeIdx = Math.min(Math.max(activeStep, 0), DESKTOP_CUM_LENGTHS.length - 1)
  const drawnLen = DESKTOP_CUM_LENGTHS[activeIdx]

  const cardW = 156
  const cardH = 92
  const descMaxH = 42
  const nodeR = 14

  const planeIdx = Math.min(Math.max(activeStep, 0), desktopWaypoints.length - 1)
  const wp = desktopWaypoints[planeIdx]
  const nextIdx = Math.min(planeIdx + 1, desktopWaypoints.length - 1)
  const nextWp = desktopWaypoints[nextIdx]
  const prevIdx = Math.max(planeIdx - 1, 0)
  const prevWp = desktopWaypoints[prevIdx]
  const angleDeg = activeStep <= 0
    ? Math.atan2(desktopWaypoints[1].y - desktopWaypoints[0].y, desktopWaypoints[1].x - desktopWaypoints[0].x) * (180 / Math.PI)
    : planeIdx >= desktopWaypoints.length - 1
      ? Math.atan2(wp.y - prevWp.y, wp.x - prevWp.x) * (180 / Math.PI)
      : Math.atan2(nextWp.y - wp.y, nextWp.x - wp.x) * (180 / Math.PI)

  const dashStyle = {
    strokeDasharray: total,
    strokeDashoffset: reduceMotion ? 0 : total - drawnLen,
    transition: reduceMotion ? 'none' : 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  return (
    <svg viewBox={viewBox} className="w-full" style={{ height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={RED_DEEP} />
          <stop offset="100%" stopColor={RED} />
        </linearGradient>
        <linearGradient id="route-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={RED_DEEP} stopOpacity="0" />
          <stop offset="25%" stopColor={RED} stopOpacity="0.4" />
          <stop offset="85%" stopColor={RED} stopOpacity="0.5" />
          <stop offset="100%" stopColor={RED_SOFT} stopOpacity="0.5" />
        </linearGradient>
        <filter id="route-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dashed background route */}
      <path d={pathD} fill="none" stroke={ROUTE} strokeWidth={2.5} strokeDasharray="3 6" strokeLinecap="round" strokeLinejoin="round" />

      {/* Animated progress route */}
      <path d={pathD} fill="none" stroke="url(#route-grad)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={dashStyle} />

      {/* Soft glow */}
      <path d={pathD} fill="none" stroke="url(#route-glow)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" style={dashStyle} filter="url(#route-blur)" />

      {/* Step labels + connectors */}
      {desktopWaypoints.map((point, idx) => {
        const step = steps[idx]
        const isActive = activeStep === step.number
        const isPast = step.number < activeStep
        const showDesc = reduceMotion || isActive
        const labelTop = point.side === 'below' ? point.y + 26 : point.y - 26 - cardH
        const cardX = point.x - cardW / 2
        const lineStartY = point.side === 'below' ? point.y + nodeR : point.y - nodeR
        const lineEndY = point.side === 'below' ? labelTop : labelTop + cardH
        return (
          <g key={step.number}>
            <line
              x1={point.x} y1={lineStartY}
              x2={point.x} y2={lineEndY}
              stroke={isActive ? RED : '#D8D4CE'}
              strokeWidth={1}
              strokeDasharray="2 4"
              strokeOpacity={isActive ? 0.7 : 0.5}
              style={{ transition: 'stroke 0.4s ease' }}
            />
            <foreignObject x={cardX} y={labelTop} width={cardW} height={cardH} style={{ pointerEvents: 'all', overflow: 'visible' }}>
              <div
                onClick={() => onStepClick(step.number)}
                style={{
                  cursor: 'pointer',
                  padding: '0 4px',
                  textAlign: 'center',
                  opacity: isActive ? 1 : isPast ? 0.7 : 0.4,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: isActive ? RED : isPast ? INK_SOFT : MUTED,
                    transition: 'color 0.4s ease',
                  }}
                >
                  {String(step.number).padStart(2, '0')}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14.5,
                    fontWeight: isActive ? 700 : 600,
                    lineHeight: 1.2,
                    marginTop: 3,
                    color: isActive ? INK : isPast ? INK_SOFT : '#B4B9C2',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    maxHeight: showDesc ? descMaxH : 0,
                    opacity: showDesc ? 1 : 0,
                    overflow: 'hidden',
                    transition: reduceMotion ? 'none' : 'max-height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.3s ease',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      fontSize: 11.5,
                      lineHeight: 1.45,
                      color: '#5b6370',
                      marginTop: 3,
                      marginBottom: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </foreignObject>
          </g>
        )
      })}

      {/* Waypoint markers */}
      {desktopWaypoints.map((point, idx) => {
        const step = steps[idx]
        const isActive = activeStep === step.number
        const isPast = step.number < activeStep
        return (
          <g key={`node-${step.number}`}>
            {isActive && !reduceMotion && (
              <circle cx={point.x} cy={point.y} r={nodeR + 6} fill="none" stroke={RED} strokeWidth={1.5} strokeOpacity={0.16} style={{ animation: 'pulse-ring 2s ease-in-out infinite' }} />
            )}
            <circle
              cx={point.x} cy={point.y}
              r={isActive ? nodeR : isPast ? nodeR - 1.5 : nodeR - 2}
              fill={isActive || isPast ? RED : '#ffffff'}
              fillOpacity={isPast && !isActive ? 0.5 : 1}
              stroke={isActive ? RED : isPast ? 'none' : '#D6D2CC'}
              strokeWidth={2}
              style={{ cursor: 'pointer', transition: reduceMotion ? 'none' : 'all 0.35s ease' }}
              onClick={() => onStepClick(step.number)}
            />
            <circle
              cx={point.x} cy={point.y}
              r={nodeR + 4}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onClick={() => onStepClick(step.number)}
            />
          </g>
        )
      })}

      {/* Airplane — the traveler, terminates at Departure */}
      <g
        style={{
          transform: `translate(${wp.x}px, ${wp.y}px) rotate(${angleDeg}deg)`,
          transition: reduceMotion ? 'none' : 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        <circle cx={0} cy={0} r={22} fill={RED} opacity={0.06} style={reduceMotion ? undefined : { animation: 'airplane-glow 1.5s ease-in-out infinite' }} />
        <circle cx={0} cy={0} r={13} fill="white" stroke={RED} strokeWidth={2.5} />
        <foreignObject x={-9} y={-9} width={18} height={18}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <PlaneSvg className="h-4 w-4 text-[#C41E3A]" />
          </div>
        </foreignObject>
      </g>
    </svg>
  )
})

function MobileJourney({ activeStep, onStepClick, reduceMotion }: { activeStep: number; onStepClick: (n: number) => void; reduceMotion: boolean }) {
  const progress = reduceMotion ? 100 : (Math.max(0, activeStep) / steps.length) * 100

  return (
    <div className="relative mx-auto max-w-xl">
      {/* Base rail */}
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#E5E1DA]" />
      {/* Active rail */}
      <div
        className="absolute left-[15px] top-2 w-px bg-[#C41E3A]"
        style={{ height: `${progress}%`, transition: reduceMotion ? 'none' : 'height 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />

      {steps.map((step, i) => {
        const isActive = !reduceMotion && activeStep === step.number
        const isPast = reduceMotion || step.number < activeStep
        const isLast = i === steps.length - 1
        const showDesc = reduceMotion || isActive
        return (
          <div key={step.number} className="relative pb-9 last:pb-0">
            <button
              type="button"
              onClick={() => onStepClick(step.number)}
              aria-label={`Step ${step.number}: ${step.title}`}
              className="absolute left-[15px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white"
              style={{
                borderColor: isActive || isPast ? RED : '#D6D2CC',
                transform: `translateX(-50%) scale(${isActive ? 1.1 : 1})`,
                boxShadow: isActive ? '0 0 0 5px rgba(196,30,58,0.10)' : 'none',
                transition: reduceMotion ? 'none' : 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {isLast ? (
                <PlaneSvg className="h-4 w-4 text-[#C41E3A]" />
              ) : (
                <span
                  className="font-mono text-[11px] font-semibold"
                  style={{ color: isActive || isPast ? RED : MUTED }}
                >
                  {step.number}
                </span>
              )}
            </button>

            <div className="pl-12 pt-0.5">
              <h3
                className="text-base font-semibold leading-snug sm:text-[17px]"
                style={{ color: isActive ? INK : isPast ? INK_SOFT : '#B4B9C2', transition: reduceMotion ? 'none' : 'color 0.3s ease' }}
              >
                {step.title}
              </h3>
              <p
                className={`mt-1 overflow-hidden text-sm leading-relaxed text-[#4b5563] transition-all duration-300 ${
                  showDesc ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ApplicationRoadmap() {
  const [activeStep, setActiveStep] = useState(1)
  const [autoPlaying, setAutoPlaying] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const activeStepRef = useRef(activeStep)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = Boolean(prefersReducedMotion)

  useEffect(() => { activeStepRef.current = activeStep }, [activeStep])

  useEffect(() => {
    if (reduceMotion || !autoPlaying || !isInView) return
    const id = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length) { setAutoPlaying(false); return prev }
        return prev + 1
      })
    }, 2200)
    return () => clearInterval(id)
  }, [autoPlaying, isInView, reduceMotion])

  const handleStepClick = useCallback((num: number) => {
    setAutoPlaying(false)
    const current = activeStepRef.current
    if (current === 0 && num === 0) return
    if (current === num) {
      setActiveStep(0)
      return
    }
    if (current > num) {
      setActiveStep(0)
      setTimeout(() => {
        setActiveStep(num)
      }, 50)
    } else {
      setActiveStep(num)
    }
  }, [])

  // Reduced motion → show the completed, static journey.
  const displayStep = reduceMotion ? steps.length : activeStep

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.05; transform: scale(1.25); }
        }
        @keyframes airplane-glow {
          0%, 100% { opacity: 0.04; transform: scale(0.95); }
          50% { opacity: 0.1; transform: scale(1.1); }
        }
      `}</style>
      <section
        ref={sectionRef}
        id="roadmap"
        className="relative scroll-mt-24 overflow-hidden py-24 lg:py-32"
        style={{ background: '#FAF9F6' }}
      >
        {/* Subtle dotted texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(16,23,42,0.05) 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        />
        {/* Single faint radial accent */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0E1116]/[0.03]" />

        <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          {/* Header */}
          <div className="mb-10 text-center lg:mb-12">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#C41E3A]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C41E3A] sm:text-xs">
                Your journey starts here
              </span>
              <span className="h-px w-8 bg-[#C41E3A]" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-4xl lg:text-[56px]">
              Application <span style={{ color: RED }}>roadmap</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#4b5563] sm:text-lg">
              Follow a clear path from choosing the right university to preparing for your departure.
            </p>
          </div>

          {/* Desktop — animated horizontal travel route */}
          <div className="hidden lg:block">
            <div className="relative mx-auto" style={{ maxWidth: 1080, overflow: 'visible' }}>
              <FlightPathScene
                viewBox="0 0 1080 340"
                activeStep={displayStep}
                onStepClick={handleStepClick}
                reduceMotion={reduceMotion}
              />
            </div>
          </div>

          {/* Mobile / tablet — dedicated vertical journey */}
          <div className="lg:hidden">
            <MobileJourney
              activeStep={displayStep}
              onStepClick={handleStepClick}
              reduceMotion={reduceMotion}
            />
          </div>

          {/* CTA — anchored to the end of the journey */}
          <div className="mt-14 text-center lg:mt-16">
            <p className="font-display text-2xl font-semibold tracking-tight text-[#0E1116] sm:text-3xl">
              Ready to start your journey?
            </p>
            <p className="mt-3 text-base leading-relaxed text-[#4b5563]">
              Get personalized guidance from application to departure.
            </p>
            <a
              href="/register"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#C41E3A] px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#A01830]"
            >
              Book a consultation
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
