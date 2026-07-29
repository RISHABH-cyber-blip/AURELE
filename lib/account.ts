import { prisma } from '@/lib/prisma'

// Real numbers, computed from actual Order rows — not placeholders.
export async function getAccountStats(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId, status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
  })
  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0)
  const inProgress = orders.filter((o) => ['PAID', 'PROCESSING', 'SHIPPED'].includes(o.status)).length
  return { totalOrders, totalSpent, inProgress }
}

export async function getOrderHistory(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { variant: { include: { product: { include: { images: { take: 1 } } } } } } },
    },
  })
}