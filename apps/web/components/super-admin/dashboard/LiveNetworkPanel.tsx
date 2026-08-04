'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Node {
  id: string
  label: string
  code: string
  type: 'branch' | 'university'
  x: number
  y: number
  volume: number // scales node size
  activeRoutes: number
  status: 'active' | 'inactive' | 'warning'
}

interface Arc {
  from: string
  to: string
  count: number
}

interface Props {
  nodes?: Node[]
  arcs?: Arc[]
  isLoading?: boolean
}


function nodeSize(volume: number): number {
  return Math.max(8, Math.min(28, 10 + volume * 0.18))
}

function nodeColor(type: 'branch' | 'university', status: string): string {
  if (status === 'warning') return '#F0625B'
  if (status === 'inactive') return '#8890A8'
  if (type === 'branch') return '#E8A33D'
  return '#4FD1A5'
}

function generateArcPath(
  x1: number, y1: number,
  x2: number, y2: number,
  curvature: number = 0.3
): string {
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.sqrt(dx * dx + dy * dy)
  const offset = dist * curvature
  const ax = midX - dy * (offset / dist)
  const ay = midY + dx * (offset / dist)
  return `M ${x1} ${y1} Q ${ax} ${ay} ${x2} ${y2}`
}

export function LiveNetworkPanel({ nodes = [], arcs = [], isLoading = false }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const resize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement!.getBoundingClientRect()
        setDimensions({ width: rect.width, height: Math.max(320, rect.width * 0.4) })
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const { width, height } = dimensions
  const padding = 40
  const mapW = width - padding * 2
  const mapH = height - padding * 2

  // Calculate node positions in pixel space
  const nodePositions = nodes.map((n) => ({
    ...n,
    px: padding + n.x * mapW,
    py: padding + n.y * mapH,
  }))

  const nodeMap = new Map(nodePositions.map((n) => [n.id, n]))

  const handleMouseEnter = (node: Node, e: React.MouseEvent) => {
    setHoveredNode(node)
    const rect = svgRef.current!.getBoundingClientRect()
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border"
      style={{ background: '#0E1220', borderColor: '#262C42' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-5 py-3"
        style={{ borderColor: '#262C42' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: '#4FD1A5',
                animation: reducedMotion ? 'none' : 'status-pulse 3s ease-in-out infinite',
              }}
            />
            <span
              className="text-[13px] font-semibold"
              style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Live Network
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px]" style={{ color: '#8890A8' }}>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: '#E8A33D' }} />
            Branch
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: '#4FD1A5' }} />
            University
          </div>
          <span style={{ color: '#8890A8' }}>{arcs.length} active routes</span>
        </div>
      </div>

      {nodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {isLoading ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} />
              <p className="mt-3 text-[12px]" style={{ color: '#8890A8' }}>Loading network data...</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(136,144,168,0.06)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8890A8" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <p className="mt-3 text-[13px] font-medium" style={{ color: '#8890A8' }}>No network data yet</p>
              <p className="mt-1 text-[11px]" style={{ color: 'rgba(136,144,168,0.6)' }}>Add branches and universities to see the live network map.</p>
            </>
          )}
        </div>
      ) : (
        /* SVG Map */
      <div className="relative">
        {/* Radar grid background */}
        <div className="sa-radar-grid absolute inset-0" />

        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="relative z-10"
          aria-label="Live network map showing branches and university connections"
        >
          {/* Arc paths */}
          {arcs.map((arc, i) => {
            const from = nodeMap.get(arc.from)
            const to = nodeMap.get(arc.to)
            if (!from || !to) return null

            const pathD = generateArcPath(from.px, from.py, to.px, to.py, 0.25)
            const opacity = Math.max(0.1, Math.min(0.6, arc.count * 0.15))

            return (
              <motion.path
                key={`${arc.from}-${arc.to}`}
                d={pathD}
                fill="none"
                stroke="#E8A33D"
                strokeWidth={Math.max(0.8, arc.count * 0.6)}
                strokeOpacity={opacity}
                strokeDasharray={reducedMotion ? undefined : '1000'}
                strokeDashoffset={reducedMotion ? undefined : '1000'}
                initial={reducedMotion ? undefined : { strokeDashoffset: 1000 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.8, delay: i * 0.03, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            )
          })}

          {/* Active pulse on arcs — small dots traveling along paths */}
          {!reducedMotion &&
            arcs.slice(0, 8).map((arc, i) => {
              const from = nodeMap.get(arc.from)
              const to = nodeMap.get(arc.to)
              if (!from || !to) return null

              return (
                <circle
                  key={`pulse-${i}`}
                  r={2}
                  fill="#E8A33D"
                  opacity={0.9}
                  filter="blur(0.5px)"
                >
                  <animateMotion
                    dur={`${3 + arc.count * 0.8}s`}
                    repeatCount="indefinite"
                    begin={`${i * 0.5}s`}
                    path={generateArcPath(from.px, from.py, to.px, to.py, 0.25)}
                  />
                </circle>
              )
            })}

          {/* Nodes */}
          {nodePositions.map((node) => {
            const size = nodeSize(node.volume)
            const color = nodeColor(node.type, node.status)
            const isHovered = hoveredNode?.id === node.id

            return (
              <g
                key={node.id}
                onMouseEnter={(e) => handleMouseEnter(node, e)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer glow ring */}
                <circle
                  cx={node.px}
                  cy={node.py}
                  r={size + 4}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeOpacity={isHovered ? 0.5 : 0.2}
                  style={{ transition: 'stroke-opacity 120ms, stroke-width 120ms' }}
                />

                {/* Node body */}
                <circle
                  cx={node.px}
                  cy={node.py}
                  r={size}
                  fill={color}
                  fillOpacity={isHovered ? 0.25 : 0.12}
                  stroke={color}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  strokeOpacity={isHovered ? 0.8 : 0.4}
                  style={{ transition: 'all 120ms' }}
                />

                {/* Inner dot */}
                <circle
                  cx={node.px}
                  cy={node.py}
                  r={Math.max(2, size * 0.25)}
                  fill={color}
                  fillOpacity={isHovered ? 1 : 0.7}
                  style={{ transition: 'fill-opacity 120ms' }}
                />

                {/* Label */}
                <text
                  x={node.px}
                  y={node.py + size + 14}
                  textAnchor="middle"
                  fill="#8890A8"
                  fontSize="10"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="500"
                  opacity={isHovered || size > 14 ? 1 : 0.5}
                  style={{ transition: 'opacity 120ms' }}
                >
                  {node.code}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none absolute z-20 rounded-lg border px-3 py-2 shadow-lg"
              style={{
                left: Math.min(tooltipPos.x + 12, width - 180),
                top: Math.max(8, tooltipPos.y - 40),
                background: '#161B2E',
                borderColor: '#262C42',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              <p
                className="text-[12px] font-semibold"
                style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {hoveredNode.label}
              </p>
              <div className="mt-1 flex items-center gap-3 text-[11px]" style={{ color: '#8890A8' }}>
                <span>
                  <span style={{ color: '#E8A33D', fontFamily: "'JetBrains Mono', monospace" }}>
                    {hoveredNode.activeRoutes}
                  </span>{' '}
                  active routes
                </span>
                <span>
                  Vol: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{hoveredNode.volume}</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}
    </div>
  )
}
