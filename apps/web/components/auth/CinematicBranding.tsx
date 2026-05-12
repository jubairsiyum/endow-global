'use client'

import { motion } from 'framer-motion'

export default function CinematicBranding() {
  const features = [
    {
      icon: '🎓',
      title: 'Expert Guidance',
      description: 'Connect with experienced counselors',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Matching',
      description: 'Find your perfect university instantly',
    },
    {
      icon: '🌍',
      title: 'Global Network',
      description: 'Access 500+ universities worldwide',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      className="hidden lg:flex flex-col justify-between h-full bg-gradient-to-br from-[#C41E3A] via-[#B01830] to-[#8B0000] p-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Premium animated gradient overlays */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top right glow */}
        <motion.div
          className="absolute w-96 h-96 bg-white rounded-full blur-3xl opacity-15"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-50%', right: '-25%' }}
        />
        {/* Bottom left glow */}
        <motion.div
          className="absolute w-96 h-96 bg-white rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-50%', left: '-25%' }}
        />
        {/* Center subtle glow */}
        <motion.div
          className="absolute w-80 h-80 bg-white rounded-full blur-3xl opacity-5"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '50%', right: '10%', transform: 'translate(0, -50%)' }}
        />
      </div>

      {/* Top Section - Logo & Headline */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Logo */}
        <motion.div
          className="inline-flex items-center justify-center w-14 h-14 bg-white/95 rounded-full mb-8 shadow-2xl backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <span className="text-2xl font-bold text-[#C41E3A]">E</span>
        </motion.div>

        {/* Main Headline */}
        <h1 className="text-5xl font-bold text-white mb-3 leading-tight">
          Your journey to <br />
          <span className="bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
            world-class education
          </span>
          <br />
          starts here
        </h1>
        <p className="text-lg text-red-100 font-light tracking-wide">
          Discover universities tailored to your dreams
        </p>
      </motion.div>

      {/* Middle Section - Features */}
      <motion.div
        className="relative z-10 space-y-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ x: 8 }}
            className="flex items-start gap-4 group cursor-pointer"
          >
            <motion.div
              className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/20 group-hover:bg-white/30 group-hover:border-white/40 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-xl">{feature.icon}</span>
            </motion.div>
            <div className="pt-1">
              <h3 className="font-semibold text-white mb-1 text-sm tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-red-100/80 font-light">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Section - Trust Statement */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center gap-2 text-sm text-red-100">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.span>
          <p className="font-light">Join thousands of students achieving their dreams</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
