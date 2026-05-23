import { MetadataRoute } from 'next'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!

  const universities = await db
    .select({ slug: schema.universities.slug, updatedAt: schema.universities.updatedAt })
    .from(schema.universities)
    .where(eq(schema.universities.isActive, true))

  const courses = await db
    .select({ slug: schema.courses.slug, updatedAt: schema.courses.updatedAt })
    .from(schema.courses)
    .where(eq(schema.courses.isActive, true))

  const staticPages = ['', '/universities', '/blog', '/about', '/faq', '/opportunities'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const universityPages = universities.map((u) => ({
    url: `${baseUrl}/universities/${u.slug}`,
    lastModified: u.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...universityPages]
}
