import { NextResponse } from 'next/server'
import { sendWhatsAppMessage } from '@/app/lib/greenApi'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, clientName, barberName, date, time, isReminder } = body;
    const result = await sendWhatsAppMessage({ phone, clientName, barberName, date, time, isReminder })
    return NextResponse.json({ success: true, result })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? 'Errore invio' }, { status: 500 })
  }
}