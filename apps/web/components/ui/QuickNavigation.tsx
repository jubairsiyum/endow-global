'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

export interface QuickNavigationItem {
  label: string
  href: string
}

interface QuickNavigationProps {
  items: QuickNavigationItem[]
  placeholder: string
  className?: string
}

export function QuickNavigation({ items, placeholder, className = '' }: QuickNavigationProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filteredItems = useMemo(() => {
    const value = query.trim().toLowerCase()
    return value ? items.filter((item) => item.label.toLowerCase().includes(value)) : items
  }, [items, query])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 transition-colors dark:border-white/[0.08] dark:bg-[#18181b]">
        <Search size={14} className="text-gray-400 dark:text-gray-500" aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[13px] text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder-gray-500"
          aria-label="Quick navigation"
        />
        <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400">
          Ctrl+K
        </kbd>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-white/[0.08] dark:bg-[#18181b]">
          {filteredItems.length ? (
            filteredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/[0.06]"
              >
                {item.label}
              </Link>
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
              No destinations found
            </p>
          )}
        </div>
      )}
    </div>
  )
}
