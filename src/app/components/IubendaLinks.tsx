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
    // Carica lo script iubenda una sola volta
    if (document.querySelector('script[src*="iubenda.js"]')) {
      return // Già caricato
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.iubenda.com/iubenda.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  // ID placeholder: sostituisci con il tuo ID Iubenda reale
  const iubendaProjectId = process.env.NEXT_PUBLIC_IUBENDA_PROJECT_ID || '29146288'

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
            href={`https://www.iubenda.com/privacy-policy/${iubendaProjectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition font-medium"
            title="Iubenda Privacy"
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
