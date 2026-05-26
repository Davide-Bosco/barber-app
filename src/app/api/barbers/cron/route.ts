import { NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'
import { sendWhatsAppMessage } from '@/app/lib/greenApi'

function getRomeDateString(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function getRomeTimeString(date = new Date()) {
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  const expectedAuth = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null

  if (process.env.NODE_ENV === 'production' && !isVercelCron && authHeader !== expectedAuth) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  try {
    const todayStr = getRomeDateString()

    const selectWithReminder = `
      id,
      customer_name,
      customer_phone,
      appointment_time,
      reminder_enabled,
      barbers ( name ),
      status
    `

    let { data: bookings, error } = await supabase
      .from('bookings')
      .select(selectWithReminder)
      .gte('appointment_time', `${todayStr}T00:00:00`)
      .lte('appointment_time', `${todayStr}T23:59:59`)
      .eq('status', 'confirmed')

    // fallback compatibilità: se la colonna reminder_enabled non esiste, continua come prima
    if (error && error.code === '42703') {
      const fallback = await supabase
        .from('bookings')
        .select(`
          id,
          customer_name,
          customer_phone,
          appointment_time,
          barbers ( name ),
          status
        `)
        .gte('appointment_time', `${todayStr}T00:00:00`)
        .lte('appointment_time', `${todayStr}T23:59:59`)
        .eq('status', 'confirmed')

      bookings = fallback.data
      error = fallback.error
    }

    if (error) throw error
    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ message: 'Nessun appuntamento per oggi.' })
    }

    let sentCount = 0
    for (const booking of bookings) {
      if ('reminder_enabled' in booking && booking.reminder_enabled !== true) {
        continue
      }

      const time = getRomeTimeString(new Date(booking.appointment_time))
      const barber = Array.isArray(booking.barbers) ? booking.barbers[0] : booking.barbers
      const phone = booking.customer_phone
      const clientName = booking.customer_name || 'Cliente'

      if (!phone) continue

      await sendWhatsAppMessage({
        phone,
        clientName,
        barberName: barber?.name ?? 'il tuo barbiere',
        date: todayStr,
        time,
        isReminder: true,
      })
      sentCount++
    }

    return NextResponse.json({ success: true, messaggiInviati: sentCount })

  } catch (error: unknown) {
    console.error('Errore nel Cron Job:', error)
    const message = error instanceof Error ? error.message : 'Errore nel Cron Job'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}