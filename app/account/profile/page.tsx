'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  user: { name: string | null; phone: string | null; avatarUrl: string | null }
}

export default function ProfileForm({ user }: Props) {
  const router = useRouter()
  const [name, setName] = useState(user.name ?? '')
  const [phone, setPhone] = useState(user.phone ?? '')
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, avatarUrl }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-cream-soft overflow-hidden flex items-center justify-center text-xl text-ink-faint flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            name?.[0]?.toUpperCase() ?? '?'
          )}
        </div>
        <div className="flex-1">
          <label className="block text-xs text-ink-faint uppercase tracking-wide mb-1">Avatar URL</label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <label className="block text-xs text-ink-faint uppercase tracking-wide mb-1">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gold"
      />

      <label className="block text-xs text-ink-faint uppercase tracking-wide mb-1">Phone</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm mb-6 focus:outline-none focus:border-gold"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-7 py-3 rounded-full text-sm bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40"
      >
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
      </button>
    </div>
  )
}