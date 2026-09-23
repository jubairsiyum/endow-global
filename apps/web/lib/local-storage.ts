import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

function storageRoot(): string {
  return process.env.LOCAL_STORAGE_DIR?.trim() || path.join(process.cwd(), 'storage')
}

function resolveStoragePath(key: string): string {
  const normalized = key.replace(/\\/g, '/').replace(/^\/+/, '')
  const parts = normalized.split('/')
  if (!normalized || parts.some((part) => !part || part === '..' || part === '.')) {
    throw new Error('Invalid storage key')
  }

  const root = path.resolve(storageRoot())
  const filePath = path.resolve(root, ...parts)
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    throw new Error('Invalid storage key')
  }
  return filePath
}

export async function writeLocalFile(key: string, data: Buffer | Uint8Array): Promise<void> {
  const filePath = resolveStoragePath(key)
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, data)
}

export async function deleteLocalFile(key: string): Promise<void> {
  try {
    await unlink(resolveStoragePath(key))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
}

export async function readLocalFile(key: string): Promise<Buffer> {
  return readFile(resolveStoragePath(key))
}

export function getLocalFileUrl(key: string): string {
  return `/api/local-files/${key.split('/').map(encodeURIComponent).join('/')}`
}
