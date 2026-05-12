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

export default function SocialButtons({
  isLoading = false,
  onGoogleClick,
  onGithubClick,
  onAppleClick,
}: SocialButtonsProps) {
  const socialButtons = [
    {
      icon: FcGoogle,
      onClick: onGoogleClick,
      label: 'Google',
    },
    {
      icon: FaGithub,
      onClick: onGithubClick,
      label: 'GitHub',
      iconClass: 'text-gray-900',
    },
    {
      icon: FaApple,
      onClick: onAppleClick,
      label: 'Apple',
      iconClass: 'text-gray-900',
    },
  ]

  return (
    <motion.div
      className="grid grid-cols-3 gap-3 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, staggerChildren: 0.05 }}
    >
      {socialButtons.map((button, idx) => {
        const Icon = button.icon

        return (
          <motion.button
            key={idx}
            whileHover={{
              y: -2,
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
            }}
            whileTap={{ scale: 0.96 }}
            onClick={button.onClick}
            disabled={isLoading}
            className="relative flex items-center justify-center w-full h-11 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white overflow-hidden group"
            aria-label={button.label}
            type="button"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />

            <div className="relative z-10 flex items-center justify-center w-5 h-5">
              {Icon && (
                <Icon
                  size={20}
                  className={button.iconClass || 'text-current'}
                  aria-hidden="true"
                />
              )}
            </div>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
