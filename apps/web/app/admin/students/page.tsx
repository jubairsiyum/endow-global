'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import AdminTable from '@/components/ui/AdminTable'
import { trpc } from '@/lib/trpc-client'
import Link from 'next/link'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [cursor, setCursor] = useState<string | null>(null)

  const { data, isLoading } = trpc.admin.students.list.useQuery({
    search: debouncedSearch || undefined,
    cursor: cursor,
    limit: 20,
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Manage all registered students." />

      {/* SEARCH */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCursor(null) // Reset cursor on search
          }}
          placeholder="Search students by name or email..."
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-gray-900 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white dark:placeholder:text-gray-500"
        />
      </div>

      {/* TABLE */}
      <AdminTable>
        <div className="overflow-x-auto">
          {/* TABLE HEADER */}
          <div className="grid min-w-[900px] grid-cols-5 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
            <div>Student</div>
            <div>Nationality</div>
            <div>Counselor</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {/* TABLE ROWS */}
          {isLoading ? (
            <div className="py-10 text-center">Loading...</div>
          ) : data?.items.length === 0 ? (
            <div className="py-10 text-center">No students found</div>
          ) : (
            data?.items.map((student) => (
              <div
                key={student.id}
                className="grid min-w-[900px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
              >
                {/* STUDENT INFO */}
                <div>
                  <p className="truncate font-semibold text-gray-900 dark:text-white">
                    {student.name || 'Unknown'}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {student.email}
                  </p>
                </div>

                {/* COUNTRY */}
                <div className="text-gray-700 dark:text-gray-300">
                  {student.studentProfile?.nationality || 'N/A'}
                </div>

                {/* COUNSELOR */}
                <div className="truncate text-gray-700 dark:text-gray-300">
                  {(student as any).studentProfile?.assignedCounselor?.user?.name || 'Unassigned'}
                </div>

                {/* STATUS */}
                <div>
                  <StatusBadge status="Active" /> {/* Replace when we have real status */}
                </div>

                {/* ACTION */}
                <div>
                  <Link href={`/admin/students/${student.id}`}>
                    <button className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-[#222530] dark:text-white dark:hover:bg-[#2d3340]">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </AdminTable>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <button
          disabled={!cursor}
          onClick={() => setCursor(null)}
          className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
        >
          First Page
        </button>
        <button
          disabled={!data?.nextCursor}
          onClick={() => data?.nextCursor && setCursor(data.nextCursor)}
          className="rounded-xl bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
