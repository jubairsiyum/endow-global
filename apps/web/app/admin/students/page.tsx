'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import AdminTable from '@/components/ui/AdminTable'
import { trpc } from '@/lib/trpc-client'
import { useSession } from '@/lib/auth-client'
import { hasPermission, parsePermissionsJSON } from '@/lib/rbac'
import { UserRole } from '@endow/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import Link from 'next/link'

const createStudentSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().email('Valid email address is required'),
  phone: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  countryOfResidence: z.string().trim().optional(),
  highestEducation: z.enum(['HIGH_SCHOOL', 'BACHELORS', 'MASTERS', 'PHD']),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
})

type CreateStudentFormValues = z.infer<typeof createStudentSchema>

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
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const permissions = parsePermissionsJSON((session?.user as any)?.permissions)
  const canManage = role === UserRole.SUPER_ADMIN || hasPermission(permissions, 'students:manage', role)

  const utils = trpc.useUtils()
  const createMutation = trpc.admin.students.create.useMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      nationality: '',
      countryOfResidence: '',
      highestEducation: 'HIGH_SCHOOL',
      password: '',
    },
  })

  const onSubmit = async (values: CreateStudentFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        nationality: values.nationality || undefined,
        countryOfResidence: values.countryOfResidence || undefined,
        highestEducation: values.highestEducation,
        password: values.password || undefined,
      })
      toast.success('Student added successfully')
      utils.admin.students.list.invalidate()
      setShowCreateModal(false)
      reset()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add student')
    }
  }

  const { data, isLoading, error } = trpc.admin.students.list.useQuery({
    search: debouncedSearch || undefined,
    cursor: cursor,
    limit: 20,
  })

  // Detect FORBIDDEN (missing students:view permission)
  const isForbidden =
    (error as any)?.data?.httpStatus === 403 ||
    (error as any)?.data?.code === 'FORBIDDEN' ||
    (error as any)?.message?.includes('FORBIDDEN')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage all registered students."
        buttonText={canManage ? 'Add New Student' : undefined}
        onButtonClick={canManage ? () => setShowCreateModal(true) : undefined}
      />

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
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-gray-900 outline-none transition-all focus:border-primary dark:border-gray-800 dark:placeholder:text-gray-500"
        />
      </div>

      {showCreateModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-[#1a1d25]">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Student</h2>
              <button
                type="button"
                onClick={() => { setShowCreateModal(false); reset(); }}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
              <div className="space-y-4 overflow-y-auto px-6 py-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    {...register('name')}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address *</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    {...register('email')}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Password (optional)</label>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    {...register('password')}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      {...register('phone')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Nationality</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangladesh"
                      {...register('nationality')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    {errors.nationality && <p className="mt-1 text-xs text-red-500">{errors.nationality.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Country of Residence</label>
                    <input
                      type="text"
                      placeholder="e.g. Canada"
                      {...register('countryOfResidence')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    {errors.countryOfResidence && <p className="mt-1 text-xs text-red-500">{errors.countryOfResidence.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Highest Education</label>
                    <select
                      {...register('highestEducation')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="HIGH_SCHOOL">High School</option>
                      <option value="BACHELORS">{"Bachelor's"}</option>
                      <option value="MASTERS">{"Master's"}</option>
                      <option value="PHD">PhD</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); reset(); }}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#AD0819' }}
                >
                  {isSubmitting || createMutation.isPending ? 'Adding Student...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

 {/* TABLE */}
 <AdminTable>
 <div className="overflow-x-auto">
 {/* TABLE HEADER */}
 <div className="grid min-w-[900px] grid-cols-5 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800">
 <div>Student</div>
 <div>Nationality</div>
 <div>Counselor</div>
 <div>Status</div>
 <div>Action</div>
 </div>

 {/* TABLE ROWS */}
 {isLoading ? (
 <div className="py-10">
 <div className="flex justify-center pb-4">
 <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
 </div>
 {Array.from({ length: 5 }).map((_, i) => (
 <div
 key={i}
 className="grid min-w-[900px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 dark:border-gray-800"
 >
 <div className="space-y-2">
 <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
 <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
 </div>
 <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
 <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
 <div>
 <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
 </div>
 <div>
 <div className="h-9 w-20 animate-pulse rounded-xl bg-gray-200" />
 </div>
 </div>
 ))}
 </div>
 ) : isForbidden ? (
 <div className="flex flex-col items-center justify-center py-16 text-center px-4">
   <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
     <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
     </svg>
   </div>
   <p className="text-sm font-semibold text-gray-800">Permission required</p>
   <p className="mt-1 max-w-sm text-xs text-gray-500">
     Your account does not have the <code className="rounded bg-gray-100 px-1 py-0.5 font-mono">students:view</code> permission.
     Ask a Super Admin to grant it via <strong>User Management → Manage Permissions</strong>.
   </p>
 </div>
 ) : error ? (
 <div className="flex flex-col items-center justify-center py-16 text-center px-4">
   <p className="text-sm font-semibold text-red-600">Failed to load students</p>
   <p className="mt-1 text-xs text-gray-500">{(error as any)?.message || 'Unexpected error'}</p>
 </div>
 ) : data?.items.length === 0 ? (
 <div className="py-10 text-center text-sm text-gray-500">No students found</div>
 ) : (
 (data?.items || []).map((student: any) => (
 <div
 key={student.id}
 className="grid min-w-[900px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800"
 >
 {/* STUDENT INFO */}
 <div>
 <p className="truncate font-semibold text-gray-900">
 {student.name || 'Unknown'}
 </p>
 <p className="truncate text-sm text-gray-500">
 {student.email}
 </p>
 </div>

 {/* COUNTRY */}
 <div className="text-gray-700">
 {student.studentProfile?.nationality || 'N/A'}
 </div>

 {/* COUNSELOR */}
 <div className="truncate text-gray-700">
 {(student as any).studentProfile?.assignedCounselor?.user?.name || 'Unassigned'}
 </div>

  {/* STATUS */}
  <div>
  <StatusBadge status={student.emailVerified ? 'ACTIVE' : 'Pending'} />
  </div>

 {/* ACTION */}
 <div>
 <Link href={`/admin/students/${student.id}`}>
 <button className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200">
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
