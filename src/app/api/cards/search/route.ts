import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.poketrace.com/v1/cards?search=${encodeURIComponent(query)}&limit=20`,
      {
        headers: {
          'X-API-Key': process.env.POKE_TRACE_API_KEY!,
        },
        next: { revalidate: 3600 }
      }
    )

    if (!response.ok) {
      throw new Error(`PokeTrace error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Card search error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    )
  }
}