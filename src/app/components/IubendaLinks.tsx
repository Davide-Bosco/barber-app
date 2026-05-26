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
    // Iubenda widget removed per design - no external scripts
  }, [])

  return (
    <footer className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-t border-[#d4af37]/20 text-[#f8f8f8] p-8 md:p-12 mt-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Links Section - only privacy & cookies as requested */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-6 text-center">
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
        </div>

        {/* Copyright only */}
        <div className="text-center text-[#d4af37]/60 text-sm">
          <p>© {new Date().getFullYear()} Joker's Style. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
