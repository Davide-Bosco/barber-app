import { NextRequest, NextResponse } from 'next/server'
import { getStaffAccessCode, createStaffCookieValue, STAFF_COOKIE_NAME } from '@/app/lib/staffAuth'

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

  if (!code || code !== accessCode) {
    return NextResponse.json({ error: 'Codice staff non valido.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: STAFF_COOKIE_NAME,
    value: createStaffCookieValue(username),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  return response
}