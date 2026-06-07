'use client'

import { Moon, Sun } from 'lucide-react'

import { useTheme } from 'next-themes'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1d25] dark:hover:bg-[#222530]"
    >
      {isDark ? (
        <Sun size={18} className="text-white" />
      ) : (
        <Moon size={18} className="text-gray-900" />
      )}
    </button>
  )
}
