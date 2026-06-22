import { Search, FileText, MessageSquare, Send, Plane } from 'lucide-react'
import { FadeUp } from '@/components/home/FadeUp'

const processSteps = [
  { icon: Search, title: 'Discover Programs', desc: 'Browse 50+ universities and courses in South Korea and Australia. Filter by degree, budget, and career goals.', bg: 'bg-violet-500' },
  { icon: FileText, title: 'Build Application', desc: 'Upload documents, write SOPs with AI assistance, and get counselor feedback.', bg: 'bg-blue-500' },
  { icon: MessageSquare, title: 'Expert Review', desc: 'Your dedicated counselor reviews your application and optimizes your profile.', bg: 'bg-amber-500' },
  { icon: Send, title: 'Submit & Track', desc: 'Submit applications across multiple universities. Track status in one dashboard.', bg: 'bg-emerald-500' },
  { icon: Plane, title: 'Fly Abroad', desc: 'Accept your offer, process your visa, and board your flight with confidence.', bg: 'bg-rose-500' },
] as const

export default function VisualHowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
              How It Works
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Five steps to your <span className="text-gradient-brand">dream campus</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
              A streamlined process designed to maximize your chances while minimizing stress.
            </p>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="relative">
                  {i < processSteps.length - 1 && (
                    <div className="absolute left-[27px] top-[52px] hidden h-px bg-gray-200 lg:block" style={{ width: 'calc(100% - 16px)' }} />
                  )}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-5">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.bg} shadow-lg`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-1.5 max-w-[200px] text-xs leading-relaxed text-gray-400">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
