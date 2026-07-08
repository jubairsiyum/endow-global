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
  { x: 250, y: 60 }, { x: 120, y: 180 }, { x: 340, y: 300 },
  { x: 140, y: 420 }, { x: 320, y: 540 }, { x: 130, y: 660 }, { x: 250, y: 780 },
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

const FlightPathScene = memo(function FlightPathScene({ waypoints, viewBox, activeStep, onStepClick, isMobile }: FlightPathProps) {
  const pathD = buildPath(waypoints)
  const progress = activeStep / steps.length

  const cardW = isMobile ? 135 : 140
  const cardH = isMobile ? 100 : 120
  const nodeR = isMobile ? 13 : 16
  const dotR = isMobile ? 3.5 : 5
  const prefix = isMobile ? 'm' : 'd'

  const wp = waypoints[Math.min(activeStep - 1, waypoints.length - 1)]
  const nextWp = waypoints[Math.min(activeStep, waypoints.length - 1)]
  const angleDeg = activeStep < steps.length
    ? Math.atan2(nextWp.y - wp.y, nextWp.x - wp.x) * (180 / Math.PI)
    : 0

  return (
    <svg viewBox={viewBox} className="w-full" style={{ height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${prefix}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C41E3A" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>

      {/* Dashed background route */}
      <path d={pathD} fill="none" stroke="#e5e7eb" strokeWidth={5} strokeDasharray="12 7" strokeLinecap="round" />

      {/* Animated progress route */}
      <path
        d={pathD}
        fill="none"
        stroke="#1f2937"
        strokeWidth={isMobile ? 6 : 7}
        strokeLinecap="round"
        style={{
          strokeDasharray: 2000,
          strokeDashoffset: 2000 - (2000 * progress),
          transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      />

      {/* Crimson glow — simplified, no filter */}
      <path
        d={pathD}
        fill="none"
        stroke={`url(#grad-${prefix})`}
        strokeWidth={isMobile ? 8 : 10}
        strokeLinecap="round"
        strokeOpacity={0.18}
        style={{
          strokeDasharray: 2000,
          strokeDashoffset: 2000 - (2000 * progress),
          transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      />

      {/* Connector lines + cards */}
      {waypoints.map((point, idx) => {
        const step = steps[idx]
        const isActive = activeStep === step.number
        const isPast = step.number < activeStep
        const cardX = point.x - cardW / 2
        const cardY = point.y + (isMobile ? 28 : 38)
        return (
          <g key={step.number}>
            <line
              x1={point.x} y1={point.y + (isActive ? nodeR + 2 : nodeR)}
              x2={point.x} y2={cardY}
              stroke={isActive ? `${step.color}40` : '#e5e7eb'}
              strokeWidth={1}
              strokeDasharray={isActive ? 'none' : '3 2'}
            />
            <circle cx={point.x} cy={cardY} r={2} fill={isActive ? step.color : '#d1d5db'} />

            <foreignObject
              x={cardX} y={cardY + 4}
              width={cardW} height={cardH}
              style={{ pointerEvents: 'all', overflow: 'visible' }}
            >
              <div
                onClick={() => onStepClick(step.number)}
                style={{
                  cursor: 'pointer',
                  height: '100%',
                  borderRadius: 10,
                  border: `1px solid ${isActive ? `${step.color}25` : '#f3f4f6'}`,
                  background: isActive ? `linear-gradient(135deg, ${step.color}08, white)` : 'white',
                  boxShadow: isActive ? `0 4px 20px ${step.color}12, 0 1px 4px rgba(0,0,0,0.04)` : '0 1px 3px rgba(0,0,0,0.03)',
                  padding: isMobile ? '8px 8px 6px' : '10px 10px 8px',
                  transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
                }}
              >
                <div style={{ height: 2, borderRadius: 1, background: isActive ? `linear-gradient(to right, ${step.color}, ${step.color}60)` : '#f3f4f6', marginBottom: isMobile ? 4 : 6 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                  <div style={{
                    width: isMobile ? 18 : 20, height: isMobile ? 18 : 20, borderRadius: 5,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isActive ? `${step.color}15` : '#f9fafb', flexShrink: 0,
                  }}>
                    <step.icon size={isMobile ? 9 : 10} color={isActive ? step.color : '#d1d5db'} />
                  </div>
                  <span style={{
                    fontSize: isMobile ? 7 : 8, fontWeight: 800,
                    textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                    color: isActive ? step.color : isPast ? `${step.color}70` : '#d1d5db',
                  }}>
                    Stop {step.number}
                  </span>
                </div>
                <h4 style={{
                  fontSize: isMobile ? 11 : 12, fontWeight: 700, lineHeight: 1.25,
                  color: isActive ? '#111827' : isPast ? '#6b7280' : '#9ca3af', margin: 0,
                }}>
                  {step.title}
                </h4>
                {isActive && (
                  <p style={{ fontSize: isMobile ? 9 : 10, lineHeight: 1.4, color: '#6b7280', marginTop: 3, marginBottom: 0 }}>
                    {step.description}
                  </p>
                )}
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
              <circle
                cx={point.x} cy={point.y} r={nodeR + 4}
                fill="none" stroke={step.color} strokeWidth={1.5} strokeOpacity={0.25}
                style={{
                  animation: 'pulse-ring 2s ease-in-out infinite',
                }}
              />
            )}
            <circle
              cx={point.x} cy={point.y}
              r={isActive ? nodeR : nodeR - 3}
              fill="white"
              stroke={isActive ? step.color : isPast ? `${step.color}60` : '#e5e7eb'}
              strokeWidth={isActive ? 2.5 : 2}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onClick={() => onStepClick(step.number)}
            />
            <circle
              cx={point.x} cy={point.y}
              r={isActive ? dotR : dotR - 1.5}
              fill={isActive ? step.color : isPast ? `${step.color}80` : '#e5e7eb'}
              style={{ pointerEvents: 'none', transition: 'all 0.3s ease' }}
            />
            <text
              x={point.x} y={point.y + 0.5}
              textAnchor="middle" dominantBaseline="central"
              fill="white" fontSize={isMobile ? 5 : 6} fontWeight={800}
              style={{ pointerEvents: 'none' }}
            >
              {step.number}
            </text>
          </g>
        )
      })}

      {/* Airplane — CSS transition, no framer-motion */}
      <g
        style={{
          transform: `translate(${wp.x}px, ${wp.y}px) rotate(${angleDeg}deg)`,
          transition: 'transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
          transformOrigin: '0 0',
        }}
      >
        <circle cx={0} cy={0} r={isMobile ? 15 : 18} fill="#C41E3A" opacity={0.08} />
        <circle cx={0} cy={0} r={isMobile ? 11 : 14} fill="white" stroke="#C41E3A" strokeWidth={2.5} />
        <foreignObject x={-8} y={-8} width={16} height={16}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <PlaneSvg className="h-3.5 w-3.5 text-[#C41E3A]" />
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
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !autoPlaying || !isInView) return
    const id = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length) { setAutoPlaying(false); return prev }
        return prev + 1
      })
    }, 2000)
    return () => clearInterval(id)
  }, [autoPlaying, isInView, prefersReducedMotion])

  const handleStepClick = useCallback((num: number) => {
    setAutoPlaying(false)
    setActiveStep((prev) => (prev === num ? 0 : num))
  }, [])

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.08; transform: scale(1.2); }
        }
      `}</style>
      <section ref={sectionRef} className="relative bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle, #000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <Plane size={13} />
              Your Flight Path
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
              Application <span className="text-[#C41E3A]">roadmap</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-400">
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
                viewBox="0 0 500 860"
                activeStep={activeStep}
                onStepClick={handleStepClick}
                isMobile={true}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white px-8 py-6 shadow-[0_1px_6px_rgba(0,0,0,0.03)] sm:flex-row sm:gap-6">
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">Ready to start your journey?</p>
                <p className="text-xs text-gray-400">Average timeline: 3–4 months to departure</p>
              </div>
              <a
                href="/register"
                className="group inline-flex h-10 items-center gap-2 rounded-full bg-[#C41E3A] px-5 text-sm font-bold text-white shadow-[0_2px_12px_rgba(196,30,58,0.25)] transition-all hover:bg-[#A01830] hover:shadow-[0_4px_20px_rgba(196,30,58,0.3)]"
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
