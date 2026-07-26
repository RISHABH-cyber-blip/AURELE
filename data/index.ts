export const NAV_LINKS = [
  { label: "Men's", href: '/shop?category=mens' },
  { label: "Women's", href: '/shop?category=womens' },
  { label: 'Shop by Brand', href: '/shop' },
  { label: 'Design Yours', href: '/customize' },
  { label: 'Authenticity', href: '/authenticity' },
]

export const HERO_STATS = [
  { num: '128', label: 'Brands Curated' },
  { num: '42-Pt', label: 'Authenticity Check' },
  { num: '30+', label: 'Countries Shipped' },
]

export const FEATURED_BRANDS = [
  'Solstice & Vane', 'Meridian House', 'Verlainne', 'Castellane',
  'Northfield & Sons', 'Aurum Atelier', 'Rivoli & Co.', 'Hartwell Bros.',
]

// Promo banner slides — built entirely with our own design tokens
// (gradients + serif type), no external images needed at all.
export const PROMO_BANNERS = [
  {
    id: 'welcome',
    eyebrow: 'Welcome to Aurele',
    title: 'Time, Curated',
    subtitle: 'Discover 450+ pieces from 15 independent houses worldwide.',
    cta: { label: 'Explore the Collection', href: '/shop' },
    gradient: 'linear-gradient(135deg, #1A1A1A 0%, #3A342B 100%)',
    textColor: '#FAF6F0',
  },
  {
    id: 'shipping',
    eyebrow: 'On Every Order',
    title: 'Free Worldwide Shipping',
    subtitle: 'No minimum. No exceptions. Delivered wherever you are.',
    cta: { label: 'Shop Now', href: '/shop' },
    gradient: 'linear-gradient(135deg, #B8935F 0%, #D9C4A0 100%)',
    textColor: '#1A1A1A',
  },
  {
    id: 'customize',
    eyebrow: 'One of One',
    title: 'Design Your Own',
    subtitle: 'Choose your case, dial, and strap — watch it come to life in real time.',
    cta: { label: 'Start Building', href: '/customize' },
    gradient: 'linear-gradient(135deg, #2F4F3D 0%, #1A1A1A 100%)',
    textColor: '#FAF6F0',
  },
  {
    id: 'authenticity',
    eyebrow: 'Our Promise',
    title: '42-Point Authenticity Check',
    subtitle: 'Every piece verified before it reaches you.',
    cta: { label: 'Learn More', href: '/authenticity' },
    gradient: 'linear-gradient(135deg, #4A4640 0%, #1A1A1A 100%)',
    textColor: '#FAF6F0',
  },
]