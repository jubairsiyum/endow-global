'use client'

import { useRef, useEffect } from 'react'

interface NoiseProps {
  patternRefreshInterval?: number
  patternAlpha?: number
}

export default function Noise({ patternRefreshInterval = 2, patternAlpha = 15 }: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = grainRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let frame = 0
    let animationId = 0
    const S = 1024

    const resize = () => {
      canvas.width = S
      canvas.height = S
      canvas.style.width = '100%'
      canvas.style.height = '100%'
    }

    const draw = () => {
      const img = ctx.createImageData(S, S)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255
        d[i] = v
        d[i + 1] = v
        d[i + 2] = v
        d[i + 3] = patternAlpha
      }
      ctx.putImageData(img, 0, 0)
    }

    const loop = () => {
      if (frame % patternRefreshInterval === 0) draw()
      frame++
      animationId = window.requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    resize()
    loop()

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animationId)
    }
  }, [patternRefreshInterval, patternAlpha])

  return (
    <canvas
      ref={grainRef}
      className="pointer-events-none absolute inset-0"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
