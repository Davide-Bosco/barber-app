'use client'

import { useEffect, useMemo, useState } from 'react'

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
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-xl border border-black/10 bg-white/95 p-4 shadow-xl backdrop-blur">
      {shouldShowAndroidInstall && (
        <div>
          <p className="text-sm font-semibold">Installa l&apos;app Barber Booking</p>
          <p className="mt-1 text-xs text-gray-600">Per aprirla piu velocemente dal telefono, installala come app.</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={installApp}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Installa
            </button>
            <button
              type="button"
              onClick={() => setClosed(true)}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Dopo
            </button>
          </div>
        </div>
      )}

      {shouldShowIosHint && (
        <div>
          <p className="text-sm font-semibold">Aggiungi alla schermata Home</p>
          <p className="mt-1 text-xs text-gray-600">Su iPhone: apri Condividi in Safari e tocca Aggiungi a Home.</p>
          <button
            type="button"
            onClick={() => setClosed(true)}
            className="mt-3 rounded-lg border px-4 py-2 text-sm"
          >
            Ho capito
          </button>
        </div>
      )}
    </div>
  )
}