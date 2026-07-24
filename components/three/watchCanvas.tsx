'use client'

import { useThreeWatch, type WatchColorConfig } from '@/hooks/useThreeWatch'

interface Props {
  config?: WatchColorConfig
}

const DEFAULT_CONFIG: WatchColorConfig = {
  caseHex: '#B8935F',
  dialHex: '#1A1A1A',
  strapHex: '#3B2A20',
}

export default function WatchCanvas({ config = DEFAULT_CONFIG }: Props) {
  const canvasRef = useThreeWatch(config)

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ display: 'block' }}
    />
  )
}