'use client'

import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaApple } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface SocialButtonsProps {
  isLoading?: boolean
  onGoogleClick?: () => void
  onGithubClick?: () => void
  onAppleClick?: () => void
}

export function SocialButtons({
  isLoading = false,
  onGoogleClick,
  onGithubClick,
  onAppleClick,
}: SocialButtonsProps) {
  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  }

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onGoogleClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <FcGoogle size={20} />
        <span className="text-sm font-medium text-gray-700">Continue with Google</span>
      </motion.button>

      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onGithubClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <FaGithub size={20} className="text-gray-900" />
        <span className="text-sm font-medium text-gray-700">Continue with GitHub</span>
      </motion.button>

      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onAppleClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <FaApple size={20} className="text-gray-900" />
        <span className="text-sm font-medium text-gray-700">Continue with Apple</span>
      </motion.button>
    </motion.div>
  )
}
