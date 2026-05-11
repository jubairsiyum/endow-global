'use client'

import { motion } from 'framer-motion'

export function FloatingObjects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating orb 1 */}
      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-br from-[#C41E3A]/30 to-red-300/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ top: '-100px', right: '-100px' }}
      />

      {/* Floating orb 2 */}
      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{ bottom: '-150px', left: '-100px' }}
      />

      {/* Floating orb 3 */}
      <motion.div
        className="absolute w-72 h-72 bg-gradient-to-br from-amber-200/10 to-orange-200/10 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{ top: '50%', left: '-120px' }}
      />
    </div>
  )
}
