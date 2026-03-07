import { useEffect, useState } from 'react'
import { managerApi } from '@/services/api'

const today = new Date().toISOString().split('T')[0]

const ManagerRefundCancel = () => {
    const [orders, setOrders] = useState([])
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)
    const [refundReason, setRefundReason] = useState('')

    const load = async () => {
        const res = await managerApi.getRefundCancelOrders(startDate, endDate)
        setOrders(res.data || [])
    }

    useEffect(() => {
        load()
    }, [])

    const refund = async (id, amount) => {
        await managerApi.processRefund(id, amount, refundReason || 'Manager refund')
        setRefundReason('')
        await load()
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Refund / Cancel Orders</h1>

            <div className="rounded-2xl bg-white border p-4 flex gap-3">
                <input type="date" className="rounded-xl border px-4 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" className="rounded-xl border px-4 py-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button className="rounded-xl bg-amber-600 text-white px-4 py-2" onClick={load}>Load</button>
            </div>

            <input
                className="rounded-xl border px-4 py-3 w-full bg-white"
                placeholder="Refund reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
            />

            <div className="grid gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="rounded-2xl bg-white border p-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500">Status: {order.status}</p>
                                <p className="text-sm text-gray-500">Customer: {order.customerName || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">৳ {order.totalAmount}</p>
                                {order.status !== 'Refunded' && (
                                    <button
                                        className="mt-2 rounded-lg bg-red-600 text-white px-3 py-2"
                                        onClick={() => refund(order.id, order.totalAmount)}
                                    >
                                        Refund
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManagerRefundCancel