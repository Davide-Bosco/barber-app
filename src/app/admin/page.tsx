"use client"
import { useEffect, useState } from 'react'
import { Trash2, UserPlus, Euro, Clock3 } from 'lucide-react'
import { Key } from 'lucide-react'

type Barber = {
	id: number
	name: string
	service_price: number
}

type SlotsPayload = {
  availableSlots: string[]
  removedDefaultSlots: string[]
  extraSlots: string[]
  warning: string | null
}

export default function AdminStaff() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [slotDate, setSlotDate] = useState(new Date().toISOString().split('T')[0])
  const [slotTime, setSlotTime] = useState('')
  const [slots, setSlots] = useState<SlotsPayload>({
    availableSlots: [],
    removedDefaultSlots: [],
    extraSlots: [],
    warning: null,
  })
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotActionLoading, setSlotActionLoading] = useState(false)
  const [staffUsers, setStaffUsers] = useState<{ id: number; username: string }[]>([])
  const [newStaffUsername, setNewStaffUsername] = useState('')
  const [newStaffPassword, setNewStaffPassword] = useState('')
  const [staffError, setStaffError] = useState<string | null>(null)

  useEffect(() => {
    fetchBarbers()
  }, [])

  useEffect(() => {
    fetchStaffUsers()
  }, [])

  useEffect(() => {
    fetchSlots(slotDate)
  }, [slotDate])

  async function fetchBarbers() {
    setErrorMessage(null)
    const response = await fetch('/api/barbers')
    const payload = await response.json()

    if (!response.ok) {
      setErrorMessage(payload.error ?? 'Errore nel caricamento dei collaboratori.')
      return
    }

    setBarbers(payload.data ?? [])
  }

  async function fetchStaffUsers() {
    setStaffError(null)
    try {
      const response = await fetch('/api/staff/users')
      const payload = await response.json()
      if (!response.ok) {
        setStaffError(payload.error ?? 'Errore nel caricamento utenti staff.')
        return
      }
      setStaffUsers(payload.data ?? [])
    } catch {
      setStaffError('Errore di rete nel caricamento utenti staff.')
    }
  }

  async function createStaffUser(e: React.FormEvent) {
    e.preventDefault()
    setStaffError(null)
    if (!newStaffUsername || newStaffPassword.length < 8) {
      setStaffError('Inserisci username e password (min 8 caratteri).')
      return
    }

    try {
      const response = await fetch('/api/staff/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newStaffUsername, password: newStaffPassword }),
      })
      const payload = await response.json()
      if (!response.ok) {
        setStaffError(payload.error ?? 'Errore durante la creazione utente.')
        return
      }

      setNewStaffPassword('')
      setNewStaffUsername('')
      await fetchStaffUsers()
    } catch {
      setStaffError('Errore di rete durante la creazione utente.')
    }
  }

  async function deleteStaff(id: number) {
    if (!confirm('Eliminare questo utente staff?')) return
    setStaffError(null)
    try {
      const response = await fetch(`/api/staff/users?id=${id}`, { method: 'DELETE' })
      const payload = await response.json()
      if (!response.ok) {
        setStaffError(payload.error ?? 'Errore durante l\'eliminazione utente.')
        return
      }
      await fetchStaffUsers()
    } catch {
      setStaffError('Errore di rete durante l\'eliminazione utente.')
    }
  }

  async function fetchSlots(date: string) {
    setSlotsLoading(true)
    setSlotsError(null)

    try {
      const response = await fetch(`/api/slots?date=${date}`)
      const payload = await response.json()

      if (!response.ok) {
        setSlotsError(payload.error ?? 'Errore nel caricamento degli slot.')
        return
      }

      setSlots({
        availableSlots: payload.availableSlots ?? [],
        removedDefaultSlots: payload.removedDefaultSlots ?? [],
        extraSlots: payload.extraSlots ?? [],
        warning: payload.warning ?? null,
      })
    } catch {
      setSlotsError('Errore di rete nel caricamento degli slot.')
    } finally {
      setSlotsLoading(false)
    }
  }

  async function addBarber(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    const response = await fetch('/api/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, service_price: Number(newPrice) }),
    })

    const payload = await response.json()

    if (!response.ok) {
      setErrorMessage(payload.error ?? 'Errore durante l\'aggiunta del collaboratore.')
      setLoading(false)
      return
    }

    setNewName('')
    setNewPrice('')
    await fetchBarbers()
    setLoading(false)
  }

  async function deleteBarber(id: number) {
    if (confirm("Vuoi davvero eliminare questo collaboratore?")) {
      setErrorMessage(null)
      const response = await fetch(`/api/barbers?id=${id}`, { method: 'DELETE' })
      const payload = await response.json()

      if (!response.ok) {
        setErrorMessage(payload.error ?? 'Errore durante l\'eliminazione del collaboratore.')
        return
      }

      await fetchBarbers()
    }
  }

  async function saveSlotOverride(date: string, time: string, isAvailable: boolean) {
    setSlotActionLoading(true)
    setSlotsError(null)

    try {
      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, is_available: isAvailable }),
      })
      const payload = await response.json()

      if (!response.ok) {
        setSlotsError(payload.error ?? 'Errore durante il salvataggio slot.')
        return
      }

      await fetchSlots(date)
      if (isAvailable) {
        setSlotTime('')
      }
    } catch {
      setSlotsError('Errore di rete durante il salvataggio slot.')
    } finally {
      setSlotActionLoading(false)
    }
  }

  async function deleteSlotOverride(date: string, time: string) {
    setSlotActionLoading(true)
    setSlotsError(null)

    try {
      const response = await fetch(`/api/slots?date=${date}&time=${encodeURIComponent(time)}`, {
        method: 'DELETE',
      })
      const payload = await response.json()

      if (!response.ok) {
        setSlotsError(payload.error ?? 'Errore durante il ripristino slot.')
        return
      }

      await fetchSlots(date)
    } catch {
      setSlotsError('Errore di rete durante il ripristino slot.')
    } finally {
      setSlotActionLoading(false)
    }
  }

  async function handleAddSlot(event: React.FormEvent) {
    event.preventDefault()

    if (!slotTime) {
      setSlotsError('Inserisci un orario valido in formato HH:mm.')
      return
    }

    await saveSlotOverride(slotDate, slotTime, true)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-[#d4af37]">
        <UserPlus /> Gestione Collaboratori
      </h1>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Form per aggiungere */}
      <form onSubmit={addBarber} className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-5 lg:p-6 rounded-2xl mb-10 flex gap-4 items-end border border-[#d4af37]/20 backdrop-blur-sm">
        <div className="flex-1">
          <label className="block text-lg font-medium text-[#d4af37] mb-2">Nome Barbiere</label>
          <input 
            value={newName} onChange={e => setNewName(e.target.value)}
            className="w-full p-4 rounded-xl border border-[#d4af37]/20 bg-[#0a0a0a] text-xl text-[#f8f8f8] placeholder-[#d4af37]/40" placeholder="Es: Giusy" required
          />
        </div>
        <div className="w-32">
          <label className="block text-lg font-medium text-[#d4af37] mb-2">Prezzo (€)</label>
          <input 
            type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)}
            className="w-full p-4 border border-[#d4af37]/20 rounded-xl bg-[#0a0a0a] text-xl text-[#f8f8f8] placeholder-[#d4af37]/40" placeholder="20" required
          />
        </div>
        <button className="bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] text-[#0a0a0a] px-6 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#d4af37]/30 transition">
          {loading ? 'Salvataggio...' : 'Aggiungi'}
        </button>
      </form>

      {/* Lista collaboratori */}
      <div className="grid gap-4">
        {barbers.map(b => (
          <div key={b.id} className="flex items-center justify-between p-4 border border-[#d4af37]/20 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#f4e4c1] rounded-full flex items-center justify-center font-bold text-[#0a0a0a]">
                {b.name[0]}
              </div>
              <div>
                <p className="font-bold text-lg text-[#f8f8f8]">{b.name}</p>
                <p className="text-[#d4af37]/60 flex items-center gap-1 text-sm">
                  <Euro size={14}/> {b.service_price} a taglio
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => deleteBarber(b.id)}
              className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* GESTIONE UTENTI STAFF */}
      <div className="mt-10 rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-5 backdrop-blur-sm">
        <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-[#d4af37]">
          <Key size={20} /> Gestione Utenti Staff
        </h2>

        {staffError && (
          <div className="mb-4 rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 p-4 text-base text-[#d4af37] backdrop-blur-sm">{staffError}</div>
        )}

        <form onSubmit={createStaffUser} className="mb-4 flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="block text-lg font-medium text-[#d4af37] mb-2">Username</label>
            <input value={newStaffUsername} onChange={e => setNewStaffUsername(e.target.value)} className="w-full rounded-xl border border-[#d4af37]/20 p-4 bg-[#0a0a0a] text-xl text-[#f8f8f8]" />
          </div>
          <div className="w-48">
            <label className="block text-lg font-medium text-[#d4af37] mb-2">Password</label>
            <input type="password" value={newStaffPassword} onChange={e => setNewStaffPassword(e.target.value)} className="w-full rounded-xl border border-[#d4af37]/20 p-4 bg-[#0a0a0a] text-xl text-[#f8f8f8]" />
          </div>
          <div>
            <button className="rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] px-5 py-4 font-semibold text-lg text-[#0a0a0a] hover:shadow-lg hover:shadow-[#d4af37]/30">Crea Utente</button>
          </div>
        </form>

        <div>
          <p className="mb-3 text-lg font-semibold text-[#d4af37]">Utenti esistenti</p>
          <div className="grid gap-2">
            {staffUsers.length === 0 ? (
              <div className="text-base text-[#d4af37]/60">Nessun utente staff presente.</div>
            ) : (
              staffUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between rounded-xl border border-[#d4af37]/20 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 backdrop-blur-sm">
                  <div className="text-lg font-medium text-[#d4af37]">{u.username}</div>
                  <button onClick={() => deleteStaff(u.id)} className="text-lg text-red-500 hover:text-red-700">Elimina</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 backdrop-blur-sm">
        <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-[#d4af37]">
          <Clock3 size={20} /> Gestione Slot Giornalieri
        </h2>

        <div className="mb-4 max-w-xs">
          <label className="mb-2 block text-lg font-medium text-[#d4af37]">Data da modificare</label>
          <input
            type="date"
            value={slotDate}
            onChange={(event) => setSlotDate(event.target.value)}
            className="w-full rounded-xl border border-[#d4af37]/20 p-4 bg-[#0a0a0a] text-xl text-[#f8f8f8]"
          />
        </div>

        <form onSubmit={handleAddSlot} className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#d4af37]/20 bg-[#0a0a0a]/50 p-5 md:flex-row md:items-end backdrop-blur-sm">
          <div>
            <label className="mb-2 block text-lg font-medium text-[#d4af37]">Nuovo slot da aggiungere</label>
            <input
              type="time"
              value={slotTime}
              onChange={(event) => setSlotTime(event.target.value)}
              className="rounded-xl border border-[#d4af37]/20 p-4 bg-[#0a0a0a] text-xl text-[#f8f8f8]"
              step={1800}
            />
          </div>
          <button
            type="submit"
            disabled={slotActionLoading}
            className="rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] px-5 py-4 font-semibold text-lg text-[#0a0a0a] hover:shadow-lg hover:shadow-[#d4af37]/30 disabled:opacity-60"
          >
            Aggiungi slot
          </button>
        </form>

        {slots.warning && (
          <div className="mb-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-base text-yellow-800">
            {slots.warning}
          </div>
        )}

        {slotsError && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-700">
            {slotsError}
          </div>
        )}

        {slotsLoading ? (
          <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 p-4 text-base text-[#d4af37] backdrop-blur-sm text-center font-bold">Caricamento slot...</div>
        ) : (
          <>
            <div className="mb-4">
              <p className="mb-3 text-lg font-semibold text-[#d4af37]">Slot prenotabili ({slots.availableSlots.length})</p>
              <div className="flex flex-wrap gap-2">
                {slots.availableSlots.length === 0 ? (
                  <span className="text-base text-[#d4af37]/60">Nessuno slot disponibile.</span>
                ) : (
                  slots.availableSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => saveSlotOverride(slotDate, time, false)}
                      disabled={slotActionLoading}
                      className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-base text-[#d4af37] hover:bg-[#d4af37]/20 disabled:opacity-60"
                    >
                      {time} - Disattiva
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="mb-3 text-lg font-semibold text-[#d4af37]">Slot standard rimossi</p>
              <div className="flex flex-wrap gap-2">
                {slots.removedDefaultSlots.length === 0 ? (
                  <span className="text-base text-[#d4af37]/60">Nessuno slot standard rimosso.</span>
                ) : (
                  slots.removedDefaultSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => deleteSlotOverride(slotDate, time)}
                      disabled={slotActionLoading}
                      className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-base text-[#d4af37] hover:bg-[#d4af37]/20 disabled:opacity-60"
                    >
                      {time} - Ripristina
                    </button>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-lg font-semibold text-[#d4af37]">Slot extra aggiunti</p>
              <div className="flex flex-wrap gap-2">
                {slots.extraSlots.length === 0 ? (
                  <span className="text-base text-[#d4af37]/60">Nessuno slot extra.</span>
                ) : (
                  slots.extraSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => deleteSlotOverride(slotDate, time)}
                      disabled={slotActionLoading}
                      className="rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-base text-gray-800 hover:bg-gray-200 disabled:opacity-60"
                    >
                      {time} - Rimuovi extra
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
