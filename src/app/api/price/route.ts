import { NextResponse } from 'next/server'

// In-memory cache — survives across requests in the same server process
const cache = new Map<string, { data: unknown; expiresAt: number }>()
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

// Cached exchange rate (changes rarely)
let fxCache: { rate: number; expiresAt: number } | null = null
const FX_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const set = searchParams.get('set')

  if (!query && !set) {
    return NextResponse.json({ error: 'Provide a card name or set' }, { status: 400 })
  }

  const cacheKey = `${query ?? ''}|${set ?? ''}`
  const cached = cache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    console.log(`[Cache] HIT for "${cacheKey}"`)
    return NextResponse.json(cached.data)
  }

  try {
    // Build PokeTrace URL
    const params = new URLSearchParams({ limit: '10' })
    if (query) params.set('search', query)
    if (set) params.set('set', set)

    // Fetch cards + exchange rate in parallel (reuse cached FX if available)
    const fxFresh = !fxCache || fxCache.expiresAt <= Date.now()
    const [cardsResponse, fxResponse] = await Promise.all([
      fetch(
        `https://api.poketrace.com/v1/cards?${params.toString()}`,
        { headers: { 'X-API-Key': process.env.POKE_TRACE_API_KEY! } }
      ),
      fxFresh
        ? fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/USD/GBP`)
        : Promise.resolve(null),
    ])

    if (!cardsResponse.ok) {
      if (cardsResponse.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit reached — please wait a moment and try again.' },
          { status: 429 }
        )
      }
      throw new Error(`PokeTrace error: ${cardsResponse.status}`)
    }

    // Log PokeTrace rate limit headers
    const ptRemaining = cardsResponse.headers.get('X-RateLimit-Remaining')
    const ptLimit = cardsResponse.headers.get('X-RateLimit-Limit')
    const ptReset = cardsResponse.headers.get('X-RateLimit-Reset')
    if (ptRemaining !== null) {
      console.log(`[PokeTrace] Remaining: ${ptRemaining}/${ptLimit ?? '?'}${ptReset ? ` — resets at ${ptReset}` : ''}`)
    }

    // Update FX cache if we fetched fresh
    if (fxResponse) {
      if (!fxResponse.ok) throw new Error(`FX error: ${fxResponse.status}`)
      const fxData = await fxResponse.json()
      fxCache = { rate: fxData.conversion_rate, expiresAt: Date.now() + FX_TTL_MS }
      if (fxData.requests_remaining !== undefined) {
        console.log(`[ExchangeRate] Remaining: ${fxData.requests_remaining}${fxData.refresh_day_of_month ? ` — resets on day ${fxData.refresh_day_of_month} of each month` : ''}`)
      }
    }

    const usdToGbp = fxCache!.rate
    const cardsData = await cardsResponse.json()

    const cards = cardsData.data.map((card: any) => {
      const gbpPrices: Record<string, Record<string, number | null>> = {}

      for (const source of ['tcgplayer', 'ebay']) {
        const sourcePrices = card.prices?.[source]
        if (!sourcePrices) continue
        gbpPrices[source] = {}
        for (const condition of ['NEAR_MINT', 'LIGHTLY_PLAYED', 'MODERATELY_PLAYED', 'HEAVILY_PLAYED', 'DAMAGED']) {
          const avg = sourcePrices[condition]?.avg
          gbpPrices[source][condition] = avg ? parseFloat((avg * usdToGbp).toFixed(2)) : null
        }
      }

      const bestPriceUsd =
        card.prices?.tcgplayer?.NEAR_MINT?.avg ??
        card.prices?.ebay?.NEAR_MINT?.avg ??
        null

      const totalSales =
        (card.prices?.tcgplayer?.NEAR_MINT?.saleCount ?? 0) +
        (card.prices?.ebay?.NEAR_MINT?.saleCount ?? 0) +
        (card.prices?.tcgplayer?.LIGHTLY_PLAYED?.saleCount ?? 0) +
        (card.prices?.ebay?.LIGHTLY_PLAYED?.saleCount ?? 0)

      return {
        id: card.id,
        name: card.name,
        cardNumber: card.cardNumber,
        set: card.set?.name,
        setSlug: card.set?.slug,
        variant: card.variant,
        rarity: card.rarity,
        image: card.image,
        gbpPrices,
        bestPriceGbp: bestPriceUsd ? parseFloat((bestPriceUsd * usdToGbp).toFixed(2)) : null,
        totalSales,
        lastUpdated: card.lastUpdated,
      }
    })

    const result = {
      cards,
      exchangeRate: usdToGbp,
      disclaimer: 'Reference price — converted from US/EU market data',
      count: cards.length,
    }

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
    return NextResponse.json(result)

  } catch (error) {
    console.error('Price route error:', error)
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}
