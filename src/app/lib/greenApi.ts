type WhatsAppMessageInput = {
  phone: string
  clientName: string
  barberName?: string | null
  date: string
  time: string
  isReminder?: boolean
}

export function buildWhatsAppMessage({ clientName, barberName, date, time, isReminder }: WhatsAppMessageInput) {
  return isReminder
    ? `🔔 *Promemoria Appuntamento*\n\nCiao ${clientName}! Ti ricordiamo il tuo taglio oggi alle *${time}* con *${barberName ?? 'il tuo barbiere'}*.\nTi aspettiamo!`
    : `✅ *Prenotazione Confermata*\n\nCiao ${clientName}! ✂️\nTi confermiamo il taglio con *${barberName ?? 'il tuo barbiere'}*.\n\n📅 Data: *${date}*\n🕒 Ora: *${time}*`
}

export async function sendWhatsAppMessage(input: WhatsAppMessageInput) {
  const idInstance = process.env.GREENAPI_ID_INSTANCE
  const apiTokenInstance = process.env.GREENAPI_TOKEN

  if (!idInstance || !apiTokenInstance) {
    throw new Error('Chiavi Green API mancanti nel file .env')
  }

  const cleanPhone = input.phone.replace(/[^0-9]/g, '')
  const chatId = `${cleanPhone}@c.us`
  const message = buildWhatsAppMessage(input)
  const apiUrl = process.env.GREENAPI_URL || 'https://api.green-api.com'
  const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })

  const contentType = response.headers.get('content-type') || ''
  const rawResponse = await response.text()

  let result: unknown = rawResponse
  if (rawResponse && contentType.includes('application/json')) {
    try {
      result = JSON.parse(rawResponse)
    } catch {
      result = rawResponse
    }
  }

  if (!response.ok) {
    throw new Error(typeof result === 'string' ? result : 'Errore invio WhatsApp')
  }

  return result
}
