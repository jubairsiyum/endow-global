interface Props {
  title: string
  description: string
  buttonText?: string
  onButtonClick?: () => void
}

export default function PageHeader({ title, description, buttonText, onButtonClick }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{title}</h1>

        <p className="mt-2 text-gray-500">{description}</p>
      </div>

      {buttonText && (
        <button
          onClick={onButtonClick}
          className="rounded-2xl px-5 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
          style={{ background: '#AD0819', boxShadow: '0 4px 12px rgba(173, 8, 25, 0.25)' }}
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}
