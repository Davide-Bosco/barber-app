import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
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

export async function GET(request: NextRequest) {
  if (!isOwnerCookieValue(request.cookies.get(STAFF_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase.from('staff_users').select('id, username, role').order('id')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Errore'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isOwnerCookieValue(request.cookies.get(STAFF_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const username = typeof body?.username === 'string' ? body.username.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!username || password.length < 8) {
    return NextResponse.json({ error: 'Username obbligatorio e password di almeno 8 caratteri.' }, { status: 400 })
  }

  const hashed = bcrypt.hashSync(password, 10)

  const { error } = await supabase.from('staff_users').insert([{ username, password_hash: hashed, role: 'barber' }])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const idParam = request.nextUrl.searchParams.get('id')
  const id = Number(idParam)

  if (!idParam || Number.isNaN(id)) {
    return NextResponse.json({ error: 'Id non valido.' }, { status: 400 })
  }

  if (!isOwnerCookieValue(request.cookies.get(STAFF_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 401 })
  }

  const { error } = await supabase.from('staff_users').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
