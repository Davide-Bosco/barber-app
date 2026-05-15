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
        
        {/* INIZIO NAVBAR NERA */}
        <nav className="bg-black text-white p-4 sticky top-0 z-50 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/" className="font-bold text-xl tracking-wider flex items-center gap-2">
              <Scissors size={24} /> IL TUO BARBIERE
            </Link>

            {/* Menu Navigazione */}
            <div className="flex gap-4 md:gap-8">
              <Link href="/" className="flex items-center gap-2 hover:text-gray-300 transition font-medium">
                <Home size={20} /> <span className="hidden sm:inline">Prenota</span>
              </Link>

              {isStaff ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 hover:text-gray-300 transition font-medium">
                    <CalendarDays size={20} /> <span className="hidden sm:inline">Appuntamenti</span>
                  </Link>

                  <Link href="/admin" className="flex items-center gap-2 hover:text-gray-300 transition font-medium">
                    <Users size={20} /> <span className="hidden sm:inline">Staff</span>
                  </Link>

                    <div className="flex items-center gap-4">
                      {staffUsername && <span className="hidden sm:inline text-sm">Ciao, {staffUsername}</span>}
                      <form action="/api/staff/logout" method="post">
                        <button type="submit" className="cursor-pointer hover:text-gray-300 transition font-medium">
                          Esci
                        </button>
                      </form>
                    </div>
                </>
              ) : (
                <Link href="/staff-login" className="flex items-center gap-2 hover:text-gray-300 transition font-medium">
                  <Users size={20} /> <span className="hidden sm:inline">Area Staff</span>
                </Link>
              )}
            </div>

          </div>
        </nav>
        {/* FINE NAVBAR */}

        {/* Qui verranno caricate le tue pagine (Home, Dashboard, Admin, ecc.) */}
        <main className="min-h-screen bg-gray-50 pb-20">
          {children}
        </main>

        <PwaInstallPrompt />

        {/* FOOTER CON LINK IUBENDA */}
        <IubendaLinks />
      </body>
    </html>
  );
}