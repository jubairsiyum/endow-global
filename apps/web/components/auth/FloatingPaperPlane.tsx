'use client'

import { motion } from 'framer-motion'

export default function FloatingPaperPlane() {
  return (
    <motion.div
      animate={{
        x: [0, 40, 120, 180, 240],
        y: [0, -40, -10, -70, -30],
        rotate: [0, 10, 18, 8, 0],
      }}
      transition={{
        duration: 16,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute left-[32%] top-[120px] z-20"
    >
      <div className="relative">
        {/* Trail */}
        <motion.div
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute right-12 top-10 h-[120px] w-[260px] rotate-[18deg] rounded-[100%] border-t-2 border-dashed border-red-200"
        />

        {/* Plane */}
        <div className="text-6xl drop-shadow-[0_10px_25px_rgba(239,68,68,0.25)]">✈️</div>
      </div>
    </motion.div>
  )
}
