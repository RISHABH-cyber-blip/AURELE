import test from 'node:test'
import assert from 'node:assert/strict'

import { ensureUserFromAuth } from '../lib/auth'

test('reuses an existing user when an email collision exists', async () => {
  const users = [
    {
      id: 'existing-user',
      email: 'someone@example.com',
      name: 'Existing User',
      supabaseId: 'old-supabase-id',
    },
  ]

  const prismaClient = {
    user: {
      async findUnique({ where }: { where: Record<string, string> }) {
        return users.find((user) => user.supabaseId === where.supabaseId) ?? null
      },
      async findFirst({ where }: { where: Record<string, string> }) {
        return users.find((user) => user.email === where.email) ?? null
      },
      async create({ data }: { data: Record<string, unknown> }) {
        const created = { id: 'created-user', ...data }
        users.push(created)
        return created
      },
      async update({ where, data }: { where: { id: string }; data: Record<string, unknown> }) {
        const existing = users.find((user) => user.id === where.id)
        if (!existing) throw new Error('User not found')

        Object.assign(existing, data)
        return existing
      },
    },
  }

  const result = await ensureUserFromAuth({
    authUser: {
      id: 'new-supabase-id',
      email: 'someone@example.com',
      user_metadata: { full_name: 'New Name' },
    },
    prismaClient: prismaClient as any,
  })

  assert.equal(result.id, 'existing-user')
  assert.equal(result.supabaseId, 'new-supabase-id')
  assert.equal(result.email, 'someone@example.com')
  assert.equal(result.name, 'New Name')
})
