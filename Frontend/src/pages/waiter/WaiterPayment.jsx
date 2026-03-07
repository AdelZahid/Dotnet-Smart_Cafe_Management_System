import { useEffect, useState } from 'react'
import { waiterApi } from '@/services/api'

const WaiterPayment = () => {
    const [orders, setOrders] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('Cash')
    const [reason, setReason] = useState('')

    const load = async () => {
        const res = await waiterApi.getServedOrdersForPayment()
        setOrders(res.data || [])
    }

    useEffect(() => {
        load()
    }, [])

    const pay = async (order) => {
        await waiterApi.processPayment({
            orderId: order.orderId,
            amount: order.totalAmount,
            paymentMethod,
            transactionId: null,
            notes: null,
        })
        await load()
    }

    const refund = async (orderId) => {
        await waiterApi.processRefund(orderId, reason || 'Customer refund request')
        setReason('')
        await load()
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Payment</h1>

            <div className="rounded-2xl bg-white border p-4 flex gap-3">
                <select
                    className="rounded-xl border px-4 py-2"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Mobile Banking">Mobile Banking</option>
                    <option value="Online">Online</option>
                </select>
                <input
                    className="rounded-xl border px-4 py-2 flex-1"
                    placeholder="Refund reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {orders.map((order) => (
                    <div key={order.orderId} className="rounded-2xl bg-white border p-5 shadow-sm">
                        <h3 className="font-bold text-lg">Order #{order.orderId}</h3>
                        <p className="text-sm text-gray-500">Table: {order.tableNumber || 'N/A'}</p>

                        <div className="mt-4 space-y-2">
                            {order.orderItems?.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.itemName} × {item.quantity}</span>
                                    <span>৳ {item.totalPrice}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="font-bold">Total: ৳ {order.totalAmount}</span>
                            <div className="flex gap-2">
                                <button
                                    className="rounded-lg bg-green-600 text-white px-3 py-2"
                                    onClick={() => pay(order)}
                                >
                                    Paid
                                </button>
                                <button
                                    className="rounded-lg bg-red-600 text-white px-3 py-2"
                                    onClick={() => refund(order.orderId)}
                                >
                                    Refund
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WaiterPayment