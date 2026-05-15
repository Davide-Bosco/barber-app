'use client'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-semibold">
        <ArrowLeft size={20} />
        Torna alla Home
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={28} className="text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Informativa Privacy</h1>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-4 mb-8">
          <p>
            La tua privacy è importante per noi. Consulta la nostra informativa completa sul trattamento dei dati personali.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 my-4">
            <p className="font-semibold text-blue-900 mb-2">📋 Documentazione completa</p>
            <p className="text-sm text-blue-800">
              Per i dettagli completi, consulta il nostro documento di privacy tramite il link nel footer della pagina oppure contattaci direttamente.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 my-4">
            <p className="font-semibold text-gray-900 mb-2">⚙️ Come configurare</p>
            <p className="text-sm text-gray-700 mb-2">
              Se sei il proprietario di questo sito:
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Accedi a <a href="https://www.iubenda.com" className="text-blue-600 hover:underline">iubenda.com</a></li>
              <li>Crea un progetto per il tuo sito</li>
              <li>Copia l'ID del tuo progetto</li>
              <li>Aggiorna il componente <code className="bg-gray-200 px-2 py-1 rounded text-xs">IubendaLinks</code> con il tuo ID</li>
            </ol>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Questa è una pagina placeholder. Il documento completo di privacy è accessibile tramite il link nel footer.
          </p>
        </div>
      </div>
    </div>
  )
}
