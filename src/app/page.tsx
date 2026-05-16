import { supabase } from './lib/supabase'
import Link from 'next/link'

type Barber = {
  id: number
  name: string
  service_price: number
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  let barbiere: Barber[] = []
  let errorMessage: string | null = null

  try {
    // Fetch barbers data on the server
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
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Prenota il tuo taglio</h1>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Errore nel caricamento dei barbieri: {errorMessage}
        </div>
      )}
      
      <div className="grid gap-4">
        {barbiere.length === 0 && !errorMessage ? (
          <div className="p-4 rounded-lg border bg-white text-gray-600">Nessun barbiere disponibile.</div>
        ) : (
          barbiere.map((b) => (
          <div key={b.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center bg-white">
            <div>
              <h2 className="text-xl font-semibold">{b.name}</h2>
              <p className="text-gray-500 text-sm mt-1">Taglio professionale</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">€{b.service_price}</span>
              <Link 
                href={`/book/${b.id}`}
                className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Prenota
              </Link>
            </div>
          </div>
          ))
        )}
      </div>
    </main>
  )
}