'use client'

import { useCallback, useEffect, useRef } from 'react'

type Spark = {
  x: number
  y: number
  angle: number
  startTime: number
}

type ClickSparkProps = {
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
  easing?: 'linear' | 'ease-in' | 'ease-in-out' | 'ease-out'
  extraScale?: number
}

export default function ClickSpark({
  sparkColor = '#AD0819',
  sparkSize = 12,
  sparkRadius = 24,
  sparkCount = 8,
  duration = 420,
  easing = 'ease-out',
  extraScale = 1,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparksRef = useRef<Spark[]>([])
  const animationIdRef = useRef<number | null>(null)
  const reducedMotionRef = useRef(false)

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t
        case 'ease-in':
          return t * t
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        default:
          return t * (2 - t)
      }
    },
    [easing]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      const ctx = canvas.getContext('2d')
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches
    }

    handleMotionPreference()
    mediaQuery.addEventListener('change', handleMotionPreference)

    return () => {
      mediaQuery.removeEventListener('change', handleMotionPreference)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) return false

        const progress = elapsed / duration
        const eased = easeFunc(progress)
        const distance = eased * sparkRadius * extraScale
        const lineLength = sparkSize * (1 - eased)

        const x1 = spark.x + distance * Math.cos(spark.angle)
        const y1 = spark.y + distance * Math.sin(spark.angle)
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)

        ctx.strokeStyle = sparkColor
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        return true
      })

      if (sparksRef.current.length > 0) {
        animationIdRef.current = requestAnimationFrame(draw)
      } else {
        animationIdRef.current = null
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (reducedMotionRef.current) return

      const now = performance.now()
      const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
        x: event.clientX,
        y: event.clientY,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }))

      sparksRef.current.push(...newSparks)

      if (animationIdRef.current === null) {
        animationIdRef.current = requestAnimationFrame(draw)
      }
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)

      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [duration, easeFunc, extraScale, sparkColor, sparkCount, sparkRadius, sparkSize])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  )
}
