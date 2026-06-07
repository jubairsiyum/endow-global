'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
} from 'lucide-react'

const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },

  {
    name: 'Students',
    icon: Users,
    href: '/admin/students',
  },

  {
    name: 'Applications',
    icon: FileText,
    href: '/admin/applications',
  },

  {
    name: 'Documents',
    icon: FolderOpen,
    href: '/admin/documents',
  },

  {
    name: 'Universities',
    icon: GraduationCap,
    href: '/admin/universities',
  },

  {
    name: 'Messages',
    icon: MessageSquare,
    href: '/admin/messages',
  },

  {
    name: 'Analytics',
    icon: BarChart3,
    href: '/admin/analytics',
  },

  {
    name: 'Notifications',
    icon: Bell,
    href: '/admin/notifications',
  },

  {
    name: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="scrollbar-hide relative flex h-screen w-[205px] flex-col overflow-y-auto overflow-x-hidden border-r border-white/[0.02]"
      style={{
        background: `linear-gradient(180deg, #0E0F14 0%, #11131A 50%, #151821 100%)`,
      }}
    >
      {/* LAYER 1: AMBIENT GRADIENT GLOWS */}

      {/* TOP LEFT RED AMBIENT */}
      <div
        className="pointer-events-none absolute left-[-120px] top-[80px] h-[280px] w-[280px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(173, 8, 25, 0.08) 0%, transparent 70%)`,
        }}
      />

      {/* CENTER RED GLOW */}
      <div
        className="pointer-events-none absolute left-[-100px] top-[240px] h-[320px] w-[320px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(173, 8, 25, 0.06) 0%, transparent 70%)`,
        }}
      />

      {/* TOP RIGHT ACCENT */}
      <div
        className="pointer-events-none absolute right-[-140px] top-[-100px] h-[260px] w-[260px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(173, 8, 25, 0.04) 0%, transparent 70%)`,
        }}
      />

      {/* LAYER 2: SUBTLE MESH OVERLAY */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 800px 300px at 50% 0%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)`,
        }}
      />

      {/* CONTENT */}

      <div className="relative z-10 flex min-h-full flex-col">
        {/* LOGO SECTION - PURE WHITE LUXURY GLASS */}

        <div className="relative mx-3 mb-2 mt-2 flex h-[72px] items-center justify-center overflow-hidden rounded-[20px] border border-white/60 bg-white shadow-[0_10px_30px_rgba(255,255,255,0.15)]">
          {/* GRADIENT GLASS REFLECTION */}

          <div className="absolute inset-0 bg-gradient-to-br from-white via-[#fafafa] to-[#f1f1f1]" />

          {/* LOGO CONTENT */}

          <div className="relative z-10 scale-[0.92]">
            <Image
              src="/logo/endow-connect.png"
              alt="logo"
              width={120}
              height={32}
              priority
              className="h-auto max-h-[52px] w-auto object-contain"
            />
          </div>
        </div>

        {/* MENU */}

        <div
          className="mt-2 flex-1 overflow-y-auto overflow-x-hidden px-2"
          style={
            {
              scrollbarWidth: 'none',
            } as React.CSSProperties
          }
        >
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon

              const isActive = pathname === item.href

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`group relative flex items-center gap-2.5 overflow-hidden rounded-[18px] border px-3 py-2 transition-all duration-300 ${
                    isActive
                      ? `border-white/[0.08] text-white shadow-[0_0_28px_rgba(173,8,25,0.3)]`
                      : `border-white/[0.02] text-white/70 hover:border-white/[0.06] hover:text-white/90 hover:shadow-[0_0_18px_rgba(255,255,255,0.05)]`
                  } `}
                >
                  {/* ACTIVE LUXURY GRADIENT BACKGROUND */}

                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-[14px]"
                      style={{
                        background: `linear-gradient(135deg, #AD0819 0%, #C41528 100%)`,
                        backdropFilter: 'blur(8px)',
                      }}
                    />
                  )}

                  {/* INACTIVE GLASS BACKGROUND */}

                  {!isActive && (
                    <div
                      className="absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `rgba(255, 255, 255, 0.02)`,
                        backdropFilter: 'blur(6px)',
                      }}
                    />
                  )}

                  {/* PREMIUM SHINE OVERLAY */}

                  <div
                    className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: isActive
                        ? `linear-gradient(120deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05), transparent)`
                        : `linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.08), transparent)`,
                    }}
                  />

                  {/* ICON CONTAINER - MINI LUXURY GLASS */}

                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-[9px] border transition-all duration-300 ${
                      isActive
                        ? 'border-white/[0.15]'
                        : 'border-white/[0.04] group-hover:border-white/[0.08]'
                    } `}
                    style={{
                      background: isActive ? `rgba(173, 8, 25, 0.28)` : `rgba(255, 255, 255, 0.03)`,
                      backdropFilter: 'blur(8px)',
                      boxShadow: isActive
                        ? `inset 0 1px 3px rgba(255, 255, 255, 0.08), 0 0 14px rgba(173, 8, 25, 0.24)`
                        : 'none',
                    }}
                  >
                    <Icon
                      size={12}
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'text-white drop-shadow-[0_0_8px_rgba(173,8,25,0.4)]'
                          : 'text-white/60 group-hover:text-white/80'
                      } `}
                    />
                  </div>

                  {/* TEXT - IMPROVED HIERARCHY */}

                  <span
                    className={`relative z-10 text-[13px] font-medium tracking-[0.01em] transition-all duration-300 ${isActive ? 'font-semibold' : ''} `}
                  >
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* USER CARD - FLOATING PREMIUM WIDGET */}

        <div className="p-2 pb-2">
          <div
            className="group relative overflow-hidden rounded-[14px] border border-white/[0.06] p-2 transition-all duration-500 hover:border-white/[0.1] hover:shadow-[0_10_32px_rgba(173,8,25,0.15)]"
            style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)`,
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* AMBIENT GLOW */}

            <div
              className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(ellipse 100px 60px at 50% 0%, rgba(173, 8, 25, 0.08) 0%, transparent 70%)`,
              }}
            />

            {/* USER SECTION */}

            <div className="relative z-10 flex items-center gap-2.5">
              {/* AVATAR - PREMIUM GRADIENT CIRCLE */}

              <div
                className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.15] text-[9px] font-bold text-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(173,8,25,0.35),inset_0_2px_8px_rgba(0,0,0,0.3)]"
                style={{
                  background: `linear-gradient(135deg, rgba(173, 8, 25, 0.7) 0%, rgba(196, 21, 40, 0.7) 100%)`,
                }}
              >
                {/* ONLINE PULSE - SUBTLE */}
                <div
                  className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white/[0.4] shadow-[0_0_6px_rgba(34,197,94,0.7)]"
                  style={{
                    background: `#22c55e`,
                  }}
                />
                SA
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-white">Super Admin</h4>

                <p className="mt-[2px] truncate text-[12px] text-white/45">Endow Global</p>
              </div>
            </div>

            {/* STATUS INDICATOR */}

            <div
              className="relative z-10 mt-2 rounded-[11px] border border-white/[0.04] px-2.5 py-1.5 transition-all duration-300"
              style={{
                background: `rgba(34, 197, 94, 0.06)`,
              }}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                  style={{
                    background: `#22c55e`,
                  }}
                />

                <span className="text-[10px] font-[500] text-green-400/85">Active Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        aside {
          scrollbar-width: none;
        }
        aside::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </aside>
  )
}
