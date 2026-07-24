// Case metals, dial colors, and strap materials available in the
// configurator, each mapped to a real hex color the 3D model uses,
// plus a price modifier applied on top of the base price.

export const CASE_METALS = [
  { id: 'gold', label: 'Gold', hex: '#B8935F', priceModifier: 120 },
  { id: 'silver', label: 'Silver', hex: '#C9C9C9', priceModifier: 0 },
  { id: 'gunmetal', label: 'Gunmetal', hex: '#3A3A3A', priceModifier: 60 },
  { id: 'rosegold', label: 'Rose Gold', hex: '#B76E79', priceModifier: 140 },
]

export const DIAL_COLORS = [
  { id: 'black', label: 'Black', hex: '#1A1A1A', priceModifier: 0 },
  { id: 'white', label: 'White', hex: '#FAF6F0', priceModifier: 0 },
  { id: 'blue', label: 'Blue', hex: '#2D4A6E', priceModifier: 20 },
  { id: 'green', label: 'Green', hex: '#2F4F3D', priceModifier: 20 },
  { id: 'champagne', label: 'Champagne', hex: '#D9C4A0', priceModifier: 40 },
  { id: 'rose', label: 'Rose', hex: '#C98FA0', priceModifier: 40 },
]

export const STRAP_MATERIALS = [
  { id: 'leather', label: 'Leather', hex: '#3B2A20', priceModifier: 30 },
  { id: 'metal', label: 'Metal Bracelet', hex: '#B0B0B0', priceModifier: 50 },
  { id: 'mesh', label: 'Mesh', hex: '#B8B8B8', priceModifier: 40 },
  { id: 'silicone', label: 'Silicone', hex: '#1A1A1A', priceModifier: 0 },
  { id: 'ceramic', label: 'Ceramic', hex: '#F0F0F0', priceModifier: 80 },
]

export const SIZES = [36, 38, 40, 42, 44]

export const BASE_PRICE = 349

export interface BuildConfig {
  caseMetalId: string
  dialColorId: string
  strapMaterialId: string
  size: number
}

export function calculatePrice(config: BuildConfig): number {
  const caseMetal = CASE_METALS.find((c) => c.id === config.caseMetalId)
  const dial = DIAL_COLORS.find((d) => d.id === config.dialColorId)
  const strap = STRAP_MATERIALS.find((s) => s.id === config.strapMaterialId)
  return BASE_PRICE + (caseMetal?.priceModifier ?? 0) + (dial?.priceModifier ?? 0) + (strap?.priceModifier ?? 0)
}