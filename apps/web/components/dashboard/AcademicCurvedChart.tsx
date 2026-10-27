'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react'

interface Props {
  profile?: {
    gpa?: number | string | null
    sscResult?: number | string | null
    sscYear?: number | string | null
    hscResult?: number | string | null
    hscYear?: number | string | null
    bachelorsResult?: number | string | null
    bachelorsYear?: number | string | null
    mastersResult?: number | string | null
    mastersYear?: number | string | null
    ieltsScore?: number | string | null
    toeflScore?: number | string | null
    satScore?: number | string | null
    greScore?: number | string | null
    topikLevel?: string | null
    highestEducation?: string | null
    completionPercent?: number | null
  } | null
}

interface MetricPoint {
  id: string
  label: string
  category: 'all' | 'academic' | 'language'
  myRaw: string
  reqRaw: string
  myPct: number
  reqPct: number
  statusText: string
  diffPct: number
}

// Generate smooth cubic bezier SVG path from coordinates
function getCurvedPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2

    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return path
}

// Format stoppage text into primary and secondary parts so they stack cleanly and never overlap
function parseMetricLabel(label: string): { primary: string; secondary?: string } {
  const parenMatch = label.match(/^(.*?)\s*(\(.*?\))$/)
  if (parenMatch) {
    return {
      primary: parenMatch[1].trim(),
      secondary: parenMatch[2].trim(),
    }
  }

  const commonSuffixes = ['GPA', 'CGPA', 'Score', 'Band', 'Readiness', 'Level', 'Result']
  for (const suf of commonSuffixes) {
    if (label.endsWith(` ${suf}`)) {
      return {
        primary: label.slice(0, -(suf.length + 1)).trim(),
        secondary: suf,
      }
    }
  }

  if (label === 'Readiness') {
    return { primary: 'Profile', secondary: 'Readiness' }
  }

  if (label.length > 12 && label.includes(' ')) {
    const lastSpace = label.lastIndexOf(' ')
    return {
      primary: label.slice(0, lastSpace).trim(),
      secondary: label.slice(lastSpace + 1).trim(),
    }
  }

  return { primary: label }
}

export function AcademicCurvedChart({ profile }: Props) {
  const chartId = useId()
  const [activeTab, setActiveTab] = useState<'all' | 'academic' | 'language'>('all')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // 1. Strictly extract real academic and language scores from database records
  const rawGpa =
    profile?.gpa != null && String(profile.gpa).trim() !== '' ? Number(profile.gpa) : null
  const rawSsc =
    profile?.sscResult != null && String(profile.sscResult).trim() !== ''
      ? Number(profile.sscResult)
      : null
  const rawHsc =
    profile?.hscResult != null && String(profile.hscResult).trim() !== ''
      ? Number(profile.hscResult)
      : null
  const rawBsc =
    profile?.bachelorsResult != null && String(profile.bachelorsResult).trim() !== ''
      ? Number(profile.bachelorsResult)
      : null
  const rawMasters =
    profile?.mastersResult != null && String(profile.mastersResult).trim() !== ''
      ? Number(profile.mastersResult)
      : null
  const rawIelts =
    profile?.ieltsScore != null && String(profile.ieltsScore).trim() !== ''
      ? Number(profile.ieltsScore)
      : null
  const rawToefl =
    profile?.toeflScore != null && String(profile.toeflScore).trim() !== ''
      ? Number(profile.toeflScore)
      : null
  const rawSat =
    profile?.satScore != null && String(profile.satScore).trim() !== ''
      ? Number(profile.satScore)
      : null
  const rawGre =
    profile?.greScore != null && String(profile.greScore).trim() !== ''
      ? Number(profile.greScore)
      : null
  const rawTopik = profile?.topikLevel ? String(profile.topikLevel).trim() : null

  const hasSsc = rawSsc !== null && !isNaN(rawSsc) && rawSsc > 0
  const hasHsc = rawHsc !== null && !isNaN(rawHsc) && rawHsc > 0
  const hasBsc = rawBsc !== null && !isNaN(rawBsc) && rawBsc > 0
  const hasMasters = rawMasters !== null && !isNaN(rawMasters) && rawMasters > 0
  const hasGpa = rawGpa !== null && !isNaN(rawGpa) && rawGpa > 0
  const hasIelts = rawIelts !== null && !isNaN(rawIelts) && rawIelts > 0
  const hasToefl = rawToefl !== null && !isNaN(rawToefl) && rawToefl > 0
  const hasSat = rawSat !== null && !isNaN(rawSat) && rawSat > 0
  const hasGre = rawGre !== null && !isNaN(rawGre) && rawGre > 0
  const hasTopik = !!rawTopik && rawTopik !== 'None'

  const hasAnyAcademicData =
    hasSsc || hasHsc || hasBsc || hasMasters || hasGpa || hasIelts || hasToefl || hasSat || hasGre || hasTopik

  // 2. If student has NOT entered any academic scores in the database, show clean empty state
  if (!hasAnyAcademicData) {
    return (
      <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-[#12141c]">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Academic Eligibility
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Target university requirements vs. your verified profile credentials
          </p>
        </div>

        <div className="my-auto flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 px-4 text-center dark:border-slate-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <GraduationCap size={24} />
          </div>
          <h4 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
            No Academic Credentials Added Yet
          </h4>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            Add your GPA, SSC, HSC, Bachelor&apos;s results, or language test scores to visualize your admission eligibility curve.
          </p>
          <Link
            href="/dashboard/settings?tab=study"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-rose-700"
          >
            <span>Complete Academic Profile</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="border-t border-slate-100 pt-3 dark:border-slate-800/80">
          <Link
            href="/dashboard/settings?tab=study"
            className="flex items-center justify-between text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
          >
            <span>Set GPA &amp; academic test scores in settings</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    )
  }

  // 3. Build dynamic metrics for ALL academic and language results
  const allMetrics: MetricPoint[] = []

  // 3a. Secondary (SSC)
  if (hasSsc && rawSsc !== null) {
    const scale = 5.0
    const reqPct = 70 // 3.50 / 5.00
    const myPct = Math.min(Math.round((rawSsc / scale) * 100), 100)
    allMetrics.push({
      id: 'ssc',
      label: 'Secondary (SSC)',
      category: 'academic',
      myRaw: `${rawSsc.toFixed(2)} / ${scale.toFixed(2)}`,
      reqRaw: '3.50 / 5.00',
      myPct,
      reqPct,
      statusText: myPct >= reqPct ? 'Exceeds Minimum' : 'Near Minimum',
      diffPct: myPct - reqPct,
    })
  }

  // 3b. Higher Secondary (HSC)
  if (hasHsc && rawHsc !== null) {
    const scale = 5.0
    const reqPct = 70 // 3.50 / 5.00
    const myPct = Math.min(Math.round((rawHsc / scale) * 100), 100)
    allMetrics.push({
      id: 'hsc',
      label: 'Higher Sec (HSC)',
      category: 'academic',
      myRaw: `${rawHsc.toFixed(2)} / ${scale.toFixed(2)}`,
      reqRaw: '3.50 / 5.00',
      myPct,
      reqPct,
      statusText: myPct >= reqPct ? 'Exceeds Minimum' : 'Near Minimum',
      diffPct: myPct - reqPct,
    })
  }

  // 3c. Bachelor's Degree (BSc / BBA / BA)
  if (hasBsc && rawBsc !== null) {
    const scale = 4.0
    const reqPct = 75 // 3.00 / 4.00
    const myPct = Math.min(Math.round((rawBsc / scale) * 100), 100)
    allMetrics.push({
      id: 'bsc',
      label: "Bachelor's (BSc)",
      category: 'academic',
      myRaw: `${rawBsc.toFixed(2)} / ${scale.toFixed(2)}`,
      reqRaw: '3.00 / 4.00',
      myPct,
      reqPct,
      statusText: myPct >= reqPct ? 'Exceeds Minimum' : 'Near Minimum',
      diffPct: myPct - reqPct,
    })
  }

  // 3d. Master's Degree (MSc / MBA / MA)
  if (hasMasters && rawMasters !== null) {
    const scale = 4.0
    const reqPct = 81 // 3.25 / 4.00
    const myPct = Math.min(Math.round((rawMasters / scale) * 100), 100)
    allMetrics.push({
      id: 'masters',
      label: "Master's (MSc)",
      category: 'academic',
      myRaw: `${rawMasters.toFixed(2)} / ${scale.toFixed(2)}`,
      reqRaw: '3.25 / 4.00',
      myPct,
      reqPct,
      statusText: myPct >= reqPct ? 'Exceeds Minimum' : 'Near Minimum',
      diffPct: myPct - reqPct,
    })
  }

  // 3e. Overall / Cumulative GPA (if distinct from specific degrees, or if only GPA was entered)
  const gpaMatchesExistingDegree =
    (hasBsc && Math.abs(rawBsc! - rawGpa!) < 0.01) ||
    (hasHsc && Math.abs(rawHsc! - rawGpa!) < 0.01) ||
    (hasSsc && Math.abs(rawSsc! - rawGpa!) < 0.01) ||
    (hasMasters && Math.abs(rawMasters! - rawGpa!) < 0.01)

  if (hasGpa && (!gpaMatchesExistingDegree || (!hasSsc && !hasHsc && !hasBsc && !hasMasters))) {
    const isFiveScale = rawGpa > 4.0 || profile?.highestEducation === 'HIGH_SCHOOL'
    const scale = isFiveScale ? 5.0 : 4.0
    const reqPct = isFiveScale ? 70 : 75
    const myPct = Math.min(Math.round((rawGpa / scale) * 100), 100)
    allMetrics.push({
      id: 'gpa',
      label:
        !hasSsc && !hasHsc && !hasBsc && !hasMasters
          ? isFiveScale
            ? 'Secondary GPA'
            : "Bachelor's CGPA"
          : 'Cumulative GPA',
      category: 'academic',
      myRaw: `${rawGpa.toFixed(2)} / ${scale.toFixed(2)}`,
      reqRaw: isFiveScale ? '3.50 / 5.00' : '3.00 / 4.00',
      myPct,
      reqPct,
      statusText: myPct >= reqPct ? 'Exceeds Minimum' : 'Near Minimum',
      diffPct: myPct - reqPct,
    })
  }

  // 3f. Standardized Academic Tests: SAT
  if (hasSat && rawSat !== null) {
    const reqPct = 72 // 1150 / 1600
    const myPct = Math.min(Math.round((rawSat / 1600.0) * 100), 100)
    allMetrics.push({
      id: 'sat',
      label: 'SAT Score',
      category: 'academic',
      myRaw: `${Math.round(rawSat)} / 1600`,
      reqRaw: '1150 / 1600',
      myPct,
      reqPct,
      statusText: myPct >= reqPct ? 'Competitive' : 'Standard',
      diffPct: myPct - reqPct,
    })
  }

  // 3g. Standardized Academic Tests: GRE
  if (hasGre && rawGre !== null) {
    const reqPct = 88 // 300 / 340
    const myPct = Math.min(Math.round((rawGre / 340.0) * 100), 100)
    allMetrics.push({
      id: 'gre',
      label: 'GRE Score',
      category: 'academic',
      myRaw: `${Math.round(rawGre)} / 340`,
      reqRaw: '300 / 340',
      myPct,
      reqPct,
      statusText: myPct >= reqPct ? 'High Score' : 'Standard',
      diffPct: myPct - reqPct,
    })
  }

  // 3h. Language Tests: IELTS
  if (hasIelts && rawIelts !== null) {
    const reqPct = 72 // 6.5 / 9.0
    const myPct = Math.min(Math.round((rawIelts / 9.0) * 100), 100)
    allMetrics.push({
      id: 'ielts',
      label: 'IELTS Band',
      category: 'language',
      myRaw: `${rawIelts.toFixed(1)} / 9.0`,
      reqRaw: '6.5 / 9.0',
      myPct,
      reqPct,
      statusText: myPct >= reqPct ? 'C1 Proficient' : 'Standard',
      diffPct: myPct - reqPct,
    })
  }

  // 3i. Language Tests: TOEFL
  if (hasToefl && rawToefl !== null) {
    const reqPct = 71 // 85 / 120
    const myPct = Math.min(Math.round((rawToefl / 120.0) * 100), 100)
    allMetrics.push({
      id: 'toefl',
      label: 'TOEFL Score',
      category: 'language',
      myRaw: `${Math.round(rawToefl)} / 120`,
      reqRaw: '85 / 120',
      myPct,
      reqPct,
      statusText: myPct >= reqPct ? 'High Score' : 'Standard',
      diffPct: myPct - reqPct,
    })
  }

  // 3j. Language Tests: TOPIK
  if (hasTopik && rawTopik) {
    const match = rawTopik.match(/\d+/)
    const lvl = match ? Number(match[0]) : 3
    const myPct = Math.min(Math.round((lvl / 6.0) * 100), 100)
    allMetrics.push({
      id: 'topik',
      label: 'TOPIK (Korean)',
      category: 'language',
      myRaw: rawTopik.startsWith('Level') ? rawTopik : `Level ${rawTopik}`,
      reqRaw: 'Level 3 / 6',
      myPct,
      reqPct: 50,
      statusText: myPct >= 50 ? 'Eligible' : 'Elementary',
      diffPct: myPct - 50,
    })
  }

  // 3k. Profile Readiness (shown in "All" view)
  const completion = profile?.completionPercent ?? 0
  if (completion > 0) {
    allMetrics.push({
      id: 'readiness',
      label: 'Readiness',
      category: 'all',
      myRaw: `${completion}%`,
      reqRaw: '70%',
      myPct: completion,
      reqPct: 70,
      statusText: completion >= 70 ? 'High Eligibility' : 'In Progress',
      diffPct: completion - 70,
    })
  }

  const hasAcademic = allMetrics.some((m) => m.category === 'academic')
  const hasLanguage = allMetrics.some((m) => m.category === 'language')

  const metrics =
    activeTab === 'all'
      ? allMetrics
      : allMetrics.filter((m) => m.category === activeTab)

  // SVG dimensions - tall and spacious layout with prominent 0-100% axis
  const svgWidth = Math.max(760, metrics.length * 115)
  const svgHeight = 350
  const padLeft = 72
  const padRight = 55
  const padTop = 32
  const padBottom = 76

  const graphWidth = svgWidth - padLeft - padRight
  const graphHeight = svgHeight - padTop - padBottom

  const stepX = metrics.length > 1 ? graphWidth / (metrics.length - 1) : graphWidth / 2

  const myPoints = metrics.map((m, i) => ({
    x: metrics.length === 1 ? padLeft + graphWidth / 2 : padLeft + i * stepX,
    y: padTop + graphHeight - (m.myPct / 100) * graphHeight,
    metric: m,
  }))

  const reqPoints = metrics.map((m, i) => ({
    x: metrics.length === 1 ? padLeft + graphWidth / 2 : padLeft + i * stepX,
    y: padTop + graphHeight - (m.reqPct / 100) * graphHeight,
    metric: m,
  }))

  const myLinePath = getCurvedPath(myPoints)
  const reqLinePath = getCurvedPath(reqPoints)

  const myAreaPath =
    myPoints.length > 1
      ? `${myLinePath} L ${myPoints[myPoints.length - 1].x} ${padTop + graphHeight} L ${myPoints[0].x} ${padTop + graphHeight} Z`
      : ''

  const activePoint = hoveredIdx !== null ? myPoints[hoveredIdx] : null

  // Calculate real eligible percentage
  const eligibleCount = metrics.filter((m) => m.myPct >= m.reqPct).length
  const eligiblePct = metrics.length > 0 ? Math.round((eligibleCount / metrics.length) * 100) : 0

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:border-slate-800 dark:bg-[#12141c]">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Academic Eligibility
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Target university requirements vs. your verified profile credentials
          </p>
        </div>

        {/* Dynamic Filter Pills */}
        {(hasAcademic || hasLanguage) && (
          <div className="inline-flex rounded-xl border border-slate-200/80 bg-slate-100/80 p-0.5 dark:border-slate-700 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => {
                setActiveTab('all')
                setHoveredIdx(null)
              }}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-rose-600 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              All Metrics
            </button>
            {hasAcademic && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('academic')
                  setHoveredIdx(null)
                }}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  activeTab === 'academic'
                    ? 'bg-white text-rose-600 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Academic
              </button>
            )}
            {hasLanguage && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('language')
                  setHoveredIdx(null)
                }}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  activeTab === 'language'
                    ? 'bg-white text-rose-600 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Language
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Curved Line Chart Area - Centered in middle of card, wider and zero overlap */}
      <div className="relative my-auto flex flex-1 flex-col items-center justify-center py-2 sm:py-3 w-full overflow-x-auto sm:overflow-visible">
        <div
          className="relative mx-auto w-full max-w-full"
          style={{ minWidth: metrics.length >= 6 ? '640px' : '100%' }}
        >
          {/* Tooltip positioned relative to data point */}
          {activePoint && (() => {
            const xPct = (activePoint.x / svgWidth) * 100
            const yPct = (activePoint.y / svgHeight) * 100
            const isLeftEdge = xPct < 15
            const isRightEdge = xPct > 85
            const transformX = isLeftEdge ? '-15%' : isRightEdge ? '-85%' : '-50%'
            const arrowLeft = isLeftEdge ? '15%' : isRightEdge ? '85%' : '50%'

            return (
              <div
                className="pointer-events-none absolute z-30 rounded-xl bg-slate-900/95 px-3 py-2 text-white shadow-xl backdrop-blur-xs transition-all duration-150 dark:bg-white dark:text-slate-900 whitespace-nowrap"
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                  transform: `translate(${transformX}, -120%)`,
                }}
              >
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  <span className="text-rose-400">★</span>
                  <span>
                    {activePoint.metric.label}: {activePoint.metric.myRaw}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3.5 text-xs text-slate-300 dark:text-slate-600">
                  <span>Required: {activePoint.metric.reqRaw}</span>
                  <span
                    className={`font-bold ${
                      activePoint.metric.diffPct >= 0
                        ? 'text-emerald-400 dark:text-emerald-600'
                        : 'text-amber-400 dark:text-amber-600'
                    }`}
                  >
                    {activePoint.metric.diffPct >= 0
                      ? `+${activePoint.metric.diffPct}% Above`
                      : `${activePoint.metric.diffPct}% Below`}
                  </span>
                </div>
                <div
                  className="absolute top-full border-4 border-transparent border-t-slate-900 dark:border-t-white"
                  style={{ left: arrowLeft, transform: 'translateX(-50%)' }}
                />
              </div>
            )
          })()}

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[380px] select-none overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id={`grad-my-score-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E11D48" stopOpacity="0.25" />
                <stop offset="80%" stopColor="#E11D48" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
              </linearGradient>

              <filter id={`glow-${chartId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#E11D48" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Grid lines */}
            {[100, 75, 50, 25, 0].map((val) => {
              const y = padTop + graphHeight - (val / 100) * graphHeight
              return (
                <g key={val}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    className="text-slate-100 dark:text-slate-800/80"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 14}
                    y={y + 5}
                    textAnchor="end"
                    fontSize="15"
                    className="fill-slate-600 font-extrabold dark:fill-slate-300 select-none"
                  >
                    {val === 100 ? '100%' : val === 75 ? '75%' : val === 50 ? '50%' : val === 25 ? '25%' : '0%'}
                  </text>
                </g>
              )
            })}

            {/* Area Fill */}
            {myAreaPath && <path d={myAreaPath} fill={`url(#grad-my-score-${chartId})`} />}

            {/* Requirement Curve */}
            {reqPoints.length > 1 && (
              <path
                d={reqLinePath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeDasharray="5 4"
              />
            )}

            {/* My Score Curve */}
            {myPoints.length > 1 && (
              <path
                d={myLinePath}
                fill="none"
                stroke="#E11D48"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter={`url(#glow-${chartId})`}
              />
            )}

            {/* Vertical tracking line on hover - connects curve to stoppage tick */}
            {activePoint && (
              <line
                x1={activePoint.x}
                y1={padTop}
                x2={activePoint.x}
                y2={padTop + graphHeight + 9}
                stroke="#E11D48"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="opacity-80 pointer-events-none"
              />
            )}

            {/* Requirement Data Points */}
            {reqPoints.map((pt) => (
              <circle
                key={`req-pt-${pt.metric.id}`}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#FFFFFF"
                stroke="#10B981"
                strokeWidth="2"
              />
            ))}

            {/* My Score Data Points & Full Stoppage Hit Area */}
            {myPoints.map((pt, idx) => {
              const isHovered = hoveredIdx === idx
              const { primary, secondary } = parseMetricLabel(pt.metric.label)
              return (
                <g
                  key={`my-pt-${pt.metric.id}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Transparent hit area 1: Top circle area */}
                  <circle cx={pt.x} cy={pt.y} r="28" fill="transparent" />

                  {/* Transparent hit area 2: Full stoppage column down through text */}
                  <rect
                    x={pt.x - 52}
                    y={padTop}
                    width="104"
                    height={graphHeight + padBottom}
                    fill="transparent"
                  />

                  {/* Soft highlight pill behind stoppage text when hovered */}
                  {isHovered && (
                    <rect
                      x={pt.x - 52}
                      y={padTop + graphHeight + 8}
                      width="104"
                      height="54"
                      rx="8"
                      fill="#E11D48"
                      fillOpacity="0.08"
                      stroke="#E11D48"
                      strokeOpacity="0.25"
                      strokeWidth="1"
                      className="pointer-events-none"
                    />
                  )}

                  {/* Glowing halo on hover */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="14"
                      fill="#E11D48"
                      fillOpacity="0.22"
                    />
                  )}

                  {/* Data point circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? '7' : '5'}
                    fill="#FFFFFF"
                    stroke="#E11D48"
                    strokeWidth={isHovered ? '4' : '2.5'}
                  />

                  {/* Stoppage tick mark */}
                  <line
                    x1={pt.x}
                    y1={padTop + graphHeight}
                    x2={pt.x}
                    y2={padTop + graphHeight + (isHovered ? 9 : 7)}
                    stroke={isHovered ? '#E11D48' : '#CBD5E1'}
                    strokeWidth={isHovered ? '2.5' : '1.5'}
                    className="transition-colors dark:stroke-slate-700"
                  />

                  {/* Stoppage text labels (large, bold, and hover interactive) */}
                  <text
                    x={pt.x}
                    y={padTop + graphHeight + 26}
                    textAnchor="middle"
                    className="select-none transition-colors"
                  >
                    <tspan
                      x={pt.x}
                      dy="0"
                      fontSize="15"
                      className={`font-black tracking-tight transition-colors ${
                        isHovered
                          ? 'fill-rose-600 dark:fill-rose-400'
                          : 'fill-slate-800 dark:fill-slate-100'
                      }`}
                    >
                      {primary}
                    </tspan>
                    {secondary && (
                      <tspan
                        x={pt.x}
                        dy="19"
                        fontSize="12.5"
                        className={`font-bold transition-colors ${
                          isHovered
                            ? 'fill-rose-500 dark:fill-rose-300'
                            : 'fill-slate-500 dark:fill-slate-400'
                        }`}
                      >
                        {secondary}
                      </tspan>
                    )}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Bottom Legend & Eligibility Confirmation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600 dark:bg-rose-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              My Academic Score
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-emerald-500 bg-white dark:bg-slate-900" />
            <span>Min University Requirement</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
          <span>
            {eligiblePct >= 80
              ? 'Qualified for Partner Programs'
              : `${eligiblePct}% Criteria Met`}
          </span>
        </div>
      </div>
    </div>
  )
}
