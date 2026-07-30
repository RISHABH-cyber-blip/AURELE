'use client'

import { useEffect, useState } from 'react'

interface Address {
  id: string; fullName: string; line1: string; line2?: string | null
  city: string; state?: string | null; postalCode: string; country: string
  phone?: string | null; isDefault: boolean
}

export default function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fullName: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', phone: '', isDefault: false })
  const [loading, setLoading] = useState(true)

  function load() {
    fetch('/api/account/addresses').then((r) => r.json()).then((d) => { setAddresses(d.addresses); setLoading(false) })
  }
  useEffect(load, [])

  async function handleAdd() {
    await fetch('/api/account/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm({ fullName: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', phone: '', isDefault: false })
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' })
    load()
  }

  async function handleSetDefault(id: string) {
    await fetch(`/api/account/addresses/${id}`, { method: 'PATCH' })
    load()
  }

  if (loading) return <p className="text-sm text-ink-faint">Loading…</p>

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        {addresses.length === 0 && <p className="text-sm text-ink-faint">No saved addresses yet.</p>}
        {addresses.map((a) => (
          <div key={a.id} className="bg-cream-soft rounded-xl p-5 flex justify-between items-start">
            <div className="text-sm text-ink-soft">
              <p className="text-ink font-medium">{a.fullName} {a.isDefault && <span className="text-gold text-xs ml-2">Default</span>}</p>
              <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
              <p>{a.city}{a.state ? `, ${a.state}` : ''} {a.postalCode}</p>
              <p>{a.country}</p>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              {!a.isDefault && <button onClick={() => handleSetDefault(a.id)} className="text-gold hover:underline">Set Default</button>}
              <button onClick={() => handleDelete(a.id)} className="text-ink-faint hover:text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="bg-cream-soft rounded-xl p-6 space-y-3">
          <input placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          <input placeholder="Address Line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="w-full bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          <input placeholder="Address Line 2 (optional)" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="w-full bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
            <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
            <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          </div>
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-gold" />
            Set as default
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAdd} className="px-6 py-2.5 rounded-full text-sm bg-ink text-cream transition-calm hover:opacity-85">Save Address</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-full text-sm text-ink-faint hover:text-ink transition-calm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="text-sm text-gold hover:underline">+ Add New Address</button>
      )}
    </div>
  )
}