import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { db, schema } from '@/lib/db'
import { eq as _eq, and as _and } from 'drizzle-orm'

const eq = _eq as any
const and = _and as any
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Calendar, User, Tag, BookOpen } from 'lucide-react'

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
    .where(and(eq(schema.resources.type, 'BLOG'), eq(schema.resources.slug, slug), eq(schema.resources.isPublished, true)))
    .limit(1)
    .then((r) => r[0] || null)
  return post
})

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

  const tags = toArray(post.tags)
  const content = post.content || `<p>${post.description || ''}</p>`

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111827]">
      <Navbar />

      <main className="flex-grow">
        <article className="mx-auto max-w-3xl px-5 py-10 sm:px-6 lg:py-14">
          <Link href="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-[#C41E3A]">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          {post.coverImage && (
            <div className="mb-6 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt={post.title} className="h-64 w-full object-cover sm:h-96" />
            </div>
          )}

          {post.category && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-semibold text-[#C41E3A]">
              <BookOpen size={12} /> {post.category}
            </span>
          )}

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-5 border-b border-gray-100 pb-6 text-sm text-gray-500">
            {post.author && (
              <span className="flex items-center gap-2"><User size={15} /> {post.author}</span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-2">
                <Calendar size={15} />
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>

          <div
            className="prose prose-gray mt-8 max-w-none text-[15px] leading-7 text-gray-700 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-[#C41E3A] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-6">
              <Tag size={15} className="text-gray-400" />
              {tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{t}</span>
              ))}
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
