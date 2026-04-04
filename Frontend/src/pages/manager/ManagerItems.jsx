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
    const [loading, setLoading] = useState(false)

    const load = async () => {
        try {
            setLoading(true)
            const res = await managerApi.getItems()
            setItems(res.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const submit = async (e) => {
        e.preventDefault()

        const payload = {
            name: form.name?.trim(),
            description: form.description?.trim() || null,
            unitPrice: Number(form.unitPrice),
            imageUrl: form.imageUrl?.trim() || null,
            categoryId: form.categoryId ? Number(form.categoryId) : null,
        }

        // client-side validation
        if (!payload.name) {
            alert('Item name is required')
            return
        }

        if (Number.isNaN(payload.unitPrice) || payload.unitPrice <= 0) {
            alert('Unit price must be a valid number greater than 0')
            return
        }

        if (payload.imageUrl && payload.imageUrl.length > 500) {
            alert('Image URL is too long. Use a shorter normal image URL.')
            return
        }

        console.log('Submitting payload:', payload)

        try {
            if (editingId) {
                await managerApi.updateItem(editingId, payload)
            } else {
                await managerApi.createItem(payload)
            }

            setForm(emptyForm)
            setEditingId(null)
            await load()
        } catch (error) {
            console.error('Full Axios error:', error)
            console.error('Response status:', error.response?.status)
            console.error('Response data:', error.response?.data)
            alert(error.response?.data?.message || 'Failed to save item')
        }
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

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const deleteItem = async (id) => {
        const ok = window.confirm('Delete this item?')
        if (!ok) return

        try {
            await managerApi.deleteItem(id)
            await load()
        } catch (error) {
            console.error(error)
            alert('Failed to delete item')
        }
    }

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900">Manager Items</h1>

            {/* FORM */}

            <form
                onSubmit={submit}
                className="rounded-2xl bg-white border shadow-sm p-6 grid md:grid-cols-2 gap-4"
            >
                <input
                    className="rounded-xl border px-4 py-3"
                    placeholder="Item name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />

                <input
                    className="rounded-xl border px-4 py-3"
                    placeholder="Unit price"
                    type="number"
                    value={form.unitPrice}
                    onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                    required
                />

                <input
                    className="rounded-xl border px-4 py-3 md:col-span-2"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                {/* IMAGE URL */}

                <input
                    className="rounded-xl border px-4 py-3 md:col-span-2"
                    placeholder="Image URL (https://...)"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />

                {/* IMAGE PREVIEW */}

                {form.imageUrl && (
                    <div className="md:col-span-2">
                        <img
                            src={form.imageUrl}
                            alt="preview"
                            className="w-48 h-32 object-cover rounded-xl border"
                        />
                    </div>
                )}

                <div className="md:col-span-2 flex gap-3">
                    <button className="rounded-xl bg-amber-600 text-white px-5 py-3 hover:bg-amber-700">
                        {editingId ? 'Update Item' : 'Add Item'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="rounded-xl border px-5 py-3"
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

            {/* ITEMS */}

            {loading ? (
                <p>Loading items...</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl bg-white border shadow-sm p-5 hover:shadow-md transition"
                        >
                            <img
                                src={
                                    item.imageUrl ||
                                    'https://via.placeholder.com/300x180?text=Item'
                                }
                                alt={item.name}
                                className="w-full h-40 object-cover rounded-xl border"
                            />

                            <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>

                            <p className="text-sm text-gray-500 mt-1">
                                {item.description || 'No description'}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                                <span className="font-bold text-amber-700">
                                    ৳ {item.unitPrice}
                                </span>

                                <span className="text-xs text-gray-500">
                                    {item.priceRange}
                                </span>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    className="flex-1 rounded-xl bg-gray-900 text-white py-2 hover:bg-black"
                                    onClick={() => editItem(item)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="flex-1 rounded-xl bg-red-50 text-red-700 py-2 hover:bg-red-100"
                                    onClick={() => deleteItem(item.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ManagerItems