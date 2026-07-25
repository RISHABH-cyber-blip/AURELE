'use client'

import { useEffect } from 'react'
import { addRecentlyViewed, type RecentlyViewedItem } from '@/lib/recently-viewed'

export default function TrackView({ item }: { item: RecentlyViewedItem }) {
  useEffect(() => {
    addRecentlyViewed(item)
  }, [item])

  return null
}