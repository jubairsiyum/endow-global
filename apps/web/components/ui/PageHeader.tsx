interface Props {
  title: string
  description: string
  buttonText?: string
}

export default function PageHeader({ title, description, buttonText }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{title}</h1>

        <p className="mt-2 text-gray-500">{description}</p>
      </div>

      {buttonText && (
        <button className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#920715]">
          {buttonText}
        </button>
      )}
    </div>
  )
}
