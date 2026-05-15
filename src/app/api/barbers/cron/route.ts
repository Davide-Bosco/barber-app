import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: Request) {
  // Sicurezza base: Vercel invia un token segreto quando chiama i cron job
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    // 1. Calcoliamo la data di oggi in formato YYYY-MM-DD
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 2. Cerchiamo su Supabase tutte le prenotazioni per la giornata di oggi
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        appointment_time,
        barbers ( name ),
        profiles ( full_name, phone )
      `)
      .gte('appointment_time', `${todayStr}T00:00:00`)
      .lte('appointment_time', `${todayStr}T23:59:59`)
      .eq('status', 'confirmed');

    if (error) throw error;
    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ message: 'Nessun appuntamento per oggi.' });
    }

    // 3. Cicliamo su ogni prenotazione e mandiamo il messaggio
    let sentCount = 0;
    for (const booking of bookings) {
      // Estraiamo solo l'ora dall'appuntamento
      const time = new Date(booking.appointment_time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

      // Supabase ritorna array per le relazioni, accediamo al primo elemento
      const profile = Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles;
      const barber = Array.isArray(booking.barbers) ? booking.barbers[0] : booking.barbers;

      // Se c'è un numero di telefono, chiamiamo l'API WhatsApp che abbiamo appena creato!
      if (profile?.phone) {
        // NOTA: Usiamo il dominio intero in produzione, o localhost in sviluppo
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        
        await fetch(`${baseUrl}/api/barbers/whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: profile.phone,
            clientName: profile.full_name || 'Cliente',
            barberName: barber?.name,
            date: todayStr,
            time: time,
            isReminder: true // Questo dirà all'API di usare il testo del promemoria!
          })
        });
        sentCount++;
      }
    }

    return NextResponse.json({ success: true, messaggiInviati: sentCount });

  } catch (error: any) {
    console.error("Errore nel Cron Job:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}