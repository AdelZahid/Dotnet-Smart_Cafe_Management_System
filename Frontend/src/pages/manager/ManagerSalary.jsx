
import { useEffect, useState } from 'react'
import { managerApi } from '@/services/api'

const today = new Date()

const ManagerSalary = () => {
    const [waiters, setWaiters] = useState([])
    const [payments, setPayments] = useState([])
    const [month, setMonth] = useState(today.getMonth() + 1)
    const [year, setYear] = useState(today.getFullYear())
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        employeeId: '',
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        amount: '',
        paymentMethod: 'Cash',
        notes: '',
    })

    const loadData = async () => {
        try {
            setLoading(true)

            const [waitersRes, paymentsRes] = await Promise.all([
                managerApi.getWaiters(),
                managerApi.getSalary(month, year),
            ])

            setWaiters(waitersRes.data || [])
            setPayments(paymentsRes.data || [])
        } catch (error) {
            console.error('Failed to load salary data:', error)
            alert(error.response?.data?.message || 'Failed to load salary data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [month, year])

    const submit = async (e) => {
        e.preventDefault()

        if (!form.employeeId) {
            alert('Please select a waiter')
            return
        }

        try {
            await managerApi.processSalary({
                employeeId: Number(form.employeeId),
                month: Number(form.month),
                year: Number(form.year),
                amount: Number(form.amount),
                paymentMethod: form.paymentMethod,
                notes: form.notes || null,
            })

            alert('Salary payment saved successfully')

            setForm({
                employeeId: '',
                month: today.getMonth() + 1,
                year: today.getFullYear(),
                amount: '',
                paymentMethod: 'Cash',
                notes: '',
            })

            await loadData()
        } catch (error) {
            console.error('Failed to process salary:', error)
            alert(error.response?.data?.message || 'Failed to process salary')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 space-y-8">
            <div className="rounded-3xl bg-white border border-amber-100 shadow-sm p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Waiter Salary</h1>
                <p className="mt-2 text-gray-500">
                    Select a waiter, pay salary, and keep monthly payment records.
                </p>
            </div>

            <form
                onSubmit={submit}
                className="rounded-3xl bg-white border shadow-sm p-6 md:p-8 grid md:grid-cols-2 gap-5"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Waiter
                    </label>
                    <select
                        className="w-full rounded-xl border px-4 py-3"
                        value={form.employeeId}
                        onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                        required
                    >
                        <option value="">Select waiter</option>
                        {waiters.map((waiter) => (
                            <option key={waiter.id} value={waiter.id}>
                                {waiter.name} - {waiter.employeeId}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                    </label>
                    <input
                        className="w-full rounded-xl border px-4 py-3"
                        type="number"
                        placeholder="Enter salary amount"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Month
                    </label>
                    <input
                        className="w-full rounded-xl border px-4 py-3"
                        type="number"
                        min="1"
                        max="12"
                        value={form.month}
                        onChange={(e) => setForm({ ...form, month: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year
                    </label>
                    <input
                        className="w-full rounded-xl border px-4 py-3"
                        type="number"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                    </label>
                    <select
                        className="w-full rounded-xl border px-4 py-3"
                        value={form.paymentMethod}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    >
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Mobile Banking">Mobile Banking</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                    </label>
                    <input
                        className="w-full rounded-xl border px-4 py-3"
                        placeholder="Optional notes"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2">
                    <button className="rounded-xl bg-amber-600 text-white px-6 py-3 hover:bg-amber-700">
                        Save Salary Payment
                    </button>
                </div>
            </form>

            <div className="rounded-3xl bg-white border shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Salary Payment Records</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Payments for month {month} / year {year}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <input
                            className="rounded-xl border px-4 py-2"
                            type="number"
                            min="1"
                            max="12"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                        />
                        <input
                            className="rounded-xl border px-4 py-2"
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                        />
                        <button
                            type="button"
                            className="rounded-xl bg-gray-900 text-white px-4 py-2 hover:bg-black"
                            onClick={loadData}
                        >
                            Load
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-gray-600">Loading salary records...</div>
                ) : payments.length === 0 ? (
                    <div className="rounded-2xl bg-gray-50 border p-5 text-gray-500">
                        No salary payments found for this month and year.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {payments.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">{item.employeeName}</h3>
                                    <p className="text-sm text-gray-500">Employee ID: {item.employeeId}</p>
                                    <p className="text-sm text-gray-500">
                                        Month: {item.month} / Year: {item.year}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Payment Method: {item.paymentMethod || 'N/A'}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-bold text-amber-700">৳ {item.amount}</p>
                                    <p className={`text-sm font-medium ${item.isPaid ? 'text-green-700' : 'text-red-700'}`}>
                                        {item.isPaid ? 'Paid' : 'Due'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.paidDate ? new Date(item.paidDate).toLocaleDateString() : 'No date'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManagerSalary