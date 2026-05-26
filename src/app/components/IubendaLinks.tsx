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
    <footer className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-t border-[#d4af37]/20 text-[#f8f8f8] p-8 md:p-12 mt-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Links Section */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-8 text-center md:text-left">
          <Link 
            href="/privacy"
            className="text-[#d4af37] hover:text-[#f4e4c1] transition-colors duration-300 font-medium"
            title="Privacy Policy"
          >
            Privacy Policy
          </Link>
          
          <span className="text-[#d4af37]/30">•</span>
          
          <Link 
            href="/cookies"
            className="text-[#d4af37] hover:text-[#f4e4c1] transition-colors duration-300 font-medium"
            title="Cookie Policy"
          >
            Cookie Policy
          </Link>
          
          <span className="text-[#d4af37]/30">•</span>
          
          <a 
            href="https://www.iubenda.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d4af37] hover:text-[#f4e4c1] transition-colors duration-300 font-medium"
            title="Iubenda"
          >
            Iubenda
          </a>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-8"></div>

        {/* Copyright */}
        <div className="text-center text-[#d4af37]/60 text-sm">
          <p>© {new Date().getFullYear()} Joker's Style. Tutti i diritti riservati.</p>
          <p className="mt-2 text-xs text-[#d4af37]/40">Crafted with ✨ for your premium barbershop experience</p>
        </div>
      </div>
    </footer>
  )
}
