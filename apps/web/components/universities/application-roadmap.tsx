'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import {
  MessageSquare,
  Search,
  FileText,
  Send,
  Video,
  Shield,
  Plane,
  ArrowRight,
} from 'lucide-react'

const steps = [
  { number: 1, title: 'Consultation', description: 'Discuss your academic goals with our experienced counselors.', detail: 'Free 30-minute session to understand your aspirations, background, and timeline.', icon: MessageSquare, color: '#8b5cf6' },
  { number: 2, title: 'University Matching', description: 'Get personalized university recommendations.', detail: 'Our algorithm analyzes your profile against partner universities in South Korea and Australia.', icon: Search, color: '#3b82f6' },
  { number: 3, title: 'Document Prep', description: 'Prepare all required documents with expert guidance.', detail: 'SOPs, LORs, transcripts, and financial documents — we review every page.', icon: FileText, color: '#f59e0b' },
  { number: 4, title: 'Application', description: 'Submit complete applications to your selected universities.', detail: 'We ensure every application is polished and submitted before deadlines.', icon: Send, color: '#10b981' },
  { number: 5, title: 'Interview Prep', description: 'Prepare and ace your university interviews with mock sessions.', detail: 'One-on-one coaching with feedback from former admissions officers.', icon: Video, color: '#ef4444' },
  { number: 6, title: 'Visa Processing', description: 'Navigate the visa application process with full support.', detail: 'Document checklist, mock visa interviews, and embassy coordination.', icon: Shield, color: '#6366f1' },
  { number: 7, title: 'Departure', description: 'Final preparations and welcome to your new chapter abroad.', detail: 'Pre-departure briefing, accommodation help, and airport pickup coordination.', icon: Plane, color: '#C41E3A' },
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
  const cardH = isMobile ? 150 : 176
  const descMaxH = isMobile ? 54 : 60
  const nodeR = isMobile ? 14 : 17
  const dotR = isMobile ? 4.5 : 5.5
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
          <stop offset="0%" stopColor="#C41E3A" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id={`traveling-grad-${prefix}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C41E3A" stopOpacity="0" />
          <stop offset="15%" stopColor="#C41E3A" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#C41E3A" stopOpacity="1" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="1" />
        </linearGradient>
        <filter id={`glow-${prefix}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dashed background route */}
      <path d={pathD} fill="none" stroke="#e5e7eb" strokeWidth={5} strokeDasharray="12 7" strokeLinecap="round" strokeLinejoin="round" />

      {/* Animated progress route base */}
      <path d={pathD} fill="none" stroke={`url(#grad-${prefix})`} strokeWidth={isMobile ? 3 : 4} strokeLinecap="round" strokeLinejoin="round" style={dashStyle} />

      {/* Animated progress route bold */}
      <path d={pathD} fill="none" stroke="#111827" strokeWidth={isMobile ? 6 : 8} strokeLinecap="round" strokeLinejoin="round" style={dashStyle} />

      {/* Crimson glow overlay */}
      <path d={pathD} fill="none" stroke={`url(#traveling-grad-${prefix})`} strokeWidth={isMobile ? 9 : 11} strokeLinecap="round" strokeLinejoin="round" style={dashStyle} filter={`url(#glow-${prefix})`} />

      {/* Connector lines + cards */}
      {waypoints.map((point, idx) => {
        const step = steps[idx]
        const isActive = activeStep === step.number
        const isPast = step.number < activeStep
        const cardX = point.x - cardW / 2
        const cardY = point.y + (isMobile ? 28 : 38)
        return (
          <g key={step.number}>
            {/* Connector line */}
            <line
              x1={point.x} y1={point.y + (isActive ? nodeR + 2 : nodeR)}
              x2={point.x} y2={cardY}
              stroke={isPast ? `${step.color}40` : isActive ? step.color : '#e5e7eb'}
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray={isActive ? 'none' : '4 3'}
              style={{ transition: 'stroke 0.4s ease, stroke-width 0.4s ease' }}
            />
            {/* Connector dot */}
            <circle
              cx={point.x} cy={cardY} r={isActive ? 3.5 : 2}
              fill={isActive ? step.color : isPast ? `${step.color}60` : '#d1d5db'}
              style={{ transition: 'all 0.4s ease' }}
            />

            <foreignObject
              x={cardX} y={cardY + 4}
              width={cardW} height={cardH}
              style={{ pointerEvents: 'all', overflow: 'visible' }}
            >
                <div
                onClick={() => onStepClick(step.number)}
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: 12,
                  border: isActive ? `1.5px solid ${step.color}40` : isPast ? `1px solid ${step.color}15` : '1px solid #f3f4f6',
                  background: isActive
                    ? `linear-gradient(135deg, ${step.color}0f, white 60%)`
                    : isPast
                      ? `linear-gradient(135deg, ${step.color}05, white)`
                      : 'white',
                  boxShadow: isActive
                    ? `0 8px 28px ${step.color}18, 0 2px 8px rgba(0,0,0,0.06)`
                    : isPast
                      ? `0 2px 8px ${step.color}05, 0 1px 3px rgba(0,0,0,0.03)`
                      : '0 1px 3px rgba(0,0,0,0.04)',
                  opacity: isActive ? 1 : 0.8,
                  padding: isMobile ? '10px 10px 12px' : '14px 13px 16px',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                {/* Accent bar */}
                <div style={{
                  height: 3, borderRadius: 2,
                  background: isActive
                    ? `linear-gradient(to right, ${step.color}, ${step.color}40)`
                    : isPast ? `${step.color}40` : '#e5e7eb',
                  marginBottom: isMobile ? 7 : 9,
                  transition: 'background 0.4s ease',
                }} />
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <div style={{
                    width: isMobile ? 24 : 26, height: isMobile ? 24 : 26, borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isActive ? `${step.color}1a` : isPast ? `${step.color}0d` : '#f9fafb',
                    flexShrink: 0,
                    transition: 'background-color 0.4s ease',
                  }}>
                    <step.icon size={isMobile ? 11 : 12} color={isActive ? step.color : isPast ? `${step.color}80` : '#c4c8d0'} />
                  </div>
                  <span style={{
                    fontSize: isMobile ? 8 : 9, fontWeight: 800,
                    textTransform: 'uppercase' as const, letterSpacing: '0.09em',
                    color: isActive ? step.color : isPast ? `${step.color}70` : '#b0b5c0',
                    transition: 'color 0.4s ease',
                  }}>
                    Stop {step.number}
                  </span>
                </div>
                {/* Title */}
                <h4 style={{
                  fontSize: isMobile ? 11.5 : 13, fontWeight: 700, lineHeight: 1.3,
                  color: isActive ? '#0f172a' : isPast ? '#374151' : '#9ca3af',
                  margin: 0,
                  transition: 'color 0.4s ease',
                }}>
                  {step.title}
                </h4>
                {/* Detail */}
                <div
                  style={{
                    maxHeight: isActive ? descMaxH : 0,
                    opacity: isActive ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.32s ease',
                  }}
                >
                  <p style={{
                    fontSize: isMobile ? 10 : 11, lineHeight: 1.5, color: '#4b5563',
                    marginTop: 5, marginBottom: 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(-4px)',
                    transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}>
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
        const nextIsActive = activeStep === step.number + 1
        return (
          <g key={`node-${step.number}`}>
            {/* Outer pulse ring */}
            {isActive && (
              <>
                <circle
                  cx={point.x} cy={point.y} r={nodeR + 5}
                  fill="none" stroke={step.color} strokeWidth={2} strokeOpacity={0.2}
                  style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
                />
                <circle
                  cx={point.x} cy={point.y} r={nodeR + 10}
                  fill="none" stroke={step.color} strokeWidth={1} strokeOpacity={0.1}
                  style={{ animation: 'pulse-ring 2s ease-in-out 0.4s infinite' }}
                />
              </>
            )}
            {/* Upcoming pulse for next stop */}
            {nextIsActive && (
              <circle
                cx={point.x} cy={point.y} r={nodeR + 2}
                fill="none" stroke={step.color} strokeWidth={1.5} strokeOpacity={0.15}
                style={{ animation: 'pulse-ring 2.5s ease-in-out 1s infinite' }}
              />
            )}
            {/* Main node circle */}
            <circle
              cx={point.x} cy={point.y}
              r={isActive ? nodeR : isPast ? nodeR - 1.5 : nodeR - 2.5}
              fill="white"
              stroke={isActive ? step.color : isPast ? `${step.color}50` : '#d4d4d8'}
              strokeWidth={isActive ? 2.5 : 2}
              style={{ cursor: 'pointer', transition: 'all 0.35s ease' }}
              onClick={() => onStepClick(step.number)}
            />
            {/* Inner dot */}
            <circle
              cx={point.x} cy={point.y}
              r={isActive ? dotR + 1 : isPast ? dotR : dotR - 1}
              fill={isActive ? step.color : isPast ? `${step.color}80` : '#d4d4d8'}
              style={{ pointerEvents: 'none', transition: 'all 0.35s ease' }}
            />
            {/* Number text */}
              <text
                  x={point.x} y={point.y + 0.5}
                  textAnchor="middle" dominantBaseline="central"
                  fill="white" fontSize={isMobile ? 10 : 11} fontWeight={800}
                  style={{ pointerEvents: 'none', fontFamily: "'Inter', sans-serif" }}
                >
              {step.number}
            </text>
            {/* Hover hit area */}
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

      {/* Airplane */}
      <g
        style={{
          transform: `translate(${wp.x}px, ${wp.y}px) rotate(${angleDeg}deg)`,
          transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {/* Glow behind airplane */}
        <circle cx={0} cy={0} r={isMobile ? 20 : 24} fill="#C41E3A" opacity={0.06} style={{ animation: 'airplane-glow 1.5s ease-in-out infinite' }} />
        {/* Main circle */}
        <circle cx={0} cy={0} r={isMobile ? 12 : 15} fill="white" stroke="#C41E3A" strokeWidth={2.5} style={{ transition: 'r 0.4s ease' }} />
        {/* Inner icon */}
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
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes soft-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
      <section
        ref={sectionRef}
        className="relative overflow-hidden px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
        style={{
          background: 'linear-gradient(175deg, #fefefe 0%, #F5F6F9 35%, #f0f2f7 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Top-right warm glow */}
          <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-rose-100/20 blur-3xl" />
          {/* Bottom-left cool glow */}
          <div className="absolute -bottom-32 -left-20 h-[450px] w-[450px] rounded-full bg-blue-50/20 blur-3xl" />
          {/* Center subtle amber glow */}
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50/15 blur-3xl" />

          {/* Faint dot matrix */}
          <div
            className="absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage: 'radial-gradient(circle, #101B3D 0.6px, transparent 0.6px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Compass rose watermark — centered */}
          <svg
            className="absolute left-1/2 top-1/2 h-full w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.035]"
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="#101B3D" strokeWidth="0.8">
              {/* Outer ring 1 */}
              <circle cx="300" cy="300" r="280" />
              {/* Outer ring 2 */}
              <circle cx="300" cy="300" r="250" strokeDasharray="4 8" />
              {/* Inner ring */}
              <circle cx="300" cy="300" r="180" />
              {/* Tick marks */}
              {Array.from({ length: 72 }, (_, i) => {
                const angle = (i * 5 * Math.PI) / 180
                const r1 = i % 3 === 0 ? 240 : 248
                const r2 = 256
                const x1 = 300 + r1 * Math.sin(angle)
                const y1 = 300 - r1 * Math.cos(angle)
                const x2 = 300 + r2 * Math.sin(angle)
                const y2 = 300 - r2 * Math.cos(angle)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
              })}
              {/* N-S-E-W compass lines */}
              <line x1="300" y1="20" x2="300" y2="580" strokeWidth="1.2" />
              <line x1="20" y1="300" x2="580" y2="300" strokeWidth="1.2" />
              {/* Diagonal compass lines */}
              <line x1="102" y1="102" x2="498" y2="498" strokeWidth="0.6" />
              <line x1="498" y1="102" x2="102" y2="498" strokeWidth="0.6" />
            </g>
            {/* Cardinal dots */}
            <circle cx="300" cy="45" r="4" fill="#101B3D" opacity="0.5" />
            <circle cx="300" cy="555" r="4" fill="#101B3D" opacity="0.5" />
            <circle cx="45" cy="300" r="4" fill="#101B3D" opacity="0.5" />
            <circle cx="555" cy="300" r="4" fill="#101B3D" opacity="0.5" />
            {/* Center dot */}
            <circle cx="300" cy="300" r="6" fill="#C41E3A" opacity="0.3" />
            <circle cx="300" cy="300" r="3" fill="#101B3D" opacity="0.4" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-14 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 shadow-sm backdrop-blur-sm">
              <Plane size={14} className="text-[#C41E3A]" />
              Your Flight Path
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Application <span className="text-[#C41E3A]">roadmap</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400">
              Follow the flight from your first consultation to departure day.
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

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-gray-200/80 bg-white px-8 py-6 shadow-[0_4px_24px_rgba(16,27,61,0.06)] sm:flex-row sm:gap-6 backdrop-blur-sm">
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">Ready to start your journey?</p>
                <p className="text-xs text-gray-400">Average timeline: 3–4 months to departure</p>
              </div>
              <a
                href="/register"
                className="group inline-flex h-10 items-center gap-2 rounded-full bg-[#C41E3A] px-5 text-sm font-bold text-white shadow-[0_2px_12px_rgba(196,30,58,0.25)] transition-all hover:bg-[#A01830] hover:shadow-[0_4px_20px_rgba(196,30,58,0.35)]"
              >
                Board Now
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
