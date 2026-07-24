'use client'

import { useState } from 'react'
import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import WatchCanvas from '@/components/three/watchCanvas'
import CustomizerPanel from '@/components/three/customize/CustomizerPanel'
import { CASE_METALS, DIAL_COLORS, STRAP_MATERIALS, type BuildConfig } from '@/lib/customize-options'
import type { WatchColorConfig } from '@/hooks/useThreeWatch'

function toColorConfig(build: BuildConfig): WatchColorConfig {
  return {
    caseHex: CASE_METALS.find((c) => c.id === build.caseMetalId)?.hex ?? '#B8935F',
    dialHex: DIAL_COLORS.find((d) => d.id === build.dialColorId)?.hex ?? '#1A1A1A',
    strapHex: STRAP_MATERIALS.find((s) => s.id === build.strapMaterialId)?.hex ?? '#3B2A20',
  }
}

export default function CustomizePage() {
  const [colorConfig, setColorConfig] = useState<WatchColorConfig>({
    caseHex: '#B8935F',
    dialHex: '#1A1A1A',
    strapHex: '#3B2A20',
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen grid md:grid-cols-2 items-center px-6 md:px-16 pt-32 pb-20 gap-12">
        <div className="relative order-1 h-[380px] md:h-[600px] flex items-center justify-center md:sticky md:top-32">
          <Suspense fallback={<div className="text-ink-faint text-sm">Loading…</div>}>
            <WatchCanvas config={colorConfig} />
          </Suspense>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-1.5 border border-cream-deep text-[11px] tracking-wide uppercase text-ink-faint font-mono">
            Drag to rotate
          </div>
        </div>

        <div className="order-2">
          <CustomizerPanel onConfigChange={(build) => setColorConfig(toColorConfig(build))} />
        </div>
      </main>
    </>
  )
}