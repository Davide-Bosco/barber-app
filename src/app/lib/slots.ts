export const DEFAULT_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
]

export function isValidSlotTime(slot: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(slot)
}

export function normalizeSlotTime(slot: string): string {
  return slot.trim()
}

export function sortSlots(slots: string[]): string[] {
  return [...new Set(slots)].sort((a, b) => a.localeCompare(b))
}

export function extractTimeFromIso(isoValue: string): string | null {
  const match = isoValue.match(/T(\d{2}:\d{2})/)
  return match?.[1] ?? null
}