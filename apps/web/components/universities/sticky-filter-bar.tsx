"use client";

import { motion } from "framer-motion";
import {
  Search,
  DollarSign,
  Sparkles,
  Filter,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";

interface StickyFilterBarProps {
  onSearch?: (query: string) => void;
}

export default function StickyFilterBar({ onSearch }: StickyFilterBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="pointer-events-none fixed bottom-6 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2"
    >
      <motion.div
        layout
        className="pointer-events-auto mx-4 overflow-hidden rounded-full border border-gray-200 bg-white/90 shadow-[0_14px_44px_rgba(15,23,42,0.12)] backdrop-blur-md"
      >
        <div className="flex h-14 items-center gap-3 px-4">
          {/* Search Input */}
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <Search className="h-4 w-4 shrink-0 text-[#C41E3A]" />
            <input
              type="text"
              placeholder="Search universities..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-950 placeholder-gray-500 outline-none"
            />
          </div>

          {/* Quick Filters */}
          {!isExpanded && (
            <div className="hidden sm:flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#C41E3A] transition-colors hover:bg-red-100">
                <Globe className="h-3 w-3" />
                Country
              </button>
              <button className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-red-50 hover:text-[#C41E3A]">
                <DollarSign className="h-3 w-3" />
                Budget
              </button>
              <button className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-red-50 hover:text-[#C41E3A]">
                <Sparkles className="h-3 w-3" />
                Scholarship
              </button>
            </div>
          )}

          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full bg-gradient-to-r from-red-600 to-rose-500 p-2 text-white shadow-[0_8px_22px_rgba(196,30,58,0.20)] transition-transform hover:scale-105"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 border-t border-red-100 bg-white/95 p-5"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Country Filter */}
              <select className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none">
                <option>All Countries</option>
                <option>South Korea</option>
                <option>USA</option>
                <option>UK</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>

              {/* Budget Filter */}
              <select className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none">
                <option>All Budgets</option>
                <option>Under $20k</option>
                <option>$20k - $40k</option>
                <option>$40k - $60k</option>
                <option>$60k+</option>
              </select>

              {/* Scholarship Filter */}
              <select className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none">
                <option>All Scholarships</option>
                <option>50%+</option>
                <option>75%+</option>
                <option>100%</option>
              </select>

              {/* Degree Level */}
              <select className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#C41E3A] focus:outline-none">
                <option>All Levels</option>
                <option>Bachelor</option>
                <option>Master</option>
                <option>PhD</option>
              </select>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="h-10 flex-1 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
              <button className="h-10 flex-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-4 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(196,30,58,0.18)] transition-shadow hover:shadow-red-200">
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
