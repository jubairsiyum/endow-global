import { NextRequest, NextResponse } from 'next/server'
import { typesense, COURSES_COLLECTION } from '@/lib/typesense'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') || '*'
  const country = searchParams.get('country')
  const subject = searchParams.get('subject')
  const level = searchParams.get('level')
  const hasScholarship = searchParams.get('hasScholarship')
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '12')

  const filterBy: string[] = ['isActive:true']
  if (country) filterBy.push(`country:=${country}`)
  if (subject) filterBy.push(`subject:=${subject}`)
  if (level) filterBy.push(`level:=${level}`)
  if (hasScholarship === 'true') filterBy.push('hasScholarship:true')

  try {
    const results = await typesense
      .collections(COURSES_COLLECTION)
      .documents()
      .search({
        q,
        query_by: 'name,subject,universityName,description',
        filter_by: filterBy.join(' && ') || undefined,
        facet_by: 'country,subject,level,hasScholarship',
        sort_by: 'tuitionFee:asc',
        page,
        per_page: perPage,
      })

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
