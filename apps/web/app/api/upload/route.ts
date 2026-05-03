import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { createRouteHandler } from 'uploadthing/next'
import { auth } from '@/lib/auth'

const f = createUploadthing()

const uploadRouter = {
  profileImage: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      const session = await auth()
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
      const session = await auth()
      if (!session) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, name: file.name, type: file.type }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
})
