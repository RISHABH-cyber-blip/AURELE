'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
    deals: { id: string; discountPct: number; endsAt: string | Date; product: { name: string } }[]
    products: { id: string; name: string }[]
}

export default function DealsManager({ deals, products }: Props) {
    const router = useRouter()
    const [productId, setProductId] = useState(products[0]?.id ?? '')
    const [discountPct, setDiscountPct] = useState('20')
    const [endsAt, setEndsAt] = useState('')
    const [saving, setSaving] = useState(false)

    async function handleAdd() {
        if (!endsAt) return
        setSaving(true)
        await fetch('/api/admin/deals', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, discountPct, endsAt }),
        })
        setSaving(false)
        router.refresh()
    }

    async function handleDelete(id: string) {
        await fetch(`/api/admin/deals/${id}`, { method: 'DELETE' })
        router.refresh()
    }

    return (
        <div>
            <div className="bg-cream-soft rounded-2xl p-6 mb-8 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-[10px] text-ink-faint uppercase mb-1">Product</label>
                    <select value={productId} onChange={(e) => setProductId(e.target.value)} className="bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm">
                        {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-ink-faint uppercase mb-1">Discount %</label>
                    <input type="number" value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} className="w-24 bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                    <label className="block text-[10px] text-ink-faint uppercase mb-1">Ends At</label>
                    <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm" />
                </div>
                <button onClick={handleAdd} disabled={saving || !endsAt} className="px-5 py-2.5 rounded-lg text-sm bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40">
                    {saving ? 'Adding…' : 'Add Deal'}
                </button>
            </div>

            <div className="bg-cream-soft rounded-2xl overflow-hidden">
                {deals.length === 0 ? (
                    <p className="p-6 text-sm text-ink-faint">No active deals.</p>
                ) : (
                    deals.map((d) => (
                        <div key={d.id} className="flex items-center justify-between px-5 py-3.5 border-b border-cream-deep last:border-0">
                            <div>
                                <p className="text-sm text-ink">{d.product.name}</p>
                                <p className="text-xs text-ink-faint">{d.discountPct}% off · ends {new Date(d.endsAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => handleDelete(d.id)} className="text-xs text-ink-faint hover:text-red-600">Remove</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}