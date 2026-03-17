'use client'
// src/app/page.tsx
// Cartae — Homepage / Landing Page
// Next.js 14 App Router | TypeScript | Tailwind CSS

import { useState, useRef } from 'react'
import Link from "next/link";
import { useRouter } from 'next/navigation';
 
// ─── DATA ────────────────────────────────────────────────────────────────────
 
const stats = [
  { value: "£0", label: "Seller fees. Always." },
  { value: "48hr", label: "Buyer protection" },
  { value: "100%", label: "GBP native" },
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
 
// Real card images from PokeTrace CDN — no API call needed
const HERO_CARDS = [
  {
    image: "https://cdn.poketrace.com/cards/d64defcfc64ff4ea.webp",
    name: "Charizard",
    set: "Base Set · 004/102",
    price: "£379.03",
  },
  {
    image: "https://cdn.poketrace.com/cards/ec575a0a587733af.webp",
    name: "Charizard",
    set: "XY Evolutions · 11/108",
    price: "£54.09",
  },
  {
    image: "https://cdn.poketrace.com/cards/cfc6e6e5032ce72a.webp",
    name: "Charizard",
    set: "Plasma Storm · 136/135",
    price: "£755.30",
  },
]
 
// ─── PAGE ────────────────────────────────────────────────────────────────────
 
export default function HomePage() {
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistMessage, setWaitlistMessage] = useState('')
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const [navSearch, setNavSearch] = useState('')
  const router = useRouter()
 
  function handleNavSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!navSearch.trim()) return
    router.push(`/price-tracker?q=${encodeURIComponent(navSearch.trim())}`)
  }
 
  async function handleWaitlist() {
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
  }
 
  return (
    <div className="bg-[#1b1c22] text-[#faf8f4] overflow-x-hidden">
 
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4 bg-[#1b1c22]/90 backdrop-blur-md border-b border-white/[0.06]">
        <span className="font-playfair text-2xl font-black tracking-tight text-[#faf8f4]">
          Carta<span className="text-[#b65529]">e</span>
        </span>
        <ul className="hidden md:flex gap-8 list-none">
          {[
            { label: "Features", href: "#features" },
            { label: "Price Tracker", href: "#price-tracker" },
            { label: "How It Works", href: "#how-it-works" },
          ].map((item) => (
            <li key={item.label}>
              <a href={item.href} className="text-sm font-medium text-white/50 hover:text-[#faf8f4] transition-colors">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        {/* Nav search — redirects to price tracker */}
        <form onSubmit={handleNavSearch} className="flex items-center">
          <div className="relative flex items-center">
            <svg className="absolute left-3 w-3.5 h-3.5 text-white/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search card prices..."
              className="bg-white/[0.08] border border-white/[0.18] rounded-lg pl-9 pr-4 py-2 text-sm text-[#faf8f4] placeholder-white/35 focus:outline-none focus:border-[#b65529]/60 transition-colors w-52"
            />
          </div>
        </form>
      </nav>
 
      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center pt-32 pb-20 px-[5%] relative overflow-hidden">
        <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#b65529]/[0.05] blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-[5%] w-[400px] h-[400px] rounded-full bg-[#2a2b35]/30 blur-3xl pointer-events-none" />
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto w-full">
 
          {/* Left */}
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-2 self-start bg-[#b65529]/10 border border-[#b65529]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#b65529] uppercase tracking-widest mb-6">
              🇬🇧 UK-First Marketplace · Coming Soon
            </span>
 
            <h1 className="font-playfair text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-5">
              The collector&apos;s<br />
              marketplace,<br />
              <em className="not-italic text-[#b65529]">built for Britain.</em>
            </h1>
 
            <div className="w-12 h-0.5 bg-[#b65529] mb-6" />
 
            <p className="text-base text-white/55 leading-relaxed mb-8 max-w-lg">
              GBP-native pricing, zero seller fees, AI-powered listings, and 48-hour
              buyer protection escrow — all in one marketplace made exclusively for UK collectors.
            </p>
 
            {/* Inline waitlist */}
            <div id="early-access" className="flex flex-col gap-3 max-w-md">
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleWaitlist()}
                  className="flex-1 bg-white/[0.07] border border-white/[0.18] rounded-lg px-4 py-3 text-sm text-[#faf8f4] placeholder-white/30 focus:outline-none focus:border-[#b65529]/60 transition-colors"
                />
                <button
                  onClick={handleWaitlist}
                  disabled={waitlistLoading}
                  className="bg-[#b65529] text-[#1b1c22] font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#d4632f] transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {waitlistLoading ? 'Joining...' : 'Get Early Access'}
                </button>
              </div>
              {waitlistMessage ? (
                <p className="text-sm text-[#b65529]">{waitlistMessage}</p>
              ) : (
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>· 0% seller fees</span>
                  <span>· GBP pricing</span>
                  <span>· 48hr escrow</span>
                  <span>· AI listings</span>
                </div>
              )}
            </div>
          </div>
 
          {/* Right: real card stack */}
          <div className="relative h-[460px] flex items-center justify-center">
            <div className="relative w-[240px] h-[336px]">
              {/* Back card */}
              <div className="absolute w-[220px] h-[308px] rounded-[14px] overflow-hidden shadow-2xl border border-white/10"
                style={{ transform: 'rotate(-8deg) translate(-30px, 10px)', zIndex: 1 }}>
                <img src={HERO_CARDS[0].image} alt={HERO_CARDS[0].name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#1b1c22]/50" />
              </div>
              {/* Mid card */}
              <div className="absolute w-[220px] h-[308px] rounded-[14px] overflow-hidden shadow-2xl border border-white/10"
                style={{ transform: 'rotate(-3deg) translate(-10px, 5px)', zIndex: 2 }}>
                <img src={HERO_CARDS[1].image} alt={HERO_CARDS[1].name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#1b1c22]/25" />
              </div>
              {/* Front card */}
              <div className="absolute w-[220px] rounded-[14px] overflow-hidden shadow-2xl border border-white/15 bg-[#222329]"
                style={{ transform: 'rotate(2deg)', zIndex: 3 }}>
                <img src={HERO_CARDS[2].image} alt={HERO_CARDS[2].name} className="w-full h-[200px] object-cover" />
                <div className="p-3">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-playfair font-bold text-sm text-[#faf8f4]">{HERO_CARDS[2].name}</p>
                    <span className="bg-amber-500/20 text-amber-300 text-[0.6rem] font-semibold px-1.5 py-0.5 rounded">PSA 10</span>
                  </div>
                  <p className="text-[0.65rem] text-white/40 mb-2">{HERO_CARDS[2].set}</p>
                  <div className="flex gap-1.5 mb-3">
                    <span className="bg-blue-500/20 text-blue-300 text-[0.6rem] font-semibold px-1.5 py-0.5 rounded">EN</span>
                    <span className="bg-green-500/20 text-green-300 text-[0.6rem] font-semibold px-1.5 py-0.5 rounded">NM</span>
                  </div>
                  <p className="font-playfair font-bold text-lg text-[#faf8f4]">{HERO_CARDS[2].price}</p>
                  <p className="text-[0.6rem] text-white/30">+ buyer protection included</p>
                </div>
              </div>
            </div>
 
            {/* Floating badges */}
            <div className="absolute top-6 right-0 bg-[#222329] border border-white/10 rounded-xl px-3 py-2 shadow-xl z-10">
              <p className="text-white/35 text-[0.6rem] uppercase tracking-wider mb-0.5">GBP Price</p>
              <p className="font-playfair font-bold text-[#b65529] text-lg">{HERO_CARDS[2].price}</p>
            </div>
            <div className="absolute bottom-16 left-0 bg-[#222329] border border-white/10 rounded-xl px-3 py-2 shadow-xl flex items-center gap-2 z-10">
              <span className="w-6 h-6 rounded-full bg-[#b65529]/15 flex items-center justify-center text-sm">🛡</span>
              <div>
                <p className="text-[#faf8f4] font-medium text-[0.7rem]">48hr Protection</p>
                <p className="text-white/35 text-[0.6rem]">Buyer escrow active</p>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* ── STATS BAR ── */}
      <div className="bg-[#151619] border-y border-white/[0.06] px-[5%] py-8 flex justify-center">
        <div className="flex flex-wrap max-w-2xl w-full">
          {stats.map((stat, i) => (
            <div key={stat.label}
              className={`flex-1 min-w-[120px] py-4 px-6 text-center ${i < stats.length - 1 ? "border-r border-white/[0.06]" : ""}`}>
              <span className="font-playfair text-3xl font-bold text-[#b65529] block mb-1">{stat.value}</span>
              <span className="text-xs text-white/35">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
 
      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-[5%] max-w-6xl mx-auto">
        <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#b65529] block mb-3">Why Cartae</span>
        <h2 className="font-playfair text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4 text-[#faf8f4]">
          Built for UK collectors.<br />Not an afterthought.
        </h2>
        <p className="text-white/45 text-base leading-relaxed max-w-xl mb-14">
          TCGPlayer is built for the US. Cardmarket is built for Europe. Cartae is built for you — GBP, Royal Mail, and the UK Pokémon community first.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 hover:-translate-y-1 hover:border-[#b65529]/30 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-[#b65529]/10 flex items-center justify-center text-xl mb-5">{f.icon}</div>
              <h3 className="font-playfair font-bold text-base text-[#faf8f4] mb-2">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ── PRICE TRACKER ── */}
      <section id="price-tracker" className="bg-[#151619] border-y border-white/[0.06] py-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#b65529]/[0.06] blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto relative">
          <div>
            <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#b65529] block mb-3">Free Tool</span>
            <h2 className="font-playfair text-4xl lg:text-5xl font-black leading-tight text-[#faf8f4] tracking-tight mb-4">
              Track GBP card<br />prices. Before<br />you even sign up.
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-6">
              The Cartae Price Tracker launches before the marketplace. Check live GBP prices across all conditions for any Pokémon card — completely free, no account needed.
            </p>
            <span className="inline-block bg-[#b65529]/10 border border-[#b65529]/25 text-[#b65529] text-xs font-medium px-4 py-1.5 rounded-full mb-8">
              Launching first · No login required
            </span>
            <br />
            <Link href="/price-tracker" className="inline-flex items-center gap-2 bg-[#b65529] text-[#1b1c22] font-semibold text-sm px-7 py-3 rounded-lg hover:bg-[#d4632f] transition-colors">
              Try the Price Tracker →
            </Link>
          </div>
 
          {/* Real card demo — hardcoded, zero API calls */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex gap-2 mb-5">
              <input type="text" defaultValue="Charizard" readOnly
                className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-lg px-4 py-2.5 text-[#faf8f4] text-sm focus:outline-none cursor-default" />
              <Link href="/price-tracker?q=Charizard"
                className="bg-[#b65529] text-[#1b1c22] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#d4632f] transition-colors">
                Search
              </Link>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 flex items-center gap-4">
              <img src={HERO_CARDS[0].image} alt="Charizard Base Set"
                className="w-14 h-[78px] rounded-lg object-cover flex-shrink-0 border border-white/10" />
              <div className="flex-1 min-w-0">
                <p className="font-playfair font-bold text-sm text-[#faf8f4] mb-0.5">Charizard — Holo Rare</p>
                <p className="text-[0.7rem] text-white/35 mb-3">Base Set · 004/102</p>
                <div className="flex gap-4">
                  <div>
                    <span className="font-playfair font-bold text-base text-[#b65529] block">£379.03</span>
                    <span className="text-[0.65rem] text-white/35">NM · TCGPlayer</span>
                  </div>
                  <div>
                    <span className="font-playfair font-bold text-base text-[#b65529] block">£547.59</span>
                    <span className="text-[0.65rem] text-white/35">NM · eBay sold</span>
                  </div>
                  <div>
                    <span className="font-bold text-base text-green-400 block">↑ 8%</span>
                    <span className="text-[0.65rem] text-white/35">30-day trend</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[0.65rem] text-white/25 mt-3 text-center">Reference price · converted from US/EU market data</p>
          </div>
        </div>
      </section>
 
      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-[5%] max-w-6xl mx-auto text-center">
        <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#b65529] block mb-3">Simple Process</span>
        <h2 className="font-playfair text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4 text-[#faf8f4]">How Cartae works</h2>
        <p className="text-white/45 text-base leading-relaxed max-w-md mx-auto mb-14">
          Buying and selling should be simple. Here&apos;s how a transaction works on Cartae.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-7 left-[17%] right-[17%] h-px bg-white/[0.08]" />
          {steps.map((step) => (
            <div key={step.num} className="px-4">
              <div className="w-14 h-14 rounded-full bg-[#b65529]/10 border border-[#b65529]/30 text-[#b65529] font-playfair text-xl font-bold flex items-center justify-center mx-auto mb-5 relative z-10">
                {step.num}
              </div>
              <h3 className="font-playfair font-bold text-base text-[#faf8f4] mb-2">{step.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ── SCROLL CTA ── */}
      <div className="py-16 px-[5%] text-center bg-[#151619] border-t border-white/[0.06]">
        <p className="text-white/40 text-sm mb-4">Want to be first when we launch?</p>
        <button
          onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          className="inline-flex items-center gap-2 bg-[#b65529] text-[#1b1c22] font-semibold text-sm px-7 py-3 rounded-lg hover:bg-[#d4632f] transition-colors"
        >
          Get Early Access ↑
        </button>
      </div>
 
      {/* ── FOOTER ── */}
      <footer className="bg-[#101115] px-[5%] py-10 flex flex-wrap justify-between items-center gap-4 border-t border-white/[0.06]">
        <span className="font-playfair text-xl font-black text-[#faf8f4]">
          Carta<span className="text-[#b65529]">e</span>
        </span>
        <ul className="flex gap-6 list-none">
          <li><button onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="text-xs text-white/35 hover:text-white/70 transition-colors">Join Waitlist</button></li>
          <li><a href="#price-tracker" className="text-xs text-white/35 hover:text-white/70 transition-colors">Price Tracker</a></li>
          <li><a href="#features" className="text-xs text-white/35 hover:text-white/70 transition-colors">Features</a></li>
          <li><Link href="/privacy" className="text-xs text-white/35 hover:text-white/70 transition-colors">Privacy Policy</Link></li>
        </ul>
        <span className="text-xs text-white/25">© 2026 Cartae · cartae.co.uk · Built in the UK 🇬🇧</span>
      </footer>
 
    </div>
  );
}