'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ArticleSidebar, StudyWorkCTA } from '@/components/blog/ArticleSidebar'

type Post = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  author: string
  publishedAt: string | null
  viewCount: number
  featured: boolean
  section: string | null
}

function formatDate(date?: string | null) {
  if (!date) return 'Jun 16, 2026'
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return 'Jun 16, 2026'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d)
}

function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function hasHtml(value = '') {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

function getReadTime(post: Post) {
  const text = stripHtml(post.content || post.description || '')
  const words = text ? text.split(/\s+/).length : 0
  return `${Math.max(2, Math.ceil(words / 220))} min read`
}

function formatViews(n: number) {
  if (!n) return null
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K views`
  return `${n} views`
}

function InlineCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border-l-4 border-[#C41E3A] bg-[#FEF2F4] px-5 py-4 shadow-sm">
      <Link
        href={href}
        className="text-sm font-bold leading-6 text-slate-800 underline-offset-2 transition hover:underline sm:text-base"
      >
        {children}
      </Link>
    </div>
  )
}

function MetaRow({ post }: { post: Post }) {
  const author = post.author || 'Study Abroad Expert'
  const views = formatViews(post.viewCount)

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-slate-500">
      <span>
        By <span className="font-semibold text-slate-700">{author}</span>
      </span>
      <span>Updated on {formatDate(post.publishedAt)}</span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex size-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-600">
          ✓
        </span>
        Fact checked
      </span>
      <span>{getReadTime(post)}</span>
      {views && <span>{views}</span>}
    </div>
  )
}

function ContentBody({ post }: { post: Post }) {
  if (post.content && hasHtml(post.content)) {
    return <section className="article-html mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
  }

  if (post.content) {
    return (
      <section className="mt-8 space-y-5 text-[15px] leading-[1.8] text-slate-700 sm:text-[16px] lg:text-[17px]">
        {post.content.split('\n\n').map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>
    )
  }

  return (
    <section className="mt-8 space-y-5 text-[15px] leading-[1.8] text-slate-700 sm:text-[16px] lg:text-[17px]">
      {post.description ? <p>{post.description}</p> : <p>No content has been published for this article yet.</p>}
    </section>
  )
}

function RelatedArticles({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section className="mt-12">
      <h3 className="text-sm font-semibold text-slate-600">Related articles</h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {posts.slice(0, 2).map((post) => (
          <Link
            key={post.id ?? post.slug ?? post.title}
            href={`/blog/${post.slug}`}
            className="flex gap-3 rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {post.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.coverImage} alt={post.title || 'Related article'} className="size-20 rounded-md object-cover" />
            ) : (
              <div className="size-20 rounded-md bg-gradient-to-br from-violet-100 to-pink-100" />
            )}

            <div className="min-w-0">
              <h4 className="line-clamp-2 text-sm font-bold leading-5 text-slate-950">
                {post.title || 'Study abroad article'}
              </h4>
              <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-slate-500">
                {stripHtml(post.description) || 'Read more about studying abroad.'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) return null

  return (
    <section className="mt-10">
      <p className="text-sm text-slate-600">Tags:</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-violet-50 px-3 py-1.5 text-[13px] font-medium text-slate-700">
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}

function AuthorArea({ post }: { post: Post }) {
  const author = post.author || 'Study Abroad Expert'

  return (
    <section className="mt-8 border-t border-[#e5e7eb] pt-8">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C41E3A] to-[#E05266] text-base font-bold text-white">
          {author.charAt(0)}
        </div>

        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Written By</p>
          <h3 className="mt-1 text-base font-bold text-slate-950">{author}</h3>
          <p className="text-sm font-medium text-slate-600">Study Abroad Expert</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A seasoned education content writer with expertise in study abroad, admissions and international student
            guidance.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border-l-4 border-gray-300 bg-gray-50 px-4 py-3 text-sm leading-6 text-slate-600">
        <strong className="font-bold text-slate-800">Disclaimer:</strong> The views and opinions shared in this article
        are for general information only. Always verify requirements from official sources before applying.
      </div>
    </section>
  )
}

export function BlogArticle({ post, related }: { post: Post; related: Post[] }) {
  const title = post.title
  const excerpt = post.description

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7FB] font-sans text-slate-950">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main className="flex-1">
        <article className="mx-auto w-full max-w-[1160px] px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-32">
          <div className="lg:grid lg:grid-cols-[minmax(0,720px)_320px] lg:items-start lg:justify-center lg:gap-10">
            <div className="min-w-0">
              <header className="mx-auto max-w-[720px]">
                {post.category && (
                  <span className="mb-3 inline-flex items-center rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-semibold text-[#C41E3A]">
                    {post.category}
                  </span>
                )}

                <h1 className="max-w-[720px] text-[26px] font-extrabold leading-tight tracking-tight text-slate-950 sm:text-[32px] lg:text-[36px]">
                  {title}
                </h1>

                <MetaRow post={post} />
              </header>

              {post.coverImage && (
                <div className="mx-auto mt-5 mb-7 aspect-[16/7] w-full max-w-[720px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImage} alt={title} className="h-full w-full object-cover" />
                </div>
              )}

              <div className="mx-auto max-w-[720px]">
                {excerpt && (
                  <p className="text-[17px] font-semibold leading-[1.7] text-slate-900 sm:text-[18px]">{excerpt}</p>
                )}

                <div className="mt-6 lg:hidden">
                  <InlineCta href="/contact">
                    Apply now for top countries with work options — admissions open for upcoming intakes!
                  </InlineCta>
                </div>

                <ContentBody post={post} />

                <div className="mt-8">
                  <StudyWorkCTA />
                </div>

                <section className="mt-12 space-y-5 text-[15px] leading-[1.8] text-slate-700 sm:text-[16px] lg:text-[17px]">
                  <h2 className="text-[22px] font-bold text-slate-950 sm:text-2xl">Sources &amp; verification</h2>

                  <p>
                    Visa and work rules can change. Before applying, verify the latest requirements from official
                    immigration, government and university sources.
                  </p>

                  <ul className="list-disc space-y-2 pl-6">
                    <li>Official immigration and government student visa pages.</li>
                    <li>University admissions pages for programme-specific requirements.</li>
                    <li>Scholarship portals and education ministry resources.</li>
                  </ul>
                </section>

                <RelatedArticles posts={related} />

                <div className="mt-10">
                  <InlineCta href="/contact">
                    Found this helpful? Sign up and start planning your study-abroad journey today.
                  </InlineCta>
                </div>

                <Tags tags={post.tags} />

                <div className="mt-8 flex justify-end gap-3">
                  <button className="flex size-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
                    ↗
                  </button>
                  <button className="flex size-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
                    🔖
                  </button>
                </div>

                <AuthorArea post={post} />
              </div>
            </div>

            <aside className="sticky top-24 hidden max-h-[calc(100vh_-_6rem)] overflow-y-auto overscroll-contain pr-1 lg:block">
              <ArticleSidebar content={post.content} title={title} />
            </aside>
          </div>
        </article>

        <div className="mx-auto w-full max-w-[1160px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto mt-8 flex max-w-[720px] flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="transition hover:text-slate-900">
              Home
            </Link>
            <span>›</span>
            <Link href="/blog" className="transition hover:text-slate-900">
              Articles
            </Link>
            <span>›</span>
            <span className="line-clamp-1">{title}</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
