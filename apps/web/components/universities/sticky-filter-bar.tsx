"use client";

import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  DollarSign,
  Sparkles,
  Filter,
  BookOpen,
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
      className="fixed bottom-8 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 pointer-events-none"
    >
      <motion.div
        layout
        className="pointer-events-auto mx-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-4 px-6 py-3">
          {/* Search Input */}
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <Search className="h-5 w-5 text-gray-600 shrink-0" />
            <input
              type="text"
              placeholder="Search universities..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none"
            />
          </div>

          {/* Quick Filters */}
          {!isExpanded && (
            <div className="hidden sm:flex items-center gap-2">
              <button className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Country
              </button>
              <button className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 transition-colors flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Budget
              </button>
              <button className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-200 transition-colors flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Scholarship
              </button>
            </div>
          )}

          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors hover:scale-110"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/20 p-6 space-y-4 bg-gradient-to-b from-white/5 to-white/0"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Country Filter */}
              <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500">
                <option>All Countries</option>
                <option>South Korea</option>
                <option>USA</option>
                <option>UK</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>

              {/* Budget Filter */}
              <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500">
                <option>All Budgets</option>
                <option>Under $20k</option>
                <option>$20k - $40k</option>
                <option>$40k - $60k</option>
                <option>$60k+</option>
              </select>

              {/* Scholarship Filter */}
              <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500">
                <option>All Scholarships</option>
                <option>50%+</option>
                <option>75%+</option>
                <option>100%</option>
              </select>

              {/* Degree Level */}
              <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500">
                <option>All Levels</option>
                <option>Bachelor</option>
                <option>Master</option>
                <option>PhD</option>
              </select>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsExpanded(false)}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
