'use client'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Users, CalendarCheck, Trash2, Clock } from 'lucide-react'

type Booking = {
  id: number
  appointment_time: string
  customer_name: string
  customer_phone: string
  barbers: { name: string } | { name: string }[] | null
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`id, appointment_time, customer_name, customer_phone, barbers ( name )`)
      .order('appointment_time', { ascending: true })

    if (error) {
      setErrorMessage('Errore nel caricamento delle prenotazioni.')
      setLoading(false)
      return
    }

    setErrorMessage(null)
    setBookings((data ?? []) as Booking[])
    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchBookings()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [fetchBookings])

  async function deleteBooking(id: number) {
    if (deletingId !== null) return

    const confirmDelete = window.confirm('Vuoi davvero cancellare questa prenotazione?')
    if (!confirmDelete) return

    setDeletingId(id)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' })
      const payload = await response.json()

      if (!response.ok) {
        setErrorMessage(payload.error ?? 'Errore durante la cancellazione della prenotazione.')
        return
      }

      setBookings((prev) => prev.filter((booking) => booking.id !== id))
    } catch {
      setErrorMessage('Errore di rete durante la cancellazione della prenotazione.')
    } finally {
      setDeletingId(null)
    }
  }

  const todayBookings = bookings.filter(b => b.appointment_time.startsWith(new Date().toISOString().split('T')[0]))

  return (
    <div className="px-4 md:px-6 py-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📅</span>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] bg-clip-text text-transparent uppercase tracking-tighter">
            Dashboard
          </h1>
        </div>
        <p className="text-[#d41a1a] font-bold">Gestisci i tuoi appuntamenti come un Joker pro! 😈</p>
      </div>

      {/* STATISTICHE VELOCI */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* Total Bookings */}
        <div className="rounded-2xl border-2 border-[#8b0099]/50 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 text-center backdrop-blur-sm hover:border-[#d41a1a] transition-colors group">
          <div className="mx-auto mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b0099] to-[#d41a1a] flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#d41a1a]/50 transition-all">
            <Users size={24} className="text-[#f8f8f8]" />
          </div>
          <p className="text-3xl font-black text-[#d4af37]">{bookings.length}</p>
          <p className="text-[#d4af37]/60 text-xs uppercase tracking-widest font-bold mt-2">Prenotazioni Totali</p>
        </div>

        {/* Today Bookings */}
        <div className="rounded-2xl border-2 border-[#8b0099]/50 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 text-center backdrop-blur-sm hover:border-[#d41a1a] transition-colors group">
          <div className="mx-auto mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-[#d41a1a] to-[#d4af37] flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#d41a1a]/50 transition-all">
            <Clock size={24} className="text-[#f8f8f8]" />
          </div>
          <p className="text-3xl font-black text-[#d41a1a]">{todayBookings.length}</p>
          <p className="text-[#d4af37]/60 text-xs uppercase tracking-widest font-bold mt-2">Oggi 🃏</p>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="mb-6 rounded-lg border-2 border-[#d41a1a]/50 bg-[#d41a1a]/15 p-4 text-[#f4e4c1] backdrop-blur-sm">
          <p className="font-black text-sm">⚠️ ERRORE</p>
          <p className="text-xs mt-1">{errorMessage}</p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="mb-6 rounded-lg border-2 border-[#8b0099]/50 bg-[#8b0099]/10 p-6 text-center backdrop-blur-sm">
          <p className="text-[#d4af37] text-sm font-black animate-pulse">⏳ Caricamento appuntamenti...</p>
        </div>
      )}

      {/* APPOINTMENTS TABLE */}
      {!loading && (
        <div className="rounded-2xl border-2 border-[#8b0099]/50 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] overflow-hidden backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
          <div className="px-4 md:px-6 py-4 border-b-2 border-[#8b0099]/40 bg-gradient-to-r from-[#8b0099]/20 to-transparent">
            <h2 className="text-lg font-black text-[#d4af37] uppercase tracking-widest">📅 Prossimi Appuntamenti</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[#8b0099]/60 font-bold text-sm">🃏 Nessun appuntamento in vista... La calma prima della tempesta?</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#8b0099]/10 border-b border-[#8b0099]/40">
                  <tr>
                    <th className="px-4 md:px-6 py-4 text-[#d4af37] font-black uppercase text-xs tracking-widest">Cliente</th>
                    <th className="px-4 md:px-6 py-4 text-[#d4af37] font-black uppercase text-xs tracking-widest">Orario</th>
                    <th className="px-4 md:px-6 py-4 text-[#d4af37] font-black uppercase text-xs tracking-widest">Barbiere</th>
                    <th className="px-4 md:px-6 py-4 text-[#d4af37] font-black uppercase text-xs tracking-widest text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, idx) => (
                    <tr key={b.id} className="border-b border-[#8b0099]/20 hover:bg-[#8b0099]/10 transition-colors">
                      <td className="px-4 md:px-6 py-4 font-black text-[#f8f8f8]">{b.customer_name}</td>
                      <td className="px-4 md:px-6 py-4 text-[#d4af37] font-bold text-xs">
                        {new Date(b.appointment_time).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-[#8b0099] to-[#d41a1a] text-[#f8f8f8] text-xs font-black uppercase tracking-widest">
                          {Array.isArray(b.barbers) ? b.barbers[0]?.name : b.barbers?.name}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteBooking(b.id)}
                          disabled={deletingId === b.id}
                          className="p-2 rounded-lg hover:bg-[#d41a1a]/20 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Cancella prenotazione"
                          title="Elimina appuntamento"
                        >
                          <Trash2 size={18} className="text-[#d41a1a]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}