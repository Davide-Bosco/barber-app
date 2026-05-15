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

    const { data: bookings, error } = await supabase
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

    if (error) throw error
    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ message: 'Nessun appuntamento per oggi.' })
    }

    let sentCount = 0
    for (const booking of bookings) {
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

  } catch (error: any) {
    console.error('Errore nel Cron Job:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}