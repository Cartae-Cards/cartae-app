import { NextResponse } from 'next/server'
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const set = searchParams.get('set')
 
  // Need at least a name or a set
  if (!query && !set) {
    return NextResponse.json({ error: 'Provide a card name or set' }, { status: 400 })
  }
 
  try {
    // Build PokeTrace URL with optional name + set params
    const params = new URLSearchParams({ limit: '10' })
    if (query) params.set('search', query)
    if (set) params.set('set', set)
 
    const [cardsResponse, fxResponse] = await Promise.all([
      fetch(
        `https://api.poketrace.com/v1/cards?${params.toString()}`,
        {
          headers: { 'X-API-Key': process.env.POKE_TRACE_API_KEY! },
          next: { revalidate: 3600 }
        }
      ),
      fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/USD/GBP`,
        { next: { revalidate: 86400 } }
      )
    ])
 
    if (!cardsResponse.ok) throw new Error(`PokeTrace error: ${cardsResponse.status}`)
    if (!fxResponse.ok) throw new Error(`FX error: ${fxResponse.status}`)
 
    const cardsData = await cardsResponse.json()
    const fxData = await fxResponse.json()
    const usdToGbp = fxData.conversion_rate


 
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
 
    return NextResponse.json({
      cards,
      exchangeRate: usdToGbp,
      disclaimer: 'Reference price — converted from US/EU market data',
      count: cards.length,
    })
 
  } catch (error) {
    console.error('Price route error:', error)
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}