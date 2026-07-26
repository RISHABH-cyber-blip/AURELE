import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

// Used on New Arrivals cards — real, computed from actual createdAt,
// not a fake "just added!" label.
export function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const days = Math.floor(seconds / 86400)
  if (days === 0) return 'Added today'
  if (days === 1) return 'Added yesterday'
  if (days < 30) return `Added ${days} days ago`
  const months = Math.floor(days / 30)
  return `Added ${months} month${months > 1 ? 's' : ''} ago`
}