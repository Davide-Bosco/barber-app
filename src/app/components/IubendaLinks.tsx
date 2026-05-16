'use client'

import Link from 'next/link'
import { useEffect } from 'react'

declare global {
  interface Window {
    iubendaOnReady?: () => void
  }
}

export default function IubendaLinks() {
  useEffect(() => {
    // Carica lo script Iubenda widget una sola volta
    if (document.querySelector('script[src*="embeds.iubenda.com"]')) {
      return // Già caricato
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://embeds.iubenda.com/widgets/8dadc10f-d3b6-417e-b81b-f21466e72c20.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <footer className="bg-gray-900 text-white p-6 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-6 text-center md:text-left">
        <div className="flex flex-wrap justify-center gap-6">
          <Link 
            href="/privacy"
            className="hover:text-gray-300 transition font-medium"
            title="Privacy Policy"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-500">|</span>
          <Link 
            href="/cookies"
            className="hover:text-gray-300 transition font-medium"
            title="Cookie Policy"
          >
            Cookie Policy
          </Link>
          <span className="text-gray-500">|</span>
          <a 
            href="https://www.iubenda.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition font-medium"
            title="Iubenda"
          >
            Iubenda
          </a>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs mt-4">
        <p>© {new Date().getFullYear()} Prenota il tuo taglio. Tutti i diritti riservati.</p>
      </div>
    </footer>
  )
}
