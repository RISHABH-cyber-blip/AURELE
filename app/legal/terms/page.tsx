import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Legal</p>
          <h1 className="font-display text-4xl font-light text-ink mb-4">Terms of Service</h1>
          <p className="text-xs text-ink-faint mb-2">Last updated: August 2026</p>
          <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 text-xs text-ink-soft mb-10">
            This is placeholder content for a portfolio/demo project. Before real launch,
            this page should be reviewed and finalized by a qualified professional
            familiar with e-commerce law in your operating region.
          </div>

          <div className="space-y-8 text-sm text-ink-soft leading-relaxed">
            <section>
              <h2 className="font-display text-xl text-ink mb-3">1. Agreement to Terms</h2>
              <p>By accessing or using the Aurele website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use this site.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">2. Products & Pricing</h2>
              <p>All product descriptions, images, and prices are subject to change without notice. We reserve the right to limit quantities and refuse service to anyone.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">3. Orders & Payment</h2>
              <p>Orders are confirmed upon successful payment. We reserve the right to cancel any order for reasons including but not limited to product availability or suspected fraud.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">4. Account Responsibility</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">5. Limitation of Liability</h2>
              <p>Aurele shall not be liable for any indirect, incidental, or consequential damages arising from use of this site or its products.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">6. Governing Law</h2>
              <p>These terms are governed by applicable law in the jurisdiction where Aurele operates.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">7. Contact</h2>
              <p>Questions about these Terms can be sent to rm1994269@gmail.com.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}