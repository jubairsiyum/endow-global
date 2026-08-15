import { MetadataRoute } from 'next'
import { db, schema } from '@/lib/db'
import { eq as _eq, and as _and } from 'drizzle-orm'

const eq = _eq as any
const and = _and as any

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const staticPages = ['', '/universities', '/blog', '/resources', '/about', '/faq', '/opportunities'].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })
  )

  try {
    const universities = await db
      .select({ slug: schema.universities.slug, updatedAt: schema.universities.updatedAt })
      .from(schema.universities)
      .where(eq(schema.universities.isActive as any, true) as any)

    const universityPages = universities.map((u) => ({
      url: `${baseUrl}/universities/${u.slug}`,
      lastModified: u.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const blogs = await db
      .select({ slug: schema.resources.slug, updatedAt: schema.resources.updatedAt })
      .from(schema.resources)
      .where(and(eq(schema.resources.type, 'BLOG'), eq(schema.resources.isPublished, true)))

    const blogPages = blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...universityPages, ...blogPages]
  } catch {
    return staticPages
  }
}
