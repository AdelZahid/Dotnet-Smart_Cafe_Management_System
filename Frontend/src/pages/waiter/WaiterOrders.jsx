import { useEffect, useState } from 'react'
import { waiterApi } from '@/services/api'

const emptyForm = {
    tableId: '',
    orderType: 'DineIn',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    notes: '',
    items: [{ menuItemId: '', quantity: 1, notes: '' }],
}

const WaiterOrders = () => {
    const [menu, setMenu] = useState([])
    const [orders, setOrders] = useState([])
    const [form, setForm] = useState(emptyForm)

    const load = async () => {
        const [menuRes, ordersRes] = await Promise.all([
            waiterApi.getMenu(),
            waiterApi.getMyOrders(),
        ])
        setMenu(menuRes.data || [])
        setOrders(ordersRes.data || [])
    }

    useEffect(() => {
        load()
    }, [])

    const addItemRow = () => {
        setForm({
            ...form,
            items: [...form.items, { menuItemId: '', quantity: 1, notes: '' }],
        })
    }

    const updateItemRow = (index, field, value) => {
        const newItems = [...form.items]
        newItems[index][field] = value
        setForm({ ...form, items: newItems })
    }

    const removeItemRow = (index) => {
        const newItems = form.items.filter((_, i) => i !== index)
        setForm({ ...form, items: newItems })
    }

    const submit = async (e) => {
        e.preventDefault()

        await waiterApi.createOrder({
            tableId: form.tableId ? Number(form.tableId) : null,
            orderType: form.orderType,
            customerName: form.customerName || null,
            customerPhone: form.customerPhone || null,
            customerAddress: form.orderType === 'Online' ? form.customerAddress : null,
            notes: form.notes || null,
            items: form.items.map((item) => ({
                menuItemId: Number(item.menuItemId),
                quantity: Number(item.quantity),
                notes: item.notes || null,
            })),
        })

        setForm(emptyForm)
        await load()
    }

    const changeStatus = async (orderId, status) => {
        await waiterApi.updateOrderStatus(orderId, status)
        await load()
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">My Orders</h1>

            <form onSubmit={submit} className="rounded-2xl bg-white border p-5 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <input
                        className="rounded-xl border px-4 py-3"
                        placeholder="Table ID"
                        value={form.tableId}
                        onChange={(e) => setForm({ ...form, tableId: e.target.value })}
                    />

                    <select
                        className="rounded-xl border px-4 py-3"
                        value={form.orderType}
                        onChange={(e) => setForm({ ...form, orderType: e.target.value })}
                    >
                        <option value="DineIn">Dine In</option>
                        <option value="Takeaway">Takeaway</option>
                        <option value="Online">Online</option>
                    </select>

                    <input
                        className="rounded-xl border px-4 py-3"
                        placeholder="Customer name"
                        value={form.customerName}
                        onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    />

                    <input
                        className="rounded-xl border px-4 py-3"
                        placeholder="Customer phone"
                        value={form.customerPhone}
                        onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    />

                    {form.orderType === 'Online' && (
                        <input
                            className="rounded-xl border px-4 py-3 md:col-span-2"
                            placeholder="Customer address"
                            value={form.customerAddress}
                            onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
                        />
                    )}

                    <input
                        className="rounded-xl border px-4 py-3 md:col-span-2"
                        placeholder="Order notes"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                </div>

                <div className="space-y-3">
                    <h2 className="text-xl font-semibold">Order Items</h2>

                    {form.items.map((item, index) => (
                        <div key={index} className="grid gap-3 md:grid-cols-3">
                            <select
                                className="rounded-xl border px-4 py-3"
                                value={item.menuItemId}
                                onChange={(e) => updateItemRow(index, 'menuItemId', e.target.value)}
                                required
                            >
                                <option value="">Select menu item</option>
                                {menu.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} - ৳ {m.unitPrice}
                                    </option>
                                ))}
                            </select>

                            <input
                                className="rounded-xl border px-4 py-3"
                                type="number"
                                min="1"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => updateItemRow(index, 'quantity', e.target.value)}
                                required
                            />

                            <div className="flex gap-2">
                                <input
                                    className="flex-1 rounded-xl border px-4 py-3"
                                    placeholder="Item notes"
                                    value={item.notes}
                                    onChange={(e) => updateItemRow(index, 'notes', e.target.value)}
                                />

                                {form.items.length > 1 && (
                                    <button
                                        type="button"
                                        className="rounded-xl bg-red-50 px-4 text-red-700"
                                        onClick={() => removeItemRow(index)}
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="rounded-xl border px-4 py-2"
                        onClick={addItemRow}
                    >
                        Add Item
                    </button>
                </div>

                <button className="rounded-xl bg-amber-600 px-5 py-3 text-white hover:bg-amber-700">
                    Create Order
                </button>
            </form>

            <div className="grid gap-4 lg:grid-cols-2">
                {orders.map((order) => (
                    <div key={order.id} className="rounded-2xl bg-white border p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500">
                                    Table: {order.tableNumber || 'N/A'}
                                </p>
                            </div>

                            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
                                {order.status}
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            {order.orderItems?.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>
                                        {item.itemName} × {item.quantity}
                                    </span>
                                    <span>৳ {item.totalPrice}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {order.status === 'Pending' && (
                                <button
                                    className="rounded-lg bg-blue-600 px-3 py-2 text-white"
                                    onClick={() => changeStatus(order.id, 'Processing')}
                                >
                                    Processing
                                </button>
                            )}

                            {order.status === 'Processing' && (
                                <button
                                    className="rounded-lg bg-green-600 px-3 py-2 text-white"
                                    onClick={() => changeStatus(order.id, 'Ready')}
                                >
                                    Ready
                                </button>
                            )}

                            {order.status === 'Ready' && (
                                <button
                                    className="rounded-lg bg-amber-600 px-3 py-2 text-white"
                                    onClick={() => changeStatus(order.id, 'Served')}
                                >
                                    Served
                                </button>
                            )}

                            {(order.status === 'Pending' || order.status === 'Processing') && (
                                <button
                                    className="rounded-lg bg-red-600 px-3 py-2 text-white"
                                    onClick={() => changeStatus(order.id, 'Cancelled')}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WaiterOrders