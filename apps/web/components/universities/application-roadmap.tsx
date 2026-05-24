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
    color: "from-blue-600 to-cyan-600",
  },
  {
    number: 2,
    title: "University Matching",
    description: "Get personalized university recommendations using AI",
    icon: Search,
    color: "from-purple-600 to-pink-600",
  },
  {
    number: 3,
    title: "Document Preparation",
    description: "Prepare all required documents with our expert guidance",
    icon: FileText,
    color: "from-green-600 to-emerald-600",
  },
  {
    number: 4,
    title: "Application",
    description: "Submit complete applications to selected universities",
    icon: Send,
    color: "from-orange-600 to-red-600",
  },
  {
    number: 5,
    title: "Interview",
    description: "Prepare and conduct university interviews",
    icon: Video,
    color: "from-indigo-600 to-blue-600",
  },
  {
    number: 6,
    title: "Visa Processing",
    description: "Navigate the visa application process with full support",
    icon: Shield,
    color: "from-teal-600 to-green-600",
  },
  {
    number: 7,
    title: "Departure",
    description: "Final preparations and welcome to your new chapter",
    icon: Plane,
    color: "from-pink-600 to-rose-600",
  },
];

export default function ApplicationRoadmap() {
  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-br from-white via-slate-50 to-white overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-blue-200 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-purple-200 opacity-10 blur-3xl"></div>
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
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600">
              Your Journey
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Your Application Roadmap
          </h2>
          <p className="mx-auto max-w-2xl text-base lg:text-lg text-gray-600">
            We guide you through every step of your international education
            journey
          </p>
        </motion.div>

        {/* Timeline - Desktop View */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-[#C41E3A] via-[#E11D48] to-[#C41E3A] transform -translate-y-1/2"></div>

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
                      whileHover={{ scale: 1.1 }}
                      className={`relative mb-6 h-20 w-20 rounded-full bg-gradient-to-br ${step.color} p-1 shadow-lg`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                        <Icon className="h-9 w-9 text-gray-900" />
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 h-7 w-7 rounded-full bg-white flex items-center justify-center text-sm font-bold text-gray-900 shadow-lg">
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
                  <div className="absolute left-9 top-20 h-16 w-px bg-gradient-to-b from-[#C41E3A] to-[#E11D48]"></div>
                )}

                {/* Circle */}
                <div className={`relative flex-shrink-0 h-20 w-20 rounded-full bg-gradient-to-br ${step.color} p-1 shadow-lg`}>
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <Icon className="h-8 w-8 text-gray-900" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 h-7 w-7 rounded-full bg-white flex items-center justify-center text-sm font-bold text-gray-900 shadow-lg">
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
          <button className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#C41E3A] to-[#E11D48] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,30,58,0.22)] hover:shadow-[0_16px_32px_rgba(196,30,58,0.28)] transition-all hover:scale-[1.02]">
            Schedule Your Consultation
          </button>
        </motion.div>
      </div>
    </section>
  );
}
