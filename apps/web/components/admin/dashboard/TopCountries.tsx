"use client";

const countries = [
  {
    name: "Bangladesh",
    value: "35%",
    color: "#ef4444",
  },
  {
    name: "India",
    value: "28%",
    color: "#8b5cf6",
  },
  {
    name: "Nepal",
    value: "15%",
    color: "#22c55e",
  },
  {
    name: "Pakistan",
    value: "10%",
    color: "#eab308",
  },
  {
    name: "Others",
    value: "12%",
    color: "#d1d5db",
  },
];

export default function TopCountries() {
  return (
    <div className="w-full flex h-full flex-col rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        
        <div>
          <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
            Top Countries
          </h2>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Student application distribution
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 items-center justify-start gap-2 pt-2">
        
        {/* DONUT */}
        <div className="relative flex items-center justify-center shrink-0">
          
          <svg
            width="190"
            height="190"
            viewBox="0 0 210 210"
            className="-rotate-90"
          >
            
            {/* BACKGROUND */}
            <circle
              cx="105"
              cy="105"
              r="58"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="14"
            />

            {/* RED */}
            <circle
              cx="105"
              cy="105"
              r="72"
              fill="none"
              stroke="#ef4444"
              strokeWidth="14"
              strokeDasharray="158 452"
              strokeLinecap="round"
            />

            {/* PURPLE */}
            <circle
              cx="105"
              cy="105"
              r="72"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="14"
              strokeDasharray="126 452"
              strokeDashoffset="-168"
              strokeLinecap="round"
            />

            {/* GREEN */}
            <circle
              cx="105"
              cy="105"
              r="72"
              fill="none"
              stroke="#22c55e"
              strokeWidth="14"
              strokeDasharray="68 452"
              strokeDashoffset="-304"
              strokeLinecap="round"
            />

            {/* YELLOW */}
            <circle
              cx="105"
              cy="105"
              r="72"
              fill="none"
              stroke="#eab308"
              strokeWidth="14"
              strokeDasharray="45 452"
              strokeDashoffset="-382"
              strokeLinecap="round"
            />
          </svg>

          {/* CENTER CONTENT */}
          <div className="absolute flex flex-col items-center">
            
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              2,587
            </h3>

            <p className="mt-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
              Students
            </p>
          </div>
        </div>

        {/* LEGEND */}
        <div className="space-y-2 flex-1">
          {countries.map((country) => (
            <div
              key={country.name}
              className="flex items-center justify-between gap-1.5"
            >
              
              <div className="flex items-center gap-1.5">
                
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{
                    background: country.color,
                  }}
                />

                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  {country.name}
                </span>
              </div>

              <span className="text-[11px] font-semibold text-gray-900 dark:text-white shrink-0 ml-1">
                {country.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}