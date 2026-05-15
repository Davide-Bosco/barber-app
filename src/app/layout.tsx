import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Home, CalendarDays, Users, Scissors } from "lucide-react";
import IubendaLinks from "./components/IubendaLinks";

const inter = Inter({ subsets: ["latin"] });

// Questi sono i metadati per la SEO e per il nome della PWA
export const metadata: Metadata = {
  title: "Barber Booking",
  description: "Prenota il tuo taglio velocemente",
  manifest: "/manifest.json", // Servirà per la PWA nel prossimo step!
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
              
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-gray-300 transition font-medium">
                <CalendarDays size={20} /> <span className="hidden sm:inline">Appuntamenti</span>
              </Link>
              
              <Link href="/admin" className="flex items-center gap-2 hover:text-gray-300 transition font-medium">
                <Users size={20} /> <span className="hidden sm:inline">Staff</span>
              </Link>
            </div>

          </div>
        </nav>
        {/* FINE NAVBAR */}

        {/* Qui verranno caricate le tue pagine (Home, Dashboard, Admin, ecc.) */}
        <main className="min-h-screen bg-gray-50 pb-20">
          {children}
        </main>

        {/* FOOTER CON LINK IUBENDA */}
        <IubendaLinks />
      </body>
    </html>
  );
}