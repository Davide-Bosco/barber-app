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
    <div className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-lg rounded-2xl border-2 border-[#d4af37]/40 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 shadow-2xl shadow-[#d4af37]/20 backdrop-blur-sm">
      {shouldShowAndroidInstall && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce">📱</div>
              <div>
                <p className="text-lg font-bold text-[#d4af37]">Installa l'App</p>
                <p className="text-xs text-[#d4af37]/60 font-semibold">Accesso Premium</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setClosed(true)}
              className="p-2 rounded-lg hover:bg-[#d4af37]/10 transition"
            >
              <X size={20} className="text-[#d4af37]" />
            </button>
          </div>
          
          <p className="text-sm text-[#f8f8f8] mb-5 leading-relaxed font-medium">
            Installa Il Tuo Barbiere come app sul tuo telefono per accesso più veloce e un'esperienza premium!
          </p>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={installApp}
              className="flex-1 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] px-4 py-3 text-[#0a0a0a] text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#d4af37]/40 transition-all"
            >
              <Download size={18} />
              Installa Ora
            </button>
            <button
              type="button"
              onClick={() => setClosed(true)}
              className="flex-1 rounded-lg border-2 border-[#d4af37]/40 px-4 py-3 text-[#d4af37] text-sm font-bold hover:border-[#d4af37]/80 transition-colors hover:bg-[#d4af37]/5"
            >
              Dopo
            </button>
          </div>
        </div>
      )}

      {shouldShowIosHint && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce">📱</div>
              <div>
                <p className="text-lg font-bold text-[#d4af37]">Aggiungi alla Home</p>
                <p className="text-xs text-[#d4af37]/60 font-semibold">Safari iOS</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setClosed(true)}
              className="p-2 rounded-lg hover:bg-[#d4af37]/10 transition"
            >
              <X size={20} className="text-[#d4af37]" />
            </button>
          </div>
          
          <p className="text-sm text-[#f8f8f8] mb-5 leading-relaxed font-medium">
            Su Safari: tocca <strong>Condividi</strong> in basso, poi <strong>Aggiungi a Home</strong> per accesso istantaneo!
          </p>
          
          <button
            type="button"
            onClick={() => setClosed(true)}
            className="w-full rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] px-4 py-3 text-[#0a0a0a] text-sm font-bold hover:shadow-lg hover:shadow-[#d4af37]/40 transition-all"
          >
            Ho capito ✓
          </button>
        </div>
      )}
    </div>
  )
}