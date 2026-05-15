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

export function isStaffCookieValue(value: string | undefined): boolean {
  if (!value) return false
  return value === getStaffSessionToken()
}