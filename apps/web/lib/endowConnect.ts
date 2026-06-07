import { z } from 'zod'

const OverviewSchema = z.object({
  nationality: z.string().nullable().optional(),
  highestEducation: z.string().nullable().optional(),
  gpa: z.number().nullable().optional(),
  ieltsScore: z.number().nullable().optional(),
  toeflScore: z.number().nullable().optional(),
  satScore: z.number().nullable().optional(),
  targetCountries: z.array(z.string()).optional(),
  targetSubjects: z.array(z.string()).optional(),
})

export type StudentOverview = z.infer<typeof OverviewSchema>

export async function fetchStudentOverviewFromEndow(studentId: string): Promise<StudentOverview> {
  const base = process.env.ENDOW_CONNECT_BASE_URL
  const key = process.env.ENDOW_CONNECT_API_KEY
  if (!base || !key)
    throw new Error('ENDOW_CONNECT_BASE_URL or ENDOW_CONNECT_API_KEY not configured')

  const res = await fetch(
    `${base.replace(/\/+$/, '')}/students/${encodeURIComponent(studentId)}/overview`,
    {
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Endow Connect fetch failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  const parsed = OverviewSchema.partial().safeParse(data)
  if (!parsed.success) {
    // return raw data as best-effort but log validation error
    console.warn('Endow Connect overview validation failed', parsed.error.format())
    return data as StudentOverview
  }

  return parsed.data
}
