'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

const STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

interface Props {
    order: {
        id: string; status: string; total: any; currency: string; createdAt: string | Date
        trackingNumber: string | null; carrier: string | null
        user: { email: string; name: string | null } | null; guestEmail: string | null
        items: { id: string; quantity: number; variant: { product: { name: string } } }[]
    }
}

export default function OrderRow({ order }: Props) {
    const [status, setStatus] = useState(order.status)
    const [tracking, setTracking] = useState(order.trackingNumber ?? '')
    const [carrier, setCarrier] = useState(order.carrier ?? '')
    const [saving, setSaving] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleSave() {
        setSaving(true)
        await fetch(`/api/admin/orders/${order.id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, trackingNumber: tracking, carrier }),
        })
        setSaving(false)
    }

    return (
        <div className="border-b border-cream-deep last:border-0">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-cream-deep/30 transition-calm">
                <span className="text-xs text-ink-faint w-24 flex-shrink-0">#{order.id.slice(-8).toUpperCase()}</span>
                <span className="text-sm text-ink flex-1 truncate">{order.user?.email || order.guestEmail || 'Guest'}</span>
                <span className="text-xs text-ink-faint">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                <span className="text-sm text-ink-soft w-20 text-right">{formatPrice(Number(order.total), order.currency)}</span>
                <span className="text-[10px] uppercase px-2.5 py-1 rounded-full bg-gold/10 text-gold w-24 text-center">{order.status}</span>
            </button>

            {open && (
                <div className="px-5 pb-5 bg-cream-soft">
                    <div className="flex flex-wrap gap-3 items-end pt-3">
                        <div>
                            <label className="block text-[10px] text-ink-faint uppercase mb-1">Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm">
                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] text-ink-faint uppercase mb-1">Tracking Number</label>
                            <input value={tracking} onChange={(e) => setTracking(e.target.value)} className="bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-ink-faint uppercase mb-1">Carrier</label>
                            <input value={carrier} onChange={(e) => setCarrier(e.target.value)} className="bg-cream border border-cream-deep rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg text-sm bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40">
                            {saving ? 'Saving…' : 'Update Order'}
                        </button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-cream-deep">
                        {order.items.map((item) => (
                            <p key={item.id} className="text-xs text-ink-faint">{item.variant.product.name} × {item.quantity}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}