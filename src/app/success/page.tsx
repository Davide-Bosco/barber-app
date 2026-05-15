'use client'
import Link from 'next/link'
import { CheckCircle, Calendar, MessageSquare } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle size={60} className="text-green-600 animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prenotato!</h1>
        <p className="text-gray-500 mb-8">
          La tua prenotazione è stata registrata con successo. 
          Ti abbiamo inviato un riepilogo su WhatsApp.
        </p>

        <div className="space-y-4 mb-8 text-left">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
            <Calendar className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-800">Controlla l'orario</p>
              <p className="text-sm text-gray-500">Puoi vederlo nel messaggio ricevuto.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
            <MessageSquare className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-800">Promemoria attivo</p>
              <p className="text-sm text-gray-500">Ti scriveremo di nuovo il giorno del taglio.</p>
            </div>
          </div>
        </div>

        <Link 
          href="/"
          className="block w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition shadow-lg"
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  )
}