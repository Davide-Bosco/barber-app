import Link from 'next/link'

type Props = {
  id: number
  name: string
  price: number
}

export default function BarberCard({ id, name, price }: Props) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative rounded-2xl border border-[#d4af37]/14 bg-gradient-to-br from-[#0b0b0b] to-[#141414] p-4 shadow-md hover:shadow-lg transition">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e4c1] flex items-center justify-center shadow-sm">
            <span className="text-xl font-bold text-[#0a0a0a]">{name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#f8f8f8]">{name}</h3>
            <p className="text-xs text-[#d4af37]/70">Taglio Professionale</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#d4af37]/70">PREZZO</p>
            <p className="text-lg font-bold bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] bg-clip-text text-transparent">€{price}</p>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href={`/book/${id}`}
            className="block text-center w-full rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] py-2 text-sm font-semibold text-[#0a0a0a] hover:scale-[1.02] transition-transform"
          >
            Prenota
          </Link>
        </div>
      </div>
    </div>
  )
}
