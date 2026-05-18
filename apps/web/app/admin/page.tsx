import {
  CalendarDays,
  Clock3,
  FileText,
  Users,
} from "lucide-react";

import AnalyticsChart from "@/components/admin/dashboard/AnalyticsChart";
import TopCountries from "@/components/admin/dashboard/TopCountries";
import UpcomingConsultations from "@/components/admin/dashboard/UpcomingConsultations";

const stats = [
  {
    title: "Total Students",
    value: "2,587",
    growth: "+12.5%",
    icon: Users,
  },
  {
    title: "Applications",
    value: "1,368",
    growth: "+8.2%",
    icon: FileText,
  },
  {
    title: "Pending Docs",
    value: "324",
    growth: "+4.3%",
    icon: Clock3,
  },
  {
    title: "Consultations",
    value: "156",
    growth: "+15.7%",
    icon: CalendarDays,
  },
];

const activities = [
  {
    title: "New student registered",
    time: "2 min ago",
  },
  {
    title: "Document approved",
    time: "15 min ago",
  },
  {
    title: "Counselor assigned",
    time: "25 min ago",
  },
  {
    title: "New application received",
    time: "1 hour ago",
  },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[1380px] space-y-3">
      
      {/* HERO */}
      <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
        
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back, Super Admin! 👋
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Here's what's happening with your applications today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          
          <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-[#1a1d25] dark:text-gray-300 dark:hover:bg-[#222530]">
            May 20, 2025 - May 26, 2025
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        
        {/* LEFT CONTENT */}
        <div className="space-y-3 xl:col-span-9">
          
          {/* STATS */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]"
                >
                  
                  <div className="flex items-center gap-3">
                    
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-50 to-red-100 text-primary shadow-inner dark:bg-[#2a1114] shrink-0">
                      <Icon size={16} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {item.title}
                      </p>

                      <h2 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                        {item.value}
                      </h2>

                      <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-500">
                        vs last 7 days
                      </p>
                    </div>

                    <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600 dark:bg-green-500/10 dark:text-green-400 shrink-0 whitespace-nowrap">
                      {item.growth}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 items-stretch gap-2 xl:grid-cols-12">
            
            {/* CHART */}
            <div className="flex xl:col-span-7">
              <AnalyticsChart />
            </div>

            {/* COUNTRIES */}
            <div className="flex xl:col-span-5">
              <TopCountries />
            </div>
          </div>

          {/* PIPELINE */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Application Pipeline
            </h2>

            <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-5">
              
              <div className="rounded-lg bg-red-50 px-3 py-2.5 dark:bg-[#2a1114]">
                <p className="text-xs font-medium text-red-600">
                  New Lead
                </p>

                <h3 className="mt-1 text-lg font-bold text-red-700 dark:text-red-400">
                  128
                </h3>
              </div>

              <div className="rounded-lg bg-blue-50 px-3 py-2.5 dark:bg-[#111b2a]">
                <p className="text-xs font-medium text-blue-600">
                  Consulting
                </p>

                <h3 className="mt-1 text-lg font-bold text-blue-700 dark:text-blue-400">
                  256
                </h3>
              </div>

              <div className="rounded-lg bg-yellow-50 px-3 py-2.5 dark:bg-[#2a2311]">
                <p className="text-xs font-medium text-yellow-600">
                  Documents
                </p>

                <h3 className="mt-1 text-lg font-bold text-yellow-700 dark:text-yellow-400">
                  312
                </h3>
              </div>

              <div className="rounded-lg bg-purple-50 px-3 py-2.5 dark:bg-[#21112a]">
                <p className="text-xs font-medium text-purple-600">
                  Applying
                </p>

                <h3 className="mt-1 text-lg font-bold text-purple-700 dark:text-purple-400">
                  248
                </h3>
              </div>

              <div className="rounded-lg bg-green-50 px-3 py-2.5 dark:bg-[#112a1a]">
                <p className="text-xs font-medium text-green-600">
                  Completed
                </p>

                <h3 className="mt-1 text-lg font-bold text-green-700 dark:text-green-400">
                  1,245
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-3 xl:col-span-3">
          
          <UpcomingConsultations />

          {/* ACTIVITIES */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
            
            <div className="flex items-center justify-between">
              
              <h2 className="text-xs font-semibold text-gray-900 dark:text-white">
                Recent Activities
              </h2>

              <button className="text-xs font-medium text-primary">
                View All
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {activities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}