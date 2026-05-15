import { NextResponse } from 'next/server'
import { STAFF_COOKIE_NAME } from '@/app/lib/staffAuth'

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set({
    name: STAFF_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  })

  return response
}