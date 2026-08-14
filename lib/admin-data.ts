import { prisma } from '@/lib/prisma'

export async function getAdminDashboardStats() {
    const [totalProducts, totalOrders, paidOrders, lowStockVariants, pendingOrders] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.findMany({ where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } } }),
        prisma.productVariant.findMany({
            where: { stockQuantity: { gt: 0, lte: 3 }, status: 'ACTIVE' },
            include: { product: { select: { name: true, slug: true } } },
            take: 8,
            orderBy: { stockQuantity: 'asc' },
        }),
        prisma.order.count({ where: { status: { in: ['PAID', 'PROCESSING'] } } }),
    ])

    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0)

    return { totalProducts, totalOrders, totalRevenue, lowStockVariants, pendingOrders }
}

export async function getAdminProducts(search?: string) {
    return prisma.product.findMany({
        where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { brand: true, category: true, variants: true, images: { take: 1 } },
        take: 100,
    })
}

export async function getAdminProduct(id: string) {
    return prisma.product.findUnique({
        where: { id },
        include: { variants: true, images: true, brand: true, category: true },
    })
}

export async function getAdminOrders(statusFilter?: string) {
    return prisma.order.findMany({
        where: statusFilter ? { status: statusFilter as any } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, name: true } }, items: { include: { variant: { include: { product: true } } } } },
        take: 100,
    })
}

export async function getAdminDeals() {
    return prisma.deal.findMany({
        orderBy: { endsAt: 'desc' },
        include: { product: { include: { images: { take: 1 } } } },
    })
}