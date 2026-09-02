'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const RED = '#C41E3A'
const RED_SOFT = '#E05266'
const INK = '#0E1116'
const INK_SOFT = '#3F4752'
const MUTED = '#9AA0A8'
const ROUTE = '#E5E1DA'

const steps = [
  { number: 1, title: 'Consultation', description: 'Discuss your academic goals with our experienced counselors.' },
  { number: 2, title: 'University Matching', description: 'Get personalized university recommendations.' },
  { number: 3, title: 'Document Prep', description: 'Prepare all required documents with expert guidance.' },
  { number: 4, title: 'Application', description: 'Submit complete applications to your selected universities.' },
  { number: 5, title: 'Interview Prep', description: 'Prepare and ace your university interviews with mock sessions.' },
  { number: 6, title: 'Visa Processing', description: 'Navigate the visa application process with full support.' },
  { number: 7, title: 'Departure', description: 'Final preparations and welcome to your new chapter abroad.' },
]

const desktopWaypoints = [
  { x: 85, y: 250 }, { x: 210, y: 130 }, { x: 360, y: 220 },
  { x: 500, y: 95 }, { x: 640, y: 200 }, { x: 790, y: 125 }, { x: 915, y: 235 },
]

const mobileWaypoints = [
  { x: 250, y: 50 }, { x: 110, y: 210 }, { x: 340, y: 370 },
  { x: 130, y: 530 }, { x: 320, y: 690 }, { x: 120, y: 850 }, { x: 250, y: 1010 },
]

function buildPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const t = 0.3
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
    const k = 0.3
    const cp1 = { x: p1.x + (p2.x - p0.x) * k, y: p1.y + (p2.y - p0.y) * k }
    const cp2 = { x: p2.x - (p3.x - p1.x) * k, y: p2.y - (p3.y - p1.y) * k }
    cum.push(cum[cum.length - 1] + segmentLen(p1, cp1, cp2, p2))
  }
  return cum
}

const DESKTOP_CUM_LENGTHS = computeCumulativeLengths(desktopWaypoints)
const MOBILE_CUM_LENGTHS = computeCumulativeLengths(mobileWaypoints)

function PlaneSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor" />
    </svg>
  )
}

interface FlightPathProps {
  waypoints: { x: number; y: number }[]
  viewBox: string
  activeStep: number
  onStepClick: (n: number) => void
  isMobile: boolean
}

function usePathLen(isMobile: boolean) {
  const cum = isMobile ? MOBILE_CUM_LENGTHS : DESKTOP_CUM_LENGTHS
  return { total: cum[cum.length - 1], cum }
}

const FlightPathScene = memo(function FlightPathScene({ waypoints, viewBox, activeStep, onStepClick, isMobile }: FlightPathProps) {
  const pathD = buildPath(waypoints)
  const { total, cum } = usePathLen(isMobile)
  const activeIdx = Math.min(activeStep, cum.length - 1)
  const drawnLen = cum[activeIdx]

  const cardW = isMobile ? 142 : 150
  const cardH = isMobile ? 146 : 150
  const descMaxH = isMobile ? 50 : 56
  const nodeR = isMobile ? 14 : 17
  const prefix = isMobile ? 'm' : 'd'

  const planeIdx = Math.min(Math.max(activeStep, 0), waypoints.length - 1)
  const wp = waypoints[planeIdx]
  const nextIdx = Math.min(planeIdx + 1, waypoints.length - 1)
  const nextWp = waypoints[nextIdx]
  const prevIdx = Math.max(planeIdx - 1, 0)
  const prevWp = waypoints[prevIdx]
  const angleDeg = activeStep <= 0
    ? Math.atan2(waypoints[1].y - waypoints[0].y, waypoints[1].x - waypoints[0].x) * (180 / Math.PI)
    : planeIdx >= waypoints.length - 1
      ? Math.atan2(wp.y - prevWp.y, wp.x - prevWp.x) * (180 / Math.PI)
      : Math.atan2(nextWp.y - wp.y, nextWp.x - wp.x) * (180 / Math.PI)

  const dashStyle = {
    strokeDasharray: total,
    strokeDashoffset: total - drawnLen,
    transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }

  return (
    <svg viewBox={viewBox} className="w-full" style={{ height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${prefix}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={RED} />
          <stop offset="100%" stopColor={RED_SOFT} />
        </linearGradient>
        <linearGradient id={`traveling-grad-${prefix}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={RED} stopOpacity="0" />
          <stop offset="15%" stopColor={RED} stopOpacity="0.5" />
          <stop offset="85%" stopColor={RED} stopOpacity="0.7" />
          <stop offset="100%" stopColor={RED_SOFT} stopOpacity="0.7" />
        </linearGradient>
        <filter id={`glow-${prefix}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dashed background route */}
      <path d={pathD} fill="none" stroke={ROUTE} strokeWidth={isMobile ? 2.5 : 3} strokeDasharray="3 6" strokeLinecap="round" strokeLinejoin="round" />

      {/* Animated progress route */}
      <path d={pathD} fill="none" stroke={`url(#grad-${prefix})`} strokeWidth={isMobile ? 3 : 3.5} strokeLinecap="round" strokeLinejoin="round" style={dashStyle} />

      {/* Soft glow overlay */}
      <path d={pathD} fill="none" stroke={`url(#traveling-grad-${prefix})`} strokeWidth={isMobile ? 7 : 8} strokeLinecap="round" strokeLinejoin="round" style={dashStyle} filter={`url(#glow-${prefix})`} />

      {/* Connector lines + step labels */}
      {waypoints.map((point, idx) => {
        const step = steps[idx]
        const isActive = activeStep === step.number
        const isPast = step.number < activeStep
        const cardX = point.x - cardW / 2
        const cardY = point.y + (isMobile ? 28 : 38)
        return (
          <g key={step.number}>
            <line
              x1={point.x} y1={point.y + nodeR + 2}
              x2={point.x} y2={cardY}
              stroke={isActive ? RED : '#D8D4CE'}
              strokeWidth={1}
              strokeDasharray="3 4"
              strokeOpacity={isActive ? 0.8 : 0.6}
              style={{ transition: 'stroke 0.4s ease' }}
            />
            <circle cx={point.x} cy={cardY + 2} r={isActive ? 3 : 2} fill={isActive ? RED : '#D8D4CE'} style={{ transition: 'all 0.4s ease' }} />

            <foreignObject
              x={cardX} y={cardY + 8}
              width={cardW} height={cardH}
              style={{ pointerEvents: 'all', overflow: 'visible' }}
            >
              <div
                onClick={() => onStepClick(step.number)}
                style={{
                  cursor: 'pointer',
                  padding: isMobile ? '0 4px' : '0 6px',
                  opacity: isActive ? 1 : isPast ? 0.72 : 0.42,
                  transform: isActive ? 'translateY(-3px)' : 'translateY(0)',
                  transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: isMobile ? 10 : 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: isActive ? RED : isPast ? INK_SOFT : MUTED,
                    transition: 'color 0.4s ease',
                  }}
                >
                  {String(step.number).padStart(2, '0')}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: isMobile ? 13 : 14.5,
                    fontWeight: isActive ? 700 : 600,
                    lineHeight: 1.2,
                    marginTop: 4,
                    color: isActive ? INK : isPast ? INK_SOFT : '#B4B9C2',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    maxHeight: isActive ? descMaxH : 0,
                    opacity: isActive ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.3s ease',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      fontSize: isMobile ? 10.5 : 11.5,
                      lineHeight: 1.5,
                      color: INK_SOFT,
                      marginTop: 5,
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

      {/* Waypoint nodes */}
      {waypoints.map((point, idx) => {
        const step = steps[idx]
        const isActive = activeStep === step.number
        const isPast = step.number < activeStep
        return (
          <g key={`node-${step.number}`}>
            {isActive && (
              <>
                <circle cx={point.x} cy={point.y} r={nodeR + 5} fill="none" stroke={RED} strokeWidth={1.5} strokeOpacity={0.18} style={{ animation: 'pulse-ring 2s ease-in-out infinite' }} />
                <circle cx={point.x} cy={point.y} r={nodeR + 10} fill="none" stroke={RED} strokeWidth={1} strokeOpacity={0.08} style={{ animation: 'pulse-ring 2s ease-in-out 0.4s infinite' }} />
              </>
            )}
            <circle
              cx={point.x} cy={point.y}
              r={isActive ? nodeR : isPast ? nodeR - 2 : nodeR - 2.5}
              fill={isActive || isPast ? RED : '#ffffff'}
              fillOpacity={isPast ? 0.5 : 1}
              stroke={isActive ? RED : isPast ? 'none' : '#D6D2CC'}
              strokeWidth={2}
              style={{ cursor: 'pointer', transition: 'all 0.35s ease' }}
              onClick={() => onStepClick(step.number)}
            />
            <circle
              cx={point.x} cy={point.y}
              r={nodeR + 3}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onClick={() => onStepClick(step.number)}
            />
          </g>
        )
      })}

      {/* Airplane marker */}
      <g
        style={{
          transform: `translate(${wp.x}px, ${wp.y}px) rotate(${angleDeg}deg)`,
          transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        <circle cx={0} cy={0} r={isMobile ? 20 : 24} fill={RED} opacity={0.05} style={{ animation: 'airplane-glow 1.5s ease-in-out infinite' }} />
        <circle cx={0} cy={0} r={isMobile ? 12 : 15} fill="white" stroke={RED} strokeWidth={2.5} style={{ transition: 'r 0.4s ease' }} />
        <foreignObject x={-9} y={-9} width={18} height={18}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <PlaneSvg className="h-4 w-4 text-[#C41E3A]" />
          </div>
        </foreignObject>
      </g>
    </svg>
  )
})

export default function ApplicationRoadmap() {
  const [activeStep, setActiveStep] = useState(1)
  const [autoPlaying, setAutoPlaying] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const activeStepRef = useRef(activeStep)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => { activeStepRef.current = activeStep }, [activeStep])

  useEffect(() => {
    if (prefersReducedMotion || !autoPlaying || !isInView) return
    const id = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length) { setAutoPlaying(false); return prev }
        return prev + 1
      })
    }, 2200)
    return () => clearInterval(id)
  }, [autoPlaying, isInView, prefersReducedMotion])

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

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.22; transform: scale(1); }
          50% { opacity: 0.05; transform: scale(1.25); }
        }
        @keyframes airplane-glow {
          0%, 100% { opacity: 0.04; transform: scale(0.95); }
          50% { opacity: 0.12; transform: scale(1.1); }
        }
      `}</style>
      <section
        ref={sectionRef}
        id="roadmap"
        className="relative scroll-mt-24 overflow-hidden py-24 lg:py-32"
        style={{ background: '#FAF9F6' }}
      >
        {/* Subtle editorial texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(16,23,42,0.05) 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0E1116]/[0.04]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[980px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0E1116]/[0.03]" />

        <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
          {/* Header */}
          <div className="mb-14 text-center lg:mb-20">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#C41E3A]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C41E3A] sm:text-xs">
                Your journey starts here
              </span>
              <span className="h-px w-8 bg-[#C41E3A]" />
            </div>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl lg:text-[56px]">
              Application <span style={{ color: RED }}>roadmap</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#4b5563] sm:text-lg">
              Follow a clear path from choosing the right university to preparing for your departure.
            </p>
          </div>

          {/* Desktop */}
          <div className="hidden lg:block">
            <div className="relative mx-auto" style={{ maxWidth: 1100, overflow: 'visible' }}>
              <FlightPathScene
                waypoints={desktopWaypoints}
                viewBox="0 0 1000 500"
                activeStep={activeStep}
                onStepClick={handleStepClick}
                isMobile={false}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <div className="relative mx-auto w-full overflow-visible px-2">
              <FlightPathScene
                waypoints={mobileWaypoints}
                viewBox="0 0 500 1230"
                activeStep={activeStep}
                onStepClick={handleStepClick}
                isMobile={true}
              />
            </div>
          </div>

          {/* CTA — anchored to the end of the journey */}
          <div className="mt-16 text-center lg:mt-20">
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
