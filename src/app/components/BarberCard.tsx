import Link from 'next/link'

type Props = {
  id: number
  name: string
  price: number
}

export default function BarberCard({ id, name, price }: Props) {
  return (
    <div className="w-full mx-auto">
      <div className="card-rect">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-md bg-gradient-to-br from-[#b8860b] to-[#d4af37] flex items-center justify-center shadow-inner">
            <span className="text-xl font-bold text-[#0a0a0a]">{name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#f4f4f4]">{name}</h3>
            <p className="text-sm text-[#d4af37]/70">Taglio Professionale</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#d4af37]/70">PREZZO</p>
            <p className="text-lg font-bold text-[#f4e4c1]">€{price}</p>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href={`/book/${id}`}
            className="btn-primary btn-lg w-full block rounded-lg text-center"
          >
            Prenota Ora
          </Link>
        </div>
      </div>
    </div>
  )
}
