'use client'

import { motion } from 'framer-motion'

interface FeatureCardsProps {
  variant?: 'default' | 'compact'
}

export function FeatureCards({ variant = 'default' }: FeatureCardsProps) {
  const features = [
    {
      icon: '🚀',
      title: 'Quick Setup',
      description: 'Complete your profile in 2 minutes',
    },
    {
      icon: '✨',
      title: 'Smart Matching',
      description: 'AI finds courses tailored for you',
    },
    {
      icon: '🎯',
      title: 'Direct Apply',
      description: 'Apply to universities instantly',
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  if (variant === 'compact') {
    return (
      <motion.div
        className="grid grid-cols-3 gap-3 mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200"
          >
            <div className="text-2xl mb-1">{feature.icon}</div>
            <h4 className="text-xs font-semibold text-gray-900">{feature.title}</h4>
            <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-[#C41E3A]/30 transition-colors"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{feature.icon}</span>
            <div>
              <h4 className="font-semibold text-gray-900">{feature.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
