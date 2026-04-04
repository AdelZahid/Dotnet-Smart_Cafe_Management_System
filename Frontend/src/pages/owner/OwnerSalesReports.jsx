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

const OwnerSalesReports = () => {
    const [period, setPeriod] = useState('week')
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)

    const range = useMemo(() => getDateRangeFromPeriod(period), [period])

    useEffect(() => {
        const loadReport = async () => {
            try {
                setLoading(true)
                const response = await ownerApi.getSalesReport(range.startDate, range.endDate)
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
                    <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
                    <p className="text-gray-600">Track sold items, revenue, and top-selling products</p>
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
                <div className="text-gray-600">Loading sales report...</div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-2xl bg-white border p-5">
                            <p className="text-sm text-gray-500">Total Sales</p>
                            <h3 className="mt-2 text-2xl font-bold">{formatCurrency(report?.totalSales)}</h3>
                        </div>
                        <div className="rounded-2xl bg-white border p-5">
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <h3 className="mt-2 text-2xl font-bold">{report?.totalOrders || 0}</h3>
                        </div>
                        <div className="rounded-2xl bg-white border p-5">
                            <p className="text-sm text-gray-500">Top Selling Item</p>
                            <h3 className="mt-2 text-lg font-bold">{report?.topSellingItem?.itemName || 'N/A'}</h3>
                        </div>
                        <div className="rounded-2xl bg-white border p-5">
                            <p className="text-sm text-gray-500">Top Item Revenue</p>
                            <h3 className="mt-2 text-2xl font-bold">
                                {formatCurrency(report?.topSellingItem?.totalRevenue)}
                            </h3>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl bg-white border p-6 lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">Sold Items</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-gray-500">
                                            <th className="py-3">Item</th>
                                            <th className="py-3">Quantity Sold</th>
                                            <th className="py-3">Unit Price</th>
                                            <th className="py-3">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report?.soldItems?.map((item) => (
                                            <tr key={item.menuItemId} className="border-b">
                                                <td className="py-3 font-medium">{item.itemName}</td>
                                                <td className="py-3">{item.quantitySold}</td>
                                                <td className="py-3">{formatCurrency(item.unitPrice)}</td>
                                                <td className="py-3">{formatCurrency(item.totalRevenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white border p-6">
                            <h2 className="text-xl font-semibold mb-4">Top Selling Product</h2>
                            {report?.topSellingItem ? (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-semibold text-gray-900">{report.topSellingItem.itemName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Quantity Sold</p>
                                        <p className="font-semibold text-gray-900">{report.topSellingItem.quantitySold}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Unit Price</p>
                                        <p className="font-semibold text-gray-900">{formatCurrency(report.topSellingItem.unitPrice)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Revenue</p>
                                        <p className="font-semibold text-gray-900">{formatCurrency(report.topSellingItem.totalRevenue)}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No sales data found.</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white border p-6">
                        <h2 className="text-xl font-semibold mb-4">Weekly Sales Comparison</h2>
                        <div className="space-y-4">
                            {(report?.weeklySalesData || []).map((week, idx) => {
                                const max = Math.max(...(report?.weeklySalesData || []).map((w) => w.salesAmount || 0), 1)
                                const width = `${((week.salesAmount || 0) / max) * 100}%`
                                return (
                                    <div key={`${week.weekLabel}-${idx}`} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>{week.weekLabel}</span>
                                            <span className="font-medium">{formatCurrency(week.salesAmount)}</span>
                                        </div>
                                        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-green-500" style={{ width }} />
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

export default OwnerSalesReports