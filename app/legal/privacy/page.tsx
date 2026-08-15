import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 pt-32 pb-24">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs tracking-[4px] uppercase text-gold mb-3">Legal</p>
          <h1 className="font-display text-4xl font-light text-ink mb-4">Privacy Policy</h1>
          <p className="text-xs text-ink-faint mb-2">Last updated: August 2026</p>
          <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 text-xs text-ink-soft mb-10">
            This is placeholder content for a portfolio/demo project. Before real launch,
            this page should be reviewed and finalized by a qualified professional,
            particularly regarding GDPR (EU visitors) and other applicable data protection laws.
          </div>

          <div className="space-y-8 text-sm text-ink-soft leading-relaxed">
            <section>
              <h2 className="font-display text-xl text-ink mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly (name, email, shipping address, phone number) and information generated through your use of the site (order history, wishlist items, browsing activity).</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">2. How We Use Your Information</h2>
              <p>We use collected information to process orders, provide customer support, send order confirmations, and improve our services. We do not sell your personal information to third parties.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">3. Payment Information</h2>
              <p>Payments are processed securely through Razorpay. We do not store your card details on our servers.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">4. Cookies</h2>
              <p>We use cookies and similar technologies to maintain your session, remember your cart, and understand site usage.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">5. Your Rights</h2>
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting rm1994269@gmail.com.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-ink mb-3">6. Data Security</h2>
              <p>We use industry-standard security measures to protect your information, including encrypted connections and secure database access controls.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}