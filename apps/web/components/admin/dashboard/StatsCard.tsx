interface Props {
  title: string
  value: string
  growth: string
}

export function StatsCard({ title, value, growth }: Props) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <p className="text-sm text-gray-500">{title}</p>

      <div className="mt-4 flex items-end justify-between">
        <h2 className="text-4xl font-bold text-gray-900">{value}</h2>

        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
          {growth}
        </span>
      </div>
    </div>
  )
}
