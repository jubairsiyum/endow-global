import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { lazyClient } from './lazy-client'

export const s3 = lazyClient<S3Client>(
  () => {
    const region = process.env.AWS_REGION
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('AWS_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY are not set')
    }
    return new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })
  },
  'S3Client',
)

export async function getUploadUrl(key: string, contentType: string): Promise<string> {
  const bucket = process.env.AWS_S3_BUCKET
  if (!bucket) throw new Error('AWS_S3_BUCKET is not set')
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(s3, command, { expiresIn: 300 })
}

export function getCDNUrl(key: string): string {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/${key}`
}

export async function deleteFile(key: string) {
  const bucket = process.env.AWS_S3_BUCKET
  if (!bucket) throw new Error('AWS_S3_BUCKET is not set')
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}
