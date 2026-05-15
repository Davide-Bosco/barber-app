import { NextRequest, NextResponse } from 'next/server'
import { isStaffCookieValue, STAFF_COOKIE_NAME } from '@/app/lib/staffAuth'

const STAFF_PAGE_PREFIXES = ['/dashboard', '/admin']

function isStaffPage(pathname: string): boolean {
  return STAFF_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

function isProtectedApiRequest(pathname: string, method: string): boolean {
  if (pathname.startsWith('/api/bookings') && method === 'DELETE') return true
  if (pathname.startsWith('/api/barbers') && method !== 'GET') return true
  if (pathname.startsWith('/api/slots') && method !== 'GET') return true
  return false
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isStaff = isStaffCookieValue(request.cookies.get(STAFF_COOKIE_NAME)?.value)

  if (pathname === '/staff-login' && isStaff) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const isProtectedPage = isStaffPage(pathname)
  const isProtectedApi = isProtectedApiRequest(pathname, request.method)

  if (!isStaff && (isProtectedPage || isProtectedApi)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Non autorizzato.' }, { status: 401 })
    }

    const loginUrl = new URL('/staff-login', request.url)
    const target = `${pathname}${request.nextUrl.search}`
    loginUrl.searchParams.set('next', target)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/:path*', '/staff-login'],
}