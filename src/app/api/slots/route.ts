import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import {
  DEFAULT_TIME_SLOTS,
  extractTimeFromIso,
  isValidSlotTime,
  normalizeSlotTime,
  sortSlots,
} from '@/app/lib/slots'
import { isOwnerCookieValue, STAFF_COOKIE_NAME } from '@/app/lib/staffAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SERVICE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL.')
}

if (!supabaseKey) {
  throw new Error('Missing Supabase key. Set SUPABASE_SERVICE_ROLE_KEY or a public Supabase key.')
}

const supabase = createClient(
  supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''),
  supabaseKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

function isValidDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function getRequestDate(request: NextRequest): string {
  const date = request.nextUrl.searchParams.get('date')
  if (!date || !isValidDateString(date)) {
    return new Date().toISOString().split('T')[0]
  }
  return date
}

async function getDailyAvailability(date: string, barberId: number | null) {
  const { data: overrides, error: overridesError } = await supabase
    .from('slot_overrides')
    .select('slot_time, is_available')
    .eq('slot_date', date)

  const missingTable = overridesError?.code === '42P01'

  if (overridesError && !missingTable) {
    throw new Error(overridesError.message)
  }

  const removedDefaultSet = new Set<string>()
  const extraSet = new Set<string>()

  for (const row of overrides ?? []) {
    const normalized = normalizeSlotTime(row.slot_time)
    const isBaseSlot = DEFAULT_TIME_SLOTS.includes(normalized)

    if (row.is_available === false && isBaseSlot) {
      removedDefaultSet.add(normalized)
    }

    if (row.is_available === true && !isBaseSlot) {
      extraSet.add(normalized)
    }
  }

  const { data: bookedRows, error: bookedError } = await supabase
    .from('bookings')
    .select('appointment_time')
    .gte('appointment_time', `${date}T00:00:00`)
    .lte('appointment_time', `${date}T23:59:59`)
    .eq('status', 'confirmed')

  if (bookedError) {
    throw new Error(bookedError.message)
  }

  const filteredBookedRows = barberId
    ? await supabase
        .from('bookings')
        .select('appointment_time')
        .gte('appointment_time', `${date}T00:00:00`)
        .lte('appointment_time', `${date}T23:59:59`)
        .eq('status', 'confirmed')
        .eq('barber_id', barberId)
    : null

  if (filteredBookedRows?.error) {
    throw new Error(filteredBookedRows.error.message)
  }

  const bookedSource = barberId ? filteredBookedRows?.data ?? [] : bookedRows ?? []
  const bookedSet = new Set(
    bookedSource
      .map((row) => extractTimeFromIso(row.appointment_time))
      .filter((value): value is string => Boolean(value))
  )

  const effectiveSlots = sortSlots([
    ...DEFAULT_TIME_SLOTS.filter((slot) => !removedDefaultSet.has(slot)),
    ...extraSet,
  ])

  const availableSlots = effectiveSlots.filter((slot) => !bookedSet.has(slot))

  return {
    date,
    baseSlots: DEFAULT_TIME_SLOTS,
    removedDefaultSlots: sortSlots(Array.from(removedDefaultSet)),
    extraSlots: sortSlots(Array.from(extraSet)),
    bookedSlots: sortSlots(Array.from(bookedSet)),
    availableSlots,
    warning: missingTable
      ? 'Tabella slot_overrides non trovata: uso solo gli slot standard.'
      : null,
  }
}

export async function GET(request: NextRequest) {
  try {
    const date = getRequestDate(request)
    const barberIdParam = request.nextUrl.searchParams.get('barberId')
    const barberId = barberIdParam ? Number(barberIdParam) : null

    if (barberIdParam && Number.isNaN(barberId)) {
      return NextResponse.json({ error: 'barberId non valido.' }, { status: 400 })
    }

    const data = await getDailyAvailability(date, barberId)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore nel recupero degli slot.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!isOwnerCookieValue(request.cookies.get(STAFF_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const date = typeof body?.date === 'string' ? body.date : ''
  const time = normalizeSlotTime(typeof body?.time === 'string' ? body.time : '')
  const isAvailable = body?.is_available

  if (!isValidDateString(date) || !isValidSlotTime(time) || typeof isAvailable !== 'boolean') {
    return NextResponse.json({ error: 'Dati slot non validi.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('slot_overrides')
    .upsert([{ slot_date: date, slot_time: time, is_available: isAvailable }], {
      onConflict: 'slot_date,slot_time',
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  if (!isOwnerCookieValue(request.cookies.get(STAFF_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 401 })
  }

  const date = request.nextUrl.searchParams.get('date') ?? ''
  const time = normalizeSlotTime(request.nextUrl.searchParams.get('time') ?? '')

  if (!isValidDateString(date) || !isValidSlotTime(time)) {
    return NextResponse.json({ error: 'Parametri non validi.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('slot_overrides')
    .delete()
    .eq('slot_date', date)
    .eq('slot_time', time)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}