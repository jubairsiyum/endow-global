"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc-client";

const fallbackUniversityImage = "/universities/Hanseo University.png";

const COVERAGE_LABEL: Record<string, string> = {
  full: "Full tuition coverage",
  partial: "Partial tuition coverage",
  tuition_only: "Tuition coverage",
  living_only: "Living cost coverage",
};

const COVERAGE_HEADLINE: Record<string, string> = {
  full: "Full",
  partial: "Partial",
  tuition_only: "Tuition",
  living_only: "Living",
};

type SpotlightItem = {
  id: string | number;
  universityName: string;
  universityLogo: string;
  country: string;
  headline: string;
  caption: string;
  label: string;
  deadlineLabel: string;
  href: string;
  isExternal: boolean;
};

type DbScholarship = {
  id: number;
  name: string;
  amount: number | null;
  currencySymbol: string;
  coverageType: string;
  deadline: Date | null;
  universityName: string | null;
  universityLogo: string | null;
  country: string | null;
  linkUrl: string | null;
  universitySlug: string | null;
  universityWebsite: string | null;
};

function formatDeadline(d: string | Date | null | undefined): string {
  if (!d) return "Rolling";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "Rolling";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function countryToSlug(country: string | null): string | null {
  if (!country) return null;
  return country.trim().toLowerCase().replace(/\s+/g, "-");
}

function resolveHref(item: {
  linkUrl: string | null;
  universityWebsite: string | null;
  universitySlug: string | null;
  country: string | null;
}): { href: string; isExternal: boolean } {
  if (item.linkUrl) return { href: item.linkUrl, isExternal: true };
  if (item.universityWebsite) return { href: item.universityWebsite, isExternal: true };
  const slug = item.universitySlug;
  const countrySlug = countryToSlug(item.country);
  if (slug && countrySlug) return { href: `/universities/${countrySlug}/${slug}`, isExternal: false };
  if (slug) return { href: `/universities/${slug}`, isExternal: false };
  return { href: "/universities", isExternal: false };
}

function fromDb(s: DbScholarship): SpotlightItem {
  const coverage = COVERAGE_LABEL[s.coverageType] ?? "Scholarship coverage";
  const headline =
    s.amount != null
      ? `${s.currencySymbol}${s.amount.toLocaleString()}`
      : COVERAGE_HEADLINE[s.coverageType] ?? "Scholarship";
  const { href, isExternal } = resolveHref(s);

  return {
    id: s.id,
    universityName: s.universityName ?? "University",
    universityLogo: s.universityLogo || fallbackUniversityImage,
    country: s.country ?? "International",
    headline,
    caption: coverage,
    label: s.name,
    deadlineLabel: formatDeadline(s.deadline),
    href,
    isExternal,
  };
}

export default function ScholarshipSpotlight() {
  const { data, isLoading } = trpc.scholarship.featured.useQuery({ limit: 6 });

  const items: SpotlightItem[] = data ? data.map(fromDb) : [];

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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FCFCFD] via-[#F8FAFC] to-[#F1F5F9] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-6 max-w-5xl text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
            Scholarships
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Exclusive Scholarship <span className="text-[#C41E3A]">Opportunities</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
            Reduce your tuition burden with partner-university scholarships and
            expert financial aid guidance.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="min-h-[240px] animate-pulse rounded-[24px] border border-slate-200/70 bg-white"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-500">
              No exclusive scholarships are available right now.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              New opportunities are added by our admin team — check back soon or explore all
              universities.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {items.map((item) => (
              <motion.article
                key={item.id}
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex min-h-[240px] flex-col overflow-hidden rounded-[24px] border border-slate-200/70 bg-gradient-to-b from-white via-white to-[#FCFCFD] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-500 ease-out hover:border-[#C41E3A]/20 hover:shadow-[0_30px_80px_rgba(196,30,58,0.12)]"
              >
                {/* Stretched link — makes entire card clickable */}
                {item.isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${item.label} at ${item.universityName}`}
                    className="absolute inset-0 z-30"
                  />
                ) : (
                  <Link
                    href={item.href}
                    aria-label={`View ${item.label} at ${item.universityName}`}
                    className="absolute inset-0 z-30"
                  />
                )}

                {/* University watermark/silhouette */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 bg-[url('/images/university-silhouette.svg')] bg-[length:170%] bg-bottom bg-no-repeat opacity-[0.02]" />

                {/* Glow effect */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#C41E3A]/10 blur-3xl opacity-0 transition-all duration-700 group-hover:opacity-100" />

                {/* Floating arrow — visual affordance, pointer-events none so stretched link handles click */}
                <div
                  className="pointer-events-none absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#F1D5DB] bg-[#FAF1F3] transition-all duration-500 group-hover:scale-110 group-hover:border-[#C41E3A] group-hover:bg-[#C41E3A] group-hover:shadow-[0_10px_25px_rgba(196,30,58,0.35)]"
                  aria-hidden="true"
                >
                  <ArrowRight className="h-4 w-4 text-[#C41E3A] transition-all duration-500 group-hover:translate-x-1 group-hover:text-white" />
                </div>

                {/* Header Section */}
                <div className="relative z-10 mb-3 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.universityLogo}
                      alt={`${item.universityName} logo`}
                      className="h-8 w-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackUniversityImage;
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="line-clamp-1 text-[19px] font-bold leading-6 tracking-normal text-[#111827]">
                      {item.universityName}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
                      <span className="line-clamp-1">{item.country}</span>
                    </p>
                  </div>
                </div>

                {/* Coverage Section */}
                <div className="relative z-10 mb-4">
                  <h3 className="text-[46px] font-bold leading-none tracking-normal text-[#C41E3A] lg:text-[52px]">
                    {item.headline}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">{item.caption}</p>
                </div>

                {/* Bottom Section */}
                <div className="relative z-10 mt-5 border-t border-slate-100 pt-4">
                  <div>
                    <p className="line-clamp-1 text-sm font-medium text-slate-500">{item.label}</p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-2 gap-2 text-[13px] font-semibold text-slate-600">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
                        <span className="line-clamp-1">{item.country}</span>
                      </div>
                      <div className="flex min-w-0 items-center justify-end gap-1.5 text-right">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#C9A15B]" />
                        <span className="line-clamp-1">{item.deadlineLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
            </motion.div>
            {items.length > 0 && (
              <div className="mt-10 flex justify-center">
                <Link
                  href="/scholarships"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#C41E3A] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(196,30,58,0.18)] transition-all hover:bg-[#A01830] hover:shadow-[0_12px_32px_rgba(196,30,58,0.24)]"
                >
                  See all scholarships
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
