export type StockDisplay =
  | { state: 'in-stock' }
  | { state: 'low-stock'; remaining: number }
  | { state: 'out-of-stock' }

export function getStockDisplay(stockQuantity: number, lowStockAt: number): StockDisplay {
  if (stockQuantity <= 0) return { state: 'out-of-stock' }
  if (stockQuantity <= lowStockAt) return { state: 'low-stock', remaining: stockQuantity }
  return { state: 'in-stock' }
}
