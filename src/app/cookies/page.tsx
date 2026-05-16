'use client'
import Link from 'next/link'
import { ArrowLeft, Cookie } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f4e4c1] transition-colors mb-8 font-semibold group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Torna alla Home
        </Link>

        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-[#d4af37] to-[#f4e4c1] p-3 rounded-lg">
              <Cookie size={28} className="text-[#0a0a0a]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] bg-clip-text text-transparent">
              Informativa Cookies
            </h1>
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 md:p-10 backdrop-blur-sm space-y-6">
          
          <p className="text-[#f8f8f8] text-lg leading-relaxed">
            Utilizziamo i cookie per migliorare l'esperienza sul nostro sito. Scopri come gestiamo e utilizziamo i tuoi dati per personalizzare il tuo servizio.
          </p>

          {/* Cookies Types */}
          <div className="border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 to-[#0a0a0a]/50 rounded-xl p-6 backdrop-blur-sm">
            <p className="font-semibold text-[#d4af37] mb-4 flex items-center gap-2">
              <span className="text-xl">🍪</span>
              Tipi di Cookie Utilizzati
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-[#f4e4c1] font-semibold text-sm">🔐 Cookie Tecnici (Necessari)</p>
                <p className="text-[#f8f8f8]/80 text-sm mt-1">
                  Essenziali per il funzionamento del sito: autenticazione staff, sessioni, preferenze di navigazione
                </p>
              </div>
              <div className="border-t border-[#d4af37]/20 pt-3">
                <p className="text-[#f4e4c1] font-semibold text-sm">📊 Cookie Analitici (Opzionali)</p>
                <p className="text-[#f8f8f8]/80 text-sm mt-1">
                  Per misurare come utilizzi il sito e migliorare l'esperienza. Completamente opzionali e anonimizzati
                </p>
              </div>
              <div className="border-t border-[#d4af37]/20 pt-3">
                <p className="text-[#f4e4c1] font-semibold text-sm">⚙️ Cookie di Preferenza (Opzionali)</p>
                <p className="text-[#f8f8f8]/80 text-sm mt-1">
                  Per ricordare le tue scelte e preferenze durante le visite future
                </p>
              </div>
            </div>
          </div>

          {/* Consent Management */}
          <div className="border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 to-[#0a0a0a]/50 rounded-xl p-6 backdrop-blur-sm">
            <p className="font-semibold text-[#d4af37] mb-3 flex items-center gap-2">
              <span className="text-xl">✓</span>
              Gestione dei Tuoi Consensi
            </p>
            <p className="text-[#f8f8f8]/80 text-sm leading-relaxed">
              Puoi gestire le tue preferenze di cookie in qualsiasi momento cliccando sul pulsante "Le tue preferenze relative al consenso per le tecnologie di tracciamento" in fondo alla pagina. Iubenda ti offre un'interfaccia semplice e intuitiva.
            </p>
          </div>

          {/* Cookie Details */}
          <div className="border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 to-[#0a0a0a]/50 rounded-xl p-6 backdrop-blur-sm">
            <p className="font-semibold text-[#d4af37] mb-3 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Cookie Specifici Utilizzati
            </p>
            <ul className="text-[#f8f8f8]/80 text-sm space-y-2">
              <li>✓ <strong>barber_staff_session:</strong> Autenticazione staff (HTTP-only, secure)</li>
              <li>✓ <strong>Cookie iubenda:</strong> Gestione dei consensi (richiesto GDPR)</li>
              <li>✓ <strong>Session tracking:</strong> Tracciamento delle sessioni di prenotazione</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="border-t border-[#d4af37]/20 pt-6 text-center">
            <p className="text-[#d4af37]/60 text-sm mb-4">
              Hai dubbi su come utilizziamo i cookie? Contattaci!
            </p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] text-[#0a0a0a] font-semibold hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all duration-300"
            >
              Torna alla Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
