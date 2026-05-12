'use client'

import { motion } from 'framer-motion'

export default function FloatingObjects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Premium floating orb 1 - Top right red glow */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-br from-[#C41E3A]/40 to-red-300/10 rounded-full blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ top: '-150px', right: '-100px' }}
      />

      {/* Premium floating orb 2 - Bottom left subtle blue-purple */}
      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-br from-blue-200/15 to-purple-200/5 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{ bottom: '-100px', left: '-120px' }}
      />

      {/* Premium floating orb 3 - Center amber accent */}
      <motion.div
        className="absolute w-72 h-72 bg-gradient-to-br from-amber-200/20 to-orange-200/5 rounded-full blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{ top: '45%', left: '-150px' }}
      />

      {/* Subtle ambient glow circle - center right */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ top: '35%', right: '5%' }}
      />

      {/* Very subtle animated light streak effect */}
      <motion.div
        className="absolute w-96 h-1 bg-gradient-to-r from-transparent via-white to-transparent blur-2xl opacity-5"
        animate={{
          y: [0, 200, 0],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ top: '30%', right: '20%', width: '200px' }}
      />
    </div>
  )
}
