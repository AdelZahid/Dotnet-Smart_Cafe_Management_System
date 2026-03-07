import { useEffect, useState } from 'react'
import { managerApi } from '@/services/api'

const ManagerOrders = () => {
    const [currentOrders, setCurrentOrders] = useState([])
    const [onlineOrders, setOnlineOrders] = useState([])

    const load = async () => {
        const [currentRes, onlineRes] = await Promise.all([
            managerApi.getCurrentOrders(),
            managerApi.getOnlineOrders(),
        ])
        setCurrentOrders(currentRes.data || [])
        setOnlineOrders(onlineRes.data || [])
    }

    useEffect(() => {
        load()
    }, [])

    const updateStatus = async (id, status) => {
        await managerApi.updateOrderStatus(id, status)
        await load()
    }

    const OrderCard = ({ order }) => (
        <div className="rounded-2xl bg-white border p-5 shadow-sm">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                        Table: {order.tableNumber || 'N/A'} | Waiter: {order.waiterName || 'N/A'}
                    </p>
                    {order.customerAddress && (
                        <p className="text-sm text-gray-500">Address: {order.customerAddress}</p>
                    )}
                </div>
                <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-sm">
                    {order.status}
                </span>
            </div>

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
                    <button className="rounded-lg bg-blue-600 text-white px-3 py-2" onClick={() => updateStatus(order.id, 'Processing')}>
                        Processing
                    </button>
                    <button className="rounded-lg bg-green-600 text-white px-3 py-2" onClick={() => updateStatus(order.id, 'Ready')}>
                        Ready
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Manager Orders</h1>

            <section>
                <h2 className="text-xl font-semibold mb-4">Current Orders</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                    {currentOrders.map((order) => <OrderCard key={order.id} order={order} />)}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Online Orders</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                    {onlineOrders.map((order) => <OrderCard key={order.id} order={order} />)}
                </div>
            </section>
        </div>
    )
}

export default ManagerOrders