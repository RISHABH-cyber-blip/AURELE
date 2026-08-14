import { requireAdmin } from '@/lib/admin'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin()

    return (
        <div className="flex min-h-screen bg-cream">
            <AdminSidebar />
            <main className="flex-1 p-8 md:p-10">{children}</main>
        </div>
    )
}