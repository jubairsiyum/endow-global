interface Props {
  children: React.ReactNode
}

export default function AdminTable({ children }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      {children}
    </div>
  )
}
