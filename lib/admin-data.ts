import { prisma } from '@/lib/prisma'

function serialize<T>(data: T): T {
    return JSON.parse(JSON.stringify(data))
}

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

    return serialize({ totalProducts, totalOrders, totalRevenue, lowStockVariants, pendingOrders })
}

export async function getAdminProducts(search?: string) {
    const products = await prisma.product.findMany({
        where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { brand: true, category: true, variants: true, images: { take: 1 } },
        take: 100,
    })
    return serialize(products)
}

export async function getAdminProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { variants: true, images: true, brand: true, category: true },
    })
    return serialize(product)
}

export async function getAdminOrders(statusFilter?: string) {
    const orders = await prisma.order.findMany({
        where: statusFilter ? { status: statusFilter as any } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, name: true } }, items: { include: { variant: { include: { product: true } } } } },
        take: 100,
    })
    return serialize(orders)
}

export async function getAdminDeals() {
    const deals = await prisma.deal.findMany({
        orderBy: { endsAt: 'desc' },
        include: { product: { include: { images: { take: 1 } } } },
    })
    return serialize(deals)
}