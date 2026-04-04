import { useEffect, useState } from 'react'
import { managerApi, ownerApi } from '@/services/api'

const now = new Date()

const ManagerSalary = () => {
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [year, setYear] = useState(now.getFullYear())
    const [payments, setPayments] = useState([])
    const [employees, setEmployees] = useState([])
    const [form, setForm] = useState({
        employeeId: '',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        amount: '',
        paymentMethod: 'Cash',
        notes: '',
    })

    const load = async () => {
        const [salaryRes, employeeRes] = await Promise.all([
            managerApi.getSalary(month, year),
            ownerApi.getEmployees(),
        ])
        setPayments(salaryRes.data || [])
        setEmployees(employeeRes.data || [])
    }

    useEffect(() => {
        load()
    }, [month, year])

    const submit = async (e) => {
        e.preventDefault()
        await managerApi.processSalary({
            employeeId: Number(form.employeeId),
            month: Number(form.month),
            year: Number(form.year),
            amount: Number(form.amount),
            paymentMethod: form.paymentMethod,
            notes: form.notes || null,
        })
        await load()
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Salary</h1>

            <form onSubmit={submit} className="rounded-2xl bg-white border p-5 grid md:grid-cols-2 gap-4">
                <select className="rounded-xl border px-4 py-3" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
                    <option value="">Select employee</option>
                    {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.name} - {emp.employeeId}
                        </option>
                    ))}
                </select>

                <input className="rounded-xl border px-4 py-3" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" type="number" placeholder="Month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required />
                <input className="rounded-xl border px-4 py-3" type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
                <select className="rounded-xl border px-4 py-3" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Banking">Mobile Banking</option>
                </select>
                <input className="rounded-xl border px-4 py-3" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <button className="rounded-xl bg-amber-600 text-white px-4 py-3 md:col-span-2">Process Salary Payment</button>
            </form>

            <div className="rounded-2xl bg-white border p-5">
                <div className="flex gap-3 mb-4">
                    <input className="rounded-xl border px-4 py-2" type="number" value={month} onChange={(e) => setMonth(e.target.value)} />
                    <input className="rounded-xl border px-4 py-2" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                    <button className="rounded-xl bg-gray-900 text-white px-4 py-2" onClick={load}>Load</button>
                </div>

                <div className="space-y-3">
                    {payments.map((item) => (
                        <div key={item.id} className="rounded-xl border p-4 flex justify-between">
                            <div>
                                <h3 className="font-semibold">{item.employeeName || `Employee ${item.employeeId}`}</h3>
                                <p className="text-sm text-gray-500">{item.month}/{item.year}</p>
                                <p className="text-sm text-gray-500">{item.paymentMethod}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">৳ {item.amount}</p>
                                <p className="text-sm text-green-700">{item.isPaid ? 'Paid' : 'Due'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ManagerSalary