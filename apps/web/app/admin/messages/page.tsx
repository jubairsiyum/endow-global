import PageHeader from '@/components/ui/PageHeader'

const messages = [
  {
    name: 'Rahim Ahmed',
    message: 'I uploaded my passport document.',
    time: '2 min ago',
  },
  {
    name: 'Nusrat Jahan',
    message: 'Can I change my university choice?',
    time: '15 min ago',
  },
  {
    name: 'Tanvir Hasan',
    message: 'Thank you for the update.',
    time: '1 hour ago',
  },
]

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Manage student communications." />

      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">
                  {message.name.charAt(0)}
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">{message.name}</h2>

                  <p className="mt-2 text-gray-500 dark:text-gray-400">{message.message}</p>
                </div>
              </div>

              <p className="text-sm text-gray-400">{message.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
