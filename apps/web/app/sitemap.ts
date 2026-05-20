import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!

  let universities: { slug: string; updatedAt: Date }[] = []
  try {
    universities = await prisma.university.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } })
  } catch {
    // Database unavailable during build — serve static pages only
  }

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
