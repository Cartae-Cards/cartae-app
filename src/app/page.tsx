'use client'
// src/app/page.tsx
// Cartae — Homepage / Landing Page
// Next.js 14 App Router | TypeScript | Tailwind CSS
// Fonts loaded via next/font in layout.tsx — see note at bottom of this file

import { useState } from 'react'
import Link from "next/link";

// ─── DATA ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "0%", label: "Seller listing fees" },
  { value: "£GBP", label: "Native pricing" },
  { value: "48hr", label: "Buyer protection escrow" },
  { value: "AI", label: "Powered listing tools" },
];

const features = [
  {
    icon: "💷",
    title: "GBP-Native Pricing",
    desc: "Every price in British pounds. No currency conversion guesswork, no surprise fees on checkout. What you see is what you pay.",
  },
  {
    icon: "🤖",
    title: "AI Listing Assistant",
    desc: "Snap a photo of your card. Our AI identifies the card, set, language, and condition — and pre-fills your listing in seconds.",
  },
  {
    icon: "🛡️",
    title: "Buyer Protection",
    desc: "Funds are held in escrow for 48 hours after dispatch. Only released when you confirm delivery. Disputes handled fairly.",
  },
  {
    icon: "📊",
    title: "Price Confidence Score",
    desc: "As a seller, see how your price compares to market averages in real time — Great Value, Competitive, or Overpriced.",
  },
  {
    icon: "🌍",
    title: "EN / JP / KR Cards",
    desc: "Full support for English, Japanese, and Korean card variants. Each listing clearly badged so buyers always know what they're getting.",
  },
  {
    icon: "🏅",
    title: "Graded Card Support",
    desc: "PSA, BGS, and CGC graded cards are first-class citizens. Grade badges, grade-specific pricing, and graded filters throughout.",
  },
];

const steps = [
  {
    num: "1",
    title: "List your card",
    desc: "Upload a photo, let the AI fill in the details, set your price and see your confidence score.",
  },
  {
    num: "2",
    title: "Buyer purchases",
    desc: "Payment is captured securely via Stripe. Funds are held in escrow — you're protected from day one.",
  },
  {
    num: "3",
    title: "Confirm & release",
    desc: "Buyer confirms delivery within 48 hours. Funds are released to the seller. Both parties leave a review.",
  },
];

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistMessage, setWaitlistMessage] = useState('')
  const [waitlistLoading, setWaitlistLoading] = useState(false)

  return (
    <div className="bg-[#faf8f4] text-[#0f1f3d] overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-5 bg-[#faf8f4]/90 backdrop-blur-md border-b border-[#e5e1d8]">
        <span className="font-playfair text-2xl font-black tracking-tight">
          Carta<span className="text-[#c9a84c]">e</span>
        </span>
        <ul className="hidden md:flex gap-8 list-none">
          {["Features", "Price Tracker", "How It Works"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-[#6b7280] hover:text-[#0f1f3d] transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <Link
          href="#early-access"
          className="bg-[#0f1f3d] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#1a3260] transition-colors"
        >
          Get Early Access
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center pt-32 pb-20 px-[5%] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-[25%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#c9a84c]/[0.06] blur-3xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto w-full">
          <div className="flex flex-col animate-fade-up">
            <span className="inline-flex items-center gap-2 self-start bg-[#c9a84c]/10 border border-[#c9a84c]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#8a6a1a] uppercase tracking-widest mb-6">
              🇬🇧 UK-First Marketplace — Coming Soon
            </span>

            <h1 className="font-playfair text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
              Buy &amp; sell cards{" "}
              <br />
              the{" "}
              <em className="not-italic text-[#c9a84c]">right</em> way.
              <br />
              In pounds.
            </h1>

            <p className="text-lg text-[#6b7280] leading-relaxed mb-10 max-w-lg">
              Cartae is the UK's dedicated trading card marketplace — GBP-native
              pricing, zero seller fees, AI-powered listings, and built-in buyer
              protection.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#early-access"
                className="inline-flex items-center gap-2 bg-[#0f1f3d] text-white font-medium text-base px-8 py-3.5 rounded-lg hover:bg-[#1a3260] hover:-translate-y-0.5 transition-all"
              >
                Get Early Access →
              </Link>
              <Link
                href="/price-tracker"
                className="inline-flex items-center gap-2 bg-transparent text-[#0f1f3d] font-medium text-base px-8 py-3.5 rounded-lg border-2 border-[#0f1f3d] hover:bg-[#0f1f3d] hover:text-white transition-all"
              >
                Try Price Tracker
              </Link>
            </div>
          </div>

          <div className="relative h-[460px] flex items-center justify-center">
            <div className="relative w-[240px] h-[340px] animate-float">
              <div className="absolute w-[220px] h-[310px] rounded-[14px] bg-gradient-to-br from-[#1a3260] to-[#0f1f3d] border border-white/10 shadow-2xl rotate-[-8deg] translate-x-[-30px] translate-y-[10px] z-[1]" />
              <div className="absolute w-[220px] h-[310px] rounded-[14px] bg-gradient-to-br from-[#2a4a8a] to-[#1a3260] border border-white/10 shadow-2xl rotate-[-3deg] translate-x-[-10px] translate-y-[5px] z-[2]" />
              <div className="absolute w-[220px] h-[310px] rounded-[14px] bg-white border border-[#e5e1d8] shadow-2xl rotate-[2deg] z-[3] p-4 flex flex-col">
                <div className="w-full h-[170px] rounded-lg bg-gradient-to-br from-[#e8f0fe] to-[#c7d8f8] flex items-center justify-center text-5xl mb-3">
                  ⚡
                </div>
                <p className="font-playfair font-bold text-base text-[#0f1f3d] mb-0.5">
                  Pikachu ex
                </p>
                <p className="text-xs text-[#6b7280] mb-3">
                  Scarlet &amp; Violet 151
                </p>
                <div className="flex gap-1.5 flex-wrap mb-3">
                  <span className="bg-blue-100 text-blue-800 text-[0.65rem] font-semibold px-2 py-0.5 rounded">EN</span>
                  <span className="bg-green-100 text-green-800 text-[0.65rem] font-semibold px-2 py-0.5 rounded">NM</span>
                  <span className="bg-amber-100 text-amber-800 text-[0.65rem] font-semibold px-2 py-0.5 rounded">PSA 10</span>
                </div>
                <div className="mt-auto">
                  <p className="font-playfair font-bold text-xl text-[#0f1f3d]">£124.99</p>
                  <p className="text-[0.65rem] text-[#6b7280]">+ buyer protection included</p>
                </div>
              </div>
            </div>

            <div className="absolute top-5 right-0 md:-right-5 bg-white border border-[#e5e1d8] rounded-xl px-3.5 py-2.5 shadow-lg flex items-center gap-2 text-xs font-medium whitespace-nowrap z-10">
              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              AI-filled in 3 seconds
            </div>
            <div className="absolute bottom-10 left-0 md:-left-10 bg-white border border-[#e5e1d8] rounded-xl px-3.5 py-2.5 shadow-lg flex items-center gap-2 text-xs font-medium whitespace-nowrap z-10">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] flex-shrink-0" />
              0% seller listing fee
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="bg-[#0f1f3d] px-[5%] py-8 flex justify-center">
        <div className="flex flex-wrap max-w-4xl w-full border border-white/10 rounded-xl overflow-hidden">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex-1 min-w-[140px] py-6 px-8 text-center ${i < stats.length - 1 ? "border-r border-white/10" : ""}`}
            >
              <span className="font-playfair text-3xl font-bold text-[#e8c97a] block mb-1">{stat.value}</span>
              <span className="text-xs text-white/50 font-light">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-[5%] max-w-6xl mx-auto">
        <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#c9a84c] block mb-3">Why Cartae</span>
        <h2 className="font-playfair text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4">
          Built for UK collectors.<br />Not an afterthought.
        </h2>
        <p className="text-[#6b7280] text-base leading-relaxed max-w-xl mb-14">
          TCGPlayer is built for the US. Cardmarket is built for Europe. Cartae is built for you — GBP, Royal Mail, and the UK Pokémon community first.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-[#e5e1d8] rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center text-xl mb-5">{f.icon}</div>
              <h3 className="font-playfair font-bold text-lg text-[#0f1f3d] mb-2">{f.title}</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICE TRACKER ── */}
      <section id="price-tracker" className="bg-[#0f1f3d] py-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#c9a84c]/10 blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto relative">
          <div>
            <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#c9a84c] block mb-3">Free Tool</span>
            <h2 className="font-playfair text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight mb-4">
              Track GBP card<br />prices. Before<br />you even sign up.
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-6">
              The Cartae Price Tracker launches before the marketplace. Check live GBP prices, 30-day trends, and PSA grade values for any Pokémon card — completely free, no account needed.
            </p>
            <span className="inline-block bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#e8c97a] text-xs font-medium px-4 py-1.5 rounded-full mb-8">
              Launching first · No login required
            </span>
            <br />
            <Link href="#early-access" className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1f3d] font-semibold text-sm px-7 py-3 rounded-lg hover:bg-[#e8c97a] transition-colors">
              Get notified when it&apos;s live →
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex gap-2 mb-5">
              <input type="text" defaultValue="Charizard ex" readOnly className="flex-1 bg-white/[0.08] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none" />
              <button className="bg-[#c9a84c] text-[#0f1f3d] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#e8c97a] transition-colors">Search</button>
            </div>
            <div className="flex gap-2 mb-4">
              {["EN", "JP", "KR"].map((lang, i) => (
                <button key={lang} className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${i === 0 ? "bg-white/10 text-white border-white/20" : "bg-transparent text-white/50 border-white/10 hover:text-white/70"}`}>{lang}</button>
              ))}
            </div>
            <div className="bg-white/5 border border-white/[0.08] rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-[68px] rounded-lg bg-gradient-to-br from-[#3a5fa0] to-[#1a3260] flex items-center justify-center text-2xl flex-shrink-0">🔥</div>
              <div className="flex-1 min-w-0">
                <p className="font-playfair font-bold text-sm text-white mb-0.5 truncate">Charizard ex — Special Illustration Rare</p>
                <p className="text-[0.7rem] text-white/40 mb-3">Obsidian Flames · SV03 · #234</p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <span className="font-playfair font-bold text-base text-[#e8c97a] block">£89.99</span>
                    <span className="text-[0.65rem] text-white/35">Raw NM</span>
                  </div>
                  <div className="text-center">
                    <span className="font-playfair font-bold text-base text-[#e8c97a] block">£310.00</span>
                    <span className="text-[0.65rem] text-white/35">PSA 10</span>
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-base text-green-400 block">↑ 12%</span>
                    <span className="text-[0.65rem] text-white/35">30-day trend</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-[5%] max-w-6xl mx-auto text-center">
        <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#c9a84c] block mb-3">Simple Process</span>
        <h2 className="font-playfair text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4">How Cartae works</h2>
        <p className="text-[#6b7280] text-base leading-relaxed max-w-md mx-auto mb-14">
          Buying and selling should be simple. Here's how a transaction works on Cartae.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[17%] right-[17%] h-px bg-[#e5e1d8]" />
          {steps.map((step) => (
            <div key={step.num} className="px-4">
              <div className="w-16 h-16 rounded-full bg-[#0f1f3d] text-white font-playfair text-2xl font-bold flex items-center justify-center mx-auto mb-5 relative z-10">{step.num}</div>
              <h3 className="font-playfair font-bold text-lg text-[#0f1f3d] mb-2">{step.title}</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EARLY ACCESS ── */}
      <section id="early-access" className="py-24 px-[5%] text-center bg-[#faf8f4]">
        <div className="max-w-lg mx-auto">
          <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#c9a84c] block mb-3">Join the waitlist</span>
          <h2 className="font-playfair text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4">
            Be first when<br />Cartae launches
          </h2>
          <p className="text-[#6b7280] text-base leading-relaxed mb-8">
            We&apos;re soft-launching in 6–8 weeks. Sign up to get early access, be notified when the Price Tracker goes live, and help shape the platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <input
              type="email"
              placeholder="your@email.com"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              className="flex-1 border-[1.5px] border-[#e5e1d8] rounded-lg px-4 py-3 text-sm text-[#0f1f3d] bg-white outline-none focus:border-[#0f1f3d] transition-colors"
            />
            <button
              onClick={async () => {
                if (!waitlistEmail) return
                setWaitlistLoading(true)
                try {
                  const res = await fetch('/api/waitlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: waitlistEmail })
                  })
                  const data = await res.json()
                  setWaitlistMessage(data.message || data.error)
                  setWaitlistEmail('')
                } catch {
                  setWaitlistMessage('Something went wrong, please try again.')
                } finally {
                  setWaitlistLoading(false)
                }
              }}
              disabled={waitlistLoading}
              className="bg-[#0f1f3d] text-white font-medium text-sm px-6 py-3 rounded-lg hover:bg-[#1a3a5c] transition-colors disabled:opacity-50"
            >
              {waitlistLoading ? 'Joining...' : 'Notify me →'}
            </button>
          </div>
          {waitlistMessage && (
            <p className="text-sm text-center text-[#0f1f3d] mt-2">{waitlistMessage}</p>
          )}
          <p className="text-xs text-[#6b7280]">No spam. Just a single email when we launch. Unsubscribe any time.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0f1f3d] px-[5%] py-10 flex flex-wrap justify-between items-center gap-4">
        <span className="font-playfair text-xl font-black text-white">Carta<span className="text-[#c9a84c]">e</span></span>
        <ul className="flex gap-6 list-none">
          {["About", "Price Tracker", "Contact", "Privacy"].map((item) => (
            <li key={item}>
              <Link href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">{item}</Link>
            </li>
          ))}
        </ul>
        <span className="text-xs text-white/30">© 2026 Cartae · cartae.co.uk · Built in the UK 🇬🇧</span>
      </footer>

    </div>
  );
}
