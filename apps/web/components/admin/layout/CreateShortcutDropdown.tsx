'use client'

import { useSession } from '@/lib/auth-client'
import { hasPermission, parsePermissionsJSON, type Permission } from '@/lib/rbac'
import { cn } from '@/lib/utils'
import { UserRole } from '@endow/types'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  Bell,
  BookOpen,
  Building2,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  Globe,
  GraduationCap,
  ImagePlus,
  Mail,
  Plus,
  Search,
  Shield,
  Star,
  Upload,
  UserCog,
  Users,
  X,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

export interface CreateShortcutItem {
  id: string
  title: string
  description: string
  href: string
  perm: Permission
  category: 'Academics' | 'People' | 'Content' | 'Operations'
  icon: any
}

const SHORTCUT_ITEMS: CreateShortcutItem[] = [
  // Academics
  {
    id: 'courses',
    title: 'Course',
    description: 'Add course to academic catalog',
    href: '/admin/courses',
    perm: 'courses:manage',
    category: 'Academics',
    icon: BookOpen,
  },
  {
    id: 'universities',
    title: 'University',
    description: 'Register partner institution',
    href: '/admin/universities',
    perm: 'universities:manage',
    category: 'Academics',
    icon: GraduationCap,
  },
  {
    id: 'scholarships',
    title: 'Scholarship',
    description: 'Publish grant or funding program',
    href: '/admin/scholarships',
    perm: 'scholarships:manage',
    category: 'Academics',
    icon: Award,
  },
  {
    id: 'countries',
    title: 'Country',
    description: 'Add study destination country',
    href: '/admin/countries',
    perm: 'countries:manage',
    category: 'Academics',
    icon: Globe,
  },

  // People & Management
  {
    id: 'students',
    title: 'Student',
    description: 'Register a new student profile',
    href: '/admin/students',
    perm: 'students:manage',
    category: 'People',
    icon: Users,
  },
  {
    id: 'counselors',
    title: 'Counselor',
    description: 'Onboard education counselor advisor',
    href: '/admin/counselors',
    perm: 'counselors:manage',
    category: 'People',
    icon: UserCog,
  },
  {
    id: 'users',
    title: 'Staff Member',
    description: 'Add staff or admin account',
    href: '/admin/users',
    perm: 'users:manage',
    category: 'People',
    icon: Shield,
  },

  // Content & Media
  {
    id: 'resources',
    title: 'Resource',
    description: 'Upload article, guide or document',
    href: '/admin/resources',
    perm: 'resources:manage',
    category: 'Content',
    icon: Upload,
  },
  {
    id: 'events',
    title: 'Event',
    description: 'Schedule webinar, seminar or expo',
    href: '/admin/events',
    perm: 'events:manage',
    category: 'Content',
    icon: CalendarDays,
  },
  {
    id: 'testimonials',
    title: 'Testimonial',
    description: 'Add student feedback or success story',
    href: '/admin/testimonials',
    perm: 'testimonials:manage',
    category: 'Content',
    icon: Star,
  },
  {
    id: 'hero-images',
    title: 'Hero Image',
    description: 'Upload homepage hero banner photo',
    href: '/admin/hero-images',
    perm: 'hero:manage',
    category: 'Content',
    icon: ImagePlus,
  },

  // Operations
  {
    id: 'deadlines',
    title: 'Deadline',
    description: 'Set application intake deadline',
    href: '/admin/deadlines',
    perm: 'deadlines:manage',
    category: 'Operations',
    icon: CalendarClock,
  },
  {
    id: 'branches',
    title: 'Branch',
    description: 'Add regional office branch location',
    href: '/admin/branches',
    perm: 'branches:manage',
    category: 'Operations',
    icon: Building2,
  },
  {
    id: 'notifications',
    title: 'Notification',
    description: 'Send broadcast announcement',
    href: '/admin/notifications',
    perm: 'notifications:manage',
    category: 'Operations',
    icon: Bell,
  },
  {
    id: 'newsletters',
    title: 'Subscriber',
    description: 'Add email newsletter subscriber',
    href: '/admin/newsletters',
    perm: 'newsletters:manage',
    category: 'Operations',
    icon: Mail,
  },
]

const CATEGORIES: Array<CreateShortcutItem['category']> = [
  'Academics',
  'People',
  'Content',
  'Operations',
]

interface Props {
  userRole?: UserRole
  permissions?: string[]
}

export function CreateShortcutDropdown({ userRole, permissions }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Resolve role and permissions
  const activeRole = userRole || (session?.user as any)?.role || UserRole.ADMIN
  const isSuperAdmin = activeRole === UserRole.SUPER_ADMIN

  const effectivePerms: string[] = useMemo(() => {
    if (permissions !== undefined && permissions.length > 0) return permissions
    return parsePermissionsJSON((session?.user as any)?.permissions)
  }, [permissions, session])

  // Filter items by user permissions
  const permittedItems = useMemo(() => {
    return SHORTCUT_ITEMS.filter((item) => {
      if (isSuperAdmin) return true
      return hasPermission(effectivePerms, item.perm, activeRole)
    })
  }, [isSuperAdmin, effectivePerms, activeRole])

  // Filter items by search query
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return permittedItems
    return permittedItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }, [permittedItems, searchQuery])

  // Group items by category when not searching or when search matches across categories
  const groupedItems = useMemo(() => {
    const groups: Record<string, CreateShortcutItem[]> = {}
    for (const cat of CATEGORIES) {
      const items = filteredItems.filter((it) => it.category === cat)
      if (items.length > 0) {
        groups[cat] = items
      }
    }
    return groups
  }, [filteredItems])

  // Flat list for keyboard navigation
  const flatItems = useMemo(() => {
    return Object.values(groupedItems).flat()
  }, [groupedItems])

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0)
      const timer = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setSearchQuery('')
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1 < flatItems.length ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : flatItems.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flatItems[activeIndex]) {
        handleSelect(flatItems[activeIndex])
      }
    }
  }

  function handleSelect(shortcut: CreateShortcutItem) {
    setIsOpen(false)
    setSearchQuery('')

    if (pathname === shortcut.href) {
      window.dispatchEvent(
        new CustomEvent('admin:create-shortcut', {
          detail: { target: shortcut.id },
        })
      )
    } else {
      router.push(`${shortcut.href}?action=new`)
    }
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium shadow-xs transition-all hover:opacity-95 active:scale-95',
          isOpen ? 'ring-2 ring-[#E8A33D]/50' : ''
        )}
        style={{ background: '#E8A33D', color: '#f8fafc' }}
        title="Add new shortcut"
      >
        <Plus size={14} className="stroke-[2.5]" />
        <span>New</span>
        <ChevronDown
          size={12}
          className={cn('transition-transform duration-200', isOpen ? 'rotate-180' : 'rotate-0')}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 sm:left-auto sm:right-0 mt-2 z-50 flex w-[330px] sm:w-[380px] max-h-[82vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-2xl dark:border-white/[0.08] dark:bg-[#121214]/95"
            style={{ zIndex: 70 }}
          >
            {/* Header with Title & Filter */}
            <div className="border-b border-gray-100 p-3 dark:border-white/[0.06]">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Quick Create
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    {flatItems.length} shortcuts
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                  aria-label="Close shortcuts menu"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex items-center">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 text-gray-400 dark:text-gray-500"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setActiveIndex(0)
                  }}
                  placeholder="Filter actions (e.g. course, university, student)..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#E8A33D] focus:bg-white focus:outline-none dark:border-white/[0.08] dark:bg-[#1c1c1f] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-[#18181b]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      searchInputRef.current?.focus()
                    }}
                    className="absolute right-2.5 rounded-full p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="min-h-0 flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
              {flatItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-xs font-medium">No shortcut found matching &ldquo;{searchQuery}&rdquo;</p>
                  <p className="mt-1 text-[11px]">Try searching for courses, universities, or resources.</p>
                </div>
              ) : (
                Object.entries(groupedItems).map(([cat, items]) => (
                  <div key={cat} className="mb-3 last:mb-0">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      {cat}
                    </div>
                    <div className="mt-1 space-y-1">
                      {items.map((item) => {
                        const globalIndex = flatItems.findIndex((it) => it.id === item.id)
                        const isSelected = globalIndex === activeIndex
                        const ItemIcon = item.icon

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(globalIndex)}
                            className={cn(
                              'group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all',
                              isSelected
                                ? 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                                : 'text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-white/[0.06]'
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div
                                className={cn(
                                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                                  isSelected
                                    ? 'bg-[#E8A33D] text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-amber-500/10 group-hover:text-amber-500 dark:bg-white/[0.06] dark:text-gray-300 dark:group-hover:bg-amber-500/20 dark:group-hover:text-amber-400'
                                )}
                              >
                                <ItemIcon size={14} />
                              </div>
                              <div className="min-w-0">
                                <p
                                  className={cn(
                                    'truncate text-xs font-semibold',
                                    isSelected
                                      ? 'text-amber-900 dark:text-amber-200'
                                      : 'text-gray-900 dark:text-white'
                                  )}
                                >
                                  Add {item.title}
                                </p>
                                <p className="truncate text-[10px] text-gray-500 dark:text-gray-400">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <span
                              className={cn(
                                'ml-2 shrink-0 rounded-md p-1 transition-all',
                                isSelected
                                  ? 'text-[#E8A33D] opacity-100'
                                  : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-amber-500'
                              )}
                            >
                              <Plus size={13} className="stroke-[2.5]" />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Hint */}
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-3 py-2 text-[10px] text-gray-400 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-gray-500">
              <span>Select any shortcut to open its create form</span>
              <span className="hidden sm:inline font-mono">Esc to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

