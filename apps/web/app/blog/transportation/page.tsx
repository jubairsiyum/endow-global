import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogArticle } from '@/components/blog/BlogArticle'
import { STUDENT_LIFE_ARTICLES, STUDENT_LIFE_ARTICLE_LIST } from '@/data/student-life-articles'

const post = STUDENT_LIFE_ARTICLES['transportation']
const related = STUDENT_LIFE_ARTICLE_LIST.filter((p) => p.slug !== 'transportation')

const baseUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  title: post ? `${post.title} | Endow Global` : 'Transportation Guide for Korea',
  description: post?.description,
  keywords: post?.tags,
  alternates: { canonical: `${baseUrl()}/blog/transportation` },
  openGraph: {
    title: post?.title,
    description: post?.description,
    url: `${baseUrl()}/blog/transportation`,
    type: 'article',
    publishedTime: post?.publishedAt ?? undefined,
    authors: post?.author ? [post.author] : undefined,
    images: post?.coverImage ? [{ url: post.coverImage }] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: post?.title,
    description: post?.description,
    images: post?.coverImage ? [post.coverImage] : undefined,
  },
  robots: { index: true, follow: true },
}

export default function TransportationPage() {
  if (!post) notFound()
  return <BlogArticle post={post} related={related} />
}
