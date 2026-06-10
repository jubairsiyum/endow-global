"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { scholarships, universities } from "@/lib/universities/data";
import { universityDesign as ds } from "./design-system";

const featuredScholarships = scholarships.slice(0, 3);
const universityById = new Map(
  universities.map((university) => [university.id, university])
);
const fallbackUniversityImage = "/universities/Hanseo University.png";

export default function ScholarshipSpotlight() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FCFCFD] via-[#F8FAFC] to-[#F1F5F9] px-4 pt-0 pb-14 sm:px-6 lg:px-8 lg:pt-0 lg:pb-16">
      <div className="mx-auto max-w-[1440px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-6 max-w-5xl text-center"
        >
          <h2 className="font-serif text-[clamp(2.1rem,3.8vw,3.4rem)] font-extrabold leading-[1] tracking-[-0.04em]">
            <span className="text-[#071225]">Exclusive Scholarship</span>{" "}
            <span className="text-[#C41E3A]">Opportunities</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Reduce your tuition burden with partner-university scholarships and
            expert financial aid guidance.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {featuredScholarships.map((scholarship) => {
            const university = universityById.get(scholarship.universityId)
            const deadlineLabel = scholarship.deadline
              ? new Date(scholarship.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Rolling'

            return (
              <motion.article
                key={scholarship.id}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-gradient-to-b from-white via-white to-[#FCFCFD] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-500 ease-out hover:border-[#C41E3A]/20 hover:shadow-[0_30px_80px_rgba(196,30,58,0.12)]"
              >
                {/* University watermark/silhouette */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 bg-[url('/images/university-silhouette.svg')] bg-[length:170%] bg-bottom bg-no-repeat opacity-[0.02]" />

                {/* Glow effect */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#C41E3A]/10 blur-3xl opacity-0 transition-all duration-700 group-hover:opacity-100" />

                {/* Floating arrow button */}
                <button
                  className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#F1D5DB] bg-[#FAF1F3] transition-all duration-500 group-hover:scale-110 group-hover:border-[#C41E3A] group-hover:bg-[#C41E3A] group-hover:shadow-[0_10px_25px_rgba(196,30,58,0.35)]"
                  aria-label="View scholarship details"
                >
                  <ArrowRight className="h-4 w-4 text-[#C41E3A] transition-all duration-500 group-hover:translate-x-1 group-hover:text-white" />
                </button>

                {/* Header Section */}
                <div className="relative z-10 mb-5 flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:shadow-md">
                    <Image
                      src={university?.logo ?? fallbackUniversityImage}
                      alt={`${scholarship.universityName} logo`}
                      width={42}
                      height={42}
                      className="h-10 w-10 object-contain"
                    />
                  </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <h3 className="line-clamp-1 text-[19px] font-bold leading-6 tracking-normal text-[#111827]">
                        {scholarship.universityName}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
                        <span className="line-clamp-1">
                          {university?.country ?? 'International'}
                        </span>
                      </p>
                    </div>
                  </div>

                {/* Percentage Section */}
                <div className="relative z-10 mb-6">
                  <h3 className="font-serif text-[46px] font-bold leading-none tracking-[-0.04em] text-[#C41E3A] lg:text-[52px]">
                    {scholarship.percentage}%
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Tuition Coverage
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="relative z-10 mt-5 border-t border-slate-100 pt-4">
                  <div>
                    <h3 className="font-serif text-[1.45rem] font-bold leading-tight text-[#071225]">
                      {scholarship.universityName}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Merit Based Award
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-2 gap-2 text-[13px] font-semibold text-slate-600">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
                        <span className="line-clamp-1">
                          {university?.country ?? "International"}
                        </span>
                      </div>
                      <div className="flex min-w-0 items-center justify-end gap-1.5 text-right">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
                        <span className="line-clamp-1">{deadlineLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}