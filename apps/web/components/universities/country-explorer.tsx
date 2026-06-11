'use client'

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Globe2,
  Landmark,
  Wallet,
} from "lucide-react";
import ScrollFloat from "@/components/animations/ScrollFloat";

type Destination = {
  name: string;
  flag: string;
  image: string;
  imageAlt: string;
  description: string;
  universities: string;
  avgTuition: string;
};

const destinations: Destination[] = [
  {
    name: "South Korea",
    flag: "\uD83C\uDDF0\uD83C\uDDF7",
    image:
      "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Seoul city skyline in South Korea",
    description:
      "Innovative education with world-class universities and vibrant culture.",
    universities: "120+",
    avgTuition: "$5,000/year",
  },
  {
    name: "USA",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    image:
      "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "New York skyline and Statue of Liberty in the United States",
    description:
      "Global leader in higher education with diverse opportunities.",
    universities: "4,000+",
    avgTuition: "$35,000/year",
  },
  {
    name: "United Kingdom",
    flag: "\uD83C\uDDEC\uD83C\uDDE7",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Big Ben and London skyline in the United Kingdom",
    description:
      "Prestigious universities with globally respected academic pathways.",
    universities: "160+",
    avgTuition: "$28,000/year",
  },
  {
    name: "Canada",
    flag: "\uD83C\uDDE8\uD83C\uDDE6",
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Toronto skyline in Canada",
    description:
      "Welcoming campuses, strong work pathways, and excellent quality of life.",
    universities: "100+",
    avgTuition: "$16,000/year",
  },
  {
    name: "Australia",
    flag: "\uD83C\uDDE6\uD83C\uDDFA",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Sydney Opera House and harbor in Australia",
    description:
      "Research-led education with practical careers and coastal student life.",
    universities: "90+",
    avgTuition: "$20,000/year",
  },
  {
    name: "Japan",
    flag: "\uD83C\uDDEF\uD83C\uDDF5",
    image:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Mount Fuji and pagoda in Japan",
    description:
      "Advanced learning, rich culture, and affordable global study routes.",
    universities: "780+",
    avgTuition: "$5,000/year",
  },
  {
    name: "Germany",
    flag: "\uD83C\uDDE9\uD83C\uDDEA",
    image:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Berlin city landmark in Germany",
    description:
      "World-class public universities with strong engineering and research.",
    universities: "420+",
    avgTuition: "$3,000/year",
  },
  {
    name: "France",
    flag: "\uD83C\uDDEB\uD83C\uDDF7",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Paris skyline and Eiffel Tower in France",
    description:
      "Elite business schools, design programs, and European culture.",
    universities: "250+",
    avgTuition: "$12,000/year",
  },
  {
    name: "Ireland",
    flag: "\uD83C\uDDEE\uD83C\uDDEA",
    image:
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Dublin city architecture in Ireland",
    description:
      "English-taught programs with technology careers and post-study routes.",
    universities: "30+",
    avgTuition: "$15,000/year",
  },
  {
    name: "Finland",
    flag: "\uD83C\uDDEB\uD83C\uDDEE",
    image:
      "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Helsinki waterfront and architecture in Finland",
    description:
      "Future-focused education with safe cities and innovation-led campuses.",
    universities: "40+",
    avgTuition: "$13,000/year",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.16,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: { duration: 0.28, ease: "easeOut" },
      }}
      className="group relative mx-auto h-[285px] max-w-[300px] overflow-hidden rounded-[24px] overflow-hidden rounded-[24px] border border-[#E7EAF0] bg-white shadow-[0_16px_42px_rgba(15,23,42,0.07)] transition-all duration-300 hover:border-[#C41E3A]/20 hover:shadow-[0_24px_60px_rgba(196,30,58,0.10)]"
    >
      <div className="relative h-[95px] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071225]/20 via-[#071225]/15 to-[#071225]/62" />

        <div className="absolute left-4 top-4 flex h-10 min-w-10 items-center justify-center rounded-2xl border border-white/55 bg-white/82 px-2.5 text-xl shadow-[0_10px_24px_rgba(15,23,42,0.16)] backdrop-blur-xl">
          {destination.flag}
        </div>
      </div>

      <div className="flex h-[180px] flex-col px-4 pb-4 pt-3">
        <div className="min-h-[48px] flex items-start gap-3">
          <h3 className="flex-1 text-[20px] font-semibold leading-[1.1] text-[#071225]">
            {destination.name}
          </h3>

          <div
            className="
      ml-auto
      flex
      h-10
      w-10
      shrink-0
      items-center
      justify-center
      rounded-full
      border
      border-[#C41E3A]/20
      bg-[#FFF5F6]
      transition-all
      duration-300
      group-hover:border-[#C41E3A]
      group-hover:bg-[#C41E3A]
    "
          >
            <ArrowRight
              className="
        h-4
        w-4
        text-[#C41E3A]
        transition-all
        duration-300
        group-hover:translate-x-0.5
        group-hover:text-white
      "
            />
          </div>
        </div>

        <p className="mt-1.5 line-clamp-2 min-h-9 text-[13px] leading-5 leading-[1.3] text-slate-600">
          {destination.description}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-[#EDF0F4] pt-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF5F6] text-[#C41E3A]">
              <Building2 className="h-3.5 w-3.5" />
            </span>
            <p className="text-[13px] font-semibold leading-4 text-[#071225]">
              {destination.universities} Universities
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF5F6] text-[#C41E3A]">
              <Wallet className="h-3.5 w-3.5" />
            </span>
            <p className="text-[13px] font-semibold leading-4 text-[#071225]">
              {destination.avgTuition}
            </p>
          </div>
        </div>

      </div>
    </motion.article>
  );
}

export default function CountryExplorer() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] px-4 pt-6 pb-12 sm:px-6 lg:px-8 lg:pt-8 lg:pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8D7A8] to-transparent" />
        <div className="absolute -right-28 top-10 h-[420px] w-[420px] rounded-full bg-[#C41E3A]/[0.08] blur-3xl" />
        <div className="absolute -left-32 bottom-10 h-[360px] w-[360px] rounded-full bg-white blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, margin: "-80px" }}
        className="relative mx-auto max-w-[1320px]"
      >
        <div className="mx-auto mb-8 max-w-4xl text-center">


          <div className="mt-2 text-center">
            <h2 className="text-[clamp(2rem,3.5vw,3.4rem)] font-bold tracking-normal leading-[1.05]">
              <span className="text-[#071225]">
                Find Your Ideal Study
              </span>{" "}
              <span className="text-[#C41E3A]">
                Destination
              </span>
            </h2>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Discover the world&apos;s best education destinations and find the
            perfect fit for your future.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-7"
        >
          {destinations.map((destination) => (
            <DestinationCard key={destination.name} destination={destination} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="mt-8 overflow-hidden rounded-[22px] border border-[#E7EAF0] bg-white px-5 py-5 shadow-[0_16px_42px_rgba(15,23,42,0.06)] sm:px-6"
        >
          <div className="flex min-h-[90px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF5F6] text-[#C41E3A]">
                <Landmark className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-xl font-semibold leading-tight text-[#071225] sm:text-2xl">
                  Can&apos;t decide where to study?
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  Our experts will help.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#B11226] via-[#8B0E1A] to-[#5F0710] px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(139,14,26,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(139,14,26,0.32)]"
            >
              Get Free Consultation
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
