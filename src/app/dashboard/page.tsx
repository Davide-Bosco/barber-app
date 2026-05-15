'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Users, CalendarCheck, Clock, Trash2 } from 'lucide-react'

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    setLoading(true)
    const { data } = await supabase
      .from('bookings')
      .select(`id, appointment_time, customer_name, customer_phone, barbers ( name )`)
      .order('appointment_time', { ascending: true })
    if (data) setBookings(data)
    setLoading(false)
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* STATISTICHE VELOCI */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-3xl border shadow-sm text-center">
          <Users className="mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">{bookings.length}</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Totale</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border shadow-sm text-center">
          <CalendarCheck className="mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">
            {bookings.filter(b => b.appointment_time.startsWith(new Date().toISOString().split('T')[0])).length}
          </p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Oggi</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Prossimi Appuntamenti</h2>
      
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-500">Cliente</th>
              <th className="p-4 text-sm font-medium text-gray-500">Orario</th>
              <th className="p-4 text-sm font-medium text-gray-500">Barbiere</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-b last:border-0">
                <td className="p-4 font-bold">{b.customer_name}</td>
                <td className="p-4 text-sm">
                   {new Date(b.appointment_time).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{b.barbers?.name}</span></td>
                <td className="p-4 text-right">
                  <button onClick={() => {/* aggiungi delete logic qui */}} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}