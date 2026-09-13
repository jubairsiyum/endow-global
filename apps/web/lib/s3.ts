import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { lazyClient } from './lazy-client'

// Cloudflare R2 is S3-compatible: we point the client at the R2 endpoint and
// use `auto` for the region. Plain AWS S3 keeps working when no endpoint is
// set (AWS_ENDPOINT_URL_S3 empty).
export const s3 = lazyClient<S3Client>(() => {
  const region = process.env.AWS_REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const endpoint = process.env.AWS_ENDPOINT_URL_S3
  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('AWS_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY are not set')
  }
  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
    ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
  })
}, 'S3Client')

function bucket(): string {
  const b = process.env.AWS_S3_BUCKET
  if (!b) throw new Error('AWS_S3_BUCKET is not set')
  return b
}

export async function uploadBuffer(key: string, body: Buffer | Uint8Array, contentType: string): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
}

export async function getObjectBuffer(key: string): Promise<Uint8Array> {
  const res = await s3.send(new GetObjectCommand({ Bucket: bucket(), Key: key }))
  if (!res.Body) throw new Error(`Object not found: ${key}`)
  return res.Body.transformToByteArray()
}

export async function getUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket(),
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(s3, command, { expiresIn: 300 })
}

export function getCDNUrl(key: string): string {
  const base = (process.env.NEXT_PUBLIC_CDN_URL || '').replace(/\/+$/, '')
  return `${base}/${key}`
}

export async function deleteFile(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }))
}
