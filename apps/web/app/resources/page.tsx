import type { Metadata } from 'next'
import { db, schema } from '@/lib/db'
import { eq as _eq, and as _and, desc as _desc } from 'drizzle-orm'

const eq = _eq as any
const and = _and as any
const desc = _desc as any
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FileText, Download, Image, File } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Resources & Downloads',
  description: 'Download brochures, checklists, and guides to help with your study abroad journey.',
}

function typeIcon(mime: string | null) {
  if (mime?.startsWith('image')) return <Image size={18} />
  if (mime?.includes('pdf')) return <FileText size={18} />
  return <File size={18} />
}

export default async function ResourcesPage() {
  const files = await db
    .select()
    .from(schema.resources)
    .where(and(eq(schema.resources.type, 'FILE'), eq(schema.resources.isPublished, true)))
    .orderBy(desc(schema.resources.publishedAt))

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111827]">
      <Navbar />

      <main className="flex-grow">
        <section className="border-b border-gray-100 bg-gradient-to-b from-[#F5F6F9] to-white py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">Resources & Downloads</h1>
            <p className="mt-3 max-w-2xl text-base text-gray-500">
              Brochures, checklists, and guides to help you plan and apply with confidence.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
          {files.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
              No resources available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {files.map((f) => (
                <a
                  key={f.id}
                  href={f.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C41E3A]/5 text-[#C41E3A]">
                    {typeIcon(f.mimeType)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">{f.title || f.fileName}</p>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {f.category ? `${f.category} · ` : ''}{f.fileName || ''}
                    </p>
                    {f.fileSize ? <p className="mt-0.5 text-xs text-gray-400">{(f.fileSize / 1024).toFixed(1)} KB</p> : null}
                  </div>
                  <Download size={18} className="shrink-0 text-gray-300 transition-colors group-hover:text-[#C41E3A]" />
                </a>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
