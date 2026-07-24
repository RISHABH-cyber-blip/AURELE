import { WatchStyle, StrapMaterial } from '@prisma/client'

export const BRANDS = [
  { name: 'Solstice & Vane', slug: 'solstice-vane', description: 'Precision chronographs, quietly engineered.' },
  { name: 'Meridian House', slug: 'meridian-house', description: 'Heritage dress watches since a fictional 1962.' },
  { name: 'Verlainne', slug: 'verlainne', description: 'Minimalist automatics for daily wear.' },
  { name: 'Castellane', slug: 'castellane', description: "Women's fine watches with interchangeable straps." },
  { name: 'Northfield & Sons', slug: 'northfield-sons', description: 'Rugged field watches, built to outlast.' },
  { name: 'Ambrose & Fell', slug: 'ambrose-fell', description: 'Contemporary minimalism, Scandinavian-influenced.' },
  { name: 'Cabrillo', slug: 'cabrillo', description: 'Dive watches engineered for real depth.' },
  { name: 'Théo Laurent', slug: 'theo-laurent', description: "Women's watches with a fashion-forward edge." },
  { name: 'Wren & Marlowe', slug: 'wren-marlowe', description: 'Everyday watches with an editorial finish.' },
  { name: 'Duncastle', slug: 'duncastle', description: 'British-inspired field and travel watches.' },
  { name: 'Salt & Cedar', slug: 'salt-cedar', description: 'Coastal-inspired dive and sport watches.' },
  { name: 'Étoile Noire', slug: 'etoile-noire', description: 'Bold statement watches for evening wear.' },
  { name: 'Harrow & Finch', slug: 'harrow-finch', description: 'Classic craftsmanship, modern proportions.' },
  { name: 'Kestrel Supply Co.', slug: 'kestrel-supply', description: 'Utility-driven watches for daily carry.' },
  { name: 'Lumen & Vale', slug: 'lumen-vale', description: 'Solar and eco-conscious movements.' },
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

// Maps each dial color to: Unsplash's official `color` filter value
// (undefined = skip the filter, rely on keywords only — Unsplash doesn't
// have a dedicated "silver" or "rose gold" bucket) + two search phrasings
// per color to build a bigger, more varied candidate pool.
export const COLOR_QUERIES: Record<string, { unsplashColor?: string; queries: string[] }> = {
  Black:     { unsplashColor: 'black',            queries: ['black dial wristwatch', 'black watch face'] },
  White:     { unsplashColor: 'white',             queries: ['white dial wristwatch', 'white watch face'] },
  Silver:    { unsplashColor: undefined,           queries: ['silver wristwatch', 'steel wristwatch'] },
  Blue:      { unsplashColor: 'blue',              queries: ['blue dial wristwatch', 'blue watch face'] },
  Green:     { unsplashColor: 'green',             queries: ['green dial wristwatch', 'green watch face'] },
  Champagne: { unsplashColor: 'yellow',            queries: ['champagne dial watch', 'gold tone wristwatch'] },
  Gunmetal:  { unsplashColor: 'black_and_white',   queries: ['gunmetal wristwatch', 'dark steel watch'] },
  Rose:      { unsplashColor: 'magenta',           queries: ['rose gold wristwatch', 'rose gold watch dial'] },
}

export function seededPick<T>(arr: T[], seed: number): T {
  if (arr.length === 0) {
    throw new Error('seededPick requires a non-empty array')
  }
  return arr[seed % arr.length]!
}