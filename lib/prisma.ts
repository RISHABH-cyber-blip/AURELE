import { PrismaClient } from '@prisma/client'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

function loadEnvFileIfNeeded() {
  if (process.env.DATABASE_URL) return

  const envPath = join(dirname(fileURLToPath(import.meta.url)), '../.env')
  if (!existsSync(envPath)) return

  const raw = readFileSync(envPath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const equalsIndex = trimmed.indexOf('=')
    if (equalsIndex === -1) continue

    const key = trimmed.slice(0, equalsIndex).trim()
    const value = trimmed.slice(equalsIndex + 1).trim()
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

loadEnvFileIfNeeded()

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not defined. Add it to .env in the project root or set it in your environment before running Next.js.'
  )
}

// Next.js hot-reloads modules in dev, which would otherwise create a new
// PrismaClient (and a new DB connection) on every file save. Caching it
// on the global object avoids exhausting the connection pool.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
