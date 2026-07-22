import { WatchStyle, StrapMaterial } from '@prisma/client'

// Search terms now always explicitly say "wristwatch" instead of the
// more ambiguous "watch" — this alone cuts down a lot of jewelry/fashion
// mismatches before the filtering algorithm even runs.
export const BRANDS = [
  { name: 'Solstice & Vane', slug: 'solstice-vane', description: 'Precision chronographs, quietly engineered.', searchTerm: 'chronograph wristwatch' },
  { name: 'Meridian House', slug: 'meridian-house', description: 'Heritage dress watches since a fictional 1962.', searchTerm: 'dress wristwatch' },
  { name: 'Verlainne', slug: 'verlainne', description: 'Minimalist automatics for daily wear.', searchTerm: 'automatic wristwatch' },
  { name: 'Castellane', slug: 'castellane', description: "Women's fine watches with interchangeable straps.", searchTerm: "women's wristwatch" },
  { name: 'Northfield & Sons', slug: 'northfield-sons', description: 'Rugged field watches, built to outlast.', searchTerm: 'field wristwatch' },
  { name: 'Ambrose & Fell', slug: 'ambrose-fell', description: 'Contemporary minimalism, Scandinavian-influenced.', searchTerm: 'minimalist wristwatch' },
  { name: 'Cabrillo', slug: 'cabrillo', description: 'Dive watches engineered for real depth.', searchTerm: 'dive wristwatch' },
  { name: 'Théo Laurent', slug: 'theo-laurent', description: "Women's watches with a fashion-forward edge.", searchTerm: 'wristwatch fashion' },
  { name: 'Wren & Marlowe', slug: 'wren-marlowe', description: 'Everyday watches with an editorial finish.', searchTerm: 'wristwatch flatlay' },
  { name: 'Duncastle', slug: 'duncastle', description: 'British-inspired field and travel watches.', searchTerm: 'leather strap wristwatch' },
  { name: 'Salt & Cedar', slug: 'salt-cedar', description: 'Coastal-inspired dive and sport watches.', searchTerm: 'sport wristwatch' },
  { name: 'Étoile Noire', slug: 'etoile-noire', description: 'Bold statement watches for evening wear.', searchTerm: 'luxury wristwatch' },
  { name: 'Harrow & Finch', slug: 'harrow-finch', description: 'Classic craftsmanship, modern proportions.', searchTerm: 'classic wristwatch' },
  { name: 'Kestrel Supply Co.', slug: 'kestrel-supply', description: 'Utility-driven watches for daily carry.', searchTerm: 'steel wristwatch' },
  { name: 'Lumen & Vale', slug: 'lumen-vale', description: 'Solar and eco-conscious movements.', searchTerm: 'gold wristwatch' },
]

export const MODEL_LINES = ['Aviator', 'Classic', 'Chrono', 'Diver', 'Field', 'Heritage', 'Minimal', 'Sport']
export const SIZES = [34, 36, 38, 40, 42, 44]
export const DIAL_COLORS = ['Black', 'White', 'Silver', 'Blue', 'Green', 'Champagne', 'Gunmetal', 'Rose']
export const STRAPS = [
  StrapMaterial.METAL,
  StrapMaterial.LEATHER,
  StrapMaterial.MESH,
  StrapMaterial.SILICONE,
  StrapMaterial.CERAMIC,
  StrapMaterial.RESIN,
]
export const STYLES = [
  WatchStyle.ANALOG,
  WatchStyle.CHRONOGRAPH,
  WatchStyle.AUTOMATIC,
  WatchStyle.MULTI_FUNCTION,
  WatchStyle.DIGITAL,
  WatchStyle.SOLAR,
  WatchStyle.MECHANICAL,
]

export const PRODUCTS_PER_BRAND = 30

export function seededPick<T>(arr: T[], seed: number): T {
  if (arr.length === 0) {
    throw new Error('seededPick requires a non-empty array')
  }

  const index = ((seed % arr.length) + arr.length) % arr.length
  return arr[index]!
}