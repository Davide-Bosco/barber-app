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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#d4af37]">
        <UserPlus /> Gestione Collaboratori
      </h1>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Form per aggiungere */}
      <form onSubmit={addBarber} className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 rounded-xl mb-8 flex gap-4 items-end border border-[#d4af37]/20 backdrop-blur-sm">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#d4af37] mb-1">Nome Barbiere</label>
          <input 
            value={newName} onChange={e => setNewName(e.target.value)}
            className="w-full p-2 border border-[#d4af37]/20 rounded bg-[#0a0a0a] text-[#f8f8f8]" placeholder="Es: Giusy" required
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-[#d4af37] mb-1">Prezzo (€)</label>
          <input 
            type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)}
            className="w-full p-2 border border-[#d4af37]/20 rounded bg-[#0a0a0a] text-[#f8f8f8]" placeholder="20" required
          />
        </div>
        <button className="bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] text-[#0a0a0a] px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-[#d4af37]/30 transition">
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
            <label className="block text-[#d4af37] font-black text-xs uppercase tracking-widest mb-2">👤 Nome Barbiere</label>
            <input 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              className="w-full p-3 rounded-lg border-2 border-[#8b0099]/40 bg-[#0a0a0a] text-[#f8f8f8] placeholder-[#8b0099]/40 focus:outline-none focus:border-[#d41a1a] transition-colors font-bold"
              placeholder="Es: Giusy" 
              required
            />
          </div>
          <div className="w-full md:w-40">
            <label className="block text-[#d4af37] font-black text-xs uppercase tracking-widest mb-2">💰 Prezzo (€)</label>
            <input 
              type="number" 
              value={newPrice} 
              onChange={e => setNewPrice(e.target.value)}
              className="w-full p-3 rounded-lg border-2 border-[#8b0099]/40 bg-[#0a0a0a] text-[#f8f8f8] placeholder-[#8b0099]/40 focus:outline-none focus:border-[#d41a1a] transition-colors font-bold"
              placeholder="20" 
              required
            />
          </div>
          <button className="w-full md:w-auto bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] text-[#0a0a0a] px-6 py-3 rounded-lg font-black hover:shadow-lg hover:shadow-[#d41a1a]/50 transition-all duration-300 uppercase tracking-widest">
            {loading ? 'Salvataggio...' : '✓ Aggiungi'}
          </button>
        </form>

        {/* Lista barbieri */}
        <div className="space-y-3">
          <p className="text-[#d4af37] font-black text-sm uppercase tracking-widest">👥 Barbieri Registrati ({barbers.length})</p>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {barbers.length === 0 ? (
              <p className="text-[#8b0099]/60 text-sm font-bold">Nessun barbiere ancora</p>
            ) : (
              barbers.map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 rounded-lg border-2 border-[#8b0099]/40 bg-[#0a0a0a]/50 hover:border-[#d41a1a] transition-colors group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8b0099] to-[#d41a1a] rounded-lg flex items-center justify-center font-black text-[#f8f8f8] group-hover:shadow-lg group-hover:shadow-[#d41a1a]/50 transition-all">
                      {b.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-lg text-[#f8f8f8] uppercase">{b.name}</p>
                      <p className="text-[#d4af37] flex items-center gap-1 text-xs font-bold">
                        💰 €{b.service_price} a taglio
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => deleteBarber(b.id)}
                    className="p-2 rounded-lg hover:bg-[#d41a1a]/20 transition-colors text-[#d41a1a]"
                    title="Elimina barbiere"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* GESTIONE UTENTI STAFF */}
      <div className="mb-10 rounded-2xl border-2 border-[#8b0099]/50 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 md:p-8 backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-[#d4af37] uppercase tracking-widest">
          <Key size={28} className="text-[#d41a1a]" /> Gestione Utenti Staff
        </h2>

        {staffError && (
          <div className="mb-4 rounded-lg border-2 border-[#d41a1a]/50 bg-[#d41a1a]/15 p-4 text-[#f4e4c1] backdrop-blur-sm">
            <p className="font-black text-sm">⚠️ ERRORE</p>
            <p className="text-xs mt-1">{staffError}</p>
          </div>
        )}

        <form onSubmit={createStaffUser} className="mb-6 p-4 rounded-xl border-2 border-[#8b0099]/40 bg-[#0a0a0a]/50 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-[#d4af37] font-black text-xs uppercase tracking-widest mb-2">👤 Username</label>
            <input 
              value={newStaffUsername} 
              onChange={e => setNewStaffUsername(e.target.value)} 
              className="w-full p-3 rounded-lg border-2 border-[#8b0099]/40 bg-[#0a0a0a] text-[#f8f8f8] placeholder-[#8b0099]/40 focus:outline-none focus:border-[#d41a1a] transition-colors font-bold"
              placeholder="admin"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-[#d4af37] font-black text-xs uppercase tracking-widest mb-2">🔐 Password</label>
            <input 
              type="password" 
              value={newStaffPassword} 
              onChange={e => setNewStaffPassword(e.target.value)} 
              className="w-full p-3 rounded-lg border-2 border-[#8b0099]/40 bg-[#0a0a0a] text-[#f8f8f8] placeholder-[#8b0099]/40 focus:outline-none focus:border-[#d41a1a] transition-colors font-bold"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full md:w-auto bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] text-[#0a0a0a] px-6 py-3 rounded-lg font-black hover:shadow-lg hover:shadow-[#d41a1a]/50 transition-all duration-300 uppercase tracking-widest">
            ✓ Crea Utente
          </button>
        </form>

        <div>
          <p className="text-[#d4af37] font-black text-sm uppercase tracking-widest mb-3">Utenti Attivi ({staffUsers.length})</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {staffUsers.length === 0 ? (
              <p className="text-[#8b0099]/60 text-sm font-bold">Nessun utente staff presente.</p>
            ) : (
              staffUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border-2 border-[#8b0099]/40 bg-[#0a0a0a]/50 hover:border-[#d41a1a] transition-colors">
                  <p className="font-black text-[#d4af37] uppercase">{u.username}</p>
                  <button 
                    onClick={() => deleteStaff(u.id)} 
                    className="p-1 rounded hover:bg-[#d41a1a]/20 transition-colors text-[#d41a1a]"
                    title="Elimina utente"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* GESTIONE SLOT GIORNALIERI */}
      <div className="rounded-2xl border-2 border-[#8b0099]/50 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 md:p-8 backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-[#d4af37] uppercase tracking-widest">
          <Clock3 size={28} className="text-[#d41a1a]" /> Gestione Slot Orari
        </h2>

        <div className="mb-6 max-w-xs">
          <label className="block text-[#d4af37] font-black text-xs uppercase tracking-widest mb-2">📅 Data da Modificare</label>
          <input
            type="date"
            value={slotDate}
            onChange={(event) => setSlotDate(event.target.value)}
            className="w-full p-3 rounded-lg border-2 border-[#8b0099]/40 bg-[#0a0a0a] text-[#f8f8f8] focus:outline-none focus:border-[#d41a1a] transition-colors font-bold"
          />
        </div>

        <form onSubmit={handleAddSlot} className="mb-6 p-4 rounded-xl border-2 border-[#8b0099]/40 bg-[#0a0a0a]/50 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-end">
          <div>
            <label className="block text-[#d4af37] font-black text-xs uppercase tracking-widest mb-2">🕐 Nuovo Slot</label>
            <input
              type="time"
              value={slotTime}
              onChange={(event) => setSlotTime(event.target.value)}
              className="p-3 rounded-lg border-2 border-[#8b0099]/40 bg-[#0a0a0a] text-[#f8f8f8] focus:outline-none focus:border-[#d41a1a] transition-colors font-bold"
              step={1800}
            />
          </div>
          <button
            type="submit"
            disabled={slotActionLoading}
            className="bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] text-[#0a0a0a] px-6 py-3 rounded-lg font-black hover:shadow-lg hover:shadow-[#d41a1a]/50 transition-all duration-300 uppercase tracking-widest disabled:opacity-60"
          >
            ✓ Aggiungi Slot
          </button>
        </form>

        {slots.warning && (
          <div className="mb-4 rounded-lg border-2 border-[#d4af37]/50 bg-[#d4af37]/10 p-4 text-[#d4af37] backdrop-blur-sm font-bold text-sm">
            ℹ️ {slots.warning}
          </div>
        )}

        {slotsError && (
          <div className="mb-4 rounded-lg border-2 border-[#d41a1a]/50 bg-[#d41a1a]/15 p-4 text-[#f4e4c1] backdrop-blur-sm">
            <p className="font-black text-sm">⚠️ ERRORE</p>
            <p className="text-xs mt-1">{slotsError}</p>
          </div>
        )}

        {slotsLoading ? (
          <div className="rounded-lg border-2 border-[#8b0099]/40 bg-[#8b0099]/10 p-4 text-center text-[#d4af37] font-black animate-pulse">
            ⏳ Caricamento slot...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Slot Prenotabili */}
            <div>
              <p className="text-[#d4af37] font-black text-sm uppercase tracking-widest mb-3">✅ Slot Prenotabili ({slots.availableSlots.length})</p>
              <div className="flex flex-wrap gap-2">
                {slots.availableSlots.length === 0 ? (
                  <span className="text-[#8b0099]/60 text-sm font-bold">Nessuno slot disponibile.</span>
                ) : (
                  slots.availableSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => saveSlotOverride(slotDate, time, false)}
                      disabled={slotActionLoading}
                      className="px-3 py-2 rounded-lg border-2 border-[#8b0099]/40 bg-[#8b0099]/10 text-[#d4af37] text-xs font-black uppercase tracking-widest hover:bg-[#8b0099]/20 hover:border-[#d41a1a] transition-all disabled:opacity-60"
                    >
                      {time} ⊘ Disattiva
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Slot Rimossi */}
            <div>
              <p className="text-[#d4af37] font-black text-sm uppercase tracking-widest mb-3">❌ Slot Standard Rimossi ({slots.removedDefaultSlots.length})</p>
              <div className="flex flex-wrap gap-2">
                {slots.removedDefaultSlots.length === 0 ? (
                  <span className="text-[#8b0099]/60 text-sm font-bold">Nessuno slot rimosso.</span>
                ) : (
                  slots.removedDefaultSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => deleteSlotOverride(slotDate, time)}
                      disabled={slotActionLoading}
                      className="px-3 py-2 rounded-lg border-2 border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs font-black uppercase tracking-widest hover:bg-[#d4af37]/20 transition-all disabled:opacity-60"
                    >
                      {time} ↺ Ripristina
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Slot Extra */}
            <div>
              <p className="text-[#d4af37] font-black text-sm uppercase tracking-widest mb-3">⚡ Slot Extra ({slots.extraSlots.length})</p>
              <div className="flex flex-wrap gap-2">
                {slots.extraSlots.length === 0 ? (
                  <span className="text-[#8b0099]/60 text-sm font-bold">Nessuno slot extra.</span>
                ) : (
                  slots.extraSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => deleteSlotOverride(slotDate, time)}
                      disabled={slotActionLoading}
                      className="px-3 py-2 rounded-lg border-2 border-[#d41a1a]/40 bg-[#d41a1a]/10 text-[#d41a1a] text-xs font-black uppercase tracking-widest hover:bg-[#d41a1a]/20 transition-all disabled:opacity-60"
                    >
                      {time} ✕ Rimuovi
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}