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
    <div className="mx-auto mt-14 max-w-lg px-4">
      <div className="card p-8 lg:p-10">
        <h1 className="mb-3 text-3xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] bg-clip-text text-transparent">
          Accesso Staff
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-[#d4af37]/70">Inserisci il codice staff per gestire appuntamenti e collaboratori.</p>
        <p className="mb-6 rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/8 px-4 py-3 text-base text-[#f8f8f8]/80">
          Il titolare può creare e gestire gli account staff dalla sezione Gestione dopo l&apos;accesso.
        </p>

        {errorMessage && (
          <div className="mb-5 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 text-base text-[#d4af37]">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-lg font-medium text-[#f8f8f8]">
            Nome utente
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#d4af37]/12 bg-[#0a0a0a] p-4 text-xl text-[#f8f8f8] placeholder-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]/60 transition-colors"
              autoComplete="username"
              required
            />
          </label>

          <label className="block text-lg font-medium text-[#f8f8f8]">
            Codice staff
            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#d4af37]/12 bg-[#0a0a0a] p-4 text-xl text-[#f8f8f8] placeholder-[#d4af37]/40 focus:outline-none focus:border-[#d4af37]/60 transition-colors"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-lg w-full text-xl"
          >
            {loading ? 'Accesso in corso...' : "Entra nell'area staff"}
          </button>
        </form>
      </div>
    </div>
  )
}