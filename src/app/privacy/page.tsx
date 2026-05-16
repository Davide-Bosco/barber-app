'use client'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function PrivacyPage() {
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
              <FileText size={28} className="text-[#f8f8f8]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] bg-clip-text text-transparent uppercase tracking-tighter">
              Privacy Policy
            </h1>
          </div>
          <p className="text-[#d4af37] font-bold italic">🃏 Joker's Code of Conduct</p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border-2 border-[#8b0099]/50 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 md:p-10 backdrop-blur-sm space-y-6 hover:border-[#d41a1a] transition-colors">
          
          <p className="text-[#f8f8f8] text-lg leading-relaxed">
            La tua privacy è importante per noi. Consulta la nostra informativa completa sul trattamento dei dati personali e su come proteggiamo i tuoi dati. 🃏 Promessa del Joker: niente scherzi con i tuoi dati!
          </p>

          {/* Info Box 1 */}
          <div className="border-2 border-[#8b0099]/40 bg-gradient-to-br from-[#8b0099]/15 to-[#0a0a0a]/50 rounded-xl p-6 backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
            <p className="font-black text-[#d41a1a] mb-3 flex items-center gap-2 uppercase tracking-widest">
              <span className="text-xl">📋</span>
              Documentazione Completa
            </p>
            <p className="text-[#f8f8f8]/80 text-sm leading-relaxed">
              Per i dettagli completi, consulta il nostro documento di privacy tramite il link nel footer della pagina oppure contattaci direttamente. Puoi anche accedere al centro di gestione dei consensi per le preferenze sui cookie.
            </p>
          </div>

          {/* Info Box 2 */}
          <div className="border-2 border-[#8b0099]/40 bg-gradient-to-br from-[#8b0099]/15 to-[#0a0a0a]/50 rounded-xl p-6 backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
            <p className="font-black text-[#d41a1a] mb-3 flex items-center gap-2 uppercase tracking-widest">
              <span className="text-xl">⚙️</span>
              Dati che Raccogliamo
            </p>
            <ul className="text-[#f8f8f8]/80 text-sm space-y-2">
              <li>🃏 Nome e cognome (per la prenotazione)</li>
              <li>🃏 Numero di telefono (per WhatsApp)</li>
              <li>🃏 Dati di prenotazione (data e ora del taglio)</li>
              <li>🃏 Cookie di sessione (per l'autenticazione staff)</li>
            </ul>
          </div>

          {/* Info Box 3 */}
          <div className="border-2 border-[#8b0099]/40 bg-gradient-to-br from-[#8b0099]/15 to-[#0a0a0a]/50 rounded-xl p-6 backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
            <p className="font-black text-[#d41a1a] mb-3 flex items-center gap-2 uppercase tracking-widest">
              <span className="text-xl">🔒</span>
              I Tuoi Diritti
            </p>
            <p className="text-[#f8f8f8]/80 text-sm mb-3">
              In qualità di utente, hai il diritto di:
            </p>
            <ul className="text-[#f8f8f8]/80 text-sm space-y-2">
              <li>🃏 Accedere ai tuoi dati personali</li>
              <li>🃏 Richiedere la rettifica dei dati</li>
              <li>🃏 Richiedere l'eliminazione dei dati</li>
              <li>🃏 Opporti al trattamento dei dati</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="border-t-2 border-[#8b0099]/40 pt-6 text-center">
            <p className="text-[#d4af37] text-sm mb-4 font-black">
              Per domande sulla tua privacy, contattaci pure! 🃏
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
