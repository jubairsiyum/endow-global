export default function ApplicationsLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      {/* Page header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-48 rounded-xl bg-gray-200 dark:bg-[#222530]" />
          <div className="h-4 w-64 rounded-lg bg-gray-200 dark:bg-[#222530]" />
        </div>
      </div>

      {/* Search + filters skeleton */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="h-12 flex-1 rounded-2xl bg-gray-200 dark:bg-[#222530]" />
        <div className="h-12 w-32 rounded-2xl bg-gray-200 dark:bg-[#222530]" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
        <div className="overflow-x-auto">
          {/* Table header */}
          <div className="grid min-w-[850px] grid-cols-5 border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-[#222530]">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-[#1a1d25]" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-[#1a1d25]" />
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-[#1a1d25]" />
            <div className="h-4 w-14 rounded bg-gray-200 dark:bg-[#1a1d25]" />
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-[#1a1d25]" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid min-w-[850px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 dark:border-gray-800"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-[#222530]" />
                <div className="h-3 w-24 rounded bg-gray-100 dark:bg-[#222530]" />
              </div>
              <div className="h-4 w-36 rounded bg-gray-200 dark:bg-[#222530]" />
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-[#222530]" />
              <div>
                <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-[#222530]" />
              </div>
              <div>
                <div className="h-9 w-20 rounded-xl bg-gray-200 dark:bg-[#222530]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-end gap-2">
        <div className="h-10 w-24 rounded-xl bg-gray-200 dark:bg-[#222530]" />
        <div className="h-10 w-16 rounded-xl bg-gray-200 dark:bg-[#222530]" />
      </div>
    </div>
  )
}
