import { NextRequest, NextResponse } from 'next/server'
import { getStaffAccessCode, createStaffCookieValue, STAFF_COOKIE_NAME, type StaffRole } from '@/app/lib/staffAuth'
import { supabase } from '@/app/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const code = typeof body?.code === 'string' ? body.code.trim() : ''
  const username = typeof body?.username === 'string' ? body.username.trim() : ''

  const accessCode = getStaffAccessCode()
  if (!accessCode) {
    return NextResponse.json(
      { error: 'STAFF_ACCESS_CODE non configurato sul server.' },
      { status: 500 }
    )
  }
  if (!username) {
    return NextResponse.json({ error: 'Nome utente obbligatorio.' }, { status: 400 })
  }

  try {
    // Try DB auth first
    const { data: users, error: usersError } = await supabase
      .from('staff_users')
      .select('id, username, password_hash, role')
      .eq('username', username)
      .limit(1)

    if (usersError) throw usersError

    if (users && users.length > 0) {
      const user = users[0] as { password_hash: string; role?: StaffRole }
      const ok = bcrypt.compareSync(code, user.password_hash)
      if (!ok) {
        return NextResponse.json({ error: 'Credenziali non valide.' }, { status: 401 })
      }

      const response = NextResponse.json({ ok: true })
      response.cookies.set({
        name: STAFF_COOKIE_NAME,
        value: createStaffCookieValue(username, user.role === 'owner' ? 'owner' : 'barber'),
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8,
        path: '/',
      })

      return response
    }

    // If no user found in DB, allow bootstrap login with STAFF_ACCESS_CODE
    const { count } = await supabase.from('staff_users').select('*', { head: true, count: 'exact' })
    const total = count ?? 0
    if (total === 0) {
      if (!code || code !== accessCode) {
        return NextResponse.json({ error: 'Codice staff non valido.' }, { status: 401 })
      }

      const hashed = bcrypt.hashSync(code, 10)
      const { error: createError } = await supabase.from('staff_users').insert([
        { username, password_hash: hashed, role: 'owner' },
      ])

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }

      const response = NextResponse.json({ ok: true })
      response.cookies.set({
        name: STAFF_COOKIE_NAME,
        value: createStaffCookieValue(username, 'owner'),
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8,
        path: '/',
      })
      return response
    }

    return NextResponse.json({ error: 'Utente non trovato.' }, { status: 404 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Errore'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}