import Link from 'next/link'

type Props = {
  id: number
  name: string
  price: number
}

export default function BarberCard({ id, name, price }: Props) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative rounded-lg border border-[#d4af37]/18 bg-gradient-to-br from-[#0f0f0f] to-[#171717] p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e4c1] flex items-center justify-center">
            <span className="text-lg font-semibold text-[#0a0a0a]">{name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#f8f8f8]">{name}</h3>
            <p className="text-xs text-[#d4af37]/70">Taglio Professionale</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#d4af37]/80">PREZZO</p>
            <p className="text-lg font-bold bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] bg-clip-text text-transparent">€{price}</p>
          </div>
        </div>

        <div className="mt-3">
          <Link
            href={`/book/${id}`}
            className="block text-center w-full rounded-md bg-gradient-to-r from-[#d4af37] to-[#f4e4c1] py-2 text-sm font-semibold text-[#0a0a0a] hover:shadow-md transition"
          >
            Prenota
          </Link>
        </div>
      </div>
    </div>
  )
}
