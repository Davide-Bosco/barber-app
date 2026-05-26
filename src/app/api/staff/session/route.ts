import { NextRequest, NextResponse } from 'next/server'
import { STAFF_COOKIE_NAME, parseStaffCookieValue } from '@/app/lib/staffAuth'

export async function GET(request: NextRequest) {
  const session = parseStaffCookieValue(request.cookies.get(STAFF_COOKIE_NAME)?.value)

  if (!session.valid) {
    return NextResponse.json({ isStaff: false, isOwner: false, role: null, username: null })
  }

  return NextResponse.json({
    isStaff: true,
    isOwner: session.role === 'owner',
    role: session.role ?? 'barber',
    username: session.username ?? null,
  })
}
