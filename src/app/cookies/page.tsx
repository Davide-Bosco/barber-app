'use client'
import Link from 'next/link'
import { ArrowLeft, Cookie } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-semibold">
        <ArrowLeft size={20} />
        Torna alla Home
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Cookie size={28} className="text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Informativa Cookies</h1>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-4 mb-8">
          <p>
            Utilizziamo i cookie per migliorare l'esperienza sul nostro sito. Scopri come gestiamo e utilizziamo i tuoi dati.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 my-4">
            <p className="font-semibold text-purple-900 mb-2">🍪 Tipi di cookie utilizzati</p>
            <ul className="text-sm text-purple-800 space-y-1">
              <li><strong>Tecnici:</strong> Necessari per il funzionamento del sito (autenticazione staff, sessioni)</li>
              <li><strong>Analitici:</strong> Per misurare l'uso del sito (opzionali)</li>
              <li><strong>Preferenze:</strong> Per ricordare le tue scelte</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 my-4">
            <p className="font-semibold text-gray-900 mb-2">⚙️ Come configurare</p>
            <p className="text-sm text-gray-700 mb-2">
              Se sei il proprietario di questo sito:
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Accedi a <a href="https://www.iubenda.com" className="text-blue-600 hover:underline">iubenda.com</a></li>
              <li>Crea un progetto per il tuo sito</li>
              <li>Configura i tuoi cookie</li>
              <li>Genera l'ID del progetto e aggiorna il componente <code className="bg-gray-200 px-2 py-1 rounded text-xs">IubendaLinks</code></li>
            </ol>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Questa è una pagina placeholder. La policy completa sui cookie è accessibile tramite il link nel footer.
          </p>
        </div>
      </div>
    </div>
  )
}
