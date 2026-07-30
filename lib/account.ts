import { prisma } from '@/lib/prisma'

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
    include: { items: { include: { variant: { include: { product: { include: { images: { take: 1 } } } } } } } },
  })
}

export async function getAddresses(userId: string) {
  return prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } })
}

// Real tiers based on real lifetime spend (INR) — no fake gamification,
// just an honest reflection of actual purchase history.
export function getLoyaltyTier(totalSpent: number) {
  if (totalSpent >= 150000) return { name: 'Gold', min: 150000, next: null, progress: 100 }
  if (totalSpent >= 50000) return { name: 'Silver', min: 50000, next: 150000, progress: ((totalSpent - 50000) / 100000) * 100 }
  return { name: 'Bronze', min: 0, next: 50000, progress: (totalSpent / 50000) * 100 }
}