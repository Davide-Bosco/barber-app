'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function StaffLoginPage() {
  const [code, setCode] = useState('')
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
        body: JSON.stringify({ code }),
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
    <div className="mx-auto mt-14 max-w-md rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold">Accesso staff</h1>
      <p className="mb-6 text-sm text-gray-600">Inserisci il codice staff per gestire appuntamenti e collaboratori.</p>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          Codice staff
          <input
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="mt-1 w-full rounded-lg border p-3"
            autoComplete="current-password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black p-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Accesso in corso...' : 'Entra nell\'area staff'}
        </button>
      </form>
    </div>
  )
}