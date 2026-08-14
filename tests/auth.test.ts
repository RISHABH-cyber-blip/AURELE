import test from 'node:test'
import assert from 'node:assert/strict'

test('user profile authentication mock test', async () => {
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
      async create({ data }: { data: any }) {
        const created = { id: 'created-user', email: data.email, name: data.name, supabaseId: data.supabaseId }
        users.push(created)
        return created
      },
      async update({ where, data }: { where: { id: string }; data: any }) {
        const existing = users.find((user) => user.id === where.id)
        if (!existing) throw new Error('User not found')

        Object.assign(existing, data)
        return existing
      },
    },
  }

  const existing = await prismaClient.user.findFirst({ where: { email: 'someone@example.com' } })
  assert.equal(existing?.id, 'existing-user')
  assert.equal(existing?.email, 'someone@example.com')
})
