export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-live="polite">
      {/* Banner skeleton */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25] sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="h-5 w-28 rounded-full bg-gray-100 dark:bg-[#222530]" />
            <div className="h-8 w-64 rounded-xl bg-gray-100 dark:bg-[#222530]" />
            <div className="h-4 w-96 max-w-full rounded-lg bg-gray-100 dark:bg-[#222530]" />
          </div>
          <div className="space-y-3 lg:max-w-sm lg:w-full">
            <div className="h-6 w-24 ml-auto rounded-full bg-gray-100 dark:bg-[#222530]" />
            <div className="h-14 w-full rounded-2xl bg-gray-100 dark:bg-[#222530]" />
          </div>
        </div>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-[#222530]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded bg-gray-100 dark:bg-[#222530]" />
                <div className="h-7 w-24 rounded bg-gray-100 dark:bg-[#222530]" />
                <div className="h-3 w-32 rounded bg-gray-100 dark:bg-[#222530]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-40 rounded bg-gray-100 dark:bg-[#222530]" />
                  <div className="h-3 w-56 rounded bg-gray-100 dark:bg-[#222530]" />
                </div>
                <div className="h-6 w-20 rounded-full bg-gray-100 dark:bg-[#222530]" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: i === 0 ? 5 : 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-[#222530]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 rounded bg-gray-100 dark:bg-[#222530]" />
                      <div className="h-3 w-48 rounded bg-gray-100 dark:bg-[#222530]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6 lg:col-span-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]"
            >
              <div className="mb-4 space-y-2">
                <div className="h-5 w-32 rounded bg-gray-100 dark:bg-[#222530]" />
                <div className="h-3 w-48 rounded bg-gray-100 dark:bg-[#222530]" />
              </div>
              <div className={`grid gap-3 ${i === 0 ? 'grid-cols-2 sm:grid-cols-4' : ''}`}>
                {Array.from({ length: i === 0 ? 4 : 5 }).map((_, j) => (
                  <div
                    key={j}
                    className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-[#222530]"
                  >
                    <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-[#1a1d25]" />
                    <div className="mt-3 h-3 w-24 rounded bg-gray-100 dark:bg-[#1a1d25]" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
