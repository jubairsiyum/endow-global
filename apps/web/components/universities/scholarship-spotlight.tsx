"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Award, MapPin } from "lucide-react";
import { scholarships, universities } from "@/lib/universities/data";
import ScrollFloat from "@/components/animations/ScrollFloat";
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
    <section className={ds.section}>
      <div className={ds.container}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={ds.header}
        >
          <div className={ds.badge}>
            <Award className="h-3.5 w-3.5" />
            <span>Financial Aid</span>
          </div>

          <ScrollFloat
            animationDuration={1.1}
            ease="back.inOut(1.8)"
            scrollStart="top bottom-=15%"
            scrollEnd="center center"
            stagger={0.015}
            containerClassName="scroll-title-highlight-scholarship mt-6 text-center !mb-0"
            textClassName={ds.heading}
          >
            Exclusive Scholarship Opportunities
          </ScrollFloat>

          <p className={ds.description}>
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
            const university = universityById.get(scholarship.universityId);

            return (
              <motion.article
                key={scholarship.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className={ds.card}
              >
                <div className="flex items-start gap-4">
                  <div className={ds.iconBox}>
                    <Image
                      src={university?.logo ?? fallbackUniversityImage}
                      alt={`${scholarship.universityName} logo`}
                      fill
                      sizes="48px"
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className={ds.cardTitle}>
                      {scholarship.universityName}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-xs font-bold uppercase text-[#64748B]">
                      <MapPin className="h-3.5 w-3.5 text-[#C41E3A]" />
                      <span className="line-clamp-1">
                        {university?.country ?? "International"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="my-8 text-center">
                  <p className="font-serif text-[56px] font-bold leading-none text-[#C41E3A]">
                    {scholarship.percentage}%
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase text-[#64748B]">
                    Scholarship
                  </p>
                </div>

                <button type="button" className={`${ds.primaryButton} mt-auto w-full`}>
                  Check Eligibility
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
