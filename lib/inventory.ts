import { prisma } from '@/lib/prisma'

/**
 * Atomically decrements stock for a variant.
 *
 * Why this matters: if two customers try to buy the last unit at the same
 * moment, a naive "read stock, check > 0, then subtract" sequence can let
 * both purchases succeed. This uses a single conditional UPDATE so the
 * database itself guarantees only one of them can win.
 *
 * Returns true if the decrement succeeded (stock was available),
 * false if it failed (someone else got there first, or item is out of stock).
 */
export async function decrementStock(variantId: string, quantity: number): Promise<boolean> {
  const result = await prisma.$executeRaw`
    UPDATE "ProductVariant"
    SET "stockQuantity" = "stockQuantity" - ${quantity}
    WHERE id = ${variantId} AND "stockQuantity" >= ${quantity}
  `
  // executeRaw returns the number of rows affected — 1 if the update
  // matched (stock existed), 0 if the WHERE clause excluded it (sold out).
  return result === 1
}

/**
 * Restocks a variant — used for order cancellations/refunds.
 */
export async function restockVariant(variantId: string, quantity: number): Promise<void> {
  await prisma.productVariant.update({
    where: { id: variantId },
    data: { stockQuantity: { increment: quantity } },
  })
}
