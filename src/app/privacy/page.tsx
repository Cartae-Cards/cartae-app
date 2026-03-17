import Link from 'next/link'
 
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#08172e] text-[#faf8f4]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors mb-8 inline-block">
          ← Back to Cartae
        </Link>
 
        <h1 className="font-playfair text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-white/35 text-sm mb-10">Last updated: March 2026</p>
 
        <div className="space-y-8 text-white/60 text-sm leading-relaxed">
 
          <section>
            <h2 className="text-[#faf8f4] font-semibold text-base mb-2">1. Who we are</h2>
            <p>Cartae is a UK-based trading card marketplace currently in pre-launch. Our website is cartae.co.uk. You can contact us at hello@cartae.co.uk.</p>
          </section>
 
          <section>
            <h2 className="text-[#faf8f4] font-semibold text-base mb-2">2. What data we collect</h2>
            <p>At this stage, the only personal data we collect is your email address when you voluntarily join our waitlist. We do not collect names, addresses, payment details, or any other personal information during the pre-launch period.</p>
          </section>
 
          <section>
            <h2 className="text-[#faf8f4] font-semibold text-base mb-2">3. How we use your data</h2>
            <p>Your email address is used solely to notify you when Cartae launches or when significant updates occur. We will not send marketing emails, sell your data, or share it with third parties.</p>
          </section>
 
          <section>
            <h2 className="text-[#faf8f4] font-semibold text-base mb-2">4. Where your data is stored</h2>
            <p>Email addresses are stored securely in Supabase, hosted in the EU (West Europe). All data is stored in accordance with UK GDPR requirements.</p>
          </section>
 
          <section>
            <h2 className="text-[#faf8f4] font-semibold text-base mb-2">5. Your rights</h2>
            <p>Under UK GDPR, you have the right to access, correct, or delete your personal data at any time. To request removal from our waitlist, email us at hello@cartae.co.uk and we will remove your data within 48 hours.</p>
          </section>
 
          <section>
            <h2 className="text-[#faf8f4] font-semibold text-base mb-2">6. Cookies</h2>
            <p>Cartae does not currently use cookies or tracking technologies on this website.</p>
          </section>
 
          <section>
            <h2 className="text-[#faf8f4] font-semibold text-base mb-2">7. Changes to this policy</h2>
            <p>As Cartae grows into a full marketplace, this privacy policy will be updated to reflect additional data processing. We will notify waitlist members of any significant changes.</p>
          </section>
 
          <section>
            <h2 className="text-[#faf8f4] font-semibold text-base mb-2">8. Contact</h2>
            <p>For any privacy-related questions, contact us at hello@cartae.co.uk.</p>
          </section>
        </div>
 
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <Link href="/" className="text-[#c9a84c] text-sm hover:text-[#e8c97a] transition-colors">
            ← Back to Cartae
          </Link>
        </div>
      </div>
    </div>
  )
}