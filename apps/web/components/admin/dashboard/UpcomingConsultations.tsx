const consultations = [
  {
    name: 'Arafat Hossain',
    initials: 'AH',
    counselor: 'Sarah Johnson',
    time: '10:00 AM',
  },
  {
    name: 'Nusrat Jahan',
    initials: 'NJ',
    counselor: 'David Kim',
    time: '11:30 AM',
  },
  {
    name: 'Rifat Ahmed',
    initials: 'RA',
    counselor: 'Emily Brown',
    time: '02:00 PM',
  },
  {
    name: 'Mehedi Hasan',
    initials: 'MH',
    counselor: 'Sarah Johnson',
    time: '03:30 PM',
  },
]

export default function UpcomingConsultations() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-900 dark:text-white">
          Upcoming Consultations
        </h2>

        <button className="text-xs font-medium text-primary">View All</button>
      </div>

      {/* LIST */}
      <div className="mt-2.5 space-y-2">
        {consultations.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            {/* LEFT */}
            <div className="flex min-w-0 items-center gap-2">
              {/* INITIAL AVATAR */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50 text-xs font-bold text-primary dark:bg-[#2a1114]">
                {item.initials}
              </div>

              {/* TEXT */}
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </p>

                <p className="truncate text-[9px] text-gray-500 dark:text-gray-400">
                  With {item.counselor}
                </p>
              </div>
            </div>

            {/* TIME */}
            <p className="shrink-0 text-right text-xs font-semibold text-primary">{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
