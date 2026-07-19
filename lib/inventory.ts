import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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

/**
 * Stock display helper for product pages — maps raw quantity to the
 * three UI states we agreed on: in stock / low stock / out of stock.
 */
export type StockDisplay =
  | { state: 'in-stock' }
  | { state: 'low-stock'; remaining: number }
  | { state: 'out-of-stock' }

export function getStockDisplay(stockQuantity: number, lowStockAt: number): StockDisplay {
  if (stockQuantity <= 0) return { state: 'out-of-stock' }
  if (stockQuantity <= lowStockAt) return { state: 'low-stock', remaining: stockQuantity }
  return { state: 'in-stock' }
}

export { Prisma }
