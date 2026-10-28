interface Props {
  children: React.ReactNode
  className?: string
}

export default function AdminTable({ children, className = '' }: Props) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-colors duration-200 dark:border-white/[0.08] dark:bg-[#18181b] print:overflow-visible print:rounded-none print:border-none print:shadow-none ${className}`}
    >
      {children}
    </div>
  )
}
