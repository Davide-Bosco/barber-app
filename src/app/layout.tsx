import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Link from "next/link";
import { Home, CalendarDays, Users, Scissors } from "lucide-react";
import IubendaLinks from "./components/IubendaLinks";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import { isStaffCookieValue, STAFF_COOKIE_NAME, getStaffUsernameFromCookie, getStaffRoleFromCookie } from "@/app/lib/staffAuth";

const inter = Inter({ subsets: ["latin"] });

// Questi sono i metadati per la SEO e per il nome della PWA
export const metadata: Metadata = {
  title: "Joker's Style",
  description: "Prenota il tuo taglio velocemente",
  manifest: "/manifest.json", // Servirà per la PWA nel prossimo step!
  applicationName: "Joker's Style",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Joker's Style",
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
  const staffRole = getStaffRoleFromCookie(cookieStore.get(STAFF_COOKIE_NAME)?.value)

  return (
    <html lang="it">
      <body className={inter.className}>
        
        {/* PREMIUM NAVBAR - ELEGANT GOLD & BLACK */}
        <nav className="sticky top-0 z-50 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] border-b border-[#d4af37]/16 backdrop-blur-sm">
          <div className="site-container flex justify-between items-center py-4">
            {/* Logo left */}
            <Link href="/" className="group flex items-center gap-3 hover:opacity-95 transition pl-6 pr-4">
              <div className="bg-gradient-to-br from-[#d4af37] to-[#b88912] p-2 rounded-md shadow-sm">
                <Scissors size={24} className="text-[#0a0a0a]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] bg-clip-text text-transparent">
                  joker's style
                </span>
                <span className="text-xs text-[#d4af37]/60">Premium Barbershop</span>
              </div>
            </Link>

            {/* Menu right */}
            <div className="flex items-center gap-6 pr-2">
              <Link href="/" className="flex items-center gap-2 text-[#f8f8f8] hover:text-[#d4af37] transition-colors duration-300 font-medium">
                <Home size={18} /> <span className="hidden sm:inline">Prenota</span>
              </Link>

              {isStaff ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 text-[#f8f8f8] hover:text-[#d4af37] transition-colors duration-300 font-medium">
                    <CalendarDays size={18} /> <span className="hidden sm:inline">Appuntamenti</span>
                  </Link>

                  {staffRole === 'owner' && (
                    <Link href="/admin" className="flex items-center gap-2 text-[#f8f8f8] hover:text-[#d4af37] transition-colors duration-300 font-medium">
                      <Users size={18} /> <span className="hidden sm:inline">Gestione</span>
                    </Link>
                  )}

                  <div className="flex items-center gap-3">
                    {staffUsername && <span className="hidden sm:inline text-sm text-[#d4af37]">👤 {staffUsername}</span>}
                    {staffRole && <span className="hidden sm:inline rounded-full border border-[#d4af37]/20 px-2 py-1 text-[11px] uppercase tracking-widest text-[#d4af37]/70">{staffRole === 'owner' ? 'Capo' : 'Parrucchiere'}</span>}
                    <form action="/api/staff/logout" method="post">
                      <button type="submit" className="cursor-pointer text-[#f8f8f8] hover:text-[#d4af37] transition-colors duration-300 font-medium">
                        Esci
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/staff-login" className="flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] text-[#0a0a0a] hover:shadow-md transition-all duration-300 font-semibold text-sm">
                    <Users size={16} /> <span className="hidden sm:inline">Staff</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a] pb-20">
          <div className="site-container">
            {children}
          </div>
        </main>

        <PwaInstallPrompt />

        {/* PREMIUM FOOTER */}
        <IubendaLinks />
      </body>
    </html>
  );
}