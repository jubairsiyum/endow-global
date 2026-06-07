interface Props {
  title: string
  value: string
  growth?: string
}

export default function StatCard({ title, value, growth }: Props) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>

        {growth && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
            {growth}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-4xl font-bold text-gray-900">{value}</h2>
    </div>
  )
}
