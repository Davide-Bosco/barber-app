'use client'

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

  return (
    <footer className="bg-gray-900 text-white p-6 mt-10">
      <div className="max-w-6xl mx-auto flex justify-center gap-6">
        <a 
          href="https://www.iubenda.com/privacy-policy/29146288" 
          className="iubenda-white iubenda-noiframe iubenda-embed hover:text-gray-300 transition"
          title="Privacy Policy"
        >
          Privacy Policy
        </a>
        <span className="text-gray-500">|</span>
        <a 
          href="https://www.iubenda.com/privacy-policy/29146288/cookie-policy" 
          className="iubenda-white iubenda-noiframe iubenda-embed hover:text-gray-300 transition"
          title="Cookie Policy"
        >
          Cookie Policy
        </a>
      </div>
    </footer>
  )
}
