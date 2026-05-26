import { supabase } from './lib/supabase'
import Link from 'next/link'

type Barber = {
  id: number
  name: string
  service_price: number
}

export const revalidate = 60

export default async function Home() {
  let barbiere: Barber[] = []
  let errorMessage: string | null = null

  try {
    const { data, error } = await supabase.from('barbers').select('*')
    
    if (error) {
      console.error('Errore nel caricamento barbieri:', error)
      errorMessage = error.message
    } else {
      barbiere = data ?? []
    }
  } catch (err) {
    console.error('Errore imprevisto:', err)
    errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a]">
      
      {/* HERO SECTION PREMIUM */}
      <section className="relative overflow-hidden px-4 md:px-6 py-12 md:py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-10 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-semibold mb-3 bg-gradient-to-r from-[#d4af37] via-[#f4e4c1] to-[#d4af37] bg-clip-text text-transparent">
              joker's style
            </h1>
            <p className="text-base text-[#d4af37]/80 font-light tracking-wide">
              Prenota il tuo taglio con gli esperti del settore
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
              <div className="w-2 h-2 rounded-full bg-[#d4af37]/50"></div>
              <div className="w-2 h-2 rounded-full bg-[#d4af37]/30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-8 animate-fade-in-up">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 backdrop-blur-sm">
            ⚠️ Errore nel caricamento dei barbieri: {errorMessage}
          </div>
        </div>
      )}

      {/* BARBIERI CARDS */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-16">
        {barbiere.length === 0 && !errorMessage ? (
          <div className="rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#1a1a1a]/50 to-[#2a2a2a]/50 p-12 text-center backdrop-blur-sm">
            <p className="text-[#d4af37]/60 text-lg">✨ Nessun barbiere disponibile al momento. Torna presto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {barbiere.map((b, index) => (
              <div 
                key={b.id}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative rounded-xl border border-[#d4af37]/22 bg-gradient-to-br from-[#111111] via-[#151515] to-[#1f1f1f] p-3 md:p-4 backdrop-blur-sm group-hover:border-[#d4af37]/50 transition-all duration-400 group-hover:shadow-lg group-hover:shadow-[#d4af37]/12">
                  
                  {/* Avatar Circle */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e4c1] flex items-center justify-center group-hover:shadow-md transition-all duration-300">
                      <span className="text-xl font-semibold text-[#0a0a0a]">{b.name.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center mb-6">
                    <h2 className="text-base font-semibold mb-1 text-[#f8f8f8] group-hover:text-[#d4af37] transition-colors">
                      {b.name}
                    </h2>
                    <p className="text-[#d4af37]/70 text-sm">Taglio Professionale</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-6"></div>

                  {/* Price & Button */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-[#d4af37]/60 text-sm mb-1">PREZZO</p>
                      <p className="text-xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] bg-clip-text text-transparent">
                        €{b.service_price}
                      </p>
                    </div>

                    <Link 
                      href={`/book/${b.id}`}
                      className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] text-[#0a0a0a] font-semibold text-sm hover:shadow-md hover:shadow-[#d4af37]/20 hover:scale-103 transition-all duration-200 text-center"
                    >
                      Prenota Ora
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* INFO SECTION */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: 'Veloce', desc: 'Prenota in pochi secondi' },
            { icon: '✓', title: 'Sicuro', desc: 'Conferma immediata via WhatsApp' },
            { icon: '👑', title: 'Premium', desc: 'Servizi di qualità superiore' }
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-[#d4af37]/20 bg-gradient-to-br from-[#1a1a1a]/50 to-[#2a2a2a]/50 p-6 text-center backdrop-blur-sm hover:border-[#d4af37]/50 transition-all">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-bold text-[#f8f8f8] mb-2">{item.title}</h3>
              <p className="text-[#d4af37]/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}