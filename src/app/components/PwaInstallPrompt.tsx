'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIos] = useState(() => {
    if (typeof window === 'undefined') return false
    const ua = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(ua)
  })
  const [isStandalone] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    )
  })
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  }, [])

  const shouldShowIosHint = useMemo(() => isIos && !isStandalone, [isIos, isStandalone])
  const shouldShowAndroidInstall = useMemo(() => Boolean(deferredPrompt) && !isStandalone, [deferredPrompt, isStandalone])

  if (closed || (!shouldShowIosHint && !shouldShowAndroidInstall)) {
    return null
  }

  async function installApp() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setClosed(true)
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-2xl border-2 border-[#8b0099]/50 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-5 shadow-2xl shadow-[#d41a1a]/30 backdrop-blur-sm hover:border-[#d41a1a] transition-colors">
      {shouldShowAndroidInstall && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl">📱</div>
              <p className="text-sm font-black text-[#d4af37] uppercase tracking-widest">Installa App</p>
            </div>
            <button
              type="button"
              onClick={() => setClosed(true)}
              className="p-1 rounded hover:bg-[#8b0099]/20 transition"
            >
              <X size={16} className="text-[#8b0099]" />
            </button>
          </div>
          
          <p className="text-xs text-[#f8f8f8]/80 mb-4 leading-relaxed">
            Installa Joker's Style come app sul tuo telefono per accesso più veloce! 🃏
          </p>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={installApp}
              className="flex-1 rounded-lg bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] px-3 py-2 text-[#0a0a0a] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-[#d41a1a]/50 transition-all"
            >
              <Download size={14} />
              Installa
            </button>
            <button
              type="button"
              onClick={() => setClosed(true)}
              className="flex-1 rounded-lg border-2 border-[#8b0099]/40 px-3 py-2 text-[#d4af37] text-xs font-black uppercase tracking-widest hover:border-[#d41a1a] transition-colors"
            >
              Dopo
            </button>
          </div>
        </div>
      )}

      {shouldShowIosHint && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl">📱</div>
              <p className="text-sm font-black text-[#d4af37] uppercase tracking-widest">Aggiungi alla Home</p>
            </div>
            <button
              type="button"
              onClick={() => setClosed(true)}
              className="p-1 rounded hover:bg-[#8b0099]/20 transition"
            >
              <X size={16} className="text-[#8b0099]" />
            </button>
          </div>
          
          <p className="text-xs text-[#f8f8f8]/80 mb-4 leading-relaxed">
            Su Safari: tocca <strong>Condividi</strong> e poi <strong>Aggiungi a Home</strong> per accesso istantaneo! 🃏
          </p>
          
          <button
            type="button"
            onClick={() => setClosed(true)}
            className="w-full rounded-lg bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] px-3 py-2 text-[#0a0a0a] text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-[#d41a1a]/50 transition-all"
          >
            Ho capito! ✓
          </button>
        </div>
      )}
    </div>
  )
}