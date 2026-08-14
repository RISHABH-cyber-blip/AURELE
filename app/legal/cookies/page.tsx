import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Legal</p>
          <h1 className="font-display text-4xl font-light text-ink mb-4">Cookie Policy</h1>
          <p className="text-xs text-ink-faint mb-2">Last updated: August 2026</p>
          <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 text-xs text-ink-soft mb-10">
            This is placeholder content for a portfolio/demo project. Before real launch,
            this page should be reviewed and finalized by a qualified professional.
          </div>

          <div className="space-y-8 text-sm text-ink-soft leading-relaxed">
            <section>
              <h2 className="font-display text-xl text-ink mb-3">1. What Are Cookies?</h2>
              <p>Cookies are small text files placed on your device to ensure basic site functionality and remember your preferences during your session.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">2. Essential Cookies</h2>
              <p>We use essential cookies to maintain user authentication sessions, remember item states in your shopping cart, and record your disclaimer verification decision.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">3. Managing Preference Cookies</h2>
              <p>You can choose to accept or decline non-essential cookies via our Cookie Banner or clear saved cookies at any time through your web browser settings.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
