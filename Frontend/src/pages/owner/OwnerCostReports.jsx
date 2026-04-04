import { useEffect, useMemo, useState } from 'react'
import { ownerApi } from '@/services/api'

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 0,
    }).format(value || 0)

const getDateRangeFromPeriod = (period) => {
    const today = new Date()
    const endDate = today.toISOString().split('T')[0]
    const start = new Date(today)

    if (period === 'week') start.setDate(today.getDate() - 7)
    else if (period === 'month') start.setMonth(today.getMonth() - 1)
    else if (period === 'year') start.setFullYear(today.getFullYear() - 1)

    return {
        startDate: start.toISOString().split('T')[0],
        endDate,
    }
}

const OwnerCostReports = () => {
    const [period, setPeriod] = useState('week')
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)

    const range = useMemo(() => getDateRangeFromPeriod(period), [period])

    useEffect(() => {
        const loadReport = async () => {
            try {
                setLoading(true)
                const response = await ownerApi.getCostReport(range.startDate, range.endDate)
                setReport(response.data)
            } finally {
                setLoading(false)
            }
        }

        loadReport()
    }, [range.startDate, range.endDate])

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cost of Production</h1>
                    <p className="text-gray-600">Track ingredient cost, usage, and weekly production cost</p>
                </div>

                <select
                    className="rounded-xl border bg-white px-4 py-2"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                >
                    <option value="week">Running Week</option>
                    <option value="month">Running Month</option>
                    <option value="year">Running Year</option>
                </select>
            </div>

            {loading ? (
                <div className="text-gray-600">Loading production cost report...</div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-white border p-5">
                            <p className="text-sm text-gray-500">Total Cost</p>
                            <h3 className="mt-2 text-2xl font-bold">{formatCurrency(report?.totalCost)}</h3>
                        </div>
                        <div className="rounded-2xl bg-white border p-5">
                            <p className="text-sm text-gray-500">Most Costly Ingredient</p>
                            <h3 className="mt-2 text-lg font-bold">{report?.mostCostlyIngredient?.ingredientName || 'N/A'}</h3>
                        </div>
                        <div className="rounded-2xl bg-white border p-5">
                            <p className="text-sm text-gray-500">Most Used Ingredient</p>
                            <h3 className="mt-2 text-lg font-bold">{report?.mostUsedIngredient?.ingredientName || 'N/A'}</h3>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl bg-white border p-6 lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">Ingredient Cost Breakdown</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-gray-500">
                                            <th className="py-3">Ingredient</th>
                                            <th className="py-3">Unit</th>
                                            <th className="py-3">Quantity Used</th>
                                            <th className="py-3">Unit Price</th>
                                            <th className="py-3">Total Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(report?.ingredientCosts || []).map((item) => (
                                            <tr key={item.ingredientId} className="border-b">
                                                <td className="py-3 font-medium">{item.ingredientName}</td>
                                                <td className="py-3">{item.unitOfMeasure}</td>
                                                <td className="py-3">{item.quantityUsed}</td>
                                                <td className="py-3">{formatCurrency(item.unitPrice)}</td>
                                                <td className="py-3">{formatCurrency(item.totalCost)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white border p-6 space-y-5">
                            <div>
                                <h2 className="text-xl font-semibold mb-3">Most Costly Ingredient</h2>
                                {report?.mostCostlyIngredient ? (
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500">Name:</span> <span className="font-medium">{report.mostCostlyIngredient.ingredientName}</span></p>
                                        <p><span className="text-gray-500">Cost:</span> <span className="font-medium">{formatCurrency(report.mostCostlyIngredient.totalCost)}</span></p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No data available.</p>
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-3">Most Used Ingredient</h2>
                                {report?.mostUsedIngredient ? (
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500">Name:</span> <span className="font-medium">{report.mostUsedIngredient.ingredientName}</span></p>
                                        <p><span className="text-gray-500">Quantity:</span> <span className="font-medium">{report.mostUsedIngredient.quantityUsed}</span></p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No data available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white border p-6">
                        <h2 className="text-xl font-semibold mb-4">Weekly Cost Comparison</h2>
                        <div className="space-y-4">
                            {(report?.weeklyCostData || []).map((week, idx) => {
                                const max = Math.max(...(report?.weeklyCostData || []).map((w) => w.costAmount || 0), 1)
                                const width = `${((week.costAmount || 0) / max) * 100}%`
                                return (
                                    <div key={`${week.weekLabel}-${idx}`} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>{week.weekLabel}</span>
                                            <span className="font-medium">{formatCurrency(week.costAmount)}</span>
                                        </div>
                                        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-red-500" style={{ width }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default OwnerCostReports