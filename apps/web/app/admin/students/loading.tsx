export default function StudentsLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      {/* Page header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-40 rounded-xl bg-gray-200 dark:bg-[#222530]" />
          <div className="h-4 w-56 rounded-lg bg-gray-200 dark:bg-[#222530]" />
        </div>
      </div>

      {/* Search skeleton */}
      <div className="h-12 w-full rounded-2xl bg-gray-200 dark:bg-[#222530]" />

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
        <div className="overflow-x-auto">
          {/* Table header */}
          <div className="grid min-w-[900px] grid-cols-5 border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-[#222530]">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-[#1a1d25]" />
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-[#1a1d25]" />
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-[#1a1d25]" />
            <div className="h-4 w-14 rounded bg-gray-200 dark:bg-[#1a1d25]" />
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-[#1a1d25]" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid min-w-[900px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 dark:border-gray-800"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-[#222530]" />
                <div className="h-3 w-40 rounded bg-gray-100 dark:bg-[#222530]" />
              </div>
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-[#222530]" />
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-[#222530]" />
              <div>
                <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-[#222530]" />
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
