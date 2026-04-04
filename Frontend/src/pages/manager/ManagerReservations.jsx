import { useEffect, useState } from 'react'
import { managerApi } from '@/services/api'

const today = new Date().toISOString().split('T')[0]

const emptyForm = {
    tableId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    reservationDate: today,
    startTime: '18:00:00',
    endTime: '20:00:00',
    numberOfGuests: 2,
    notes: '',
}

const ManagerReservations = () => {
    const [reservations, setReservations] = useState([])
    const [todayReservations, setTodayReservations] = useState([])
    const [form, setForm] = useState(emptyForm)

    const load = async () => {
        const [allRes, todayRes] = await Promise.all([
            managerApi.getReservations(),
            managerApi.getTodayReservations(),
        ])
        setReservations(allRes.data || [])
        setTodayReservations(todayRes.data || [])
    }

    useEffect(() => {
        load()
    }, [])

    const submit = async (e) => {
        e.preventDefault()
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
        setForm(emptyForm)
        await load()
    }

    const cancelReservation = async (id) => {
        await managerApi.cancelReservation(id)
        await load()
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Reservations</h1>

            <form onSubmit={submit} className="rounded-2xl bg-white border p-5 grid md:grid-cols-2 gap-4">
                <input className="rounded-xl border px-4 py-3" placeholder="Table ID" value={form.tableId} onChange={(e) => setForm({ ...form, tableId: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" placeholder="Customer name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" placeholder="Customer phone" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" placeholder="Customer email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
                <input className="rounded-xl border px-4 py-3" type="date" value={form.reservationDate} onChange={(e) => setForm({ ...form, reservationDate: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" type="number" placeholder="Guests" value={form.numberOfGuests} onChange={(e) => setForm({ ...form, numberOfGuests: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <button className="rounded-xl bg-amber-600 text-white px-4 py-3 md:col-span-2">Create Reservation</button>
            </form>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white border p-5">
                    <h2 className="text-xl font-semibold mb-4">Today Reservations</h2>
                    <div className="space-y-3">
                        {todayReservations.map((item) => (
                            <div key={item.id} className="rounded-xl border p-4">
                                <h3 className="font-semibold">{item.customerName}</h3>
                                <p className="text-sm text-gray-500">Table: {item.tableNumber}</p>
                                <p className="text-sm text-gray-500">{item.startTime} - {item.endTime}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl bg-white border p-5">
                    <h2 className="text-xl font-semibold mb-4">All Reservations</h2>
                    <div className="space-y-3">
                        {reservations.map((item) => (
                            <div key={item.id} className="rounded-xl border p-4 flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="font-semibold">{item.customerName}</h3>
                                    <p className="text-sm text-gray-500">Phone: {item.customerPhone}</p>
                                    <p className="text-sm text-gray-500">Date: {item.reservationDate?.split('T')[0] || item.reservationDate}</p>
                                </div>
                                <button
                                    className="rounded-lg bg-red-600 text-white px-3 py-2"
                                    onClick={() => cancelReservation(item.id)}
                                >
                                    Cancel
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerReservations