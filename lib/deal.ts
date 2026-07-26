import { prisma } from '@/lib/prisma'

// Only returns deals that haven't expired yet — expired ones simply
// stop appearing, no manual cleanup needed on your end.
export async function getActiveDeals() {
  return prisma.deal.findMany({
    where: { endsAt: { gt: new Date() } },
    orderBy: { endsAt: 'asc' }, // soonest-ending deals first
    include: {
      product: {
        include: {
          brand: true,
          images: { orderBy: { position: 'asc' }, take: 1 },
          variants: { select: { dialColor: true, stockQuantity: true } },
        },
      },
    },
  })
}