"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Landmark, MapPin } from "lucide-react";

type UniversityOpportunity = {
  id: string;
  program: string;
  university: string;
  location: string;
  price: string;
  logo: string;
};

const universityOpportunities: UniversityOpportunity[] = [
  {
    id: "aalto-business",
    program: "Global Business Leadership",
    university: "Aalto University",
    location: "Finland",
    price: "A$ 26,880",
    logo: "/universities/Aalto University.png",
  },
  {
    id: "helsinki-data",
    program: "Data Science & AI",
    university: "Helsinki University",
    location: "Finland",
    price: "A$ 28,450",
    logo: "/universities/Helsinki University.png",
  },
  {
    id: "turku-health",
    program: "Health Innovation",
    university: "Turku University",
    location: "Finland",
    price: "A$ 25,970",
    logo: "/universities/Turku University.png",
  },
  {
    id: "kyunghee-hospitality",
    program: "Hospitality Management",
    university: "Kyung Hee University",
    location: "South Korea",
    price: "A$ 18,620",
    logo: "/universities/Kyung Hee University.png",
  },
  {
    id: "sejong-engineering",
    program: "Smart Systems Engineering",
    university: "Sejong University",
    location: "South Korea",
    price: "A$ 20,140",
    logo: "/universities/Sejong University.png",
  },
  {
    id: "busan-maritime",
    program: "Maritime Business",
    university: "Busan University",
    location: "South Korea",
    price: "A$ 17,900",
    logo: "/universities/Busan University.png",
  },
  {
    id: "sunmoon-global",
    program: "International Relations",
    university: "Sun Moon University",
    location: "South Korea",
    price: "A$ 16,780",
    logo: "/universities/Sun Moon University.png",
  },
  {
    id: "hanseo-aviation",
    program: "Aviation Operations",
    university: "Hanseo University",
    location: "South Korea",
    price: "A$ 19,360",
    logo: "/universities/Hanseo University.png",
  },
  {
    id: "sahmyook-biotech",
    program: "Biotechnology",
    university: "Sahmyook University",
    location: "South Korea",
    price: "A$ 18,240",
    logo: "/universities/Sahmyook University.png",
  },
  {
    id: "daejin-design",
    program: "Digital Media Design",
    university: "Daejin University",
    location: "South Korea",
    price: "A$ 15,980",
    logo: "/universities/Daejin University.png",
  },
  {
    id: "dongeui-robotics",
    program: "Robotics Engineering",
    university: "Dong-Eui University",
    location: "South Korea",
    price: "A$ 17,420",
    logo: "/universities/Dong-Eui University.png",
  },
  {
    id: "yeungjin-computing",
    program: "Cloud Computing",
    university: "Yeungjin University",
    location: "South Korea",
    price: "A$ 14,890",
    logo: "/universities/Yeungjin University.png",
  },
];

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 26,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function UniversityCard({ opportunity }: { opportunity: UniversityOpportunity }) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: {
          duration: 0.25,
          ease: "easeOut",
        },
      }}
      className="group relative flex min-h-[170px] overflow-hidden rounded-[24px] border border-[#F1F5F9] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.055)] transition-shadow duration-300 hover:shadow-[0_28px_70px_rgba(139,14,26,0.16)]"
    >
      <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#8B0E1A] via-[#A91324] to-[#C9A15B] transition-transform duration-500 ease-out group-hover:scale-x-100" />

      <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#F8EFE1] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <Image
              src={opportunity.logo}
              alt={`${opportunity.university} logo`}
              width={44}
              height={44}
              className="max-h-11 w-auto object-contain"
            />
          </div>

          <div className="min-w-0 pt-0.5">
            <h3 className="font-serif text-[21px] font-bold leading-tight text-[#111827]">
              {opportunity.program}
            </h3>

            <p className="mt-2 truncate text-sm font-medium text-slate-500">
              {opportunity.university}
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-[#C9A15B]" />
              <span>{opportunity.location}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-end justify-between gap-4 border-t border-[#EEF2F6] pt-4 sm:min-w-[150px] sm:items-center sm:justify-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-400">
              From
            </p>

            <p className="mt-2 text-[26px] font-extrabold leading-none tracking-normal text-[#8B0E1A] transition-colors duration-300 group-hover:text-[#6F0914]">
              {opportunity.price}
            </p>
          </div>

          <button
            type="button"
            aria-label={`View ${opportunity.program} at ${opportunity.university}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#8B0E1A] text-[#8B0E1A] transition-all duration-300 group-hover:bg-[#8B0E1A] group-hover:text-white"
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturedUniversities() {
  return (
    <section className="relative overflow-hidden bg-[#FBFAF7] px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-28 h-[420px] w-[420px] rounded-full bg-white/90 blur-3xl" />
        <div className="absolute -right-24 top-8 h-[520px] w-[520px] rounded-full bg-[#F7EBD5]/70 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8D5B1] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-16 max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-3 text-[#C9A15B]">
            <span className="h-px w-10 bg-[#C9A15B] sm:w-14" />
            <Landmark className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.34em]">
              Featured Partners
            </span>
            <span className="h-px w-10 bg-[#C9A15B] sm:w-14" />
          </div>

          <h2 className="font-serif text-5xl font-semibold leading-[1.05] tracking-normal text-[#111827] sm:text-6xl lg:text-[64px]">
            Premium{" "}
            <span className="text-[#8B0E1A]">
              University Opportunities
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-500 sm:text-lg">
            Handpicked universities offering world-class education with
            exclusive scholarships and visa guarantees.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {universityOpportunities.map((opportunity) => (
            <UniversityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <button
            type="button"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#760B16] via-[#8B0E1A] to-[#A91324] px-9 py-4 text-sm font-bold text-white shadow-[0_18px_45px_rgba(201,161,91,0.34)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(201,161,91,0.48)] sm:px-11"
          >
            <GraduationCap className="h-5 w-5 text-[#F4D99A]" />
            <span>View All Universities</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
