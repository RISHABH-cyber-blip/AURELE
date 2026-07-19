'use client'

import { useThreeWatch } from '@/hooks/useThreeWatch'

export default function WatchCanvas() {
  const canvasRef = useThreeWatch()

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ display: 'block' }}
    />
  )
}