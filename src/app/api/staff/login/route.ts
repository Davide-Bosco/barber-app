import { NextRequest, NextResponse } from 'next/server'
import { getStaffAccessCode, getStaffSessionToken, STAFF_COOKIE_NAME } from '@/app/lib/staffAuth'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const code = typeof body?.code === 'string' ? body.code.trim() : ''

  const accessCode = getStaffAccessCode()
  if (!accessCode) {
    return NextResponse.json(
      { error: 'STAFF_ACCESS_CODE non configurato sul server.' },
      { status: 500 }
    )
  }

  if (!code || code !== accessCode) {
    return NextResponse.json({ error: 'Codice staff non valido.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: STAFF_COOKIE_NAME,
    value: getStaffSessionToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  return response
}