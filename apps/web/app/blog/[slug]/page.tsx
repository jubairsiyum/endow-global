import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { db, schema } from '@/lib/db'
import { eq as _eq, and as _and, ne as _ne, desc as _desc } from 'drizzle-orm'
import { BlogArticle } from '@/components/blog/BlogArticle'

const eq = _eq as any
const and = _and as any
const ne = _ne as any
const desc = _desc as any

export const dynamic = 'force-dynamic'

const baseUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string')
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.filter((v) => typeof v === 'string')
    } catch {
      /* ignore */
    }
  }
  return []
}

const getBlog = cache(async (slug: string) => {
  const post = await db
    .select()
    .from(schema.resources)
    .where(
      and(eq(schema.resources.type, 'BLOG'), eq(schema.resources.slug, slug), eq(schema.resources.isPublished, true))
    )
    .limit(1)
    .then((r) => r[0] || null)
  return post
})

function serialize(p: any) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description ?? '',
    content: p.content ?? '',
    coverImage: p.coverImage ?? '',
    category: p.category ?? '',
    tags: toArray(p.tags),
    author: p.author ?? '',
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
    viewCount: p.viewCount ?? 0,
    featured: p.featured ?? false,
    section: p.section ?? null,
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlog(params.slug)
  if (!post) return {}

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.description || ''
  const url = `${baseUrl()}/blog/${post.slug}`
  const keywords = toArray(post.keywords)
  const image = post.ogImageUrl || post.coverImage || undefined

  return {
    title,
    description: description || undefined,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: post.canonicalUrl || url },
    openGraph: {
      title,
      description: description || undefined,
      url,
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: post.author ? [post.author] : undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: image ? [image] : undefined,
    },
    robots: post.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlog(params.slug)
  if (!post) notFound()

  const relatedRows = await db
    .select()
    .from(schema.resources)
    .where(
      and(
        eq(schema.resources.type, 'BLOG'),
        eq(schema.resources.isPublished, true),
        ne(schema.resources.slug, params.slug)
      )
    )
    .orderBy(desc(schema.resources.publishedAt))
    .limit(4)

  return <BlogArticle post={serialize(post)} related={relatedRows.map(serialize)} />
}
