import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Legal</p>
          <h1 className="font-display text-4xl font-light text-ink mb-4">Refund & Return Policy</h1>
          <p className="text-xs text-ink-faint mb-2">Last updated: August 2026</p>
          <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 text-xs text-ink-soft mb-10">
            This is placeholder content for a portfolio/demo project. Before real launch,
            this page should be reviewed and finalized by a qualified professional, and
            payment gateways typically require this page to be live before approving
            real transactions.
          </div>

          <div className="space-y-8 text-sm text-ink-soft leading-relaxed">
            <section>
              <h2 className="font-display text-xl text-ink mb-3">30-Day Returns</h2>
              <p>Unworn items in original packaging with all tags and documentation may be returned within 30 days of delivery for a full refund.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">How to Start a Return</h2>
              <p>Contact hello@aurele.com with your order number to begin the return process. We'll provide a prepaid return label for eligible items.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">Refund Timeline</h2>
              <p>Once your return is received and inspected, refunds are processed within 5-7 business days to your original payment method.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">Non-Returnable Items</h2>
              <p>Custom/personalized builds from our Design Yours configurator, and items showing signs of wear, are not eligible for return.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">Exchanges</h2>
              <p>We currently process exchanges as a return followed by a new order, to ensure accurate stock availability.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}