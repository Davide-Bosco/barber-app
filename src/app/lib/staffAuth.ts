export const STAFF_COOKIE_NAME = 'barber_staff_session'

export function getStaffAccessCode(): string | null {
  const value = process.env.STAFF_ACCESS_CODE
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function getStaffSessionToken(): string {
  return process.env.STAFF_SESSION_TOKEN?.trim() || 'staff-session'
}

// Cookie value format: `${token}|${encodeURIComponent(username)}`
export function createStaffCookieValue(username: string): string {
  const token = getStaffSessionToken()
  return `${token}|${encodeURIComponent(username)}`
}

export function parseStaffCookieValue(value: string | undefined): { valid: boolean; username?: string } {
  if (!value) return { valid: false }
  const token = getStaffSessionToken()
  if (value === token) return { valid: true }

  const parts = value.split('|')
  if (parts.length >= 2 && parts[0] === token) {
    try {
      const username = decodeURIComponent(parts.slice(1).join('|'))
      return { valid: true, username }
    } catch {
      return { valid: true }
    }
  }

  return { valid: false }
}

export function isStaffCookieValue(value: string | undefined): boolean {
  return parseStaffCookieValue(value).valid
}

export function getStaffUsernameFromCookie(value: string | undefined): string | null {
  return parseStaffCookieValue(value).username ?? null
}