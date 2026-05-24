"use client";

import { Navbar } from "@/components/layout/Navbar";
import HeroSection from "@/components/universities/hero-section";
import UniversityMarquee from "@/components/universities/university-marquee";
import FeaturedUniversities from "@/components/universities/featured-universities";
import StatisticsSection from "@/components/universities/statistics-section";
import CountryExplorer from "@/components/universities/country-explorer";
import ScholarshipSpotlight from "@/components/universities/scholarship-spotlight";
import StudentSuccessStories from "@/components/universities/student-success-stories";
import ApplicationRoadmap from "@/components/universities/application-roadmap";
import PremiumConsultationCTA from "@/components/universities/premium-consultation-cta";
import UniversitiesFooter from "@/components/universities/footer";
import StickyFilterBar from "@/components/universities/sticky-filter-bar";

export default function UniversitiesPage() {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <section className="relative overflow-x-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="pt-4 pb-8 lg:pb-12">
            <Navbar />
          </div>
          <HeroSection />
        </div>
      </section>
      <UniversityMarquee />
      <FeaturedUniversities />
      <StatisticsSection />
      <CountryExplorer />
      <ScholarshipSpotlight />
      <StudentSuccessStories />
      <ApplicationRoadmap />
      <PremiumConsultationCTA />
      <UniversitiesFooter />
      <StickyFilterBar />
    </div>
  );
}
