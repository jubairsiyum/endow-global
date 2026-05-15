"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  Bell,
  Settings,
  GraduationCap,
  BarChart3,
  MessageSquare,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users,
  },
  {
    title: "Applications",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    title: "Documents",
    href: "/admin/documents",
    icon: FolderOpen,
  },
  {
    title: "Universities",
    href: "/admin/universities",
    icon: GraduationCap,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-[245px] border-r border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-[#11131a]">
      
      <div className="flex h-full flex-col">
        
        {/* LOGO */}
        <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          
          <div className="flex items-center gap-2">
            
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white shadow-sm">
              E
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                ENDOW
              </h1>

              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Portal
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(
                item.href + "/"
              );

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`group flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200
                  
                  ${
                    isActive
                      ? "bg-red-50 text-primary shadow-sm dark:bg-[#2a1114]"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#1a1d25] dark:hover:text-white"
                  }
                `}
              >
                <Icon
                  size={15}
                  className={`transition-all duration-200 shrink-0
                    ${
                      isActive
                        ? "text-primary"
                        : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    }
                  `}
                />

                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM PROFILE */}
        <div className="border-t border-gray-200 p-2 dark:border-gray-800">
          
          <div className="rounded-lg bg-gradient-to-br from-red-50 to-white p-2 dark:from-[#1a1d25] dark:to-[#11131a]">
            
            <div className="flex items-center gap-2">
              
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100 text-[10px] font-bold text-primary dark:bg-[#2a1114]">
                SA
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  Super Admin
                </p>

                <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
                  Endow Global
                </p>
              </div>
            </div>

            {/* SYSTEM STATUS */}
            <div className="mt-2 rounded-md bg-white px-2 py-1 shadow-sm dark:bg-[#1a1d25]">
              
              <p className="text-[9px] font-medium text-gray-500 dark:text-gray-400">
                System Status
              </p>

              <div className="mt-0.5 flex items-center gap-1">
                
                <div className="h-1 w-1 rounded-full bg-green-500" />

                <span className="text-[8px] font-semibold text-green-600">
                  All operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}


