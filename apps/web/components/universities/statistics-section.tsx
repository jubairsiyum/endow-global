"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp, Users, Globe, Award } from "lucide-react";

interface StatConfig {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      onViewportEnter={() => {
        const increment = value / (duration * 60);
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            setDisplayValue(value);
            clearInterval(timer);
          } else {
            setDisplayValue(Math.floor(current));
          }
        }, 16);
      }}
      viewport={{ once: true }}
    >
      {Math.floor(displayValue).toLocaleString()}
    </motion.span>
  );
};

export default function StatisticsSection() {
  const stats: StatConfig[] = [
    {
      value: 5000,
      suffix: "+",
      label: "Students Abroad",
      icon: <Users className="h-6 w-6" />,
      color: "from-blue-600 to-cyan-600",
    },
    {
      value: 250,
      suffix: "+",
      label: "Partner Universities",
      icon: <Award className="h-6 w-6" />,
      color: "from-purple-600 to-pink-600",
    },
    {
      value: 45,
      suffix: "",
      label: "Countries Covered",
      icon: <Globe className="h-6 w-6" />,
      color: "from-green-600 to-emerald-600",
    },
    {
      value: 98,
      suffix: "%",
      label: "Visa Success Rate",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-red-600 to-orange-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-br from-white via-slate-50 to-white overflow-x-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-red-200 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-red-100 opacity-10 blur-3xl"></div>
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
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Global Success by Numbers
          </h2>
          <p className="mx-auto max-w-2xl text-base lg:text-lg text-gray-600">
            Join thousands of students who have successfully pursued their
            education dreams globally
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl overflow-hidden bg-white/85 backdrop-blur-sm border border-white/50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_36px_rgba(196,30,58,0.1)] transition-all duration-300 hover:border-red-200 lg:p-6"
            >
              {/* Glow effect */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r ${stat.color} blur-3xl`}
              ></div>

              <div className="relative space-y-4">
                {/* Icon */}
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.3 }}
                  className={`inline-flex rounded-xl bg-gradient-to-br ${stat.color} p-3 text-white`}
                >
                  {stat.icon}
                </motion.div>

                {/* Counter */}
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    <AnimatedCounter value={stat.value} />
                    <span>{stat.suffix}</span>
                  </div>
                </div>

                {/* Label */}
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
            Trusted by leading education consultants worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
}
