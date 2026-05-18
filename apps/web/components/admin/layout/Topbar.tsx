"use client";

import ThemeToggle from "@/components/ui/ThemeToggle";

import {
  Bell,
  ChevronDown,
  CircleHelp,
  Menu,
  Plus,
  Search,
} from "lucide-react";

interface Props {
  onMenuClick: () => void;
}

export function Topbar({
  onMenuClick,
}: Props) {
  return (
    <header className="flex h-[56px] items-center justify-between border-b border-gray-200 bg-white px-3 transition-all duration-300 dark:border-gray-800 dark:bg-[#11131a] lg:px-4">
      
      {/* LEFT */}
      <div className="flex items-center gap-2.5">
        
        {/* MOBILE MENU */}
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 transition-all hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#1a1d25] lg:hidden"
        >
          <Menu
            size={16}
            className="dark:text-white"
          />
        </button>

        {/* SEARCH */}
        <div className="hidden w-[280px] items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 dark:border-gray-700 dark:bg-[#1a1d25] lg:flex">
          
          <Search
            size={14}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
          />

          <div className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[9px] text-gray-500 dark:border-gray-700 dark:bg-[#222530] dark:text-gray-400">
            ⌘K
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        
        {/* QUICK ACTION */}
        <button className="hidden items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-[#920715] lg:flex">
          
          <Plus size={13} />
          New
        </button>

        {/* NOTIFICATION */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1d25] dark:hover:bg-[#222530]">
          
          <Bell
            size={15}
            className="text-gray-700 dark:text-white"
          />

          <div className="absolute right-0.5 top-0.5 flex h-3 min-w-[14px] items-center justify-center rounded-full bg-primary px-0.5 text-[8px] font-bold text-white">
            12
          </div>
        </button>

        {/* HELP */}
        <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1d25] dark:hover:bg-[#222530]">
          
          <CircleHelp
            size={15}
            className="text-gray-700 dark:text-white"
          />
        </button>

        {/* THEME */}
        <ThemeToggle />

        {/* PROFILE */}
        <button className="flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-all hover:bg-gray-50 dark:hover:bg-[#1a1d25]">
          
          {/* AVATAR */}
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-white shadow-sm">
            SA
          </div>

          {/* TEXT */}
          <div className="hidden text-left lg:block">
            <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
              Admin
            </p>

            <p className="text-[9px] text-gray-500 dark:text-gray-400">
              Endow
            </p>
          </div>

          {/* DROPDOWN ICON */}
          <ChevronDown
            size={14}
            className="hidden text-gray-500 dark:text-gray-400 lg:block"
          />
        </button>
      </div>
    </header>
  );
}