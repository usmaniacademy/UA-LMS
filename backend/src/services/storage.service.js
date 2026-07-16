import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

const r2Configured = !!(env.r2.accountId && env.r2.accessKeyId && env.r2.secretAccessKey && env.r2.bucketName)

const client = r2Configured
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.r2.accessKeyId,
        secretAccessKey: env.r2.secretAccessKey
      }
    })
  : null

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function uploadImage(buffer, key, contentType) {
  if (!r2Configured) {
    throw ApiError.badRequest('Image storage is not configured yet. Add R2 credentials to .env to enable uploads.')
  }

  await client.send(new PutObjectCommand({
    Bucket: env.r2.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType
  }))

  // Public bucket (r2.dev toggle or a custom domain) -> return a direct URL.
  // No public URL configured -> return our own proxy route; the browser
  // never talks to R2 directly, the backend fetches and streams it.
  return env.r2.publicUrl
    ? `${env.r2.publicUrl.replace(/\/$/, '')}/${key}`
    : `/api/blog/images/${encodeURIComponent(key)}`
}

export async function deleteImage(key) {
  if (!r2Configured) return
  await client.send(new DeleteObjectCommand({ Bucket: env.r2.bucketName, Key: key }))
}

// ─── Proxy read (used only when R2_PUBLIC_URL isn't set) ──────────────────────

export async function getImageStream(key) {
  if (!r2Configured) throw ApiError.notFound('Image storage is not configured')
  const result = await client.send(new GetObjectCommand({ Bucket: env.r2.bucketName, Key: key }))
  return result // { Body: stream, ContentType, ContentLength, ... }
}

export function isStorageConfigured() {
  return r2Configured
}
