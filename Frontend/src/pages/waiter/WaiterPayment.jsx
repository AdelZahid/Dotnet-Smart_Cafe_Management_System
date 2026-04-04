import { useEffect, useState } from 'react'
import { waiterApi } from '@/services/api'

const WaiterPayment = () => {
    const [orders, setOrders] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('Cash')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)

    const load = async () => {
        try {
            setLoading(true)
            const res = await waiterApi.getServedOrdersForPayment()
            setOrders(res.data || [])
        } catch (error) {
            console.error('Failed to load served orders:', error)
            alert(error.response?.data?.message || 'Failed to load served orders')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const pay = async (order) => {
        try {
            const payload = {
                orderId: order.id, // IMPORTANT: backend served-order DTO uses Id, not orderId
                amount: Number(order.totalAmount),
                paymentMethod,
                transactionId: null,
                notes: notes || null,
            }

            console.log('Payment payload:', payload)

            await waiterApi.processPayment(payload)
            alert('Payment saved successfully')
            setNotes('')
            await load()
        } catch (error) {
            console.error('Payment failed:', error)
            console.error('Response data:', error.response?.data)
            alert(error.response?.data?.message || 'Payment failed')
        }
    }

    const refund = async (order) => {
        try {
            await waiterApi.processRefund(order.id, notes || 'Customer refund request')
            alert('Refund processed successfully')
            setNotes('')
            await load()
        } catch (error) {
            console.error('Refund failed:', error)
            alert(error.response?.data?.message || 'Refund failed')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            <h1 className="text-3xl font-bold">Payment</h1>

            <div className="rounded-2xl bg-white border p-4 flex flex-col md:flex-row gap-3">
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
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="rounded-2xl bg-white border p-6">Loading payment orders...</div>
            ) : orders.length === 0 ? (
                <div className="rounded-2xl bg-white border p-6 text-gray-500">
                    No served orders waiting for payment.
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {orders.map((order) => (
                        <div key={order.id} className="rounded-2xl bg-white border p-5 shadow-sm">
                            <h3 className="font-bold text-lg">Order #{order.id}</h3>
                            <p className="text-sm text-gray-500">Table: {order.tableNumber || 'N/A'}</p>
                            <p className="text-sm text-gray-500">Customer: {order.customerName || 'Walk-in'}</p>

                            <div className="mt-4 space-y-2">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span>{item.itemName} × {item.quantity}</span>
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
                                        onClick={() => refund(order)}
                                    >
                                        Refund
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WaiterPayment