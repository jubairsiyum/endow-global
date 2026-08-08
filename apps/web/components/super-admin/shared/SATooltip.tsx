'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function SATooltip({ content, children, side = 'top' }: Props) {
  const [show, setShow] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: side === 'bottom' ? -4 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: side === 'bottom' ? -4 : 4 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute z-50 rounded-md border px-2.5 py-1.5 shadow-lg"
            style={{
              background: '#ffffff',
              borderColor: '#e5e7eb',
              boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
              [side]: '100%',
              ...(side === 'top' || side === 'bottom' ? { left: '50%', transform: 'translateX(-50%)' } : {}),
              ...(side === 'left' || side === 'right' ? { top: '50%', transform: 'translateY(-50%)' } : {}),
              marginTop: side === 'bottom' ? '4px' : undefined,
              marginBottom: side === 'top' ? '4px' : undefined,
            }}
          >
            <span className="text-[11px] whitespace-nowrap" style={{ color: '#111827' }}>
              {content}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
