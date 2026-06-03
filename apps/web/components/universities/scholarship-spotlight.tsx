"use client";

import { motion } from "framer-motion";
import { Award, Clock, Check, ArrowRight } from "lucide-react";
import { scholarships } from "@/lib/universities/data";
import { calculateDaysRemaining } from "@/lib/universities/utils";

export default function ScholarshipSpotlight() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative overflow-x-hidden bg-white py-16 lg:py-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-red-500/10 opacity-20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 space-y-3 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
            <Award className="h-3.5 w-3.5 text-[#C41E3A]" />
            <span className="text-xs font-medium text-[#C41E3A]">
              Financial Aid
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            Exclusive Scholarship Opportunities
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            Reduce your tuition burden with our partner universities' exclusive
            scholarships and financial aid programs
          </p>
        </motion.div>

        {/* Scholarships Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {scholarships.map((scholarship, idx) => {
            const daysLeft = calculateDaysRemaining(scholarship.deadline);
            const isUrgent = daysLeft <= 7;

            return (
              <motion.div
                key={scholarship.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-red-100"
              >
                {isUrgent && (
                  <div className="absolute inset-0 bg-red-50/70" />
                )}

                <div className="relative space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {scholarship.universityName}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {scholarship.description}
                      </p>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      className="ml-4 shrink-0 rounded-2xl border border-red-100 bg-white px-4 py-2 text-center shadow-sm"
                    >
                      <p className="text-xl font-bold text-[#C41E3A]">
                        {scholarship.percentage}%
                      </p>
                      <p className="text-xs text-gray-500">Scholarship</p>
                    </motion.div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Requirements
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C41E3A]" />
                        <span className="text-gray-700">
                          {scholarship.requirements}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C41E3A]" />
                        <span className="text-gray-700">
                          IELTS: {scholarship.ieltsRequirement}+ required
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-[#C41E3A]" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600">
                          Application Deadline
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {daysLeft} days left
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-[#C41E3A]">
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Alert for urgent */}
                  {isUrgent && (
                    <div className="rounded-2xl border border-red-200 bg-white p-3">
                      <p className="text-xs text-red-700 font-semibold">
                        Hurry! Application closing soon
                      </p>
                    </div>
                  )}

                  {/* Apply Button */}
                  <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(196,30,58,0.18)] transition-shadow hover:shadow-red-200">
                    Apply for Scholarship
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
