"use client"
import { useEffect, useState } from 'react'
import { Trash2, UserPlus, Euro } from 'lucide-react'

type Barber = {
	id: number
	name: string
	service_price: number
}

export default function AdminStaff() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBarbers()
  }, [])

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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserPlus /> Gestione Collaboratori
      </h1>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Form per aggiungere */}
      <form onSubmit={addBarber} className="bg-gray-50 p-4 rounded-xl mb-8 flex gap-4 items-end border">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Nome Barbiere</label>
          <input 
            value={newName} onChange={e => setNewName(e.target.value)}
            className="w-full p-2 border rounded" placeholder="Es: Giusy" required
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium mb-1">Prezzo (€)</label>
          <input 
            type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)}
            className="w-full p-2 border rounded" placeholder="20" required
          />
        </div>
        <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition">
          {loading ? 'Salvataggio...' : 'Aggiungi'}
        </button>
      </form>

      {/* Lista collaboratori */}
      <div className="grid gap-4">
        {barbers.map(b => (
          <div key={b.id} className="flex items-center justify-between p-4 border rounded-xl shadow-sm bg-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                {b.name[0]}
              </div>
              <div>
                <p className="font-bold text-lg">{b.name}</p>
                <p className="text-gray-500 flex items-center gap-1 text-sm">
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
    </div>
  )
}