import { useEffect, useState } from 'react'
import { managerApi } from '@/services/api'

const today = new Date().toISOString().split('T')[0]

const ManagerAdditionalCosts = () => {
    const [costs, setCosts] = useState([])
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)
    const [form, setForm] = useState({
        costType: '',
        amount: '',
        costDate: today,
        description: '',
        isRecurring: false,
    })

    const load = async () => {
        const res = await managerApi.getAdditionalCosts(startDate, endDate)
        setCosts(res.data || [])
    }

    useEffect(() => {
        load()
    }, [])

    const submit = async (e) => {
        e.preventDefault()
        await managerApi.createAdditionalCost({
            costType: form.costType,
            amount: Number(form.amount),
            costDate: form.costDate,
            description: form.description || null,
            isRecurring: form.isRecurring,
        })
        setForm({
            costType: '',
            amount: '',
            costDate: today,
            description: '',
            isRecurring: false,
        })
        await load()
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Additional Cost</h1>

            <form onSubmit={submit} className="rounded-2xl bg-white border p-5 grid md:grid-cols-2 gap-4">
                <input className="rounded-xl border px-4 py-3" placeholder="Cost type (Electricity/Gas/Rent)" value={form.costType} onChange={(e) => setForm({ ...form, costType: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" type="date" value={form.costDate} onChange={(e) => setForm({ ...form, costDate: e.target.value })} required />
                <label className="flex items-center gap-3 rounded-xl border px-4 py-3">
                    <input type="checkbox" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })} />
                    Recurring Cost
                </label>
                <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <button className="rounded-xl bg-amber-600 text-white px-4 py-3 md:col-span-2">Add Cost</button>
            </form>

            <div className="rounded-2xl bg-white border p-5">
                <h2 className="text-xl font-semibold mb-4">Cost History</h2>
                <div className="space-y-3">
                    {costs.map((cost) => (
                        <div key={cost.id} className="rounded-xl border p-4 flex justify-between">
                            <div>
                                <h3 className="font-semibold">{cost.costType}</h3>
                                <p className="text-sm text-gray-500">{cost.description || 'No description'}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">৳ {cost.amount}</p>
                                <p className="text-sm text-gray-500">{cost.costDate?.split('T')[0] || cost.costDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ManagerAdditionalCosts