'use client'

import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Building2,
  BarChart3,
  Users,
  GraduationCap,
  ClipboardCheck,
} from 'lucide-react'

const menuItems = [
  {
    title: 'OFFICE MANAGEMENT',

    items: [
      {
        name: 'Dashboard',
        icon: LayoutDashboard,
        active: true,
      },

      {
        name: 'Daily Reports',
        icon: FileText,
      },

      {
        name: 'Work Assignments',
        icon: ClipboardList,
      },

      {
        name: 'Departments',
        icon: Building2,
      },

      {
        name: 'HR Reports',
        icon: BarChart3,
      },
    ],
  },

  {
    title: 'STUDENT MANAGEMENT',

    items: [
      {
        name: 'My Students',
        icon: Users,
      },

      {
        name: 'All Students',
        icon: GraduationCap,
      },

      {
        name: 'Student Visits',
        icon: ClipboardCheck,
      },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="relative flex h-screen w-[260px] flex-col overflow-hidden border-r border-white/5 bg-[#0b0b0d]">
      {/* RED GLOW */}

      <div className="absolute left-[-120px] top-[140px] h-[280px] w-[280px] rounded-full bg-red-600/10 blur-3xl" />

      {/* CONTENT */}

      <div className="relative z-10 flex h-full flex-col">
        {/* LOGO */}

        <div className="px-4 pt-7">
          <div className="flex h-[80px] items-center justify-center rounded-2xl border border-white/5 bg-white shadow-[0_10px_40px_rgba(255,255,255,0.04)]">
            <img src="/logo/endow-connect.png" alt="logo" className="h-9 object-contain" />
          </div>
        </div>

        {/* MENU */}

        <div className="mt-10 flex-1 overflow-y-auto px-3">
          {menuItems.map((section, index) => (
            <div key={index} className="mb-10">
              {/* SECTION TITLE */}

              <h3 className="mb-5 px-3 text-[12px] font-semibold tracking-[1.8px] text-[#bfa67c]">
                {section.title}
              </h3>

              {/* MENU ITEMS */}

              <div className="space-y-2">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon

                  return (
                    <button
                      key={itemIndex}
                      className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all duration-300 ${
                        item.active
                          ? `bg-gradient-to-r from-[#b40020] to-[#ea123f] text-white shadow-[0_0_35px_rgba(255,0,76,0.35)]`
                          : `text-white/75 hover:bg-white/[0.04] hover:text-white`
                      } `}
                    >
                      <Icon
                        size={18}
                        className={` ${
                          item.active ? 'text-white' : 'text-white/70 group-hover:text-white'
                        } `}
                      />

                      <span className="text-[15px] font-medium">{item.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* DIVIDER */}

              {index !== menuItems.length - 1 && <div className="border-white/6 mt-8 border-t" />}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
