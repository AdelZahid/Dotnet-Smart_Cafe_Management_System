import { useEffect, useState } from 'react'
import { managerApi } from '@/services/api'

const emptyForm = {
    name: '',
    description: '',
    unitPrice: '',
    imageUrl: '',
    categoryId: '',
}

const ManagerItems = () => {
    const [items, setItems] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)

    const load = async () => {
        const res = await managerApi.getItems()
        setItems(res.data || [])
    }

    useEffect(() => {
        load()
    }, [])

    const submit = async (e) => {
        e.preventDefault()
        const payload = {
            name: form.name,
            description: form.description || null,
            unitPrice: Number(form.unitPrice),
            imageUrl: form.imageUrl || null,
            categoryId: form.categoryId ? Number(form.categoryId) : null,
        }

        if (editingId) {
            await managerApi.updateItem(editingId, payload)
        } else {
            await managerApi.createItem(payload)
        }

        setForm(emptyForm)
        setEditingId(null)
        await load()
    }

    const editItem = (item) => {
        setEditingId(item.id)
        setForm({
            name: item.name || '',
            description: item.description || '',
            unitPrice: item.unitPrice?.toString() || '',
            imageUrl: item.imageUrl || '',
            categoryId: item.categoryId?.toString() || '',
        })
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Manager Items</h1>

            <form onSubmit={submit} className="rounded-2xl bg-white border p-5 grid md:grid-cols-2 gap-4">
                <input className="rounded-xl border px-4 py-3" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" placeholder="Unit price" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                <div className="md:col-span-2 flex gap-3">
                    <button className="rounded-xl bg-amber-600 text-white px-4 py-3 hover:bg-amber-700">
                        {editingId ? 'Update Item' : 'Add Item'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="rounded-xl border px-4 py-3"
                            onClick={() => {
                                setEditingId(null)
                                setForm(emptyForm)
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white border p-5 shadow-sm">
                        <img
                            src={item.imageUrl || 'https://via.placeholder.com/300x180?text=Item'}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-xl border"
                        />
                        <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.description || 'No description'}</p>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="font-bold text-amber-700">৳ {item.unitPrice}</span>
                            <span className="text-sm text-gray-500">{item.priceRange}</span>
                        </div>
                        <button
                            className="mt-4 w-full rounded-xl bg-gray-900 text-white py-2 hover:bg-black"
                            onClick={() => editItem(item)}
                        >
                            Edit Price / Item
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManagerItems