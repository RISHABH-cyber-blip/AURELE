'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Variant {
    id: string; sku: string; dialColor: string | null; strapMaterial: string | null; stockQuantity: number
}

interface Props {
    brands: { id: string; name: string }[]
    categories: { id: string; name: string }[]
    product?: {
        id: string; name: string; description: string | null; basePrice: any
        brandId: string; categoryId: string; isPublished: boolean; variants: Variant[]
    }
}

const STRAP_OPTIONS = ['METAL', 'LEATHER', 'MESH', 'SILICONE', 'CERAMIC', 'RESIN']

export default function ProductForm({ brands, categories, product }: Props) {
    const router = useRouter()
    const isEdit = !!product

    const [name, setName] = useState(product?.name ?? '')
    const [description, setDescription] = useState(product?.description ?? '')
    const [basePrice, setBasePrice] = useState(product ? String(product.basePrice) : '')
    const [brandId, setBrandId] = useState(product?.brandId ?? brands[0]?.id ?? '')
    const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? '')
    const [imageUrl, setImageUrl] = useState('')
    const [isPublished, setIsPublished] = useState(product?.isPublished ?? true)
    const [saving, setSaving] = useState(false)

    const [variants, setVariants] = useState<Variant[]>(product?.variants ?? [])
    const [newVariant, setNewVariant] = useState({ dialColor: '', strapMaterial: 'METAL', stockQuantity: '10' })

    async function handleSave() {
        setSaving(true)
        const payload = { name, description, basePrice: Number(basePrice), brandId, categoryId, isPublished, imageUrl }

        if (isEdit) {
            await fetch(`/api/admin/products/${product!.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            router.refresh()
        } else {
            const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            const data = await res.json()
            router.push(`/admin/products/${data.product.id}/edit`)
        }
        setSaving(false)
    }

    async function handleAddVariant() {
        if (!product || !newVariant.dialColor) return
        const sku = `${product.id.slice(-6)}-${newVariant.dialColor}-${newVariant.strapMaterial}`.toLowerCase()
        const res = await fetch('/api/admin/variants', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id, sku, ...newVariant }),
        })
        const data = await res.json()
        setVariants([...variants, data.variant])
        setNewVariant({ dialColor: '', strapMaterial: 'METAL', stockQuantity: '10' })
    }

    async function handleUpdateStock(variantId: string, stockQuantity: number) {
        await fetch(`/api/admin/variants/${variantId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stockQuantity }) })
        setVariants(variants.map((v) => (v.id === variantId ? { ...v, stockQuantity } : v)))
    }

    async function handleDeleteVariant(variantId: string) {
        await fetch(`/api/admin/variants/${variantId}`, { method: 'DELETE' })
        setVariants(variants.filter((v) => v.id !== variantId))
    }

    async function handleDeleteProduct() {
        if (!product || !confirm('Delete this product permanently? This cannot be undone.')) return
        await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
        router.push('/admin/products')
    }

    return (
        <div className="max-w-2xl">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                    <label className="block text-xs text-ink-faint uppercase tracking-wide mb-1">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                    <label className="block text-xs text-ink-faint uppercase tracking-wide mb-1">Brand</label>
                    <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="w-full bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold">
                        {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-ink-faint uppercase tracking-wide mb-1">Category</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold">
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-ink-faint uppercase tracking-wide mb-1">Base Price ($)</label>
                    <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                </div>
                <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 text-sm text-ink-soft">
                        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="accent-gold" />
                        Published (visible in shop)
                    </label>
                </div>
                {!isEdit && (
                    <div className="col-span-2">
                        <label className="block text-xs text-ink-faint uppercase tracking-wide mb-1">Image URL</label>
                        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                    </div>
                )}
                <div className="col-span-2">
                    <label className="block text-xs text-ink-faint uppercase tracking-wide mb-1">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
            </div>

            <div className="flex gap-3 mb-10">
                <button onClick={handleSave} disabled={saving || !name} className="px-6 py-2.5 rounded-full text-sm bg-ink text-cream transition-calm hover:opacity-85 disabled:opacity-40">
                    {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
                </button>
                {isEdit && (
                    <button onClick={handleDeleteProduct} className="px-6 py-2.5 rounded-full text-sm text-red-600 border border-red-200 hover:bg-red-50 transition-calm">
                        Delete Product
                    </button>
                )}
            </div>

            {isEdit && (
                <div>
                    <h2 className="font-display text-xl font-light text-ink mb-4">Variants (Color / Strap / Stock)</h2>
                    <div className="flex flex-col gap-2 mb-4">
                        {variants.map((v) => (
                            <div key={v.id} className="flex items-center gap-3 bg-cream-soft rounded-lg px-4 py-2.5">
                                <span className="text-sm text-ink flex-1">{v.dialColor} · {v.strapMaterial}</span>
                                <input
                                    type="number"
                                    defaultValue={v.stockQuantity}
                                    onBlur={(e) => handleUpdateStock(v.id, Number(e.target.value))}
                                    className="w-20 bg-cream border border-cream-deep rounded-md px-2 py-1 text-sm text-center"
                                />
                                <button onClick={() => handleDeleteVariant(v.id)} className="text-xs text-ink-faint hover:text-red-600">Remove</button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="block text-[10px] text-ink-faint uppercase mb-1">Dial Color</label>
                            <input value={newVariant.dialColor} onChange={(e) => setNewVariant({ ...newVariant, dialColor: e.target.value })} placeholder="e.g. Black" className="w-full bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-ink-faint uppercase mb-1">Strap</label>
                            <select value={newVariant.strapMaterial} onChange={(e) => setNewVariant({ ...newVariant, strapMaterial: e.target.value })} className="bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm">
                                {STRAP_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] text-ink-faint uppercase mb-1">Stock</label>
                            <input type="number" value={newVariant.stockQuantity} onChange={(e) => setNewVariant({ ...newVariant, stockQuantity: e.target.value })} className="w-20 bg-cream-soft border border-cream-deep rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <button onClick={handleAddVariant} disabled={!newVariant.dialColor} className="px-4 py-2 rounded-lg text-sm bg-gold text-ink transition-calm hover:opacity-85 disabled:opacity-40">
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}