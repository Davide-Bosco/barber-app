'use client'
import { useEffect, useState, useRef } from 'react'
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
  // preimposta il prefisso italiano; l'utente non deve inserirlo
  const [customerPhone, setCustomerPhone] = useState('+39 ')
  const [reminderAccepted, setReminderAccepted] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [bookingFeedback, setBookingFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  // numero minimo di cifre locali (escluso prefisso 39) prima di aprire il calendario
  const PHONE_LOCAL_DIGITS = 10
  const dateInputRef = useRef<HTMLInputElement | null>(null)

  const rawPhoneDigits = customerPhone.replace(/\D/g, '')
  const localPhoneDigits = rawPhoneDigits.startsWith('39') ? rawPhoneDigits.slice(2) : rawPhoneDigits
  
  const router = useRouter()

  useEffect(() => {
    async function fetchBarber() {
      const barberId = Number(id)
      if (Number.isNaN(barberId)) return

      try {
        const response = await fetch('/api/barbers')
        const payload = await response.json().catch(() => null)
        const fallbackBarber = Array.isArray(payload?.data)
          ? payload.data.find((item: Barber) => item.id === barberId) ?? null
          : null

        if (fallbackBarber) {
          setBarber(fallbackBarber)
          return
        }

        console.error('Barbiere non trovato per id:', barberId)
      } catch (fetchError) {
        console.error('Errore nel caricamento barbiere:', fetchError)
      }
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

    // quando il cliente ha inserito tutto il numero, apri il calendario
    useEffect(() => {
      const digits = customerPhone.replace(/\D/g, '')
      const local = digits.startsWith('39') ? digits.slice(2) : digits
      if (local.length >= PHONE_LOCAL_DIGITS) {
        // prova ad aprire il datepicker: usa showPicker se disponibile, altrimenti focus+click
        setTimeout(() => {
          const pickerInput = dateInputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null
          try {
            if (pickerInput?.showPicker) {
              pickerInput.showPicker()
              return
            }
          } catch {}
          pickerInput?.focus()
          pickerInput?.click()
        }, 50)
      }
    }, [customerPhone])

  async function handleBooking() {
    if (isSubmitting) return

    if (!barber) {
      return alert('Barbiere non disponibile al momento.')
    }

    const digits = customerPhone.replace(/\D/g, '')
    const local = digits.startsWith('39') ? digits.slice(2) : digits
    const missingFields: string[] = []
    if (!customerName.trim()) missingFields.push('nome e cognome')
    if (!(local.length >= PHONE_LOCAL_DIGITS)) missingFields.push('numero di telefono (10 cifre)')
    if (!date) missingFields.push('giorno')
    if (!time) missingFields.push('orario')
    if (!reminderAccepted) missingFields.push('reminder WhatsApp')

    if (missingFields.length > 0) {
      setFormErrors(missingFields)
      setBookingFeedback({
        kind: 'error',
        message: `Prima di confermare devi completare: ${missingFields.join(', ')}.`,
      })
      return
    }

    setFormErrors([])
    setBookingFeedback(null)

    if (!availableSlots.includes(time)) {
      return alert('Questo orario non e piu disponibile. Seleziona un altro slot.')
    }

    setConfirmDialogOpen(true)
  }

  async function confirmBooking() {
    if (!barber || isSubmitting) return

    setIsSubmitting(true)
    setConfirmDialogOpen(false)

    const appointmentTimestamp = `${date}T${time}:00`

    // 1. Salviamo il cliente nella tabella profiles o gestiamo l'ospite
    // Per velocità in questa settimana, salviamo il nome e telefono direttamente nella prenotazione
    // o assicurati che la tabella bookings abbia queste colonne.
    
    const bookingBase = {
      barber_id: Number(id),
      appointment_time: appointmentTimestamp,
      customer_name: customerName, // Assicurati di avere questa colonna nel DB
      customer_phone: customerPhone, // Assicurati di avere questa colonna nel DB
      status: 'confirmed' as const,
    }

    // prova a salvare anche la preferenza reminder; fallback se la colonna non esiste
    let { error } = await supabase.from('bookings').insert([
      { ...bookingBase, reminder_enabled: reminderAccepted },
    ])

    if (error && /reminder_enabled/i.test(error.message)) {
      const retry = await supabase.from('bookings').insert([bookingBase])
      error = retry.error
      if (!retry.error) {
        console.warn('Colonna reminder_enabled non trovata: reminder non persistito nel DB.')
      }
    }

    if (error) {
      alert("Errore salvataggio: " + error.message)
      setIsSubmitting(false)
      return
    }

    // rimuovi lo slot prenotato dall'elenco disponibile (aggiorna UI)
    setAvailableSlots((prev) => prev.filter((s) => s !== time))
    setTime('')

    // 2. Chiamata API WhatsApp con dati REALI - verifica risultato
    let whatsappOk = false
    let whatsappErrorMessage = ''
    try {
      const res = await fetch('/api/barbers/whatsapp', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerPhone,
          clientName: customerName,
          barberName: barber.name,
          date: date,
          time: time
          , isReminder: false
        })
      })
      const payload = await res.json().catch(() => null)
      if (res.ok && payload?.success !== false) {
        whatsappOk = true
      } else {
        whatsappErrorMessage = payload?.error || 'Errore invio WhatsApp'
        console.error('WhatsApp API error:', payload)
      }
    } catch (e) {
      whatsappErrorMessage = e instanceof Error ? e.message : 'Errore WhatsApp'
      console.error("Errore WhatsApp:", e)
    }

    if (!whatsappOk) {
      setBookingFeedback({
        kind: 'error',
        message: 'Prenotazione salvata. Ti invieremo un messaggio WhatsApp appena possibile.',
      })
    } else {
      setBookingFeedback({
        kind: 'success',
        message: 'Prenotazione confermata. Il messaggio WhatsApp è stato inviato correttamente.',
      })
    }

    setIsSubmitting(false)

    if (whatsappOk) {
      router.push('/success')
    }
  }

  if (!barber) return <div className="p-10 text-center">Caricamento barbiere...</div>

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="card p-8 lg:p-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Prenota con {barber.name}</h1>
      
      {/* INPUT DATI CLIENTE */}
        <div className="space-y-6 mb-10">
        <div>
          <label className="block text-lg font-medium mb-3">Nome e Cognome</label>
          <input 
            type="text" 
            placeholder="Esempio: Mario Rossi"
            className="w-full p-5 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] text-xl text-[#f8f8f8] placeholder-[#d4af37]/40 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value)
              if (formErrors.length > 0) setFormErrors([])
            }}
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-3">Cellulare (WhatsApp)</label>
          <input 
            type="tel" 
            placeholder="333 1234567"
            className="w-full p-5 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] text-xl text-[#f8f8f8] placeholder-[#d4af37]/40 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
            value={customerPhone}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '')
              // rimuovi il prefisso se presente, mantieni il resto
              const rest = digits.startsWith('39') ? digits.slice(2) : digits
              setCustomerPhone(rest ? `+39 ${rest}` : '+39 ')
              if (formErrors.length > 0) setFormErrors([])
            }}
          />
        </div>
        <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-5">
          <label className="flex items-center gap-3 text-xl font-medium">
            <input
              type="checkbox"
              className="h-6 w-6 accent-[#b8860b]"
              checked={reminderAccepted}
              onChange={(e) => {
                setReminderAccepted(e.target.checked)
                if (formErrors.length > 0) setFormErrors([])
              }}
            />
            Attiva reminder WhatsApp
          </label>
          <p className="mt-2 text-base text-[#f8f8f8]/70">
            Devi attivare il reminder per poter confermare la prenotazione.
          </p>
        </div>
      </div>

      <hr className="mb-6" />

      {/* Scelta Data: mostrala solo dopo che l'utente ha inserito tutto il numero (soglia configurabile) */}
      {localPhoneDigits.length >= PHONE_LOCAL_DIGITS && (
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Scegli il giorno</label>
          <input 
            type="date" 
            ref={dateInputRef}
            className="w-full h-16 p-5 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] text-xl text-[#f8f8f8]"
            onChange={(e) => {
              setAvailableSlots([])
              setSlotsError(null)
              setDate(e.target.value)
              setTime('')
              if (formErrors.length > 0) setFormErrors([])
            }}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      )}

      {/* Scelta Ora */}
      {date && (
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Scegli l&apos;orario</label>
          {loadingSlots ? (
            <div className="rounded-lg border bg-gray-50 p-3 text-sm text-gray-600">Caricamento slot disponibili...</div>
          ) : slotsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{slotsError}</div>
          ) : availableSlots.length === 0 ? (
            <div className="rounded-lg border bg-gray-50 p-3 text-sm text-gray-600">Nessuno slot disponibile per questa data.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots.map(slot => (
                <button 
                  key={slot}
                  onClick={() => {
                    setTime(slot)
                    if (formErrors.length > 0) setFormErrors([])
                  }}
                  className={`w-full flex items-center justify-center p-4 min-h-[56px] rounded-lg border font-semibold transition text-xl ${
                    time === slot ? 'bg-[#b8860b] text-[#0a0a0a] border-[#b8860b]' : 'bg-[#0a0a0a] text-[#f8f8f8] border-[#2a2a2a] hover:bg-[#1a1a1a]'
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
        className="btn-primary btn-lg w-full mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'INVIO IN CORSO...' : 'CONFERMA PRENOTAZIONE'}
      </button>
      {bookingFeedback && (
        <div
          className={`mt-4 rounded-2xl border p-4 text-base shadow-lg ${
            bookingFeedback.kind === 'success'
              ? 'border-emerald-400/30 bg-emerald-950/35 text-emerald-100'
              : 'border-red-400/30 bg-red-950/35 text-red-100'
          }`}
        >
          {bookingFeedback.message}
        </div>
      )}
      {formErrors.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-400/50 bg-red-900/20 p-4 text-red-200">
          <p className="text-lg font-semibold">Prima di confermare, completa:</p>
          <ul className="mt-2 list-disc pl-6 text-base">
            {formErrors.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {confirmDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-[#d4af37]/25 bg-gradient-to-b from-[#151515] to-[#0b0b0b] p-6 shadow-2xl shadow-black/50">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]/80">Conferma prenotazione</p>
                <h2 className="mt-2 text-2xl font-bold text-[#f8f8f8]">Controlla i dati prima di procedere</h2>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDialogOpen(false)}
                className="rounded-full border border-[#2a2a2a] px-3 py-1 text-sm text-[#f8f8f8]/70 transition hover:border-[#d4af37]/40 hover:text-[#f8f8f8]"
              >
                Chiudi
              </button>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] p-5 text-lg text-[#f8f8f8]">
              <div className="flex justify-between gap-4"><span className="text-[#d4af37]/80">Barbiere</span><span className="text-right font-semibold">{barber?.name}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[#d4af37]/80">Cliente</span><span className="text-right font-semibold">{customerName}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[#d4af37]/80">Telefono</span><span className="text-right font-semibold">{customerPhone}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[#d4af37]/80">Giorno</span><span className="text-right font-semibold">{date}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[#d4af37]/80">Ora</span><span className="text-right font-semibold">{time}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[#d4af37]/80">Reminder WhatsApp</span><span className="text-right font-semibold">{reminderAccepted ? 'Attivo' : 'Non attivo'}</span></div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmDialogOpen(false)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-transparent px-5 py-4 text-lg font-semibold text-[#f8f8f8] transition hover:bg-[#1a1a1a]"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={() => void confirmBooking()}
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-[#d4af37] px-5 py-4 text-lg font-semibold text-[#0a0a0a] transition hover:bg-[#e0bc52] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'SALVATAGGIO...' : 'Conferma e invia'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}