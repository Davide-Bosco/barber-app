'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StaffRegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/staff/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const payload = await res.json()
      if (!res.ok) {
        setMessage(payload.error || 'Errore nella registrazione')
        setLoading(false)
        return
      }

      setMessage('Registrazione completata. Accedi ora con il tuo username.')
      setLoading(false)
      router.push('/staff-login')
    } catch (err) {
      setMessage('Errore di rete. Riprova.')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-[#d4af37]/18 bg-gradient-to-br from-[#111] to-[#171717] p-6">
      <h1 className="text-2xl font-semibold text-[#f8f8f8] mb-2">Registrazione Staff</h1>
      <p className="text-sm text-[#d4af37]/70 mb-4">Crea un account staff. Se esistono già utenti, questa operazione richiede autorizzazione.</p>

      {message && (
        <div className="mb-4 text-sm text-[#d4af37]">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full rounded-md bg-[#0a0a0a] border border-[#d4af37]/12 p-3 text-[#f8f8f8]"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 caratteri)"
          className="w-full rounded-md bg-[#0a0a0a] border border-[#d4af37]/12 p-3 text-[#f8f8f8]"
          minLength={8}
          required
        />

        <button type="submit" disabled={loading} className="w-full rounded-md bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] p-3 font-semibold text-[#0a0a0a]">
          {loading ? 'Registrazione...' : 'Registrati come Staff'}
        </button>
      </form>
    </div>
  )
}
