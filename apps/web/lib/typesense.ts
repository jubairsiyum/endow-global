import Typesense from 'typesense'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: any = null

function getClient() {
  if (!_client) {
    _client = new Typesense.Client({
      nodes: [
        {
          host: process.env.TYPESENSE_HOST || 'localhost',
          port: parseInt(process.env.TYPESENSE_PORT || '8108'),
          protocol: 'http',
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY!,
      connectionTimeoutSeconds: 2,
    })
  }
  return _client
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const typesense: any = new Proxy({} as any, {
  get(_target, prop) {
    const client = getClient()
    const val = (client as Record<string | symbol, unknown>)[prop]
    return typeof val === 'function' ? val.bind(client) : val
  },
})

export const COURSES_COLLECTION = 'courses'

export const courseSchema = {
  name: COURSES_COLLECTION,
  fields: [
    { name: 'id', type: 'string' as const },
    { name: 'name', type: 'string' as const },
    { name: 'subject', type: 'string' as const, facet: true },
    { name: 'level', type: 'string' as const, facet: true },
    { name: 'country', type: 'string' as const, facet: true },
    { name: 'city', type: 'string' as const },
    { name: 'universityName', type: 'string' as const },
    { name: 'universitySlug', type: 'string' as const },
    { name: 'slug', type: 'string' as const },
    { name: 'tuitionFee', type: 'int32' as const, facet: true },
    { name: 'currency', type: 'string' as const },
    { name: 'duration', type: 'int32' as const },
    { name: 'durationUnit', type: 'string' as const },
    { name: 'hasScholarship', type: 'bool' as const, facet: true },
    { name: 'language', type: 'string' as const, facet: true },
    { name: 'description', type: 'string' as const },
    { name: 'applicationDeadline', type: 'int64' as const, optional: true },
    { name: 'isActive', type: 'bool' as const },
  ],
  default_sorting_field: 'tuitionFee',
}

export async function initTypesense() {
  try {
    await typesense.collections(COURSES_COLLECTION).retrieve()
    console.log('Typesense collection already exists')
  } catch {
    await typesense.collections().create(courseSchema)
    console.log('Typesense collection created')
  }
}

export async function indexCourse(course: {
  id: string
  name: string
  subject: string
  level: string
  country: string
  city: string
  universityName: string
  universitySlug: string
  slug: string
  tuitionFee: number
  currency: string
  duration: number
  durationUnit: string
  hasScholarship: boolean
  language: string
  description: string
  applicationDeadline?: Date | null
  isActive: boolean
}) {
  return typesense
    .collections(COURSES_COLLECTION)
    .documents()
    .upsert({
      ...course,
      applicationDeadline: course.applicationDeadline
        ? Math.floor(course.applicationDeadline.getTime() / 1000)
        : undefined,
    })
}
