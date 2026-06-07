"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Award, MapPin } from "lucide-react";
import { scholarships, universities } from "@/lib/universities/data";
import ScrollFloat from "@/components/animations/ScrollFloat";

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative overflow-x-hidden bg-white py-12 lg:py-14">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-0 h-[340px] w-[340px] rounded-full bg-red-500/10 opacity-20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 space-y-3 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
            <Award className="h-3.5 w-3.5 text-[#C41E3A]" />
            <span className="text-xs font-medium text-[#C41E3A]">
              Financial Aid
            </span>
          </div>
          <ScrollFloat
            animationDuration={1.1}
            ease="back.inOut(1.8)"
            scrollStart="top bottom-=15%"
            scrollEnd="center center"
            stagger={0.015}
            containerClassName="scroll-title-highlight-scholarship text-center !my-0"
            textClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-bold tracking-tight leading-none text-[#111827]"
          >
            Exclusive Scholarship Opportunities
          </ScrollFloat>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            Reduce your tuition burden with our partner universities&apos; exclusive
            scholarships and financial aid programs
          </p>
        </motion.div>

        {/* Scholarships Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {featuredScholarships.map((scholarship) => {
            const university = universityById.get(scholarship.universityId);

            return (
              <motion.div
                key={scholarship.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group relative h-[220px] overflow-hidden rounded-[18px] border border-[#EFE6D7] bg-white px-5 py-5 shadow-[0_16px_34px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-[#D6B36D] hover:shadow-[0_22px_44px_rgba(139,14,26,0.13)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#760B16] via-[#8B0E1A] to-[#C9A15B]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,161,91,0.13),transparent_34%)]" />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start gap-3">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#F0E4D1] bg-[#FFFDF9] p-1.5 shadow-[0_8px_18px_rgba(15,23,42,0.07)]">
                      <Image
                        src={university?.logo ?? fallbackUniversityImage}
                        alt={`${scholarship.universityName} logo`}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <h3 className="line-clamp-1 text-[19px] font-bold leading-6 tracking-normal text-[#111827]">
                        {scholarship.universityName}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
                        <span className="line-clamp-1">
                          {university?.country ?? "International"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <p className="font-serif text-[56px] font-semibold leading-none tracking-normal text-[#8B0E1A]">
                      {scholarship.percentage}%
                    </p>
                    <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.18em] text-[#C9A15B]">
                      Scholarship
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#8B0E1A] px-5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(139,14,26,0.2)] transition-all duration-300 hover:bg-[#760B16] hover:shadow-[0_14px_28px_rgba(139,14,26,0.28)]"
                  >
                    Check Eligibility
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
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
