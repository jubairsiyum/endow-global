'use client'

import { useRef, useEffect } from 'react'

interface NoiseProps {
  patternAlpha?: number
}

export default function Noise({ patternAlpha = 15 }: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = grainRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const S = 256
    canvas.width = S
    canvas.height = S

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
  }, [patternAlpha])

  return (
    <canvas
      ref={grainRef}
      className="pointer-events-none absolute inset-0"
      style={{
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
      }}
    />
  )
}
