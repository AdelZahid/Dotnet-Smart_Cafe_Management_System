import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Clock3, Table2 } from 'lucide-react'
import { managerApi } from '@/services/api'

const today = new Date().toISOString().split('T')[0]

const emptyForm = {
    tableId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    reservationDate: today,
    startTime: '18:00',
    endTime: '20:00',
    numberOfGuests: 2,
    notes: '',
}

const timeLabel = (value) => (value || '').toString().slice(0, 5)

const ManagerReservations = () => {
    const [reservations, setReservations] = useState([])
    const [tables, setTables] = useState([])
    const [filterDate, setFilterDate] = useState(today)
    const [form, setForm] = useState(emptyForm)
    const [loading, setLoading] = useState(false)

    const load = async (targetDate = filterDate) => {
        try {
            setLoading(true)
            const [resRes, tableRes] = await Promise.all([
                managerApi.getReservations(targetDate),
                managerApi.getTablesOverview(targetDate),
            ])
            setReservations(resRes.data || [])
            setTables(tableRes.data || [])
        } catch (error) {
            console.error('Failed to load reservation data:', error)
            alert(error.response?.data?.message || 'Failed to load reservation data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load(filterDate)
    }, [filterDate])

    const submit = async (e) => {
        e.preventDefault()
        try {
            await managerApi.createReservation({
                tableId: Number(form.tableId),
                customerName: form.customerName,
                customerPhone: form.customerPhone,
                customerEmail: form.customerEmail || null,
                reservationDate: form.reservationDate,
                startTime: form.startTime,
                endTime: form.endTime,
                numberOfGuests: Number(form.numberOfGuests),
                notes: form.notes || null,
            })
            setForm((prev) => ({ ...emptyForm, reservationDate: prev.reservationDate }))
            await load(form.reservationDate)
        } catch (error) {
            console.error('Failed to create reservation:', error)
            alert(error.response?.data?.message || 'Failed to create reservation')
        }
    }

    const cancelReservation = async (id) => {
        const ok = window.confirm('Cancel this reservation?')
        if (!ok) return
        try {
            await managerApi.cancelReservation(id)
            await load(filterDate)
        } catch (error) {
            console.error('Failed to cancel reservation:', error)
            alert(error.response?.data?.message || 'Failed to cancel reservation')
        }
    }

    const stats = useMemo(() => {
        const total = tables.length
        const reserved = tables.filter((t) => t.status === 'Reserved').length
        const available = tables.filter((t) => t.status === 'Available').length
        const inactive = tables.filter((t) => t.status === 'Inactive').length
        return { total, reserved, available, inactive }
    }, [tables])

    const activeTables = tables.filter((t) => t.isActive)

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 space-y-8">
            <div className="rounded-3xl bg-white border border-amber-100 shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Table Reservations</h1>
                        <p className="mt-2 text-gray-500">Manage table reservations with live table visibility.</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border px-4 py-2 bg-gray-50">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <input
                            className="bg-transparent outline-none"
                            type="date"
                            value={filterDate}
                            onChange={(e) => {
                                setFilterDate(e.target.value)
                                setForm((prev) => ({ ...prev, reservationDate: e.target.value }))
                            }}
                        />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <div className="rounded-2xl border bg-gray-50 border-gray-200 p-4">
                        <p className="text-sm text-gray-500">Inactive</p>
                        <p className="text-2xl font-bold text-gray-700 mt-1">{stats.inactive}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="rounded-3xl bg-white border shadow-sm p-6 md:p-8 grid md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Table</label>
                    <select
                        className="w-full rounded-xl border px-4 py-3"
                        value={form.tableId}
                        onChange={(e) => setForm({ ...form, tableId: e.target.value })}
                        required
                    >
                        <option value="">Select table</option>
                        {activeTables.map((table) => (
                            <option key={table.tableId} value={table.tableId}>
                                {table.tableNumber} (Capacity {table.capacity})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                    <input className="w-full rounded-xl border px-4 py-3" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
                    <input className="w-full rounded-xl border px-4 py-3" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email (optional)</label>
                    <input className="w-full rounded-xl border px-4 py-3" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reservation Date</label>
                    <input className="w-full rounded-xl border px-4 py-3" type="date" value={form.reservationDate} onChange={(e) => setForm({ ...form, reservationDate: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <input className="w-full rounded-xl border px-4 py-3" type="number" min="1" value={form.numberOfGuests} onChange={(e) => setForm({ ...form, numberOfGuests: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input className="w-full rounded-xl border px-4 py-3" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input className="w-full rounded-xl border px-4 py-3" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                    <input className="w-full rounded-xl border px-4 py-3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                    <button className="rounded-xl bg-amber-600 text-white px-6 py-3 hover:bg-amber-700">Create Reservation</button>
                </div>
            </form>

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

            <div className="rounded-3xl bg-white border shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-5">
                    <Clock3 className="h-5 w-5 text-amber-700" />
                    <h2 className="text-2xl font-semibold text-gray-900">Reservations ({filterDate})</h2>
                </div>

                {loading ? (
                    <div className="text-gray-500">Loading reservations...</div>
                ) : reservations.length === 0 ? (
                    <div className="rounded-2xl bg-gray-50 border p-5 text-gray-500">No reservations for this date.</div>
                ) : (
                    <div className="grid gap-4">
                        {reservations.map((item) => (
                            <div key={item.id} className="rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">{item.customerName}</h3>
                                    <p className="text-sm text-gray-500">Table: {item.tableNumber}</p>
                                    <p className="text-sm text-gray-500">Phone: {item.customerPhone}</p>
                                    <p className="text-sm text-gray-500">Time: {timeLabel(item.startTime)} - {timeLabel(item.endTime)}</p>
                                </div>
                                <button className="rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700" onClick={() => cancelReservation(item.id)}>
                                    Cancel
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManagerReservations