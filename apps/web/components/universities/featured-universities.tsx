"use client";

import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Zap,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { universities } from "@/lib/universities/data";
import { formatCurrency } from "@/lib/universities/utils";
import Image from "next/image";

export default function FeaturedUniversities() {
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    const newSaved = new Set(saved);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSaved(newSaved);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative overflow-x-hidden bg-white py-16 lg:py-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-500/10 opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 space-y-3 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
            <Zap className="h-3.5 w-3.5 text-[#C41E3A]" />
            <span className="text-xs font-medium text-[#C41E3A]">
              Featured Partners
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            Premium University Opportunities
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            Handpicked universities with exclusive scholarships and visa
            guarantees for our students
          </p>
        </motion.div>

        {/* University Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {universities.slice(0, 6).map((uni) => (
            <motion.div
              key={uni.id}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative w-full max-w-[340px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-red-100"
            >
              <div className="relative h-32 w-full overflow-hidden bg-gray-50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,30,58,0.10),transparent_58%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <Image
                      src={uni.logo}
                      alt={uni.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="absolute left-3 top-3 rounded-full border border-gray-200 bg-white/90 px-2.5 py-1 text-xs font-bold text-gray-900 shadow-sm backdrop-blur">
                  #{uni.ranking}
                </div>

                <div className="absolute right-3 top-3 rounded-full border border-red-100 bg-white px-2.5 py-1 text-xs font-bold text-[#C41E3A] shadow-sm">
                  {uni.scholarship}% Scholarship
                </div>
              </div>

              <div className="space-y-3 p-5">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {uni.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {uni.city}, {uni.country}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-600">Tuition/Year</p>
                    <p className="font-bold text-gray-900">
                      {formatCurrency(uni.tuition.min)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-600">Visa Success</p>
                    <p className="font-bold text-gray-900">
                      {uni.visaSuccessRate}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-gray-700">
                    <TrendingUp className="h-3.5 w-3.5 text-[#C41E3A]" />
                    <span>{uni.employmentRate}% Employment</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C41E3A]" />
                    <span>{uni.daysToIntake} days to Intake</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">
                    Popular Programs
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uni.programs.slice(0, 2).map((prog, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-red-100 bg-red-50 px-2 py-1 text-xs text-[#C41E3A]"
                      >
                        {prog}
                      </span>
                    ))}
                    {uni.programs.length > 2 && (
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700">
                        +{uni.programs.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-red-100 bg-red-50/70 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">AI Match Score</p>
                      <p className="text-sm font-bold text-gray-900">
                        92% Match For You
                      </p>
                    </div>
                    <div className="relative h-10 w-10">
                      <svg
                        className="h-10 w-10 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          className="stroke-gray-200"
                          strokeWidth="3"
                        ></circle>
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          className="stroke-[#C41E3A]"
                          strokeWidth="3"
                          strokeDasharray="94.77 102.4"
                          strokeLinecap="round"
                        ></circle>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#C41E3A]">
                        92%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => toggleSave(uni.id)}
                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    {saved.has(uni.id) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(196,30,58,0.18)] transition-shadow hover:shadow-red-200">
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <button className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-900 px-5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white">
            View All Universities
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
