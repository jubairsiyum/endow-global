"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  FileText,
  Send,
  Video,
  Shield,
  Plane,
  CheckCircle2,
} from "lucide-react";

const roadmapSteps = [
  {
    number: 1,
    title: "Consultation",
    description: "Discuss your academic goals and profile with our counselors",
    icon: MessageSquare,
  },
  {
    number: 2,
    title: "University Matching",
    description: "Get personalized university recommendations using AI",
    icon: Search,
  },
  {
    number: 3,
    title: "Document Preparation",
    description: "Prepare all required documents with our expert guidance",
    icon: FileText,
  },
  {
    number: 4,
    title: "Application",
    description: "Submit complete applications to selected universities",
    icon: Send,
  },
  {
    number: 5,
    title: "Interview",
    description: "Prepare and conduct university interviews",
    icon: Video,
  },
  {
    number: 6,
    title: "Visa Processing",
    description: "Navigate the visa application process with full support",
    icon: Shield,
  },
  {
    number: 7,
    title: "Departure",
    description: "Final preparations and welcome to your new chapter",
    icon: Plane,
  },
];

export default function ApplicationRoadmap() {
  return (
    <section className="relative overflow-x-hidden bg-[#F8FAFC] py-16 lg:py-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-500/10 opacity-20 blur-3xl" />
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
            <CheckCircle2 className="h-3.5 w-3.5 text-[#C41E3A]" />
            <span className="text-xs font-medium text-[#C41E3A]">
              Your Journey
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            Your Application Roadmap
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            We guide you through every step of your international education
            journey
          </p>
        </motion.div>

        {/* Timeline - Desktop View */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-16 h-px -translate-y-1/2 transform bg-gradient-to-r from-[#C41E3A] via-red-400 to-[#C41E3A]"></div>

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative grid gap-8 lg:grid-cols-7"
            >
              {roadmapSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                  >
                    {/* Circle with icon */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="relative mb-5 h-16 w-16 rounded-full border border-red-100 bg-white p-1 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-red-50">
                        <Icon className="h-7 w-7 text-[#C41E3A]" />
                      </div>
                      <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#C41E3A] text-xs font-bold text-white shadow-[0_8px_18px_rgba(196,30,58,0.2)]">
                        {step.number}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="text-center space-y-2">
                      <h3 className="font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Timeline - Mobile View */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:hidden space-y-6"
        >
          {roadmapSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative flex gap-6"
              >
                {/* Vertical line connector */}
                {idx < roadmapSteps.length - 1 && (
                  <div className="absolute left-8 top-16 h-16 w-px bg-gradient-to-b from-[#C41E3A] to-red-400"></div>
                )}

                {/* Circle */}
                <div className="relative h-16 w-16 flex-shrink-0 rounded-full border border-red-100 bg-white p-1 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-red-50">
                    <Icon className="h-7 w-7 text-[#C41E3A]" />
                  </div>
                  <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#C41E3A] text-xs font-bold text-white shadow-[0_8px_18px_rgba(196,30,58,0.2)]">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center space-y-4"
        >
          <h3 className="text-xl font-bold text-gray-900">
            Estimated Timeline: 4-6 Months
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our streamlined process ensures you're ready to start your
            international education journey on time, every time.
          </p>
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,30,58,0.18)] transition-shadow hover:shadow-red-200">
            Schedule Your Consultation
          </button>
        </motion.div>
      </div>
    </section>
  );
}
