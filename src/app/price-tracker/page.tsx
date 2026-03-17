'use client'
 
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
 
interface GbpPrices {
  NEAR_MINT: number | null
  LIGHTLY_PLAYED: number | null
  MODERATELY_PLAYED: number | null
  HEAVILY_PLAYED: number | null
  DAMAGED: number | null
}
 
interface Card {
  id: string
  name: string
  cardNumber: string
  set: string
  variant: string
  rarity: string
  image: string
  bestPriceGbp: number | null
  gbpPrices: {
    tcgplayer?: GbpPrices
    ebay?: GbpPrices
  }
  lastUpdated: string
}
 
const CONDITIONS = [
  { key: 'NEAR_MINT', label: 'NM' },
  { key: 'LIGHTLY_PLAYED', label: 'LP' },
  { key: 'MODERATELY_PLAYED', label: 'MP' },
  { key: 'HEAVILY_PLAYED', label: 'HP' },
  { key: 'DAMAGED', label: 'DMG' },
]
 
function formatGbp(value: number | null) {
  if (!value) return '—'
  return `£${value.toFixed(2)}`
}
 
function CardResult({ card }: { card: Card }) {
  const [expanded, setExpanded] = useState(false)
 
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        <div className="flex-shrink-0">
          <img
            src={card.image}
            alt={card.name}
            width={80}
            height={112}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900">{card.name}</h3>
              <p className="text-sm text-gray-500">{card.set} · {card.cardNumber}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.variant.replace(/_/g, ' ')} · {card.rarity}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold text-green-600">{formatGbp(card.bestPriceGbp)}</p>
              <p className="text-xs text-gray-400">NM · TCGPlayer</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            {CONDITIONS.map(({ key, label }) => {
              const price = card.gbpPrices?.tcgplayer?.[key as keyof GbpPrices]
              return (
                <div key={key} className="text-center">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{formatGbp(price)}</p>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-xs text-blue-600 hover:text-blue-800"
          >
            {expanded ? '▲ Hide eBay prices' : '▼ Show eBay prices'}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 mb-2">eBay sold prices</p>
          <div className="flex gap-4 flex-wrap">
            {CONDITIONS.map(({ key, label }) => {
              const price = card.gbpPrices?.ebay?.[key as keyof GbpPrices]
              return (
                <div key={key} className="text-center">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-700">{formatGbp(price)}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
 
// Inner component that uses useSearchParams
function PriceTrackerInner() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
 
  // Auto-search if ?q= param is present (e.g. from nav search or homepage)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q.trim()) {
      setQuery(q)
      runSearch(q)
    }
  }, [searchParams])
 
  async function runSearch(searchQuery: string) {
    if (!searchQuery.trim()) return
    setLoading(true)
    setError('')
    setSearched(true)
    try {
      const res = await fetch(`/api/price?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Search failed')
      setCards(data.cards)
      setExchangeRate(data.exchangeRate)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setCards([])
    } finally {
      setLoading(false)
    }
  }
 
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    runSearch(query)
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
            ← Back to Cartae
          </a>
          <h1 className="text-2xl font-bold text-gray-900">Price Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">
            Real market prices in GBP — converted from TCGPlayer & eBay sold data
          </p>
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a card e.g. Charizard, Pikachu..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>
 
      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {exchangeRate && (
          <p className="text-xs text-gray-400 mb-4">
            Reference price — converted from US/EU market data · Rate: 1 USD = £{exchangeRate}
          </p>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">{error}</div>
        )}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/4 mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && searched && cards.length === 0 && !error && (
          <p className="text-center text-gray-500 py-12">No cards found for &quot;{query}&quot;</p>
        )}
        {!loading && cards.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">{cards.length} results for &quot;{query}&quot;</p>
            {cards.map(card => (
              <CardResult key={card.id} card={card} />
            ))}
          </div>
        )}
        {!searched && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">Search for any Pokémon card to see real GBP prices</p>
          </div>
        )}
      </div>
    </div>
  )
}
 
// Wrap in Suspense — required by Next.js for useSearchParams
export default function PriceTrackerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    }>
      <PriceTrackerInner />
    </Suspense>
  )
}