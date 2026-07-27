import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
  lines?: number
  hasImage?: boolean
}

export function SkeletonCard({ className, lines = 3, hasImage = false }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white motion-reduce:animate-none',
        className
      )}
      aria-hidden="true"
    >
      {hasImage && <div className="h-40 w-full bg-gray-200" />}
      <div className="space-y-3 p-6">
        <div className="h-4 w-3/4 rounded-lg bg-gray-200" />
        <div className="h-3 w-1/2 rounded-lg bg-gray-200" />
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded-lg bg-gray-100"
              style={{ width: `${85 - i * 15}%` }}
            />
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-7 w-20 rounded-full bg-gray-200" />
          <div className="h-7 w-24 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

interface SkeletonGridProps {
  className?: string
  count?: number
  columns?: 2 | 3 | 4
  hasImage?: boolean
}

export function SkeletonGrid({ className, count = 6, columns = 3, hasImage = false }: SkeletonGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-5', gridCols[columns], className)} aria-busy="true" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} hasImage={hasImage} />
      ))}
    </div>
  )
}

export function SkeletonText({ className, width = '3/4' }: { className?: string; width?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-gray-200 motion-reduce:animate-none', className)}
      style={{ width: width === 'full' ? '100%' : width === '1/2' ? '50%' : width === '3/4' ? '75%' : `${width}` }}
      aria-hidden="true"
    />
  )
}

export function SkeletonRow({ className, cols = 4 }: { className?: string; cols?: number }) {
  return (
    <div className={cn('animate-pulse space-y-3 motion-reduce:animate-none', className)} aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded-lg bg-gray-200" />
            <div className="h-3 w-1/2 rounded-lg bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  )
}
