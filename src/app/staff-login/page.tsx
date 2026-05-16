'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function StaffLoginPage() {
  const [code, setCode] = useState('')
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()

  const nextPath = params.get('next') || '/dashboard'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, username }),
      })

      const payload = await response.json()
      if (!response.ok) {
        setErrorMessage(payload.error ?? 'Impossibile accedere all\'area staff.')
        setLoading(false)
        return
      }

      router.replace(nextPath)
      router.refresh()
    } catch {
      setErrorMessage('Errore di rete. Riprova tra pochi secondi.')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-14 max-w-md rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 backdrop-blur-sm">
      <h1 className="mb-2 text-2xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] bg-clip-text text-transparent">
        Accesso Staff
      </h1>
      <p className="mb-6 text-sm text-[#d4af37]/60">Inserisci il codice staff per gestire appuntamenti e collaboratori.</p>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 p-3 text-sm text-[#d4af37] backdrop-blur-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-[#f8f8f8]">
          Nome utente
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d4af37]/20 bg-[#0a0a0a] p-3 text-[#f8f8f8] placeholder-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]/60 transition-colors"
            autoComplete="username"
            required
          />
        </label>

        <label className="block text-sm font-medium text-[#f8f8f8]">
          Codice staff
          <input
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d4af37]/20 bg-[#0a0a0a] p-3 text-[#f8f8f8] placeholder-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]/60 transition-colors"
            autoComplete="current-password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] p-3 font-semibold text-[#0a0a0a] transition hover:shadow-lg hover:shadow-[#d4af37]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Accesso in corso...' : 'Entra nell\'area staff'}
        </button>
      </form>
    </div>
  )
}