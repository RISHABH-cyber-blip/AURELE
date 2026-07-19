import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  variantId: string
  productSlug: string
  name: string
  brand: string
  dialColor?: string
  strapMaterial?: string
  price: number
  currency: string
  image: string
  qty: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  removeItem: (variantId: string) => void
  updateQty: (variantId: string, qty: number) => void
  clear: () => void
  totalQty: () => number
  totalPrice: () => number
}

// Persisted to localStorage so the cart survives a refresh.
// NOTE: this is guest-cart convenience only — the real source of truth
// for stock/pricing is always re-validated server-side at checkout.
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) => {
        const existing = get().items.find((i) => i.variantId === item.variantId)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.variantId === item.variantId ? { ...i, qty: i.qty + qty } : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, qty }] })
        }
      },

      removeItem: (variantId) =>
        set({ items: get().items.filter((i) => i.variantId !== variantId) }),

      updateQty: (variantId, qty) => {
        if (qty <= 0) return get().removeItem(variantId)
        set({
          items: get().items.map((i) => (i.variantId === variantId ? { ...i, qty } : i)),
        })
      },

      clear: () => set({ items: [] }),

      totalQty: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: 'aurele-cart' }
  )
)
