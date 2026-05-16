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
      
      {/* HERO SECTION JOKER'S STYLE */}
      <section className="relative overflow-hidden px-4 md:px-6 py-16 md:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#8b0099]/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#d41a1a]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl transform -translate-x-1/2"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-block mb-4 text-6xl animate-bounce">🃏</div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] bg-clip-text text-transparent uppercase tracking-tighter">
              JOKER'S STYLE
            </h1>
            <p className="text-2xl text-[#d41a1a] font-black uppercase tracking-widest mb-2">
              Laugh's Barbershop
            </p>
            <p className="text-lg text-[#d4af37]/90 font-bold italic">
              "Why so serious? Get your cut and smile!" 😈
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8b0099]"></div>
              <div className="w-3 h-3 rounded-full bg-[#d41a1a]"></div>
              <div className="w-3 h-3 rounded-full bg-[#d4af37]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-8 animate-fade-in-up">
          <div className="rounded-xl border border-red-500/50 bg-gradient-to-br from-[#d41a1a]/20 to-[#8b0099]/10 p-4 text-[#f4e4c1] backdrop-blur-sm font-bold">
            ⚠️ OOPS! Errore nel caricamento dei barbieri: {errorMessage}
          </div>
        </div>
      )}

      {/* BARBIERI CARDS - JOKER'S CREW */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="mb-8 text-center">
          <p className="text-[#d41a1a] font-black uppercase text-sm tracking-widest">OUR CREW</p>
          <h2 className="text-3xl font-black text-[#f8f8f8] mt-2">Meet The Gang 😈</h2>
        </div>
        
        {barbiere.length === 0 && !errorMessage ? (
          <div className="rounded-2xl border-2 border-[#8b0099]/40 bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/80 p-12 text-center backdrop-blur-sm">
            <p className="text-[#d41a1a] text-lg font-black">🃏 NO LAUGHS TODAY... COME BACK LATER!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbiere.map((b, index) => (
              <div 
                key={b.id}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8b0099]/20 via-[#d41a1a]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-joker-pulse"></div>
                
                <div className="relative rounded-2xl border-2 border-[#8b0099]/50 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#2a2a2a] p-6 md:p-8 backdrop-blur-sm group-hover:border-[#d41a1a] transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#d41a1a]/40">
                  
                  {/* Avatar - Joker Colors */}
                  <div className="mb-6 flex justify-center relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8b0099] via-[#d41a1a] to-[#d4af37] flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#d41a1a]/70 transition-all duration-500 animate-joker-pulse">
                      <span className="text-4xl font-black text-[#f8f8f8]">{b.name.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black mb-2 text-[#f8f8f8] group-hover:text-[#d41a1a] transition-colors uppercase tracking-wide">
                      {b.name}
                    </h2>
                    <p className="text-[#8b0099] font-black uppercase text-xs tracking-widest">Professional Cut Master</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#8b0099]/50 to-transparent mb-6"></div>

                  {/* Price & Button */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-[#d41a1a]/70 text-xs font-black uppercase mb-1">💰 PRICE</p>
                      <p className="text-4xl font-black bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] bg-clip-text text-transparent">
                        €{b.service_price}
                      </p>
                    </div>

                    <Link 
                      href={`/book/${b.id}`}
                      className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] text-[#0a0a0a] font-black hover:shadow-2xl hover:shadow-[#d41a1a]/60 hover:scale-105 transition-all duration-300 text-center uppercase tracking-widest text-sm"
                    >
                      🃏 BOOK NOW
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* INFO SECTION - JOKER'S PROMISES */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="mb-8 text-center">
          <p className="text-[#d41a1a] font-black uppercase text-sm tracking-widest">WHY CHOOSE US?</p>
          <h2 className="text-3xl font-black text-[#f8f8f8] mt-2">The Joker's Promise 🎭</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: 'LIGHTNING FAST', desc: 'Book in seconds, laugh in hours' },
            { icon: '🃏', title: 'THE BEST CARD', desc: 'Premium service, always a wild card' },
            { icon: '😈', title: 'PURE CHAOS', desc: 'Unpredictable vibes, perfect cuts' }
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border-2 border-[#8b0099]/40 bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/80 p-6 text-center backdrop-blur-sm hover:border-[#d41a1a] transition-all group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-lg font-black text-[#f8f8f8] mb-2 uppercase">{item.title}</h3>
              <p className="text-[#d4af37] text-sm font-bold italic">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}