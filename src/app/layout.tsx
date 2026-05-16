import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Link from "next/link";
import { Home, CalendarDays, Users, Scissors } from "lucide-react";
import IubendaLinks from "./components/IubendaLinks";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import { isStaffCookieValue, STAFF_COOKIE_NAME, getStaffUsernameFromCookie } from "@/app/lib/staffAuth";

const inter = Inter({ subsets: ["latin"] });

// Questi sono i metadati per la SEO e per il nome della PWA
export const metadata: Metadata = {
  title: "Barber Booking",
  description: "Prenota il tuo taglio velocemente",
  manifest: "/manifest.json", // Servirà per la PWA nel prossimo step!
  applicationName: "Barber Booking",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Barber Booking",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const isStaff = isStaffCookieValue(cookieStore.get(STAFF_COOKIE_NAME)?.value)
  const staffUsername = getStaffUsernameFromCookie(cookieStore.get(STAFF_COOKIE_NAME)?.value)

  return (
    <html lang="it">
      <body className={inter.className}>
        
        {/* PREMIUM NAVBAR - JOKER'S STYLE */}
        <nav className="sticky top-0 z-50 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] border-b border-[#8b0099]/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
            
            {/* Logo - Joker Card */}
            <Link href="/" className="group flex items-center gap-3 hover:opacity-80 transition animate-card-flip">
              <div className="bg-gradient-to-br from-[#8b0099] via-[#d41a1a] to-[#d4af37] p-2 rounded-lg relative overflow-hidden animate-joker-pulse">
                <span className="text-2xl font-black">🃏</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-widest bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] bg-clip-text text-transparent">
                  JOKER'S STYLE
                </span>
                <span className="text-xs text-[#d41a1a]/80 font-bold">LAUGH's BARBERSHOP</span>
              </div>
            </Link>

            {/* Menu Navigazione */}
            <div className="flex gap-6 md:gap-8 items-center">
              <Link href="/" className="flex items-center gap-2 text-[#f8f8f8] hover:text-[#d41a1a] transition-colors duration-300 font-bold uppercase text-sm">
                <Home size={20} /> <span className="hidden sm:inline">Prenota</span>
              </Link>

              {isStaff ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 text-[#f8f8f8] hover:text-[#8b0099] transition-colors duration-300 font-bold uppercase text-sm">
                    <CalendarDays size={20} /> <span className="hidden sm:inline">Appuntamenti</span>
                  </Link>

                  <Link href="/admin" className="flex items-center gap-2 text-[#f8f8f8] hover:text-[#8b0099] transition-colors duration-300 font-bold uppercase text-sm">
                    <Users size={20} /> <span className="hidden sm:inline">Gestione</span>
                  </Link>

                  <div className="flex items-center gap-4 border-l border-[#8b0099]/20 pl-4">
                    {staffUsername && <span className="hidden sm:inline text-sm text-[#d41a1a] font-bold">😈 {staffUsername}</span>}
                    <form action="/api/staff/logout" method="post">
                      <button type="submit" className="cursor-pointer text-[#f8f8f8] hover:text-[#d41a1a] transition-colors duration-300 font-bold uppercase text-sm">
                        Esci
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <Link href="/staff-login" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#8b0099] via-[#d41a1a] to-[#d4af37] text-[#0a0a0a] hover:shadow-lg hover:shadow-[#d41a1a]/50 transition-all duration-300 font-black text-sm uppercase">
                  <Users size={18} /> <span className="hidden sm:inline">Staff</span>
                </Link>
              )}
            </div>

          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a] pb-20">
          {children}
        </main>

        <PwaInstallPrompt />

        {/* PREMIUM FOOTER */}
        <IubendaLinks />
      </body>
    </html>
  );
}