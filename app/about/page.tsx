import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const TIMELINE = [
  { year: '2019', text: 'Started as a single spreadsheet — a personal list of watches worth owning, shared between friends who kept asking "where do I even start?"' },
  { year: '2021', text: 'First 12 brand partnerships formed, each chosen not for size, but for a story worth telling.' },
  { year: '2023', text: 'Built our authentication process from scratch — no piece leaves our hands without the same 42 checks, regardless of price.' },
  { year: '2026', text: 'Now home to 15 independent houses and over 450 pieces, still run with the same care as that first spreadsheet.' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Our Story</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-ink mb-10">
            Built on a Simple Belief
          </h1>

          <div className="space-y-6 text-ink-soft font-light leading-relaxed mb-16">
            <p>
              Aurele didn't start as a business plan. It started with a question a friend
              asked one evening — "if you were buying your first real watch, where would
              you even look?" There wasn't a good answer. The big names felt impersonal,
              and the independent houses making genuinely interesting work were scattered,
              hard to find, harder to trust.
            </p>
            <p>
              So we started keeping a list. Brands worth watching. Watchmakers who cared
              more about their craft than their marketing budget. Pieces that felt like
              they'd still mean something in twenty years, not just twenty minutes on a
              wrist in a photo.
            </p>
            <p>
              That list became Aurele — a place where you don't have to choose between
              discovering something genuinely new and trusting that it's real. Every brand
              here was chosen deliberately. Every piece is verified before it ships. We're
              not the biggest watch retailer, and we don't intend to be. We'd rather be the
              one you actually trust.
            </p>
          </div>

          <h2 className="font-display text-2xl font-light text-ink mb-10">How We Got Here</h2>

          <div className="space-y-10">
            {TIMELINE.map((item) => (
              <div key={item.year} className="flex gap-6">
                <span className="font-display text-2xl font-light text-gold flex-shrink-0 w-16">
                  {item.year}
                </span>
                <p className="text-sm text-ink-soft leading-relaxed pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}