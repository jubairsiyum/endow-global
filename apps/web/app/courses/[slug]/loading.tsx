import { Navbar } from '@/components/layout/Navbar'

export default function CourseLoading() {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <section className="relative overflow-x-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="pt-4 pb-6 lg:pb-8"><Navbar /></div>
        </div>
      </section>
      <main className="flex-grow py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-gray-200" />
              <div className="h-6 w-20 rounded-full bg-gray-200" />
            </div>
            <div className="h-10 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="h-48 rounded-lg bg-gray-100" />
                <div className="h-32 rounded-lg bg-gray-100" />
              </div>
              <div className="space-y-4">
                <div className="h-48 rounded-lg bg-gray-100" />
                <div className="h-64 rounded-lg bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
