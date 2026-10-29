export default function InquiryDetailLoading() {
  return (
    <div className="space-y-6 py-4" aria-busy="true">
      <div className="flex items-center gap-3">
        <div className="h-9 w-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="h-6 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="h-36 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-6">
          <div className="h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  )
}
