import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { createRouteHandler } from 'uploadthing/next'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const f = createUploadthing()

const uploadRouter = {
  profileImage: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      })
      if (!session) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, userId: metadata.userId }
    }),

  applicationDocument: f({
    pdf: { maxFileSize: '8MB' },
    image: { maxFileSize: '4MB' },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      })
      if (!session) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, name: file.name, type: file.type }
    }),

  universityAsset: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      })
      if (!session) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, name: file.name }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
})
