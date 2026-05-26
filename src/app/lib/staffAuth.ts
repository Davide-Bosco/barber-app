export const STAFF_COOKIE_NAME = 'barber_staff_session'

export type StaffRole = 'owner' | 'barber'

export function getStaffAccessCode(): string | null {
  const value = process.env.STAFF_ACCESS_CODE
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function getStaffSessionToken(): string {
  return process.env.STAFF_SESSION_TOKEN?.trim() || 'staff-session'
}

// Cookie value format: `${token}|${role}|${encodeURIComponent(username)}`
export function createStaffCookieValue(username: string, role: StaffRole = 'barber'): string {
  const token = getStaffSessionToken()
  return `${token}|${role}|${encodeURIComponent(username)}`
}

export function parseStaffCookieValue(value: string | undefined): { valid: boolean; username?: string; role?: StaffRole } {
  if (!value) return { valid: false }
  const token = getStaffSessionToken()
  if (value === token) return { valid: true, role: 'barber' }

  const parts = value.split('|')
  if (parts.length >= 2 && parts[0] === token) {
    try {
      if (parts.length >= 3 && (parts[1] === 'owner' || parts[1] === 'barber')) {
        return { valid: true, role: parts[1] as StaffRole, username: decodeURIComponent(parts.slice(2).join('|')) }
      }

      return { valid: true, role: 'barber', username: decodeURIComponent(parts.slice(1).join('|')) }
    } catch {
      return { valid: true, role: parts[1] === 'owner' ? 'owner' : 'barber' }
    }
  }

  return { valid: false }
}

export function isStaffCookieValue(value: string | undefined): boolean {
  return parseStaffCookieValue(value).valid
}

export function isOwnerCookieValue(value: string | undefined): boolean {
  return parseStaffCookieValue(value).role === 'owner'
}

export function getStaffUsernameFromCookie(value: string | undefined): string | null {
  return parseStaffCookieValue(value).username ?? null
}

export function getStaffRoleFromCookie(value: string | undefined): StaffRole | null {
  return parseStaffCookieValue(value).role ?? null
}