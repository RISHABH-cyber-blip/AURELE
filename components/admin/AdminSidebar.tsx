'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Tag, ExternalLink } from 'lucide-react'

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/deals', label: 'Deals', icon: Tag },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-60 flex-shrink-0 bg-ink min-h-screen p-6 flex flex-col">
            <p className="font-display text-xl font-light text-cream tracking-wide mb-1">AURELE</p>
            <p className="font-mono text-[10px] tracking-[3px] uppercase text-gold mb-10">Admin</p>

            <nav className="flex flex-col gap-1 flex-1">
                {NAV.map((item) => {
                    const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-calm ${active ? 'bg-gold/15 text-gold' : 'text-cream/60 hover:text-cream hover:bg-cream/5'
                                }`}
                        >
                            <Icon size={16} strokeWidth={1.5} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <Link href="/" className="flex items-center gap-2 px-3 py-2.5 text-xs text-cream/40 hover:text-cream/70 transition-calm">
                <ExternalLink size={13} />
                View Storefront
            </Link>
        </aside>
    )
}