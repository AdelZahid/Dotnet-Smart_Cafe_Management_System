import { useEffect, useState } from 'react'
import { managerApi } from '@/services/api'

const today = new Date().toISOString().split('T')[0]

const ManagerPurchased = () => {
    const [orders, setOrders] = useState([])
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)

    const load = async () => {
        const res = await managerApi.getPurchasedOrders(startDate, endDate)
        setOrders(res.data || [])
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Purchased Orders</h1>

            <div className="rounded-2xl bg-white border p-4 flex gap-3">
                <input type="date" className="rounded-xl border px-4 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" className="rounded-xl border px-4 py-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button className="rounded-xl bg-amber-600 text-white px-4 py-2" onClick={load}>Load</button>
            </div>

            <div className="grid gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="rounded-2xl bg-white border p-5">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500">{order.customerName || 'Walk-in customer'}</p>
                                <p className="text-sm text-gray-500">{order.customerAddress || ''}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">৳ {order.totalAmount}</p>
                                <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManagerPurchased