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
    <div className="mx-auto mt-12 max-w-lg px-4">
      <div className="card p-8 lg:p-10">
        <h1 className="text-3xl font-semibold text-[#f8f8f8] mb-3">Registrazione Staff</h1>
        <p className="text-lg leading-relaxed text-[#d4af37]/70 mb-8">Crea un account staff. Se esistono già utenti, questa operazione richiede autorizzazione.</p>

        {message && (
          <div className="mb-5 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 text-base text-[#d4af37]">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded-xl bg-[#0a0a0a] border border-[#d4af37]/12 p-4 text-xl text-[#f8f8f8] placeholder-[#d4af37]/40"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 caratteri)"
            className="w-full rounded-xl bg-[#0a0a0a] border border-[#d4af37]/12 p-4 text-xl text-[#f8f8f8] placeholder-[#d4af37]/40"
            minLength={8}
            required
          />

          <button type="submit" disabled={loading} className="btn-primary btn-lg w-full text-xl">
            {loading ? 'Registrazione...' : 'Registrati come Staff'}
          </button>
        </form>
      </div>
    </div>
  )
}
