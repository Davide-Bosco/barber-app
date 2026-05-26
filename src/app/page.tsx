import { supabase } from './lib/supabase'
import Link from 'next/link'
import { Star, Clock, ShieldCheck } from 'lucide-react'
import BarberCard from './components/BarberCard'

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
      <section className="relative overflow-hidden px-6 md:px-8 py-14 md:py-18">
        <div className="absolute inset-0 opacity-12">
          <div className="absolute top-12 right-16 w-72 h-72 bg-[#d4af37]/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-12 left-16 w-72 h-72 bg-[#d4af37]/6 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#d4af37] via-[#f4e4c1] to-[#d4af37] bg-clip-text text-transparent leading-tight">
              joker's style
            </h1>
            <p className="text-sm md:text-base text-[#d4af37]/80 font-light tracking-wide max-w-2xl mx-auto">
              Prenota il tuo taglio con gli esperti del settore
            </p>
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
      <section className="max-w-6xl mx-auto px-6 md:px-8 pb-16">
        {barbiere.length === 0 && !errorMessage ? (
          <div className="rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#1a1a1a]/50 to-[#2a2a2a]/50 p-12 text-center backdrop-blur-sm">
            <p className="text-[#d4af37]/60 text-lg">✨ Nessun barbiere disponibile al momento. Torna presto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {barbiere.map((b, index) => (
              <div key={b.id} className={`animate-fade-in-up ${index === 0 ? 'ml-6 md:ml-8 lg:ml-0' : ''}`}>
                <BarberCard id={b.id} name={b.name} price={b.service_price} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info section removed per design request */}
    </div>
  )
}