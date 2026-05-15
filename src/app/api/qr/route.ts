import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://barber.app'
    const homeUrl = siteUrl
    
    // Usa QR Server API per generare il QR code come immagine
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(homeUrl)}`
    
    const response = await fetch(qrUrl)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Errore generazione QR' }, { status: 500 })
    }
    
    const buffer = await response.arrayBuffer()
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="barber-qr.png"',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Errore' }, { status: 500 })
  }
}
