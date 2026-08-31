'use client'

import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { ArrowRight, Building2, Landmark, Wallet } from "lucide-react"
import { trpc } from "@/lib/trpc-client"
import { ROUTES } from "@/lib/config/routes"

type Destination = {
  name: string
  flag: string
  flagAlt: string
  href: string
  image: string
  imageAlt: string
  description: string
  universities: string
  avgTuition: string
}

const destinations: Destination[] = [
  {
    name: "South Korea",
    flag: "/flags/kr.png",
    flagAlt: "South Korea flag",
    href: ROUTES.countries.southKorea,
    image:
      "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Seoul city skyline in South Korea",
    description:
      "Innovative education with world-class universities and vibrant culture.",
    universities: "120+",
    avgTuition: "$5,000/year",
  },
  {
    name: "Australia",
    flag: "/flags/au.png",
    flagAlt: "Australia flag",
    href: ROUTES.countries.australia,
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Sydney Opera House and harbor in Australia",
    description:
      "Research-led education with practical careers and coastal student life.",
    universities: "90+",
    avgTuition: "$20,000/year",
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.16,
    },
  },
}

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
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: { duration: 0.28, ease: "easeOut" },
      }}
      className="group relative flex w-full flex-col overflow-hidden rounded-[24px] border border-[#E7EAF0] bg-white shadow-[0_16px_42px_rgba(15,23,42,0.07)] transition-all duration-300 hover:border-[#C41E3A]/20 hover:shadow-[0_24px_60px_rgba(196,30,58,0.10)]"
    >
      <div className="relative h-[112px] shrink-0 overflow-hidden sm:h-[118px] lg:h-[124px]">
        <Image
          src={destination.image}
          alt={destination.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, 340px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071225]/20 via-[#071225]/15 to-[#071225]/62" />

        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/55 bg-white/82 shadow-[0_10px_24px_rgba(15,23,42,0.16)] backdrop-blur-xl">
          <Image
            src={destination.flag}
            alt={destination.flagAlt}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5">
        <div className="flex items-start gap-3">
          <h3 className="flex-1 text-[19px] font-semibold leading-[1.15] tracking-tight text-[#071225] sm:text-[20px]">
            {destination.name}
          </h3>

          <Link
            href={destination.href}
            aria-label={`Explore universities in ${destination.name}`}
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C41E3A]/20 bg-[#FFF5F6] transition-all duration-300 group-hover:border-[#C41E3A] group-hover:bg-[#C41E3A]"
          >
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 text-[#C41E3A] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
            />
          </Link>
        </div>

        <p className="mt-2 line-clamp-2 min-h-[2.6em] text-[13px] leading-[1.45] text-slate-600 sm:text-[13.5px]">
          {destination.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#EDF0F4] pt-3.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF5F6] text-[#C41E3A]">
              <Building2 aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
            <p className="truncate text-[12.5px] font-semibold leading-4 text-[#071225] sm:text-[13px]">
              {destination.universities} Universities
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF5F6] text-[#C41E3A]">
              <Wallet aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
            <p className="truncate text-[12.5px] font-semibold leading-4 text-[#071225] sm:text-[13px]">
              {destination.avgTuition}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function CountryExplorer() {
  const { data: countryData } = trpc.university.countries.useQuery()
  const countByCountry = new Map<string, number>(
    (countryData ?? []).map((c: any) => [c.country, Number(c.count) || 0])
  )

  const destinationsWithCounts = destinations.map((d) => ({
    ...d,
    universities: countByCountry.get(d.name)
      ? `${countByCountry.get(d.name)}+`
      : d.universities,
  }))

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
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
        <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm sm:text-xs">
            Study Destinations
          </span>
          <h2 className="mt-4 text-[28px] font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-[42px]">
            Find Your Ideal Study <span className="text-[#C41E3A]">Destination</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-gray-500 sm:text-base">
            Discover the world&apos;s best education destinations and find the
            perfect fit for your future.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto grid max-w-[360px] grid-cols-1 gap-5 sm:max-w-[720px] sm:grid-cols-2 sm:gap-6 lg:max-w-[760px] lg:gap-7"
        >
          {destinationsWithCounts.map((destination) => (
            <DestinationCard key={destination.name} destination={destination} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mt-6 max-w-[360px] overflow-hidden rounded-[22px] border border-[#E7EAF0] bg-white px-5 py-5 shadow-[0_16px_42px_rgba(15,23,42,0.06)] sm:mt-8 sm:max-w-[720px] sm:px-6 lg:max-w-[760px]"
        >
          <div className="flex min-h-[90px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF5F6] text-[#C41E3A]">
                <Landmark aria-hidden="true" className="h-5 w-5" />
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

            <Link
              href={ROUTES.home}
              aria-label="Get free consultation with our education experts"
              className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#B11226] via-[#8B0E1A] to-[#5F0710] px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(139,14,26,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(139,14,26,0.32)] sm:w-auto"
            >
              Get Free Consultation
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
