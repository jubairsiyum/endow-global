'use client'

import { motion } from 'framer-motion'

export function CinematicBranding() {
  return (
    <motion.div
      className="hidden lg:flex flex-col justify-between h-full bg-gradient-to-br from-[#C41E3A] via-red-700 to-red-900 p-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-white rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: '-50%', right: '-25%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-white rounded-full blur-3xl opacity-5"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          style={{ bottom: '-50%', left: '-25%' }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full mb-8 shadow-xl">
          <span className="text-2xl font-bold text-[#C41E3A]">E</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Endow Global</h1>
        <p className="text-lg text-red-100">Your pathway to world-class education</p>
      </motion.div>

      {/* Features */}
      <motion.div
        className="relative z-10 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <span className="text-white text-xl">🎓</span>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Expert Guidance</h3>
            <p className="text-sm text-red-100">Connect with experienced counselors</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <span className="text-white text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">AI-Powered Matching</h3>
            <p className="text-sm text-red-100">Find your perfect university instantly</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <span className="text-white text-xl">🌍</span>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Global Network</h3>
            <p className="text-sm text-red-100">Access 500+ universities worldwide</p>
          </div>
        </div>
      </motion.div>

      {/* Footer text */}
      <motion.p
        className="relative z-10 text-sm text-red-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        Join thousands of students achieving their dreams ✨
      </motion.p>
    </motion.div>
  )
}
