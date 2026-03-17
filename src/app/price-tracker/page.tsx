'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
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
  setSlug: string
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

const SETS = [
  { slug: 'base-set', name: 'Base Set' },
  { slug: 'base-set-shadowless', name: 'Base Set (Shadowless)' },
  { slug: 'base-set-2', name: 'Base Set 2' },
  { slug: 'jungle', name: 'Jungle' },
  { slug: 'fossil', name: 'Fossil' },
  { slug: 'team-rocket', name: 'Team Rocket' },
  { slug: 'gym-heroes', name: 'Gym Heroes' },
  { slug: 'gym-challenge', name: 'Gym Challenge' },
  { slug: 'neo-genesis', name: 'Neo Genesis' },
  { slug: 'neo-discovery', name: 'Neo Discovery' },
  { slug: 'neo-revelation', name: 'Neo Revelation' },
  { slug: 'neo-destiny', name: 'Neo Destiny' },
  { slug: 'legendary-collection', name: 'Legendary Collection' },
  { slug: 'expedition-base-set', name: 'Expedition Base Set' },
  { slug: 'aquapolis', name: 'Aquapolis' },
  { slug: 'skyridge', name: 'Skyridge' },
  { slug: 'ruby-sapphire', name: 'EX Ruby & Sapphire' },
  { slug: 'sandstorm', name: 'EX Sandstorm' },
  { slug: 'dragon', name: 'EX Dragon' },
  { slug: 'team-magma-vs-team-aqua', name: 'EX Team Magma vs Team Aqua' },
  { slug: 'hidden-legends', name: 'EX Hidden Legends' },
  { slug: 'firered-leafgreen', name: 'EX FireRed & LeafGreen' },
  { slug: 'deoxys', name: 'EX Deoxys' },
  { slug: 'emerald', name: 'EX Emerald' },
  { slug: 'unseen-forces', name: 'EX Unseen Forces' },
  { slug: 'delta-species', name: 'EX Delta Species' },
  { slug: 'legend-maker', name: 'EX Legend Maker' },
  { slug: 'holon-phantoms', name: 'EX Holon Phantoms' },
  { slug: 'crystal-guardians', name: 'EX Crystal Guardians' },
  { slug: 'dragon-frontiers', name: 'EX Dragon Frontiers' },
  { slug: 'power-keepers', name: 'EX Power Keepers' },
  { slug: 'diamond-pearl', name: 'Diamond & Pearl' },
  { slug: 'mysterious-treasures', name: 'Mysterious Treasures' },
  { slug: 'secret-wonders', name: 'Secret Wonders' },
  { slug: 'great-encounters', name: 'Great Encounters' },
  { slug: 'majestic-dawn', name: 'Majestic Dawn' },
  { slug: 'legends-awakened', name: 'Legends Awakened' },
  { slug: 'stormfront', name: 'Stormfront' },
  { slug: 'platinum', name: 'Platinum' },
  { slug: 'rising-rivals', name: 'Rising Rivals' },
  { slug: 'supreme-victors', name: 'Supreme Victors' },
  { slug: 'arceus', name: 'Arceus' },
  { slug: 'heartgold-soulsilver', name: 'HeartGold SoulSilver' },
  { slug: 'unleashed', name: 'Unleashed' },
  { slug: 'undaunted', name: 'Undaunted' },
  { slug: 'triumphant', name: 'Triumphant' },
  { slug: 'black-white', name: 'Black & White' },
  { slug: 'emerging-powers', name: 'Emerging Powers' },
  { slug: 'noble-victories', name: 'Noble Victories' },
  { slug: 'next-destinies', name: 'Next Destinies' },
  { slug: 'dark-explorers', name: 'Dark Explorers' },
  { slug: 'dragons-exalted', name: 'Dragons Exalted' },
  { slug: 'boundaries-crossed', name: 'Boundaries Crossed' },
  { slug: 'plasma-storm', name: 'Plasma Storm' },
  { slug: 'plasma-freeze', name: 'Plasma Freeze' },
  { slug: 'plasma-blast', name: 'Plasma Blast' },
  { slug: 'legendary-treasures', name: 'Legendary Treasures' },
  { slug: 'xy', name: 'XY' },
  { slug: 'flashfire', name: 'Flashfire' },
  { slug: 'furious-fists', name: 'Furious Fists' },
  { slug: 'phantom-forces', name: 'Phantom Forces' },
  { slug: 'primal-clash', name: 'Primal Clash' },
  { slug: 'roaring-skies', name: 'Roaring Skies' },
  { slug: 'ancient-origins', name: 'Ancient Origins' },
  { slug: 'breakthrough', name: 'BREAKthrough' },
  { slug: 'breakpoint', name: 'BREAKpoint' },
  { slug: 'generations', name: 'Generations' },
  { slug: 'fates-collide', name: 'Fates Collide' },
  { slug: 'steam-siege', name: 'Steam Siege' },
  { slug: 'xy-evolutions', name: 'XY - Evolutions' },
  { slug: 'sun-moon', name: 'Sun & Moon' },
  { slug: 'guardians-rising', name: 'Guardians Rising' },
  { slug: 'burning-shadows', name: 'Burning Shadows' },
  { slug: 'shining-legends', name: 'Shining Legends' },
  { slug: 'crimson-invasion', name: 'Crimson Invasion' },
  { slug: 'ultra-prism', name: 'Ultra Prism' },
  { slug: 'forbidden-light', name: 'Forbidden Light' },
  { slug: 'celestial-storm', name: 'Celestial Storm' },
  { slug: 'dragon-majesty', name: 'Dragon Majesty' },
  { slug: 'lost-thunder', name: 'Lost Thunder' },
  { slug: 'team-up', name: 'Team Up' },
  { slug: 'detective-pikachu', name: 'Detective Pikachu' },
  { slug: 'unbroken-bonds', name: 'Unbroken Bonds' },
  { slug: 'unified-minds', name: 'Unified Minds' },
  { slug: 'hidden-fates', name: 'Hidden Fates' },
  { slug: 'cosmic-eclipse', name: 'Cosmic Eclipse' },
  { slug: 'sword-shield', name: 'Sword & Shield' },
  { slug: 'rebel-clash', name: 'Rebel Clash' },
  { slug: 'darkness-ablaze', name: 'Darkness Ablaze' },
  { slug: 'champions-path', name: "Champion's Path" },
  { slug: 'vivid-voltage', name: 'Vivid Voltage' },
  { slug: 'shining-fates', name: 'Shining Fates' },
  { slug: 'battle-styles', name: 'Battle Styles' },
  { slug: 'chilling-reign', name: 'Chilling Reign' },
  { slug: 'evolving-skies', name: 'Evolving Skies' },
  { slug: 'celebrations', name: 'Celebrations' },
  { slug: 'fusion-strike', name: 'Fusion Strike' },
  { slug: 'brilliant-stars', name: 'Brilliant Stars' },
  { slug: 'astral-radiance', name: 'Astral Radiance' },
  { slug: 'pokemon-go', name: 'Pokémon GO' },
  { slug: 'lost-origin', name: 'Lost Origin' },
  { slug: 'silver-tempest', name: 'Silver Tempest' },
  { slug: 'crown-zenith', name: 'Crown Zenith' },
  { slug: 'sv-scarlet', name: 'Scarlet & Violet' },
  { slug: 'sv02-paldea-evolved', name: 'Paldea Evolved' },
  { slug: 'sv03-obsidian-flames', name: 'Obsidian Flames' },
  { slug: 'sv-scarlet-and-violet-151', name: 'Pokémon 151' },
  { slug: 'sv04-paradox-rift', name: 'Paradox Rift' },
  { slug: 'sv-paldean-fates', name: 'Paldean Fates' },
  { slug: 'sv05-temporal-forces', name: 'Temporal Forces' },
  { slug: 'sv06-twilight-masquerade', name: 'Twilight Masquerade' },
  { slug: 'sv-shrouded-fable', name: 'Shrouded Fable' },
  { slug: 'sv07-stellar-crown', name: 'Stellar Crown' },
  { slug: 'sv08-surging-sparks', name: 'Surging Sparks' },
  { slug: 'sv-prismatic-evolutions', name: 'Prismatic Evolutions' },
]

const RECENT_SEARCHES_KEY = 'cartae_recent_searches'
const MAX_RECENT = 6

function formatGbp(value: number | null | undefined) {
  if (!value) return '—'
  return `£${value.toFixed(2)}`
}

function saveRecentSearch(label: string) {
  try {
    const existing: string[] = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
    const updated = [label, ...existing.filter(q => q.toLowerCase() !== label.toLowerCase())].slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {}
}

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
  } catch { return [] }
}

function CardResult({ card }: { card: Card }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden hover:border-[#c9a84c]/30 transition-all duration-200">
      <div className="flex gap-4 p-4">
        <div className="flex-shrink-0">
          <img src={card.image} alt={card.name} width={80} height={112} className="rounded-lg object-cover border border-white/10" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-playfair font-bold text-[#faf8f4]">{card.name}</h3>
              <p className="text-sm text-white/45">{card.set} · {card.cardNumber}</p>
              <p className="text-xs text-white/30 mt-0.5">{card.variant.replace(/_/g, ' ')} · {card.rarity}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-playfair text-2xl font-bold text-[#c9a84c]">{formatGbp(card.bestPriceGbp)}</p>
              <p className="text-xs text-white/30">NM · TCGPlayer</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            {CONDITIONS.map(({ key, label }) => {
              const price = card.gbpPrices?.tcgplayer?.[key as keyof GbpPrices]
              return (
                <div key={key} className="text-center">
                  <p className="text-xs text-white/30">{label}</p>
                  <p className="text-sm font-medium text-[#faf8f4]">{formatGbp(price)}</p>
                </div>
              )
            })}
          </div>
          <button onClick={() => setExpanded(!expanded)} className="mt-3 text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors">
            {expanded ? '▲ Hide eBay prices' : '▼ Show eBay prices'}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-white/[0.06] px-4 py-3 bg-white/[0.02]">
          <p className="text-xs font-semibold text-white/35 mb-2">eBay sold prices</p>
          <div className="flex gap-4 flex-wrap">
            {CONDITIONS.map(({ key, label }) => {
              const price = card.gbpPrices?.ebay?.[key as keyof GbpPrices]
              return (
                <div key={key} className="text-center">
                  <p className="text-xs text-white/30">{label}</p>
                  <p className="text-sm font-medium text-white/60">{formatGbp(price)}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function PriceTrackerInner() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [selectedSet, setSelectedSet] = useState('')
  const [setSearch, setSetSearch] = useState('')
  const [showSetDropdown, setShowSetDropdown] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const setDropdownRef = useRef<HTMLDivElement>(null)
  const setInputRef = useRef<HTMLInputElement>(null)

  const [selectedRarity, setSelectedRarity] = useState('All')
  const [selectedVariant, setSelectedVariant] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => { setRecentSearches(getRecentSearches()) }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    const s = searchParams.get('set')
    if (q) setQuery(q)
    if (s) {
      setSelectedSet(s)
      const match = SETS.find(set => set.slug === s)
      if (match) setSetSearch(match.name)
    }
    if (q || s) runSearch(q || '', s || '')
  }, [searchParams])

  useEffect(() => {
    let result = [...cards]
    if (selectedRarity !== 'All') result = result.filter(c => c.rarity === selectedRarity)
    if (selectedVariant !== 'All') result = result.filter(c => c.variant.replace(/_/g, ' ') === selectedVariant)
    if (sortBy === 'price-asc') result.sort((a, b) => (a.bestPriceGbp ?? 0) - (b.bestPriceGbp ?? 0))
    else if (sortBy === 'price-desc') result.sort((a, b) => (b.bestPriceGbp ?? 0) - (a.bestPriceGbp ?? 0))
    else if (sortBy === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name))
    setFilteredCards(result)
  }, [cards, selectedRarity, selectedVariant, sortBy])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
      if (setDropdownRef.current && !setDropdownRef.current.contains(e.target as Node) &&
        setInputRef.current && !setInputRef.current.contains(e.target as Node)) {
        setShowSetDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const rarities = ['All', ...Array.from(new Set(cards.map(c => c.rarity))).sort()]
  const variants = ['All', ...Array.from(new Set(cards.map(c => c.variant.replace(/_/g, ' ')))).sort()]
  const suggestions = query.trim()
    ? recentSearches.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : recentSearches
  const filteredSets = setSearch.trim()
    ? SETS.filter(s => s.name.toLowerCase().includes(setSearch.toLowerCase()))
    : SETS

  async function runSearch(nameQuery: string, setSlug: string) {
    if (!nameQuery.trim() && !setSlug) return
    setLoading(true)
    setError('')
    setSearched(true)
    setSelectedRarity('All')
    setSelectedVariant('All')
    setSortBy('default')
    try {
      const params = new URLSearchParams()
      if (nameQuery.trim()) params.set('q', nameQuery.trim())
      if (setSlug) params.set('set', setSlug)
      const res = await fetch(`/api/price?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Search failed')
      setCards(data.cards)
      setExchangeRate(data.exchangeRate)
      const label = nameQuery && setSlug
        ? `${nameQuery} — ${SETS.find(s => s.slug === setSlug)?.name || setSlug}`
        : nameQuery || SETS.find(s => s.slug === setSlug)?.name || setSlug
      saveRecentSearch(label)
      setRecentSearches(getRecentSearches())
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setShowSuggestions(false)
    setShowSetDropdown(false)
    runSearch(query, selectedSet)
  }

  function handleSuggestionClick(suggestion: string) {
    setQuery(suggestion)
    setShowSuggestions(false)
    runSearch(suggestion, selectedSet)
  }

  function handleSetSelect(slug: string, name: string) {
    setSelectedSet(slug)
    setSetSearch(name)
    setShowSetDropdown(false)
  }

  function clearSet() {
    setSelectedSet('')
    setSetSearch('')
  }

  function clearRecentSearches() {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
    setRecentSearches([])
    setShowSuggestions(false)
  }

  const selectedSetName = SETS.find(s => s.slug === selectedSet)?.name

  return (
    <div className="min-h-screen bg-[#08172e] text-[#faf8f4]">
      {/* Header */}
      <div className="bg-[#0a1628] border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <a href="/" className="text-sm text-white/35 hover:text-white/70 transition-colors mb-4 inline-block">← Back to Cartae</a>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-playfair text-2xl font-black tracking-tight text-[#faf8f4]">
              Carta<span className="text-[#c9a84c]">e</span>
            </span>
            <span className="text-white/20 text-sm">/</span>
            <h1 className="font-playfair text-2xl font-bold text-[#faf8f4]">Price Tracker</h1>
          </div>
          <p className="text-white/40 text-sm mt-1">Real market prices in GBP — converted from TCGPlayer &amp; eBay sold data</p>

          <form onSubmit={handleSearch} className="mt-5 space-y-2">
            {/* Name search */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  name="card-search"
                  autoComplete="new-password"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Card name e.g. Charizard, Pikachu... (optional)"
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-lg px-4 py-2.5 text-sm text-[#faf8f4] placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
                {/* Recent searches dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-1 bg-[#0f1f3d] border border-white/[0.12] rounded-lg shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
                      <span className="text-xs font-semibold text-white/35 uppercase tracking-wide">Recent searches</span>
                      <button type="button" onClick={clearRecentSearches} className="text-xs text-white/35 hover:text-white/60 transition-colors">Clear all</button>
                    </div>
                    {suggestions.map((s, i) => (
                      <button key={i} type="button" onClick={() => handleSuggestionClick(s)}
                        className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.04] flex items-center gap-2 border-b border-white/[0.04] last:border-0 transition-colors">
                        <span className="text-white/20 text-xs">🕐</span>{s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Set picker + Search button */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={setInputRef}
                  type="text"
                  name="set-search"
                  autoComplete="new-password"
                  value={setSearch}
                  onChange={(e) => { setSetSearch(e.target.value); setShowSetDropdown(true) }}
                  onFocus={() => setShowSetDropdown(true)}
                  placeholder="Filter by set e.g. Base Set, Obsidian Flames... (optional)"
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-lg px-4 py-2.5 text-sm text-[#faf8f4] placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/60 transition-colors pr-8"
                />
                {selectedSet && (
                  <button type="button" onClick={clearSet}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors text-xs">
                    ✕
                  </button>
                )}
                {/* Set dropdown */}
                {showSetDropdown && filteredSets.length > 0 && (
                  <div ref={setDropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-[#0f1f3d] border border-white/[0.12] rounded-lg shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                    {filteredSets.map((set) => (
                      <button key={set.slug} type="button" onClick={() => handleSetSelect(set.slug, set.name)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.04] flex items-center justify-between border-b border-white/[0.04] last:border-0 transition-colors ${selectedSet === set.slug ? 'text-[#c9a84c] bg-[#c9a84c]/[0.06]' : 'text-white/70'}`}>
                        {set.name}
                        {selectedSet === set.slug && <span className="text-[#c9a84c] text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" disabled={loading || (!query.trim() && !selectedSet)}
                className="bg-[#c9a84c] text-[#08172e] font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-[#e8c97a] disabled:opacity-40 whitespace-nowrap transition-colors">
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Active search tags */}
            {(query || selectedSetName) && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {query && (
                  <span className="bg-[#c9a84c]/10 text-[#c9a84c] text-xs px-2.5 py-1 rounded-full border border-[#c9a84c]/25">
                    Name: {query}
                  </span>
                )}
                {selectedSetName && (
                  <span className="bg-white/[0.06] text-white/60 text-xs px-2.5 py-1 rounded-full border border-white/[0.12]">
                    Set: {selectedSetName}
                  </span>
                )}
              </div>
            )}
          </form>

          {/* Filter bar */}
          {searched && cards.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3 items-center pt-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-white/35 font-medium">Rarity</label>
                <select value={selectedRarity} onChange={(e) => setSelectedRarity(e.target.value)}
                  className="text-xs border border-white/[0.12] rounded-md px-2 py-1.5 bg-white/[0.06] text-white/70 focus:outline-none focus:border-[#c9a84c]/60 transition-colors">
                  {rarities.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-white/35 font-medium">Variant</label>
                <select value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value)}
                  className="text-xs border border-white/[0.12] rounded-md px-2 py-1.5 bg-white/[0.06] text-white/70 focus:outline-none focus:border-[#c9a84c]/60 transition-colors">
                  {variants.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-white/35 font-medium">Sort</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs border border-white/[0.12] rounded-md px-2 py-1.5 bg-white/[0.06] text-white/70 focus:outline-none focus:border-[#c9a84c]/60 transition-colors">
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="name-asc">Name A → Z</option>
                </select>
              </div>
              {(selectedRarity !== 'All' || selectedVariant !== 'All' || sortBy !== 'default') && (
                <button onClick={() => { setSelectedRarity('All'); setSelectedVariant('All'); setSortBy('default') }}
                  className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors">
                  Reset filters
                </button>
              )}
              <span className="text-xs text-white/25 ml-auto">{filteredCards.length} of {cards.length} results</span>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {exchangeRate && (
          <p className="text-xs text-white/25 mb-4">
            Reference price — converted from US/EU market data · Rate: 1 USD = £{exchangeRate}
          </p>
        )}
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4 text-sm">{error}</div>}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-white/[0.06] rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/[0.06] rounded w-1/3" />
                    <div className="h-3 bg-white/[0.04] rounded w-1/2" />
                    <div className="h-6 bg-white/[0.06] rounded w-1/4 mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && searched && filteredCards.length === 0 && !error && (
          <p className="text-center text-white/35 py-12">
            {cards.length > 0
              ? 'No cards match your current filters. Try resetting.'
              : 'No cards found. Try a different name or set.'}
          </p>
        )}

        {!loading && filteredCards.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-white/40">
              {filteredCards.length} result{filteredCards.length !== 1 ? 's' : ''}
              {query && ` for "${query}"`}
              {selectedSetName && ` in ${selectedSetName}`}
            </p>
            {filteredCards.map(card => <CardResult key={card.id} card={card} />)}
          </div>
        )}

        {!searched && (
          <div className="text-center py-16 text-white/30">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">Search by card name, set, or both</p>
            {recentSearches.length > 0 && (
              <div className="mt-8">
                <p className="text-xs text-white/25 mb-3 uppercase tracking-wide font-medium">Recent searches</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => handleSuggestionClick(s)}
                      className="bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-white/50 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PriceTrackerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#08172e] flex items-center justify-center">
        <p className="text-white/35 text-sm">Loading...</p>
      </div>
    }>
      <PriceTrackerInner />
    </Suspense>
  )
}
