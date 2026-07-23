import app from './app.js'
import { env } from './config/env.js'
import { isStorageConfigured } from './services/storage.service.js'
import prisma from './config/prisma.js'

async function start() {
  try {
    await prisma.$connect()
    console.log('[db] Connected to PostgreSQL')
  } catch (err) {
    console.error('[db] Failed to connect to PostgreSQL:', err.message)
    console.error('[db] Ensure DATABASE_URL is set and the database is running.')
  }

  const storageOk = isStorageConfigured()
  if (storageOk) {
    console.log('[storage] R2 image storage is configured')
  } else {
    console.warn('[storage] R2 image storage is NOT configured — uploads will fail. Check R2_* env vars.')
  }

  const server = app.listen(env.port, () => {
    console.log(`[api] Usmani Academy API running on http://localhost:${env.port} (${env.nodeEnv})`)
  })

  const shutdown = async (signal) => {
    console.log(`\n[api] ${signal} received, shutting down...`)
    server.close(async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

start()
