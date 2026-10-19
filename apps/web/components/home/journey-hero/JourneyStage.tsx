'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import Link from 'next/link'
import * as React from 'react'
import { JourneyEngine, type Phase } from './engine'
import styles from './journey-hero.module.css'
import { CITY_TO_PROVINCE_ID, PROVINCE_GROUPS } from './korea-provinces'
import type { JourneyConfig, JourneyController } from './types'
import { DESIGN_W, STAGE_ASPECT } from './view'

interface Props {
  config: JourneyConfig
  controllerRef?:
    | React.MutableRefObject<JourneyController | null>
    | ((c: JourneyController | null) => void)
  className?: string
}

function setRef<T>(ref: Props['controllerRef'], v: T | null) {
  if (!ref) return
  if (typeof ref === 'function') (ref as (v: T | null) => void)(v)
  else (ref as React.MutableRefObject<T | null>).current = v
}

export function JourneyStage({ config, controllerRef, className }: Props) {
  const cfg = config
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const engineRef = React.useRef<JourneyEngine | null>(null)
  const [W, setW] = React.useState(DESIGN_W)
  const [phase, setPhase] = React.useState<Phase>('intro')
  const [hoveredProvince, setHoveredProvince] = React.useState<number | null>(null)
  const [hoveredCity, setHoveredCity] = React.useState<number | null>(null)
  const reduced = useReducedMotion()
  const steps = cfg.steps
  const t = cfg.theme

  /* ---- pointer tilt (springs) ---- */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotY = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.6 })
  const rotX = useSpring(my, { stiffness: 120, damping: 18, mass: 0.6 })

  /* ---- engine lifecycle ---- */
  React.useEffect(() => {
    const root = rootRef.current!
    const canvas = canvasRef.current!
    let cancelled = false
    let ro: ResizeObserver | undefined
    let io: IntersectionObserver | undefined

    ;(async () => {
      const { GEO } = await import('./geo-data')
      if (cancelled) return
      const engine = new JourneyEngine({
        root,
        canvas,
        config: cfg,
        geo: GEO,
        onPhase: setPhase,
        reducedMotion: !!reduced,
      })
      engineRef.current = engine

      const measure = () => {
        const r = root.getBoundingClientRect()
        const w = root.clientWidth || r.width
        setW(w)
        engine.setSize(w, w / STAGE_ASPECT, Math.min(window.devicePixelRatio || 1, 2))
      }
      measure()
      ro = new ResizeObserver(measure)
      ro.observe(root)

      io = new IntersectionObserver(
        (es) => {
          if (es.some((e) => e.isIntersecting)) engine.start()
        },
        { threshold: 0.25 }
      )
      io.observe(root)

      const base = engine.controller()
      setRef(controllerRef, {
        ...base,
        replay: () => {
          setHoveredProvince(null)
          setHoveredCity(null)
          engine.setHover(null, null)
          base.replay()
        },
        showCity: (id: string) => {
          const i = cfg.cities.findIndex((c) => c.id === id)
          if (i >= 0) {
            const pId = CITY_TO_PROVINCE_ID[id] ?? null
            setHoveredProvince(pId)
            setHoveredCity(i)
            engine.setHover(pId, i)
          }
        },
      } as JourneyController)
    })()

    return () => {
      cancelled = true
      ro?.disconnect()
      io?.disconnect()
      engineRef.current?.destroy()
      engineRef.current = null
      setRef(controllerRef, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg, reduced])

  // re-read colors if the theme changes
  React.useEffect(() => {
    engineRef.current?.readTheme()
  }, [t])

  const u = W / DESIGN_W
  const interactive = phase === 'explore'

  /* ---- pointer interactions ---- */
  const onMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect()
    const x = e.clientX - r.left,
      y = e.clientY - r.top
    engineRef.current?.setPointer(x, y)
    if (cfg.motion.tilt && !reduced) {
      mx.set((x / r.width - 0.5) * 6)
      my.set((0.5 - y / r.height) * 5)
    }

    // In explore phase, detect exact province or marker hover
    if (interactive) {
      if ((e.target as HTMLElement)?.closest?.(`.${styles.smallCityCard}`)) {
        return
      }

      const hit = engineRef.current?.getHoverAt(x, y) ?? { provinceId: null, cityIndex: null }
      if (hit.provinceId !== hoveredProvince || hit.cityIndex !== hoveredCity) {
        setHoveredProvince(hit.provinceId)
        setHoveredCity(hit.cityIndex)
        engineRef.current?.setHover(hit.provinceId, hit.cityIndex)
      }
    }
  }

  const onLeave = () => {
    engineRef.current?.setPointer(null)
    mx.set(0)
    my.set(0)
    setHoveredProvince(null)
    setHoveredCity(null)
    engineRef.current?.setHover(null, null)
  }

  const cssVars = {
    '--u': `${u}px`,
    '--jh-map': t.map, // Endow Crimson Theme Red (#C41E3A)
    '--jh-map-muted': t.mapMuted,
    '--jh-ocean': t.ocean,
    '--jh-disc-0': t.disc[0],
    '--jh-disc-1': t.disc[1],
    '--jh-lime': t.lime,
    '--jh-ink': t.ink,
    '--jh-accent': t.accent,
  } as React.CSSProperties

  return (
    <div
      ref={rootRef}
      className={`${styles.stage} ${className ?? ''}`}
      style={cssVars}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={(e) => {
        if ((e.target as HTMLElement)?.closest?.(`.${styles.smallCityCard}`)) return
        if ((e.target as HTMLElement)?.closest?.(`.${styles.replay}`)) return
        if (interactive && hoveredCity !== null && cfg.cities[hoveredCity]?.href) {
          window.location.assign(cfg.cities[hoveredCity].href!)
        }
      }}
      data-hovered={hoveredCity !== null}
      data-jh-stage
    >
      <motion.div className={styles.tilt} style={{ rotateX: rotX, rotateY: rotY }}>
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* origin pin & pill (Dhaka) */}
        <div className={`${styles.abs} ${styles.pin}`} data-jh="pin-o" style={{ opacity: 0 }} />
        <div className={`${styles.abs} ${styles.pill}`} data-jh="pill-o" style={{ opacity: 0 }}>
          <span className={styles.pillText}>{cfg.origin.label}</span>
        </div>

        {/* destination pin & pill (South Korea) */}
        <div className={`${styles.abs} ${styles.pin}`} data-jh="pin-d" style={{ opacity: 0 }} />
        <div
          className={`${styles.abs} ${styles.pill} ${styles.pillBadge}`}
          data-jh="pill-d"
          style={{ opacity: 0 }}
        >
          <span className={styles.badge}>{cfg.destination.glyph ?? 'KR'}</span>
          <span className={styles.pillText}>{cfg.destination.label}</span>
        </div>

        {/* intermediate milestones along the flight journey */}
        {steps.map((s, i) => (
          <React.Fragment key={s.id ?? i}>
            <div
              className={`${styles.abs} ${styles.node}`}
              data-jh={`node-${i}`}
              style={{
                opacity: 0,
                color: t.accent,
                background: '#ffffff',
              }}
            >
              {i + 1}
            </div>
            <div
              className={`${styles.abs} ${styles.label}`}
              data-jh={`label-${i}`}
              style={{ opacity: 0 }}
            >
              {s.label}
            </div>
          </React.Fragment>
        ))}

        {/* airplane icon */}
        <div className={`${styles.abs} ${styles.plane}`} data-jh="plane" style={{ opacity: 0 }}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"
              fill={t.accent}
              stroke="#ffffff"
              strokeWidth="1.4"
              strokeLinejoin="round"
              paintOrder="stroke"
            />
          </svg>
        </div>

        {/* Initial Division / Province Labels visible across South Korea divisions */}
        <div
          className={styles.provinceLabelsLayer}
          data-active={interactive}
          data-hidden={hoveredProvince !== null}
          aria-hidden={!interactive || hoveredProvince !== null}
        >
          {PROVINCE_GROUPS.map((pg) => {
            const words = pg.label.split(' ')
            return (
              <div key={pg.id} data-jh-province={pg.id} className={styles.provinceLabel}>
                <span className={styles.provinceLabelText}>
                  {words.map((w, idx) => (
                    <span key={idx} className={styles.provinceWord}>
                      {w}
                    </span>
                  ))}
                </span>
              </div>
            )
          })}
        </div>

        {/* Explore Layer: City Markers visible when their parent division is hovered */}
        <div
          className={styles.cities}
          data-active={interactive}
          data-hovered={hoveredProvince !== null}
          aria-hidden={!interactive}
        >
          {cfg.cities.map((c, i) => {
            const provId = CITY_TO_PROVINCE_ID[c.id]
            const isBelongingToHovered = hoveredProvince !== null && provId === hoveredProvince
            const isSpecificHoveredCity = hoveredCity === i

            return (
              <button
                key={c.id}
                type="button"
                tabIndex={isBelongingToHovered ? 0 : -1}
                aria-label={c.name}
                data-jh-city={c.id}
                data-visible={isBelongingToHovered}
                data-on={isSpecificHoveredCity}
                className={`${styles.abs} ${styles.marker}`}
                onPointerEnter={() => {
                  setHoveredProvince(provId)
                  setHoveredCity(i)
                  engineRef.current?.setHover(provId, i)
                }}
                onFocus={() => {
                  setHoveredProvince(provId)
                  setHoveredCity(i)
                  engineRef.current?.setHover(provId, i)
                }}
                onBlur={() => {
                  setHoveredProvince(null)
                  setHoveredCity(null)
                  engineRef.current?.setHover(null, null)
                }}
                onClick={() => {
                  if (c.href) window.location.assign(c.href)
                }}
              >
                <span className={styles.markerDot} />
                {isSpecificHoveredCity && <span className={styles.markerPulse} />}
                <span className={styles.markerNameLabel}>{c.name}</span>
              </button>
            )
          })}
        </div>

        {/* Right-Side Small City Details Card (Outside South Korea map) */}
        <AnimatePresence>
          {interactive && hoveredCity !== null && cfg.cities[hoveredCity] && (
            <motion.div
              key={cfg.cities[hoveredCity].id}
              className={styles.smallCityCard}
              initial={{ opacity: 0, x: 12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onPointerEnter={() => {
                const pId = CITY_TO_PROVINCE_ID[cfg.cities[hoveredCity].id] ?? null
                setHoveredProvince(pId)
                setHoveredCity(hoveredCity)
                engineRef.current?.setHover(pId, hoveredCity)
              }}
              onPointerLeave={() => {
                setHoveredProvince(null)
                setHoveredCity(null)
                engineRef.current?.setHover(null, null)
              }}
            >
              {cfg.cities[hoveredCity].image && (
                <div className={styles.smallCardMedia}>
                  <img
                    src={cfg.cities[hoveredCity].image}
                    alt={cfg.cities[hoveredCity].name}
                    className={styles.smallCardImg}
                  />
                  <div className={styles.smallCardOverlay} />
                  {cfg.cities[hoveredCity].rankBadge && (
                    <span className={styles.smallCardBadge}>
                      {cfg.cities[hoveredCity].rankBadge}
                    </span>
                  )}
                </div>
              )}

              <div className={styles.smallCardContent}>
                <div className={styles.smallCardRow}>
                  <div className={styles.smallCardTitle}>
                    <span className={styles.smallCardName}>{cfg.cities[hoveredCity].name}</span>
                    {cfg.cities[hoveredCity].native && (
                      <span className={styles.smallCardNative}>
                        {cfg.cities[hoveredCity].native}
                      </span>
                    )}
                  </div>
                  {cfg.cities[hoveredCity].visaRate && (
                    <span className={styles.smallCardVisa}>{cfg.cities[hoveredCity].visaRate}</span>
                  )}
                </div>

                {cfg.cities[hoveredCity].university && (
                  <p className={styles.smallCardUni}>{cfg.cities[hoveredCity].university}</p>
                )}

                <a
                  href={cfg.cities[hoveredCity].href || '/universities/country/south-korea'}
                  className={styles.smallCardLink}
                >
                  <span>Explore Universities</span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.smallCardArrow}
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </a>
              </div>
            </motion.div>
          )}

          {interactive && hoveredProvince !== null && hoveredCity === null && (
            <motion.div
              key={`prov-${hoveredProvince}`}
              className={styles.smallCityCard}
              initial={{ opacity: 0, x: 12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.smallCardContent}>
                <div className={styles.smallCardRow}>
                  <div className={styles.smallCardTitle}>
                    <span className={styles.smallCardName}>
                      {PROVINCE_GROUPS.find((p) => p.id === hoveredProvince)?.name}
                    </span>
                  </div>
                  <span className={styles.smallCardVisa}>Network</span>
                </div>
                <p className={styles.smallCardUni}>
                  Regional university partnership network expanding across South Korea.
                </p>
                <Link href="/universities/country/south-korea" className={styles.smallCardLink}>
                  <span>Explore All Universities</span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.smallCardArrow}
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Replay Button */}
        {cfg.motion.replayButton && (
          <button
            type="button"
            className={styles.replay}
            aria-label="Replay animation"
            onClick={() => {
              setHoveredCity(null)
              engineRef.current?.setHoveredCity(null)
              engineRef.current?.replay()
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path
                d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </motion.div>
    </div>
  )
}
