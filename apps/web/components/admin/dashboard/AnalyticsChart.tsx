"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    date: "May 20",
    applications: 280,
  },
  {
    date: "May 21",
    applications: 430,
  },
  {
    date: "May 22",
    applications: 380,
  },
  {
    date: "May 23",
    applications: 520,
  },
  {
    date: "May 24",
    applications: 490,
  },
  {
    date: "May 25",
    applications: 640,
  },
  {
    date: "May 26",
    applications: 580,
  },
];

export default function AnalyticsChart() {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
      
      {/* HEADER */}
      <div className="flex items-start justify-between">
        
        <div>
          <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
            Application Overview
          </h2>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Weekly application analytics
          </p>
        </div>

        {/* DROPDOWN */}
        <select className="rounded-md border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700 outline-none transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-[#222530] dark:text-white">
          
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      {/* CHART */}
      <div className="mt-3 h-[190px]">
        
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            
            {/* GRADIENT */}
            <defs>
              <linearGradient
                id="colorApplications"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#AD0819"
                  stopOpacity={0.18}
                />

                <stop
                  offset="100%"
                  stopColor="#AD0819"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            {/* GRID */}
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#f1f5f9"
              vertical={false}
            />

            {/* X AXIS */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />

            {/* Y AXIS */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />

            {/* TOOLTIP */}
            <Tooltip
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid #e5e7eb",
                background: "#fff",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)",
              }}
            />

            {/* AREA */}
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#E11D2E"
              strokeWidth={2}
              fill="url(#colorApplications)"
              dot={{
                r: 3,
                strokeWidth: 1.5,
                fill: "#fff",
                stroke: "#E11D2E",
              }}
              activeDot={{
                r: 4,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}