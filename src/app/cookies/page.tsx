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
            <div className="bg-gradient-to-br from-[#8b0099] via-[#d41a1a] to-[#d4af37] p-3 rounded-lg animate-joker-pulse">
              <Cookie size={28} className="text-[#f8f8f8]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] bg-clip-text text-transparent uppercase tracking-tighter">
              Cookie Policy
            </h1>
          </div>
          <p className="text-[#d41a1a] font-bold italic">🃏 How We Track Your Laughs</p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border-2 border-[#8b0099]/50 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 md:p-10 backdrop-blur-sm space-y-6 hover:border-[#d41a1a] transition-colors">
          
          <p className="text-[#f8f8f8] text-lg leading-relaxed">
            Utilizziamo i cookie per migliorare l'esperienza sul nostro sito. Scopri come gestiamo e utilizziamo i tuoi dati per personalizzare il tuo servizio. 🃏
          </p>

          {/* Cookies Types */}
          <div className="border-2 border-[#8b0099]/40 bg-gradient-to-br from-[#8b0099]/15 to-[#0a0a0a]/50 rounded-xl p-6 backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
            <p className="font-black text-[#d41a1a] mb-4 flex items-center gap-2 uppercase tracking-widest">
              <span className="text-xl">🍪</span>
              Tipi di Cookie Utilizzati
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-[#d4af37] font-black text-sm uppercase">🔐 COOKIE TECNICI (NECESSARI)</p>
                <p className="text-[#f8f8f8]/80 text-sm mt-1">
                  Essenziali per il funzionamento del sito: autenticazione staff, sessioni, preferenze di navigazione
                </p>
              </div>
              <div className="border-t border-[#8b0099]/20 pt-3">
                <p className="text-[#d4af37] font-black text-sm uppercase">📊 COOKIE ANALITICI (OPZIONALI)</p>
                <p className="text-[#f8f8f8]/80 text-sm mt-1">
                  Per misurare come utilizzi il sito e migliorare l'esperienza. Completamente opzionali e anonimizzati
                </p>
              </div>
              <div className="border-t border-[#8b0099]/20 pt-3">
                <p className="text-[#d4af37] font-black text-sm uppercase">⚙️ COOKIE DI PREFERENZA (OPZIONALI)</p>
                <p className="text-[#f8f8f8]/80 text-sm mt-1">
                  Per ricordare le tue scelte e preferenze durante le visite future
                </p>
              </div>
            </div>
          </div>

          {/* Consent Management */}
          <div className="border-2 border-[#8b0099]/40 bg-gradient-to-br from-[#8b0099]/15 to-[#0a0a0a]/50 rounded-xl p-6 backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
            <p className="font-black text-[#d41a1a] mb-3 flex items-center gap-2 uppercase tracking-widest">
              <span className="text-xl">✓</span>
              Gestione dei Tuoi Consensi
            </p>
            <p className="text-[#f8f8f8]/80 text-sm leading-relaxed">
              Puoi gestire le tue preferenze di cookie in qualsiasi momento cliccando sul pulsante "Le tue preferenze relative al consenso per le tecnologie di tracciamento" in fondo alla pagina. Iubenda ti offre un'interfaccia semplice e intuitiva. 🃏
            </p>
          </div>

          {/* Cookie Details */}
          <div className="border-2 border-[#8b0099]/40 bg-gradient-to-br from-[#8b0099]/15 to-[#0a0a0a]/50 rounded-xl p-6 backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
            <p className="font-black text-[#d41a1a] mb-3 flex items-center gap-2 uppercase tracking-widest">
              <span className="text-xl">📋</span>
              Cookie Specifici Utilizzati
            </p>
            <ul className="text-[#f8f8f8]/80 text-sm space-y-2">
              <li>🃏 <strong>barber_staff_session:</strong> Autenticazione staff (HTTP-only, secure)</li>
              <li>🃏 <strong>Cookie iubenda:</strong> Gestione dei consensi (richiesto GDPR)</li>
              <li>🃏 <strong>Session tracking:</strong> Tracciamento delle sessioni di prenotazione</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="border-t-2 border-[#8b0099]/40 pt-6 text-center">
            <p className="text-[#d4af37] text-sm mb-4 font-black">
              Hai dubbi su come utilizziamo i cookie? Contattaci! 🃏
            </p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] text-[#0a0a0a] font-black hover:shadow-lg hover:shadow-[#d41a1a]/50 transition-all duration-300 uppercase tracking-widest"
            >
              Back to Joker's Style
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
