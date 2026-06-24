export default function CountryLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mx-auto h-6 w-32 animate-pulse rounded-full bg-gray-200" />
            <div className="mx-auto mt-4 h-10 w-80 animate-pulse rounded-lg bg-gray-200 sm:h-12" />
            <div className="mx-auto mt-4 h-5 w-96 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 text-center">
                <div className="mx-auto h-8 w-8 rounded-lg bg-gray-200" />
                <div className="mx-auto mt-2 h-5 w-16 rounded bg-gray-200" />
                <div className="mx-auto mt-1 h-3 w-12 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="bg-gray-50 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <div className="h-[2px] w-full bg-gray-200" />
                <div className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-gray-200" />
                  <div className="mt-3 h-5 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
                  <div className="mt-4 h-16 rounded-lg bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
