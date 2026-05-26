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
            <div className="bg-gradient-to-br from-[#d4af37] to-[#f4e4c1] p-3 rounded-lg">
              <FileText size={28} className="text-[#0a0a0a]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#d4af37] via-[#f4e4c1] to-[#d4af37] bg-clip-text text-transparent tracking-tighter">
              Privacy Policy
            </h1>
          </div>
          <p className="text-[#d4af37] font-semibold">Privacy e trattamento dati — in linea con lo stile del sito</p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 md:p-8 backdrop-blur-sm space-y-6 hover:border-[#d4af37]/40 transition-colors">
          
          <p className="text-[#f8f8f8] text-lg leading-relaxed">
            La tua privacy è importante per noi. Consulta la nostra informativa completa sul trattamento dei dati personali e su come proteggiamo i tuoi dati. 🃏 Promessa del Joker: niente scherzi con i tuoi dati!
          </p>

          {/* Info Box 1 */}
          <div className="border border-[#d4af37]/12 bg-gradient-to-br from-[#d4af37]/8 to-[#0a0a0a]/50 rounded-xl p-4 backdrop-blur-sm hover:border-[#d4af37]/30 transition-colors">
            <p className="font-black text-[#d4af37] mb-3 flex items-center gap-2 uppercase tracking-widest">
              <span className="text-xl">📋</span>
              Documentazione Completa
            </p>
            <p className="text-[#f8f8f8]/80 text-sm leading-relaxed">
              Per i dettagli completi, consulta il nostro documento di privacy tramite il link nel footer della pagina oppure contattaci direttamente. Puoi anche accedere al centro di gestione dei consensi per le preferenze sui cookie.
            </p>
          </div>

          {/* Info Box 2 */}
          <div className="border border-[#d4af37]/12 bg-gradient-to-br from-[#d4af37]/8 to-[#0a0a0a]/50 rounded-xl p-4 backdrop-blur-sm hover:border-[#d4af37]/30 transition-colors">
            <p className="font-black text-[#d4af37] mb-3 flex items-center gap-2 uppercase tracking-widest">
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
          <div className="border border-[#d4af37]/12 bg-gradient-to-br from-[#d4af37]/8 to-[#0a0a0a]/50 rounded-xl p-4 backdrop-blur-sm hover:border-[#d4af37]/30 transition-colors">
            <p className="font-black text-[#d4af37] mb-3 flex items-center gap-2 uppercase tracking-widest">
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
          <div className="border-t border-[#d4af37]/12 pt-6 text-center">
            <p className="text-[#d4af37] text-sm mb-4 font-semibold">
              Per domande sulla tua privacy, contattaci pure!
            </p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] text-[#0a0a0a] font-semibold hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all duration-200 text-base"
            >
              Back to Joker's Style
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
