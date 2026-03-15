import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: `Missing vars: url=${!!supabaseUrl} key=${!!supabaseKey}` }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const body = await request.json()
  const { email } = body

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('waitlist')
    .insert([{ email, created_at: new Date().toISOString() }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: 500 })
  }

  return NextResponse.json({ message: 'Successfully joined the waitlist!', data }, { status: 200 })
}