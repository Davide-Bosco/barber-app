'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

type Barber = {
  id: number
  name: string
  service_price: number
}

export default function BookingPage() {
  const params = useParams() as { id?: string }
  const id = params?.id
  
  const [barber, setBarber] = useState<Barber | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  
  // NUOVI STATI PER I DATI DEL CLIENTE
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  
  const router = useRouter()

  useEffect(() => {
    async function fetchBarber() {
      const { data } = await supabase.from('barbers').select('*').eq('id', Number(id)).single()
      if (data) setBarber(data)
    }
    fetchBarber()
  }, [id])

  useEffect(() => {
    if (!date || !id) return

    let cancelled = false

    async function fetchSlots() {
      setLoadingSlots(true)
      setSlotsError(null)

      try {
        const response = await fetch(`/api/slots?date=${date}&barberId=${Number(id)}`)
        const payload = await response.json()

        if (!response.ok) {
          if (!cancelled) {
            setSlotsError(payload.error ?? 'Errore nel recupero degli slot.')
            setAvailableSlots([])
          }
          return
        }

        if (!cancelled) {
          const slots = Array.isArray(payload.availableSlots) ? payload.availableSlots : []
          setAvailableSlots(slots)
          setTime((current) => (slots.includes(current) ? current : ''))
        }
      } catch {
        if (!cancelled) {
          setSlotsError('Errore di rete nel recupero degli slot.')
          setAvailableSlots([])
        }
      } finally {
        if (!cancelled) setLoadingSlots(false)
      }
    }

    fetchSlots()

    return () => {
      cancelled = true
    }
  }, [date, id])

  async function handleBooking() {
    if (isSubmitting) return

    if (!barber) {
      return alert('Barbiere non disponibile al momento.')
    }

    if (!date || !time || !customerName || !customerPhone) {
      return alert("Compila tutti i campi: nome, telefono, data e ora!")
    }

    if (!availableSlots.includes(time)) {
      return alert('Questo orario non e piu disponibile. Seleziona un altro slot.')
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
          onChange={(e) => {
            setAvailableSlots([])
            setSlotsError(null)
            setDate(e.target.value)
            setTime('')
          }}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Scelta Ora */}
      {date && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Scegli l&apos;orario</label>
          {loadingSlots ? (
            <div className="rounded-lg border bg-gray-50 p-3 text-sm text-gray-600">Caricamento slot disponibili...</div>
          ) : slotsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{slotsError}</div>
          ) : availableSlots.length === 0 ? (
            <div className="rounded-lg border bg-gray-50 p-3 text-sm text-gray-600">Nessuno slot disponibile per questa data.</div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map(slot => (
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
          )}
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