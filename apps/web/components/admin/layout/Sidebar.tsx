"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },

  {
    name: "Students",
    icon: Users,
    href: "/admin/students",
  },

  {
    name: "Applications",
    icon: FileText,
    href: "/admin/applications",
  },

  {
    name: "Documents",
    icon: FolderOpen,
    href: "/admin/documents",
  },

  {
    name: "Universities",
    icon: GraduationCap,
    href: "/admin/universities",
  },

  {
    name: "Messages",
    icon: MessageSquare,
    href: "/admin/messages",
  },

  {
    name: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },

  {
    name: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
  },

  {
    name: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        relative
        flex
        h-screen
        w-[205px]
        flex-col
        overflow-y-auto
        overflow-x-hidden
        border-r
        border-white/[0.03]
        bg-[#070709]
        scrollbar-hide
      "
    >

      {/* PREMIUM RED GLOW */}

      <div
        className="
          absolute
          left-[-140px]
          top-[140px]
          h-[260px]
          w-[260px]
          rounded-full
          bg-red-600/10
          blur-3xl
        "
      />

      {/* TOP RED LIGHT */}

      <div
        className="
          absolute
          right-[-100px]
          top-[-120px]
          h-[180px]
          w-[180px]
          rounded-full
          bg-red-500/10
          blur-3xl
        "
      />

      {/* CONTENT */}

      <div className="relative z-10 flex min-h-full flex-col">

        {/* LOGO */}

        <div className="px-3 pt-3">

          <div
            className="
              flex
              h-[54px]
              items-center
              justify-center
              rounded-[14px]
              border
              border-white/[0.04]
              bg-white
              px-4
              py-2
              shadow-[0_10px_30px_rgba(255,255,255,0.04)]
            "
          >

            <Image
              src="/logo/endow-connect.png"
              alt="logo"
              width={120}
              height={32}
              priority
              className="h-6 w-auto object-contain"
            />

          </div>
        </div>

        {/* MENU */}

        <div
          className="
            mt-5
            flex-1
            px-2.5
          "
        >

          <div className="space-y-1.5">

            {menuItems.map((item, index) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`
                    group
                    relative
                    flex
                    items-center
                    gap-2.5
                    overflow-hidden
                    rounded-[14px]
                    px-3.5
                    py-[8px]
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-[#c3002f]
                          to-[#ff174f]
                          text-white
                          shadow-[0_0_22px_rgba(255,0,76,0.22)]
                        `
                        : `
                          text-white/70
                          hover:bg-white/[0.03]
                          hover:text-white
                        `
                    }
                  `}
                >

                  {/* ACTIVE SHINE */}

                  {isActive && (
                    <div
                      className="
                        absolute
                        inset-0
                        bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]
                      "
                    />
                  )}

                  {/* ICON */}

                  <Icon
                    size={16}
                    className={`
                      relative
                      z-10

                      ${
                        isActive
                          ? "text-white"
                          : "text-white/65 group-hover:text-white"
                      }
                    `}
                  />

                  {/* TEXT */}

                  <span
                    className="
                      relative
                      z-10
                      text-[12.5px]
                      font-[500]
                      tracking-[0.1px]
                    "
                  >
                    {item.name}
                  </span>

                </Link>
              );
            })}
          </div>
        </div>

        {/* USER CARD */}

        <div className="p-2.5">

          <div
            className="
              rounded-[14px]
              border
              border-white/[0.04]
              bg-white/[0.02]
              p-[8px]
              backdrop-blur-xl
            "
          >

            {/* USER */}

            <div className="flex items-center gap-2.5">

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-[#ff214f]
                  to-[#93001f]
                  text-[11px]
                  font-bold
                  text-white
                "
              >
                SA
              </div>

              <div>

                <h4
                  className="
                    text-[13px]
                    font-semibold
                    text-white
                  "
                >
                  Super Admin
                </h4>

                <p
                  className="
                    mt-[2px]
                    text-[11px]
                    text-white/45
                  "
                >
                  Endow Global
                </p>

              </div>
            </div>

            {/* STATUS */}

            <div
              className="
                mt-3
                rounded-[12px]
                border
                border-white/[0.04]
                bg-black/20
                px-3
                py-2
              "
            >

              <p
                className="
                  text-[10px]
                  text-white/40
                "
              >
                System Status
              </p>

              <div className="mt-1.5 flex items-center gap-1.5">

                <div
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-green-400
                    shadow-[0_0_10px_rgba(74,222,128,0.9)]
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-medium
                    text-green-400
                  "
                >
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