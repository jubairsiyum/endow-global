import PageHeader from '@/components/ui/PageHeader'

const notifications = [
  {
    title: 'New application submitted',
    time: '2 minutes ago',
  },
  {
    title: 'Student uploaded document',
    time: '15 minutes ago',
  },
  {
    title: 'Consultation booked',
    time: '1 hour ago',
  },
  {
    title: 'New counselor added',
    time: '3 hours ago',
  },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Track all platform notifications." />

      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#1a1d25]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-primary" />

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {notification.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    System notification
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-400">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
