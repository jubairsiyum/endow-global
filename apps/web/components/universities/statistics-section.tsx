'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { TrendingUp, Users, Globe, Award } from 'lucide-react'

interface StatConfig {
  value: number
  suffix: string
  label: string
  icon: React.ReactNode
}

const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true
          const start = performance.now()
          let raf: number
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / (duration * 1000))
            const eased = 1 - Math.pow(1 - t, 3)
            setDisplayValue(Math.floor(value * eased))
            if (t < 1) {
              raf = requestAnimationFrame(tick)
            } else {
              setDisplayValue(value)
            }
          }
          raf = requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}
    </span>
  )
}

export default function StatisticsSection() {
  const stats: StatConfig[] = [
    {
      value: 5000,
      suffix: '+',
      label: 'Students Abroad',
      icon: <Users className="h-6 w-6" />,
    },
    {
      value: 250,
      suffix: '+',
      label: 'Partner Universities',
      icon: <Award className="h-6 w-6" />,
    },
    {
      value: 45,
      suffix: '',
      label: 'Countries Covered',
      icon: <Globe className="h-6 w-6" />,
    },
    {
      value: 98,
      suffix: '%',
      label: 'Visa Success Rate',
      icon: <TrendingUp className="h-6 w-6" />,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative overflow-x-hidden bg-[#F8FAFC] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-500/10 opacity-20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6 text-center"
        >
          <h2 className="text-[clamp(2.75rem,4.5vw,5rem)] font-bold tracking-normal leading-[1.05]">
            <span className="text-[#071225]">Global</span>{' '}
            <span className="text-[#C41E3A]">Success</span>{' '}
            <span className="text-[#071225]">by Numbers</span>
          </h2>
          
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Join thousands of students who have successfully pursued their education dreams globally
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
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-red-100"
            >
              <div className="relative space-y-4">
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 6 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex rounded-2xl border border-red-100 bg-red-50 p-3 text-[#C41E3A]"
                >
                  {stat.icon}
                </motion.div>

                <div>
                  <div className="text-3xl font-bold text-gray-900">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-sm font-semibold text-[#C41E3A]">
            Trusted by leading education consultants worldwide
          </p>
        </motion.div>
      </div>
    </section>
  )
}