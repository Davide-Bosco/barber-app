'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogIn } from 'lucide-react'

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
    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-block mb-4 text-5xl">🃏</div>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] bg-clip-text text-transparent uppercase tracking-tighter">
            Staff Access
          </h1>
          <p className="text-[#d41a1a] font-bold italic text-sm">Enter the Joker's Lair 😈</p>
        </div>

        {/* LOGIN CARD */}
        <div className="rounded-2xl border-2 border-[#8b0099]/50 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
          <p className="text-[#f8f8f8] text-center text-sm mb-6 font-bold">Gestisci appuntamenti e collaboratori con accesso privilegiato</p>

          {errorMessage && (
            <div className="mb-6 rounded-lg border-2 border-[#d41a1a]/50 bg-[#d41a1a]/15 p-4 text-[#f4e4c1] backdrop-blur-sm">
              <p className="font-black text-sm">⚠️ ERRORE</p>
              <p className="text-xs mt-1">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-[#d4af37] font-black text-xs uppercase tracking-widest mb-2">
                👤 Nome Utente
              </label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-lg border-2 border-[#8b0099]/40 bg-[#0a0a0a] px-4 py-3 text-[#f8f8f8] placeholder-[#8b0099]/40 focus:outline-none focus:border-[#d41a1a] transition-colors font-bold"
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[#d4af37] font-black text-xs uppercase tracking-widest mb-2">
                🔐 Codice Staff
              </label>
              <input
                type="password"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="w-full rounded-lg border-2 border-[#8b0099]/40 bg-[#0a0a0a] px-4 py-3 text-[#f8f8f8] placeholder-[#8b0099]/40 focus:outline-none focus:border-[#d41a1a] transition-colors font-bold"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] text-[#0a0a0a] font-black hover:shadow-lg hover:shadow-[#d41a1a]/50 hover:scale-105 transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} />
              {loading ? 'Accesso in corso...' : 'Entra nell\'area staff'}
            </button>
          </form>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#8b0099]/40 to-transparent my-6"></div>

          {/* Footer Text */}
          <p className="text-center text-[#8b0099]/60 text-xs font-bold">
            🃏 Staff-only area - Why so serious about security?
          </p>
        </div>
      </div>
    </div>
  )
}