'use client'
import { Download, Share2 } from 'lucide-react'

export default function QRPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || typeof window !== 'undefined' ? window.location.origin : 'https://barber.app'
  const homeUrl = siteUrl
  
  // QR Server API (free, no auth needed)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(homeUrl)}`

  async function downloadQR() {
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'barbershop-qr.png'
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Errore download QR:', error)
      alert('Errore nel download del QR code')
    }
  }

  async function shareQR() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Prenota il tuo taglio',
          text: 'Scansiona il QR per prenotare',
          url: homeUrl,
        })
      } else {
        // Fallback: copia URL negli appunti
        await navigator.clipboard.writeText(homeUrl)
        alert('Link copiato negli appunti!')
      }
    } catch (error) {
      console.error('Errore share:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prenota il tuo taglio</h1>
        <p className="text-gray-500 mb-8">Scansiona il QR o clicca il link qui sotto</p>

        {/* QR Code */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-4 rounded-2xl border-4 border-black shadow-lg">
            <img 
              src={qrUrl} 
              alt="QR code prenotazioni" 
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Link diretto */}
        <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-200 break-all">
          <p className="text-xs text-gray-500 mb-2">O visita direttamente:</p>
          <a 
            href={homeUrl} 
            className="text-blue-600 font-semibold hover:underline text-sm md:text-base"
          >
            {homeUrl}
          </a>
        </div>

        {/* Azioni */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadQR}
            className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-2xl font-semibold hover:bg-gray-800 transition"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Scarica</span>
          </button>
          <button
            onClick={shareQR}
            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-900 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">Condividi</span>
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-400 mt-6">
          Questo link puoi condividerlo su Instagram, WhatsApp o stamparlo in negozio.
        </p>
      </div>
    </div>
  )
}
