import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('🔵 [WHATSAPP API] Richiesta ricevuta');
    
    const body = await request.json();
    const { phone, clientName, barberName, date, time, isReminder } = body;
    console.log('📦 [WHATSAPP API] Parametri ricevuti:', { phone, clientName, barberName, date, time, isReminder });

    // 1. Prepariamo il testo del messaggio
    const message = isReminder 
      ? `🔔 *Promemoria Appuntamento*\n\nCiao ${clientName}! Ti ricordiamo il tuo taglio oggi alle *${time}* con *${barberName}*.\nTi aspettiamo!`
      : `✅ *Prenotazione Confermata*\n\nCiao ${clientName}! ✂️\nTi confermiamo il taglio con *${barberName}*.\n\n📅 Data: *${date}*\n🕒 Ora: *${time}*`;

    console.log('💬 [WHATSAPP API] Messaggio da inviare:', message);

    // 2. Recuperiamo le chiavi
    const idInstance = process.env.GREENAPI_ID_INSTANCE;
    const apiTokenInstance = process.env.GREENAPI_TOKEN;

    console.log('🔑 [WHATSAPP API] ID Instance:', idInstance ? '✓ Configurato' : '✗ Mancante');
    console.log('🔑 [WHATSAPP API] API Token:', apiTokenInstance ? '✓ Configurato' : '✗ Mancante');

    if (!idInstance || !apiTokenInstance) {
      throw new Error("Chiavi Green API mancanti nel file .env");
    }

    // 3. Formattiamo il numero per Green API (Rimuove il +, rimuove gli spazi, aggiunge @c.us)
    // Es: "+39 333 1234567" diventa "393331234567@c.us"
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const chatId = `${cleanPhone}@c.us`;

    console.log('📱 [WHATSAPP API] Numero originale:', phone);
    console.log('📱 [WHATSAPP API] Numero formattato:', chatId);

    // 4. Chiamata ufficiale a Green API
    const apiUrl = process.env.GREENAPI_URL || 'https://api.green-api.com';
    const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    console.log('🌐 [WHATSAPP API] API base URL:', apiUrl);
    console.log('🌐 [WHATSAPP API] URL completo:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: chatId,
        message: message
      })
    });

    const contentType = response.headers.get('content-type') || '';
    const rawResponse = await response.text();

    let result: unknown = rawResponse;
    if (rawResponse && contentType.includes('application/json')) {
      try {
        result = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error('❌ [WHATSAPP API] Errore parsing JSON:', parseError);
      }
    }

    if (!response.ok) {
      console.error('❌ [WHATSAPP API] Green API ha risposto con errore:', response.status, result);
      return NextResponse.json(
        { success: false, statusCode: response.status, error: result },
        { status: response.status }
      );
    }

    console.log('✅ [WHATSAPP API] Messaggio inviato con successo');
    return NextResponse.json({ success: true, result });

  } catch (error: any) {
    console.error('Errore WhatsApp API:', error);
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Errore invio' },
      { status: 500 }
    );
  }
}