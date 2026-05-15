'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function BookingPage() {
  const params = useParams() as { id?: string }
  const id = params?.id
  
  const [barber, setBarber] = useState<any>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // NUOVI STATI PER I DATI DEL CLIENTE
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  
  const router = useRouter()

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"
  ]

  useEffect(() => {
    async function fetchBarber() {
      const { data } = await supabase.from('barbers').select('*').eq('id', Number(id)).single()
      if (data) setBarber(data)
    }
    fetchBarber()
  }, [id])

  async function handleBooking() {
    if (isSubmitting) return

    if (!date || !time || !customerName || !customerPhone) {
      return alert("Compila tutti i campi: nome, telefono, data e ora!")
    }

    setIsSubmitting(true)

    const appointmentTimestamp = `${date}T${time}:00`

    // 1. Salviamo il cliente nella tabella profiles o gestiamo l'ospite
    // Per velocità in questa settimana, salviamo il nome e telefono direttamente nella prenotazione
    // o assicurati che la tabella bookings abbia queste colonne.
    
    const { error } = await supabase.from('bookings').insert([{
      barber_id: Number(id),
      appointment_time: appointmentTimestamp,
      customer_name: customerName, // Assicurati di avere questa colonna nel DB
      customer_phone: customerPhone, // Assicurati di avere questa colonna nel DB
      status: 'confirmed'
    }])

    if (error) {
      alert("Errore salvataggio: " + error.message)
      setIsSubmitting(false)
      return
    }

    // 2. Chiamata API WhatsApp con dati REALI
    try {
      await fetch('/api/barbers/whatsapp', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerPhone,
          clientName: customerName,
          barberName: barber.name,
          date: date,
          time: time
        })
      })
    } catch (e) {
      console.error("Errore WhatsApp:", e)
    }

    alert("Prenotazione confermata! Riceverai un messaggio WhatsApp.")
    router.push('/success')
  }

  if (!barber) return <div className="p-10 text-center">Caricamento barbiere...</div>

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-6 italic">Prenota con {barber.name}</h1>
      
      {/* INPUT DATI CLIENTE */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Nome e Cognome</label>
          <input 
            type="text" 
            placeholder="Esempio: Mario Rossi"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cellulare (WhatsApp)</label>
          <input 
            type="tel" 
            placeholder="+39 333 1234567"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>
      </div>

      <hr className="mb-6" />

      {/* Scelta Data */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Scegli il giorno</label>
        <input 
          type="date" 
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Scelta Ora */}
      {date && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Scegli l'orario</label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map(slot => (
              <button 
                key={slot}
                onClick={() => setTime(slot)}
                className={`p-2 rounded-lg border text-xs font-bold transition ${
                  time === slot ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={handleBooking}
        className="w-full bg-black text-white p-4 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
        disabled={!date || !time || !customerName || !customerPhone || isSubmitting}
      >
        {isSubmitting ? 'INVIO IN CORSO...' : 'CONFERMA PRENOTAZIONE'}
      </button>
    </div>
  )
}