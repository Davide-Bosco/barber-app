import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { isOwnerCookieValue, STAFF_COOKIE_NAME } from '@/app/lib/staffAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SERVICE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL.')
}

if (!supabaseKey) {
  throw new Error('Missing Supabase key. Set SUPABASE_SERVICE_ROLE_KEY or a public Supabase key.')
}

const supabase = createClient(
  supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''),
  supabaseKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

export async function DELETE(request: NextRequest) {
  if (!isOwnerCookieValue(request.cookies.get(STAFF_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 401 })
  }

  const idParam = request.nextUrl.searchParams.get('id')
  const id = Number(idParam)

  if (!idParam || Number.isNaN(id)) {
    return NextResponse.json({ error: 'Id prenotazione non valido.' }, { status: 400 })
  }

  const { error } = await supabase.from('bookings').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}