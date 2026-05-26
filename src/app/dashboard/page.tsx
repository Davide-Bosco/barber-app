'use client'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Users, CalendarCheck, Trash2 } from 'lucide-react'

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

type StaffSession = {
  isStaff: boolean
  isOwner: boolean
  role: 'owner' | 'barber' | null
  username: string | null
}
    const timer = window.setTimeout(() => {
      void fetchBookings()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [fetchBookings])
  const [session, setSession] = useState<StaffSession>({ isStaff: false, isOwner: false, role: null, username: null })

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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetch('/api/staff/session')
        .then((response) => response.json())
        .then((payload) => {
          setSession({
            isStaff: Boolean(payload?.isStaff),
            isOwner: Boolean(payload?.isOwner),
            role: payload?.role === 'owner' ? 'owner' : payload?.role === 'barber' ? 'barber' : null,
            username: typeof payload?.username === 'string' ? payload.username : null,
          })
        })
        .catch(() => setSession({ isStaff: false, isOwner: false, role: null, username: null }))
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* STATISTICHE VELOCI */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-2xl border border-[#d4af37]/20 text-center">
          <Users className="mx-auto mb-2 text-[#d4af37]" />
          <p className="text-2xl font-bold text-[#d4af37]">{bookings.length}</p>
          <p className="text-[#d4af37]/60 text-xs uppercase tracking-widest font-bold mt-2">Totale</p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-2xl border border-[#d4af37]/20 text-center">
          <CalendarCheck className="mx-auto mb-2 text-[#d4af37]" />
          <p className="text-2xl font-bold text-[#d4af37]">
            {bookings.filter(b => b.appointment_time.startsWith(new Date().toISOString().split('T')[0])).length}
          </p>
          <p className="text-[#d4af37]/60 text-xs uppercase tracking-widest font-bold mt-2">Oggi</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-[#d4af37] mb-4 uppercase tracking-wide">Prossimi Appuntamenti</h2>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {loading && (
        <div className="mb-4 rounded-lg border border-[#d4af37]/20 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 text-[#d4af37] backdrop-blur-sm text-center font-bold">
          Caricamento appuntamenti...
        </div>
      )}
      
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-[#d4af37]/20 overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#d4af37]/10 border-b border-[#d4af37]/20">
            <tr>
              <th className="p-4 text-[#d4af37] font-bold uppercase text-xs tracking-widest">Cliente</th>
              <th className="p-4 text-[#d4af37] font-bold uppercase text-xs tracking-widest">Orario</th>
              <th className="p-4 text-[#d4af37] font-bold uppercase text-xs tracking-widest">Barbiere</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-b border-[#d4af37]/10 hover:bg-[#d4af37]/5 transition-colors">
                <td className="p-4 font-bold text-[#f8f8f8]">{b.customer_name}</td>
                <td className="p-4 text-[#d4af37]/80">
                   {new Date(b.appointment_time).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-4 text-right">
                  {session.isOwner ? (
                    <button
                      type="button"
                      onClick={() => deleteBooking(b.id)}
                      disabled={deletingId === b.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      {deletingId === b.id ? 'Eliminazione...' : 'Elimina'}
                    </button>
                  ) : (
                    <span className="text-xs uppercase tracking-widest text-[#d4af37]/40">Solo lettura</span>
                  )}
                </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}