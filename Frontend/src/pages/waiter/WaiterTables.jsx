import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Table2 } from 'lucide-react'
import { waiterApi } from '@/services/api'

const today = new Date().toISOString().split('T')[0]
const timeLabel = (value) => (value || '').toString().slice(0, 5)

const WaiterTables = () => {
    const [filterDate, setFilterDate] = useState(today)
    const [tables, setTables] = useState([])
    const [loading, setLoading] = useState(false)

    const loadTables = async (targetDate = filterDate) => {
        try {
            setLoading(true)
            const res = await waiterApi.getTables(targetDate)
            setTables(res.data || [])
        } catch (error) {
            console.error('Failed to load tables:', error)
            alert(error.response?.data?.message || 'Failed to load tables')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTables(filterDate)
    }, [filterDate])

    const stats = useMemo(() => {
        const total = tables.length
        const reserved = tables.filter((t) => t.status === 'Reserved').length
        const available = tables.filter((t) => t.status === 'Available').length
        return { total, reserved, available }
    }, [tables])

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 space-y-8">
            <div className="rounded-3xl bg-white border border-amber-100 shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Tables & Reservations</h1>
                        <p className="mt-2 text-gray-500">See reserved and available tables before taking orders.</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border px-4 py-2 bg-gray-50">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <input
                            className="bg-transparent outline-none"
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border bg-blue-50 border-blue-100 p-4">
                        <p className="text-sm text-gray-500">Total Tables</p>
                        <p className="text-2xl font-bold text-blue-700 mt-1">{stats.total}</p>
                    </div>
                    <div className="rounded-2xl border bg-red-50 border-red-100 p-4">
                        <p className="text-sm text-gray-500">Reserved</p>
                        <p className="text-2xl font-bold text-red-700 mt-1">{stats.reserved}</p>
                    </div>
                    <div className="rounded-2xl border bg-green-50 border-green-100 p-4">
                        <p className="text-sm text-gray-500">Available</p>
                        <p className="text-2xl font-bold text-green-700 mt-1">{stats.available}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl bg-white border shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-5">
                    <Table2 className="h-5 w-5 text-amber-700" />
                    <h2 className="text-2xl font-semibold text-gray-900">Table Overview</h2>
                </div>

                {loading ? (
                    <div className="text-gray-500">Loading tables...</div>
                ) : tables.length === 0 ? (
                    <div className="rounded-2xl bg-gray-50 border p-5 text-gray-500">No tables found.</div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {tables.map((table) => (
                            <div key={table.tableId} className={`rounded-2xl border p-5 ${table.status === 'Reserved' ? 'border-red-200 bg-red-50' : table.status === 'Available' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Table {table.tableNumber}</h3>
                                        <p className="text-sm text-gray-600">Capacity: {table.capacity}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${table.status === 'Reserved' ? 'bg-red-100 text-red-700' : table.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                        {table.status}
                                    </span>
                                </div>

                                {table.reservations?.length > 0 ? (
                                    <div className="mt-4 space-y-2">
                                        {table.reservations.map((r) => (
                                            <div key={r.reservationId} className="rounded-xl bg-white border px-3 py-2">
                                                <p className="text-sm font-medium text-gray-900">{r.customerName}</p>
                                                <p className="text-xs text-gray-500">{timeLabel(r.startTime)} - {timeLabel(r.endTime)} • {r.numberOfGuests} guests</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-4 text-sm text-gray-500">No reservations on this date.</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WaiterTables
